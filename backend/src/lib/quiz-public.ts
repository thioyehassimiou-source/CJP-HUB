import { ApiError } from "./api-error";
import { prisma } from "./prisma";

export type StoredQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type PublicQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

export function parseQuizQuestions(raw: string): StoredQuizQuestion[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ApiError(500, "Quiz mal configuré");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new ApiError(500, "Quiz mal configuré");
  }

  return parsed.map((item, index) => {
    const question = item as Partial<StoredQuizQuestion>;
    if (
      !question.id ||
      !question.prompt ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      typeof question.correctIndex !== "number"
    ) {
      throw new ApiError(500, `Question invalide à l'index ${index}`);
    }

    return {
      id: question.id,
      prompt: question.prompt,
      options: question.options,
      correctIndex: question.correctIndex,
    };
  });
}

export function toPublicQuizQuestions(questions: StoredQuizQuestion[]): PublicQuizQuestion[] {
  return questions.map(({ id, prompt, options }) => ({ id, prompt, options }));
}

export function gradeQuiz(
  questions: StoredQuizQuestion[],
  answers: Record<string, number>,
  passScore: number,
) {
  let correctCount = 0;

  for (const question of questions) {
    if (answers[question.id] === question.correctIndex) {
      correctCount += 1;
    }
  }

  const score = Math.round((correctCount / questions.length) * 100);

  return {
    score,
    passScore,
    passed: score >= passScore,
    correctCount,
    totalQuestions: questions.length,
  };
}

export async function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.certificate.count({
    where: { number: { startsWith: `CJP-CERT-${year}-` } },
  });

  return `CJP-CERT-${year}-${String(count + 1).padStart(4, "0")}`;
}
