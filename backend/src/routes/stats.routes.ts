import { Router } from "express";
import { CotisationStatus, MembershipStatus, TransactionType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";

export const statsRouter = Router();

statsRouter.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const [
      activeMembers,
      pendingMembers,
      publishedFormations,
      upcomingEvents,
      publishedProjects,
      libraryResources,
      paidCotisations,
      incomeAgg,
      expenseAgg,
      recentTransactions,
      nextEvent,
    ] = await Promise.all([
      prisma.membership.count({ where: { status: MembershipStatus.ACTIVE } }),
      prisma.membership.count({ where: { status: MembershipStatus.PENDING } }),
      prisma.formation.count({ where: { published: true } }),
      prisma.event.count({ where: { published: true, startAt: { gte: new Date() } } }),
      prisma.project.count({ where: { status: { not: "DRAFT" } } }),
      prisma.resource.count(),
      prisma.cotisation.aggregate({
        where: { status: CotisationStatus.PAID },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        orderBy: { transactionAt: "desc" },
        take: 5,
        select: {
          id: true,
          description: true,
          amount: true,
          type: true,
          transactionAt: true,
        },
      }),
      prisma.event.findFirst({
        where: { published: true, startAt: { gte: new Date() } },
        orderBy: { startAt: "asc" },
        select: {
          id: true,
          title: true,
          startAt: true,
          location: true,
          posterUrl: true,
        },
      }),
    ]);

    const totalIncome = incomeAgg._sum.amount ?? 0;
    const totalExpenses = expenseAgg._sum.amount ?? 0;

    res.json({
      activeMembers,
      pendingMembers,
      publishedFormations,
      upcomingEvents,
      publishedProjects,
      libraryResources,
      cotisationsReceived: paidCotisations._sum.amount ?? 0,
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      recentTransactions: recentTransactions.map((item) => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        type: item.type,
        transactionAt: item.transactionAt.toISOString(),
      })),
      nextEvent: nextEvent
        ? {
            id: nextEvent.id,
            title: nextEvent.title,
            startAt: nextEvent.startAt.toISOString(),
            location: nextEvent.location,
            posterUrl: nextEvent.posterUrl,
          }
        : null,
    });
  }),
);
