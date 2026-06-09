import { Router } from "express";
import { ApiError } from "../lib/api-error";
import { toPublicCertificate, toVerifyCertificate } from "../lib/certificates-public";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, requireAuth } from "../middleware/auth";

export const certificatesRouter = Router();

const certificateInclude = {
  formation: {
    select: { id: true, title: true, program: true, level: true },
  },
  user: {
    select: { firstName: true, lastName: true, matricule: true },
  },
} as const;

certificatesRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user!.id },
      include: certificateInclude,
      orderBy: { issuedAt: "desc" },
    });

    res.json({
      certificates: certificates.map(toPublicCertificate),
    });
  }),
);

certificatesRouter.get(
  "/verify/:number",
  asyncHandler(async (req, res) => {
    const numberParam = req.params.number;
    if (!numberParam || Array.isArray(numberParam)) {
      throw new ApiError(400, "Numéro de certificat invalide");
    }

    const certificate = await prisma.certificate.findUnique({
      where: { number: numberParam.toUpperCase() },
      include: {
        formation: { select: { title: true, program: true, level: true } },
        user: { select: { firstName: true, lastName: true, matricule: true } },
      },
    });

    if (!certificate) {
      res.json({
        valid: false,
        number: numberParam.toUpperCase(),
        message: "Certificat introuvable",
      });
      return;
    }

    res.json(toVerifyCertificate(certificate));
  }),
);
