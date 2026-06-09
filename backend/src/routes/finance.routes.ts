import { Router } from "express";
import { CotisationStatus, TransactionType } from "@prisma/client";
import { ApiError } from "../lib/api-error";
import {
  buildMonthlyChart,
  isValidTransactionType,
  toPublicCotisation,
  toPublicTransaction,
} from "../lib/finance-public";
import { PERMISSIONS } from "../lib/rbac";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, requireAuth, requireRole } from "../middleware/auth";

export const financeRouter = Router();

const CURRENT_ACADEMIC_YEAR = "2025-2026";
const DEFAULT_COTISATION_AMOUNT = 50000;

async function generateReceiptNo(academicYear: string) {
  const prefix = academicYear.split("-")[0] ?? String(new Date().getFullYear());
  const count = await prisma.cotisation.count({
    where: {
      receiptNo: { startsWith: `CJP-RCP-${prefix}-` },
    },
  });

  return `CJP-RCP-${prefix}-${String(count + 1).padStart(4, "0")}`;
}

financeRouter.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const [transactions, paidCotisations] = await Promise.all([
      prisma.transaction.findMany({ orderBy: { transactionAt: "asc" } }),
      prisma.cotisation.aggregate({
        where: { status: CotisationStatus.PAID },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = transactions
      .filter((item) => item.type === TransactionType.INCOME)
      .reduce((sum, item) => sum + item.amount, 0);

    const totalExpenses = transactions
      .filter((item) => item.type === TransactionType.EXPENSE)
      .reduce((sum, item) => sum + item.amount, 0);

    res.json({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      cotisationsReceived: paidCotisations._sum.amount ?? 0,
      chart: buildMonthlyChart(transactions),
    });
  }),
);

financeRouter.get(
  "/transactions",
  asyncHandler(async (_req, res) => {
    const transactions = await prisma.transaction.findMany({
      orderBy: { transactionAt: "desc" },
    });

    res.json({
      transactions: transactions.map(toPublicTransaction),
    });
  }),
);

financeRouter.get(
  "/cotisations/me",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const cotisation = await prisma.cotisation.findFirst({
      where: {
        userId: req.user!.id,
        academicYear: CURRENT_ACADEMIC_YEAR,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      cotisation: cotisation ? toPublicCotisation(cotisation) : null,
      academicYear: CURRENT_ACADEMIC_YEAR,
      defaultAmount: DEFAULT_COTISATION_AMOUNT,
    });
  }),
);

financeRouter.post(
  "/transactions",
  requireAuth,
  requireRole(...PERMISSIONS.manageFinance),
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      type?: string;
      amount?: number;
      category?: string;
      description?: string;
      transactionAt?: string;
      receiptUrl?: string;
    };

    if (!body.type || !isValidTransactionType(body.type)) {
      throw new ApiError(400, "Type de transaction invalide (INCOME ou EXPENSE)");
    }

    if (!body.category?.trim() || !body.description?.trim()) {
      throw new ApiError(400, "Catégorie et description sont requises");
    }

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ApiError(400, "Montant invalide");
    }

    const transactionAt = body.transactionAt ? new Date(body.transactionAt) : new Date();
    if (Number.isNaN(transactionAt.getTime())) {
      throw new ApiError(400, "Date de transaction invalide");
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: body.type,
        amount,
        category: body.category.trim(),
        description: body.description.trim(),
        receiptUrl: body.receiptUrl?.trim() || null,
        createdById: req.user!.id,
        transactionAt,
      },
    });

    res.status(201).json({ transaction: toPublicTransaction(transaction) });
  }),
);

financeRouter.post(
  "/cotisations",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as {
      userId?: string;
      academicYear?: string;
      amount?: number;
      paymentMethod?: string;
      paymentPhone?: string;
    };

    const academicYear = body.academicYear?.trim() || CURRENT_ACADEMIC_YEAR;
    const targetUserId = body.userId?.trim() || req.user!.id;
    const canManageOthers = PERMISSIONS.manageFinance.includes(req.user!.role);

    if (targetUserId !== req.user!.id && !canManageOthers) {
      throw new ApiError(403, "Accès refusé");
    }

    const amount = Number(body.amount ?? DEFAULT_COTISATION_AMOUNT);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ApiError(400, "Montant invalide");
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { membership: true },
    });

    if (!user) {
      throw new ApiError(404, "Membre introuvable");
    }

    if (user.membership?.status !== "ACTIVE") {
      throw new ApiError(403, "Seuls les membres actifs peuvent régler une cotisation");
    }

    const existing = await prisma.cotisation.findFirst({
      where: { userId: targetUserId, academicYear },
    });

    if (existing?.status === CotisationStatus.PAID) {
      throw new ApiError(409, "Cotisation déjà réglée pour cette année académique");
    }

    const receiptNo = await generateReceiptNo(academicYear);
    const paidAt = new Date();
    const paymentMethod = body.paymentMethod?.trim().toUpperCase() || "SIMULATION";
    const paymentPhone = body.paymentPhone?.trim() || null;
    const paymentReference =
      paymentMethod === "ORANGE_MONEY"
        ? `OM-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
        : paymentMethod === "MTN_MOMO"
          ? `MTN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
          : `SIM-${Date.now()}`;

    const cotisation = await prisma.$transaction(async (tx) => {
      const saved = existing
        ? await tx.cotisation.update({
            where: { id: existing.id },
            data: {
              amount,
              status: CotisationStatus.PAID,
              paidAt,
              receiptNo,
              paymentMethod,
              paymentPhone,
              paymentReference,
            },
          })
        : await tx.cotisation.create({
            data: {
              userId: targetUserId,
              amount,
              status: CotisationStatus.PAID,
              paidAt,
              receiptNo,
              academicYear,
              paymentMethod,
              paymentPhone,
              paymentReference,
            },
          });

      await tx.transaction.create({
        data: {
          type: TransactionType.INCOME,
          amount,
          category: "Cotisations",
          description: `Cotisation — ${user.firstName} ${user.lastName}`,
          createdById: req.user!.id,
          transactionAt: paidAt,
        },
      });

      return saved;
    });

    res.status(201).json({ cotisation: toPublicCotisation(cotisation) });
  }),
);
