import { Router } from "express";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { ApiError } from "../lib/api-error";
import { signToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { toPublicUser } from "../lib/user-public";
import { validateRegistrationFields } from "../lib/university-rules";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, requireAuth } from "../middleware/auth";
import {
  generateState,
  getGoogleAuthUrl,
  getGoogleOAuthTokens,
  getGoogleUser,
  getGithubAuthUrl,
  getGithubOAuthTokens,
  getGithubUser,
} from "../lib/oauth";

export const authRouter = Router();

// === OAUTH ROUTES ===

authRouter.get("/google", (req, res) => {
  const state = generateState();
  // Optional: store state in a cookie to verify it in the callback
  const url = getGoogleAuthUrl(state);
  res.redirect(url);
});

authRouter.get("/google/callback", asyncHandler(async (req, res) => {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!code) {
    throw new ApiError(400, "Code OAuth manquant");
  }

  const tokens = await getGoogleOAuthTokens({ code });
  const googleUser = await getGoogleUser(tokens.id_token, tokens.access_token);

  if (!googleUser.verified_email) {
    throw new ApiError(403, "L'email Google n'est pas vérifié");
  }

  // Find existing user by email or googleId
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: googleUser.id },
        { email: googleUser.email.toLowerCase() },
      ],
    },
    include: { membership: true },
  });

  if (user) {
    // If found by email but no googleId, link them
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.id },
        include: { membership: true },
      });
    }
  } else {
    // Create new user
    user = await prisma.user.create({
      data: {
        email: googleUser.email.toLowerCase(),
        googleId: googleUser.id,
        firstName: googleUser.given_name || googleUser.name || "Utilisateur",
        lastName: googleUser.family_name || "",
        role: Role.MEMBRE,
      },
      include: { membership: true },
    });
  }

  const token = signToken(user.id, user.role);

  // Redirect to frontend with token
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
}));

authRouter.get("/github", (req, res) => {
  const state = generateState();
  const url = getGithubAuthUrl(state);
  res.redirect(url);
});

authRouter.get("/github/callback", asyncHandler(async (req, res) => {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!code) {
    throw new ApiError(400, "Code OAuth manquant");
  }

  const tokens = await getGithubOAuthTokens({ code });
  const githubUser = await getGithubUser(tokens.access_token);

  if (!githubUser.email) {
    throw new ApiError(400, "Aucun email public trouvé sur GitHub");
  }

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { githubId: githubUser.id.toString() },
        { email: githubUser.email.toLowerCase() },
      ],
    },
    include: { membership: true },
  });

  if (user) {
    if (!user.githubId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { githubId: githubUser.id.toString() },
        include: { membership: true },
      });
    }
  } else {
    let firstName = "Utilisateur";
    let lastName = "GitHub";
    if (githubUser.name) {
      const parts = githubUser.name.split(" ");
      firstName = parts[0] || firstName;
      lastName = parts.slice(1).join(" ") || lastName;
    } else {
      firstName = githubUser.login;
    }

    user = await prisma.user.create({
      data: {
        email: githubUser.email.toLowerCase(),
        githubId: githubUser.id.toString(),
        firstName,
        lastName,
        role: Role.MEMBRE,
      },
      include: { membership: true },
    });
  }

  const token = signToken(user.id, user.role);

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
}));

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email?.trim() || !password) {
      throw new ApiError(400, "E-mail et mot de passe requis");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: { membership: true },
    });

    if (!user) {
      throw new ApiError(401, "Identifiants incorrects");
    }

    const valid = await bcrypt.compare(password, user.passwordHash ?? "");
    if (!valid) {
      throw new ApiError(401, "Identifiants incorrects");
    }

    const token = signToken(user.id, user.role);

    res.json({
      token,
      user: toPublicUser(user),
    });
  }),
);

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = req.body as {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      matricule?: string;
      filiere?: string;
      niveau?: string;
      phone?: string;
    };

    const required = [
      "email",
      "password",
      "firstName",
      "lastName",
      "matricule",
      "filiere",
      "niveau",
      "phone",
    ] as const;

    const fieldLabels: Record<(typeof required)[number], string> = {
      email: "e-mail",
      password: "mot de passe",
      firstName: "prénom",
      lastName: "nom",
      matricule: "matricule",
      filiere: "filière",
      niveau: "niveau",
      phone: "téléphone",
    };

    for (const field of required) {
      if (!body[field]?.trim()) {
        throw new ApiError(400, `Le champ ${fieldLabels[field]} est requis`);
      }
    }

    if ((body.password?.length ?? 0) < 6) {
      throw new ApiError(400, "Le mot de passe doit contenir au moins 6 caractères");
    }

    let matricule: string;
    let email: string;

    try {
      ({ matricule, email } = validateRegistrationFields({
        matricule: body.matricule!,
        email: body.email!,
        filiere: body.filiere!.trim(),
        niveau: body.niveau!.trim(),
      }));
    } catch (error) {
      throw new ApiError(400, error instanceof Error ? error.message : "Données invalides");
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { matricule }],
      },
    });

    if (existing) {
      throw new ApiError(409, "Un compte existe déjà avec cet e-mail ou ce matricule");
    }

    const passwordHash = await bcrypt.hash(body.password!, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: body.firstName!.trim(),
        lastName: body.lastName!.trim(),
        matricule,
        filiere: body.filiere!.trim(),
        niveau: body.niveau!.trim(),
        phone: body.phone!.trim(),
        role: Role.MEMBRE,
        membership: {
          create: {
            status: "PENDING",
            academicYear: "2025-2026",
          },
        },
      },
      include: { membership: true },
    });

    const token = signToken(user.id, user.role);

    res.status(201).json({
      token,
      user: toPublicUser(user),
    });
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { membership: true },
    });

    if (!user) {
      throw new ApiError(404, "Utilisateur introuvable");
    }

    res.json({ user: toPublicUser(user) });
  }),
);

authRouter.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      bio?: string;
    };

    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const phone = body.phone?.trim();
    const bio = body.bio?.trim() ?? null;

    if (!firstName || !lastName) {
      throw new ApiError(400, "Le prénom et le nom sont requis");
    }

    if (!phone) {
      throw new ApiError(400, "Le numéro de téléphone est requis");
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        firstName,
        lastName,
        phone,
        bio: bio || null,
      },
      include: { membership: true },
    });

    res.json({ user: toPublicUser(user) });
  }),
);

authRouter.patch(
  "/password",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!body.currentPassword || !body.newPassword) {
      throw new ApiError(400, "Mot de passe actuel et nouveau mot de passe requis");
    }

    if (body.newPassword.length < 6) {
      throw new ApiError(400, "Le nouveau mot de passe doit contenir au moins 6 caractères");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      throw new ApiError(404, "Utilisateur introuvable");
    }

    const valid = await bcrypt.compare(body.currentPassword, user.passwordHash ?? "");
    if (!valid) {
      throw new ApiError(401, "Mot de passe actuel incorrect");
    }

    const passwordHash = await bcrypt.hash(body.newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    res.json({ ok: true });
  }),
);
