import { Router } from "express";
import { ApiError } from "../lib/api-error";
import { toPublicFormation } from "../lib/catalog-public";
import {
  generateCertificateNumber,
  gradeQuiz,
  parseQuizQuestions,
  toPublicQuizQuestions,
} from "../lib/quiz-public";
import { toPublicCertificate } from "../lib/certificates-public";
import { PERMISSIONS } from "../lib/rbac";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, optionalAuth, requireAuth, requireRole } from "../middleware/auth";
import { requireActiveMember } from "../middleware/membership";

export const formationsRouter = Router();

formationsRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const manage = req.query.manage === "1";
    const canManage =
      manage && req.user && PERMISSIONS.manageFormations.includes(req.user.role);

    const formations = await prisma.formation.findMany({
      where: canManage ? undefined : { published: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ formations: formations.map(toPublicFormation) });
  }),
);

formationsRouter.get(
  "/:formationId",
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const formationIdParam = req.params.formationId;
    if (!formationIdParam || Array.isArray(formationIdParam)) {
      throw new ApiError(400, "Identifiant de formation invalide");
    }

    const formation = await prisma.formation.findUnique({
      where: { id: formationIdParam },
      include: {
        quizzes: { select: { id: true, title: true, passScore: true } },
      },
    });

    if (!formation || (!formation.published && !req.user)) {
      throw new ApiError(404, "Formation introuvable");
    }

    const canManage =
      req.user && PERMISSIONS.manageFormations.includes(req.user.role);

    if (!formation.published && !canManage) {
      throw new ApiError(404, "Formation introuvable");
    }

    let certificate = null;
    if (req.user) {
      certificate = await prisma.certificate.findUnique({
        where: {
          userId_formationId: {
            userId: req.user.id,
            formationId: formation.id,
          },
        },
        select: { number: true, issuedAt: true },
      });
    }

    res.json({
      formation: {
        ...toPublicFormation(formation),
        quiz: formation.quizzes[0]
          ? {
              id: formation.quizzes[0].id,
              title: formation.quizzes[0].title,
              passScore: formation.quizzes[0].passScore,
            }
          : null,
        certificate: certificate
          ? {
              number: certificate.number,
              issuedAt: certificate.issuedAt.toISOString(),
            }
          : null,
      },
    });
  }),
);

formationsRouter.get(
  "/:formationId/quiz",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const formationIdParam = req.params.formationId;
    if (!formationIdParam || Array.isArray(formationIdParam)) {
      throw new ApiError(400, "Identifiant de formation invalide");
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        formationId: formationIdParam,
        formation: { published: true },
      },
    });

    if (!quiz) {
      throw new ApiError(404, "Aucun quiz disponible pour cette formation");
    }

    const questions = parseQuizQuestions(quiz.questions);

    res.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        passScore: quiz.passScore,
        questions: toPublicQuizQuestions(questions),
      },
    });
  }),
);

formationsRouter.post(
  "/:formationId/quiz/submit",
  requireAuth,
  requireActiveMember,
  asyncHandler(async (req: AuthRequest, res) => {
    const formationIdParam = req.params.formationId;
    if (!formationIdParam || Array.isArray(formationIdParam)) {
      throw new ApiError(400, "Identifiant de formation invalide");
    }

    const body = req.body as { answers?: Record<string, number> };
    if (!body.answers || typeof body.answers !== "object") {
      throw new ApiError(400, "Réponses requises");
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        formationId: formationIdParam,
        formation: { published: true },
      },
      include: { formation: true },
    });

    if (!quiz) {
      throw new ApiError(404, "Aucun quiz disponible pour cette formation");
    }

    const questions = parseQuizQuestions(quiz.questions);
    const result = gradeQuiz(questions, body.answers, quiz.passScore);

    if (!result.passed) {
      res.json({
        passed: false,
        score: result.score,
        passScore: result.passScore,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
        certificate: null,
      });
      return;
    }

    const existing = await prisma.certificate.findUnique({
      where: {
        userId_formationId: {
          userId: req.user!.id,
          formationId: quiz.formationId,
        },
      },
      include: {
        formation: { select: { id: true, title: true, program: true, level: true } },
        user: { select: { firstName: true, lastName: true, matricule: true } },
      },
    });

    if (existing) {
      res.json({
        passed: true,
        score: result.score,
        passScore: result.passScore,
        correctCount: result.correctCount,
        totalQuestions: result.totalQuestions,
        certificate: toPublicCertificate(existing),
      });
      return;
    }

    const number = await generateCertificateNumber();
    const certificate = await prisma.certificate.create({
      data: {
        number,
        userId: req.user!.id,
        formationId: quiz.formationId,
      },
      include: {
        formation: { select: { id: true, title: true, program: true, level: true } },
        user: { select: { firstName: true, lastName: true, matricule: true } },
      },
    });

    res.status(201).json({
      passed: true,
      score: result.score,
      passScore: result.passScore,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      certificate: toPublicCertificate(certificate),
    });
  }),
);

formationsRouter.post(
  "/",
  requireAuth,
  requireRole(...PERMISSIONS.manageFormations),
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      title?: string;
      description?: string;
      level?: string;
      program?: string;
      resources?: string;
      published?: boolean;
    };

    if (!body.title?.trim() || !body.description?.trim() || !body.level?.trim() || !body.program?.trim()) {
      throw new ApiError(400, "Titre, description, niveau et programme sont requis");
    }

    const formation = await prisma.formation.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        level: body.level.trim(),
        program: body.program.trim(),
        resources: body.resources?.trim() || null,
        published: body.published ?? true,
      },
    });

    res.status(201).json({ formation: toPublicFormation(formation) });
  }),
);
