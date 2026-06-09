import { FormEvent, useEffect, useState } from "react";
import { Award, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { fetchFormationDetail, fetchFormationQuiz, submitFormationQuiz } from "@/lib/api/formations";
import type { ApiFormationDetail, ApiQuiz, ApiQuizResult } from "@/lib/api/types";
import { getFormationImage } from "@/lib/catalog-display";
import { cn } from "@/lib/utils";

type FormationQuizPanelProps = {
  formationId: string;
};

export function FormationQuizPanel({ formationId }: FormationQuizPanelProps) {
  const { user } = useAuth();
  const [formation, setFormation] = useState<ApiFormationDetail | null>(null);
  const [quiz, setQuiz] = useState<ApiQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ApiQuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    setErrorMessage("");
    setResult(null);
    setAnswers({});

    Promise.all([fetchFormationDetail(formationId), fetchFormationQuiz(formationId)])
      .then(([detailData, quizData]) => {
        setFormation(detailData.formation);
        setQuiz(quizData.quiz);
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof ApiClientError ? error.message : "Impossible de charger le quiz",
        );
      })
      .finally(() => setLoading(false));
  }, [formationId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!quiz || submitting) return;

    if (quiz.questions.some((question) => answers[question.id] === undefined)) {
      setErrorMessage("Veuillez répondre à toutes les questions.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const quizResult = await submitFormationQuiz(formationId, answers);
      setResult(quizResult);
      if (quizResult.certificate) {
        const detail = await fetchFormationDetail(formationId);
        setFormation(detail.formation);
      }
    } catch (error) {
      setErrorMessage(error instanceof ApiClientError ? error.message : "Soumission impossible");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="cjp-card-dark h-96 animate-pulse" />;
  }

  if (!formation || !quiz) {
    return (
      <p className="cjp-card-dark p-6 text-sm text-[var(--cjp-text-muted)]">
        {errorMessage || "Quiz indisponible."}
      </p>
    );
  }

  const existingCertificate = formation.certificate ?? result?.certificate;

  return (
    <div className="space-y-6">
      <div className="cjp-card-dark overflow-hidden">
        <div className="relative h-44">
          <img
            src={getFormationImage(formation.program)}
            alt=""
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--cjp-black)] via-[var(--cjp-black)]/40 to-transparent" />
          <div className="absolute bottom-0 p-6">
            <span className="cjp-badge-gold">{formation.program}</span>
            <h1 className="mt-3 text-2xl font-bold text-[var(--cjp-white)]">{formation.title}</h1>
            <p className="mt-2 cjp-text-lead text-sm">{formation.description}</p>
          </div>
        </div>
      </div>

      {existingCertificate ? (
        <div className="cjp-card-dark border border-[var(--cjp-gold)]/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cjp-gold)] text-[var(--cjp-black)]">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="cjp-label-gold">Certificat obtenu</p>
              <h2 className="mt-1 text-xl font-bold text-[var(--cjp-white)]">
                {existingCertificate.number}
              </h2>
              <p className="mt-2 text-sm text-[var(--cjp-text-muted)]">
                Délivré le{" "}
                {new Intl.DateTimeFormat("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).format(new Date(existingCertificate.issuedAt))}
              </p>
              <Link
                to={`/certificats/verify/${existingCertificate.number}`}
                className="mt-4 inline-flex text-xs font-semibold uppercase tracking-wider text-[var(--cjp-gold)] hover:underline"
              >
                Vérifier ce certificat
              </Link>
            </div>
          </div>
        </div>
      ) : user?.membership?.status !== "ACTIVE" ? (
        <p className="cjp-card-dark p-6 text-sm text-[var(--cjp-text-muted)]">
          Adhésion active requise pour passer le quiz et obtenir un certificat.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="cjp-card-dark space-y-6 p-6">
          <div>
            <p className="cjp-label-gold">Quiz de validation</p>
            <h2 className="text-xl font-bold text-[var(--cjp-white)]">{quiz.title}</h2>
            <p className="mt-2 text-sm text-[var(--cjp-text-muted)]">
              Score minimum requis : {quiz.passScore}% · {quiz.questions.length} questions
            </p>
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </p>
          ) : null}

          {result && !result.passed ? (
            <p className="rounded-lg border border-amber-400/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
              Score obtenu : {result.score}% — il faut {result.passScore}% pour valider. Réessayez !
            </p>
          ) : null}

          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <fieldset key={question.id} className="space-y-3">
                <legend className="text-sm font-semibold text-[var(--cjp-white)]">
                  {index + 1}. {question.prompt}
                </legend>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={`${question.id}-${optionIndex}`}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                        answers[question.id] === optionIndex
                          ? "border-[var(--cjp-gold)] bg-[var(--cjp-gold)]/10 text-[var(--cjp-white)]"
                          : "border-[var(--cjp-border)] text-[var(--cjp-text-muted)] hover:border-[var(--cjp-gold)]/50",
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === optionIndex}
                        onChange={() =>
                          setAnswers((current) => ({ ...current, [question.id]: optionIndex }))
                        }
                        className="accent-[var(--cjp-gold)]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-cjp inline-flex items-center gap-2 !py-3 !text-xs disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {submitting ? "Correction…" : "Valider mes réponses"}
          </button>
        </form>
      )}
    </div>
  );
}
