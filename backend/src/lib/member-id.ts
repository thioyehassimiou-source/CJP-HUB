import { prisma } from "./prisma";

export async function generateMemberId(academicYear: string) {
  const prefix = academicYear.split("-")[0] ?? String(new Date().getFullYear());
  const latest = await prisma.membership.findFirst({
    where: {
      memberId: {
        startsWith: `CJP-${prefix}-`,
      },
    },
    orderBy: { memberId: "desc" },
    select: { memberId: true },
  });

  const lastNumber = latest?.memberId?.match(/-(\d+)$/)?.[1];
  const next = (Number(lastNumber ?? 0) + 1).toString().padStart(4, "0");

  return `CJP-${prefix}-${next}`;
}
