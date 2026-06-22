import { Router } from "express";
import { ApiError } from "../lib/api-error";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, requireAuth, requireRole } from "../middleware/auth";
import { PERMISSIONS } from "../lib/rbac";

export const campaignsRouter = Router();

// Create a new campaign (Admin only)
campaignsRouter.post(
  "/",
  requireAuth,
  requireRole(...PERMISSIONS.manageFormations),
  asyncHandler(async (req: AuthRequest, res) => {
    const { name, formationId, eventId, requiredScans } = req.body;

    if (!name) {
      throw new ApiError(400, "Le nom de la campagne est requis");
    }

    const campaign = await prisma.certificateCampaign.create({
      data: {
        name,
        formationId,
        eventId,
        requiredScans: Number(requiredScans) || 1,
      },
    });

    // Create a scanner link for each required scan day
    for (let i = 1; i <= campaign.requiredScans; i++) {
      await prisma.campaignScannerLink.create({
        data: {
          campaignId: campaign.id,
          dayNumber: i,
        },
      });
    }

    res.status(201).json({ campaign });
  }),
);

// Get all campaigns (Admin only)
campaignsRouter.get(
  "/",
  requireAuth,
  requireRole(...PERMISSIONS.manageFormations),
  asyncHandler(async (req: AuthRequest, res) => {
    const campaigns = await prisma.certificateCampaign.findMany({
      include: {
        formation: { select: { title: true } },
        event: { select: { title: true } },
        _count: { select: { participants: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ campaigns });
  }),
);

// Get campaign links and stats (Admin only)
campaignsRouter.get(
  "/:id/details",
  requireAuth,
  requireRole(...PERMISSIONS.manageFormations),
  asyncHandler(async (req: AuthRequest, res) => {
    const id = req.params.id as string;

    const campaign = await prisma.certificateCampaign.findUnique({
      where: { id: id },
      include: {
        scannerLinks: true,
        formation: { select: { title: true } },
        event: { select: { title: true } },
      },
    });

    if (!campaign) {
      throw new ApiError(404, "Campagne introuvable");
    }

    const participants = await prisma.campaignParticipant.findMany({
      where: { campaignId: id as string },
      orderBy: { createdAt: "desc" },
    });

    res.json({ campaign, participants });
  }),
);

// Scan a QR Code (Public / Secret Link)
campaignsRouter.post(
  "/scan",
  asyncHandler(async (req, res) => {
    const { token, phoneNumber } = req.body;

    if (!token || !phoneNumber) {
      throw new ApiError(400, "Token et numéro de téléphone requis");
    }

    // Find the scanner link
    const scannerLink = await prisma.campaignScannerLink.findUnique({
      where: { token },
      include: { campaign: true },
    });

    if (!scannerLink || !scannerLink.isActive) {
      throw new ApiError(400, "Lien de scan invalide ou expiré");
    }

    if (scannerLink.campaign.status !== "OPEN") {
      throw new ApiError(400, "Cette campagne de certification est fermée");
    }

    // Upsert the participant
    const participant = await prisma.campaignParticipant.upsert({
      where: {
        campaignId_phoneNumber: {
          campaignId: scannerLink.campaignId,
          phoneNumber: phoneNumber,
        },
      },
      create: {
        campaignId: scannerLink.campaignId,
        phoneNumber: phoneNumber,
        scannedDays: JSON.stringify([scannerLink.dayNumber]),
        scanCount: 1,
      },
      update: {
        // We will do a custom update below to ensure we don't count the same day twice
      },
    });

    // Check if the day was already scanned
    const scannedDays: number[] = JSON.parse(participant.scannedDays);
    if (!scannedDays.includes(scannerLink.dayNumber)) {
      scannedDays.push(scannerLink.dayNumber);
      await prisma.campaignParticipant.update({
        where: { id: participant.id },
        data: {
          scannedDays: JSON.stringify(scannedDays),
          scanCount: scannedDays.length,
        },
      });
      res.json({ success: true, message: "Présence validée", participant: { phoneNumber } });
    } else {
      res.json({ success: true, message: "Déjà scanné pour ce jour", participant: { phoneNumber } });
    }
  }),
);

// Claim a certificate (Public)
campaignsRouter.post(
  "/claim",
  asyncHandler(async (req, res) => {
    const { campaignId, phoneNumber, firstName, lastName, email } = req.body;

    if (!campaignId || !phoneNumber || !firstName || !lastName) {
      throw new ApiError(400, "Toutes les informations sont requises");
    }

    const campaign = await prisma.certificateCampaign.findUnique({
      where: { id: campaignId },
      include: {
        formation: { select: { title: true, program: true, level: true } },
        event: { select: { title: true } },
      },
    });

    if (!campaign) {
      throw new ApiError(404, "Campagne introuvable");
    }

    const participant = await prisma.campaignParticipant.findUnique({
      where: {
        campaignId_phoneNumber: {
          campaignId: campaignId,
          phoneNumber: phoneNumber,
        },
      },
    });

    if (!participant) {
      throw new ApiError(400, "Ce numéro de téléphone n'a pas été enregistré lors de l'événement.");
    }

    if (participant.scanCount < campaign.requiredScans) {
      throw new ApiError(
        400,
        `Vous devez être présent ${campaign.requiredScans} jour(s) pour obtenir ce certificat. (Présences: ${participant.scanCount})`,
      );
    }

    // Update participant details
    await prisma.campaignParticipant.update({
      where: { id: participant.id },
      data: {
        firstName,
        lastName,
        email,
        claimed: true,
        claimedAt: new Date(),
      },
    });

    res.json({
      success: true,
      participant: {
        firstName,
        lastName,
        phoneNumber,
        claimed: true,
      },
      campaign: {
        name: campaign.name,
        formation: campaign.formation,
        event: campaign.event,
      },
    });
  }),
);

// Get open campaigns for claim page (Public)
campaignsRouter.get(
  "/open",
  asyncHandler(async (req, res) => {
    const campaigns = await prisma.certificateCampaign.findMany({
      where: { status: "OPEN" },
      select: {
        id: true,
        name: true,
        formation: { select: { title: true } },
        event: { select: { title: true } },
      },
    });
    res.json({ campaigns });
  }),
);
