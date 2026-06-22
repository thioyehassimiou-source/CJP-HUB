import { useEffect, useRef, useState, useMemo } from "react";

import { Download, FileText, Lock } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { CjpReveal } from "@/components/cjp/cjp-reveal";
import { CjpParticles } from "@/components/cjp/cjp-particles";
import { CjpButton } from "@/components/cjp/cjp-button";
import { useAuth } from "@/features/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { fetchFinanceSummary, fetchFinanceTransactions } from "@/lib/api/finance";
import type { ApiFinanceTransaction, FinanceSummary } from "@/lib/api/types";
import { formatFinanceDate, formatGnf, formatSignedGnf } from "@/lib/finance-display";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/lib/use-count-up";

function AnimatedAmount({ value }: { value: number }) {
  const animatedValue = useCountUp(value, 1500) ?? 0;
  return <>{formatGnf(animatedValue)}</>;
}

type FilterType = "ALL" | "INCOME" | "EXPENSE";

export function CjpTresoreriePage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [transactions, setTransactions] = useState<ApiFinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const glowRef = useRef<HTMLDivElement>(null);

  const isActiveMember = user?.membership?.status === "ACTIVE";

  useEffect(() => {
    if (!isActiveMember) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([fetchFinanceSummary(), fetchFinanceTransactions()])
      .then(([summaryData, transactionsData]) => {
        if (cancelled) return;
        setSummary(summaryData);
        setTransactions(transactionsData.transactions);
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error instanceof ApiClientError ? error.message : "Impossible de charger la trésorerie",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isActiveMember]);

  const filteredTransactions = useMemo(() => {
    if (filterType === "ALL") return transactions;
    return transactions.filter((tx) => tx.type === filterType);
  }, [transactions, filterType]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Historique des transactions - CJP Hub", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Généré le : ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`, 14, 28);
    doc.text(`Membre : ${user?.firstName} ${user?.lastName} (${user?.matricule})`, 14, 34);

    const tableData = filteredTransactions.map((tx) => [
      formatFinanceDate(tx.transactionAt),
      tx.description,
      tx.type === "INCOME" ? "Recette" : "Dépense",
      tx.category,
      formatSignedGnf(tx.signedAmount),
    ]);

    autoTable(doc, {
      head: [["Date", "Libellé", "Type", "Catégorie", "Montant"]],
      body: tableData,
      startY: 40,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [245, 166, 35], textColor: [10, 10, 10] },
      columnStyles: {
        4: { halign: "right", fontStyle: "bold" }
      },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.raw && data.cell.raw.toString().startsWith("-")) {
            data.cell.styles.textColor = [150, 150, 150]; // Gris
          } else {
            data.cell.styles.textColor = [200, 130, 0]; // Or foncé
          }
        }
      }
    });

    doc.save(`tresorerie_cjp_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const maxValue = Math.max(
    ...(summary?.chart.flatMap((item) => [item.income, item.expenses]) ?? [1]),
    1,
  );

  const handleHeroMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${x * 40}px, ${y * 30}px)`;
    }
  };

  const handleHeroMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.transform = "translate(0, 0)";
  };

  return (
    <CjpPublicLayout variant="dark">
      <section 
        className="relative min-h-screen overflow-hidden py-16 md:py-20"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_40%,rgba(245,166,35,0.12),transparent_55%)] transition-transform duration-300 ease-out"
          aria-hidden
        />
        <CjpParticles count={25} />
        
        <div className="cjp-container relative z-10">
          <CjpReveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="cjp-label-gold mb-4">Transparence Financière</p>
                <CjpDisplayTitle
                  as="h1"
                  bold="Trésorerie"
                  light="du club"
                  className="!text-[clamp(2rem,5vw,3.5rem)]"
                />
                <p className="cjp-text-lead mt-4 max-w-2xl">
                  Suivi en temps réel des recettes, dépenses et cotisations du Club des Jeunes Programmeurs.
                </p>
              </div>
              {isActiveMember && summary && !loading && (
                <CjpButton onClick={exportPDF} variant="outline" className="shrink-0 group">
                  <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  Exporter PDF
                </CjpButton>
              )}
            </div>
          </CjpReveal>

          {!isActiveMember ? (
            <div style={{ width: '100%' }} className="mt-16">
              <div className="w-full rounded-2xl border border-[var(--cjp-border)] bg-[var(--cjp-black)]/60 p-8 md:p-12 text-center backdrop-blur-sm">
                <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--cjp-dark)] border border-[var(--cjp-gold)]/30 shadow-[0_0_30px_rgba(245,166,35,0.15)]">
                  <Lock className="h-8 w-8 text-[var(--cjp-gold)]" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-[var(--cjp-white)]">Accès Restreint</h2>
                <p style={{ maxWidth: '36rem', margin: '0 auto 2rem auto' }} className="text-base leading-relaxed text-[var(--cjp-text-muted)]">
                  L'accès à la comptabilité et à la trésorerie est strictement réservé aux membres actifs du CJP, afin de garantir la confidentialité et la sécurité de notre argent public.
                </p>
                {!user ? (
                  <div className="flex justify-center">
                    <CjpButton to="/connexion">Se connecter</CjpButton>
                  </div>
                ) : (
                  <p style={{ maxWidth: '32rem', margin: '0 auto' }} className="text-sm font-semibold text-[var(--cjp-gold)]">
                    Votre adhésion n'est pas encore active. Veuillez régulariser votre situation ou contacter le bureau.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {errorMessage ? (
                <CjpReveal>
                  <p className="mt-8 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
                    {errorMessage}
                  </p>
                </CjpReveal>
              ) : null}

              {loading ? (
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="cjp-card-dark h-32 animate-pulse p-6" />
                  ))}
                </div>
              ) : null}

              {!loading && summary ? (
                <>
                  <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                      { label: "Recettes totales", value: summary.totalIncome },
                      { label: "Dépenses totales", value: summary.totalExpenses },
                      { label: "Solde actuel", value: summary.netBalance },
                    ].map((card, index) => (
                      <CjpReveal key={card.label} delay={index * 100}>
                        <div className="cjp-card-dark group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-12px_rgba(245,166,35,0.25)] border-[var(--cjp-gold)]/20">
                          <div className="absolute top-0 right-0 h-16 w-16 opacity-10 transition-opacity duration-300 group-hover:opacity-20 bg-[radial-gradient(circle_at_top_right,var(--cjp-gold),transparent)]" />
                          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--cjp-text-muted)] transition-colors group-hover:text-[var(--cjp-white)]">{card.label}</p>
                          <p className="mt-3 text-3xl font-bold text-[var(--cjp-gold)] drop-shadow-[0_0_8px_rgba(245,166,35,0.2)]">
                            <AnimatedAmount value={card.value} />
                          </p>
                        </div>
                      </CjpReveal>
                    ))}
                  </div>

                  {summary.chart.length > 0 ? (
                    <CjpReveal delay={200}>
                      <div className="cjp-card-dark group mt-10 p-6 sm:p-8 transition-all hover:border-[var(--cjp-gold)]/30">
                        <h2 className="text-xl font-bold text-[var(--cjp-white)]">Recettes vs Dépenses</h2>
                        <div className="mt-10 flex h-56 sm:h-64 items-end justify-between gap-2 sm:gap-6 border-b border-[var(--cjp-border)]/50 pb-2">
                          {summary.chart.map((item) => (
                            <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
                              <div className="flex h-44 sm:h-52 w-full items-end justify-center gap-1 sm:gap-2">
                                <div className="group/bar relative flex h-full items-end">
                                  <div
                                    className="w-3 sm:w-6 rounded-t bg-[var(--cjp-gold)] shadow-[0_0_10px_rgba(245,166,35,0.1)] transition-all duration-1000 ease-out group-hover:shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                                    style={{ height: `${Math.max((item.income / maxValue) * 100, item.income > 0 ? 1 : 0)}%`, minHeight: item.income > 0 ? '4px' : '0' }}
                                  />
                                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[var(--cjp-black)] px-2 py-1 text-xs text-[var(--cjp-white)] border border-[var(--cjp-border)] opacity-0 transition-opacity group-hover/bar:block group-hover/bar:opacity-100 z-10">
                                    Recettes: {formatGnf(item.income)}
                                  </div>
                                </div>
                                <div className="group/bar relative flex h-full items-end">
                                  <div
                                    className="w-3 sm:w-6 rounded-t bg-[var(--cjp-border)] transition-all duration-1000 ease-out hover:bg-zinc-600"
                                    style={{ height: `${Math.max((item.expenses / maxValue) * 100, item.expenses > 0 ? 1 : 0)}%`, minHeight: item.expenses > 0 ? '4px' : '0' }}
                                  />
                                  <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[var(--cjp-black)] px-2 py-1 text-xs text-[var(--cjp-white)] border border-[var(--cjp-border)] opacity-0 transition-opacity group-hover/bar:block group-hover/bar:opacity-100 z-10">
                                    Dépenses: {formatGnf(item.expenses)}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] sm:text-xs font-medium text-[var(--cjp-text-muted)]">{item.month}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 flex justify-center gap-8 text-sm font-medium">
                          <span className="flex items-center gap-2 text-[var(--cjp-white)]">
                            <span className="h-3 w-3 rounded-sm bg-[var(--cjp-gold)] shadow-[0_0_5px_rgba(245,166,35,0.5)]" /> Recettes
                          </span>
                          <span className="flex items-center gap-2 text-[var(--cjp-text-muted)]">
                            <span className="h-3 w-3 rounded-sm bg-[var(--cjp-border)]" /> Dépenses
                          </span>
                        </div>
                      </div>
                    </CjpReveal>
                  ) : null}

                  <CjpReveal delay={300}>
                    <div className="cjp-card-dark mt-10 overflow-hidden border-[var(--cjp-border)]/50">
                      <div className="flex flex-col gap-4 border-b border-[var(--cjp-border)]/50 bg-[var(--cjp-black)]/30 p-6 md:flex-row md:items-end md:justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-[var(--cjp-white)]">Historique des transactions</h2>
                            <span className="rounded-full bg-[var(--cjp-dark)] border border-[var(--cjp-gold)]/20 px-2 py-0.5 text-xs font-bold text-[var(--cjp-gold)] shadow-[0_0_10px_rgba(245,166,35,0.1)]">
                              Certifié
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-[var(--cjp-text-muted)]">
                            Cotisations reçues : <span className="text-[var(--cjp-white)]">{formatGnf(summary.cotisationsReceived)}</span>
                          </p>
                        </div>
                        
                        {/* Filtres */}
                        <div className="flex rounded-lg bg-[var(--cjp-dark)] p-1 border border-[var(--cjp-border)]">
                          {(["ALL", "INCOME", "EXPENSE"] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => setFilterType(type)}
                              className={cn(
                                "rounded-md px-4 py-1.5 text-xs font-semibold transition-all",
                                filterType === type
                                  ? "bg-[var(--cjp-gold)] text-[var(--cjp-black)] shadow-sm"
                                  : "text-[var(--cjp-text-muted)] hover:text-[var(--cjp-white)]"
                              )}
                            >
                              {type === "ALL" ? "Toutes" : type === "INCOME" ? "Recettes" : "Dépenses"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                          <thead className="bg-[var(--cjp-dark)] text-xs uppercase tracking-wider text-[var(--cjp-text-muted)]">
                            <tr>
                              <th className="px-6 py-4 font-semibold">Date</th>
                              <th className="px-6 py-4 font-semibold">Libellé</th>
                              <th className="px-6 py-4 font-semibold text-right">Montant</th>
                              <th className="px-6 py-4 font-semibold text-center">Justificatif</th>
                              <th className="px-6 py-4 font-semibold text-right">Catégorie</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--cjp-border)]/30">
                            {filteredTransactions.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-8 text-center italic text-[var(--cjp-text-muted)]">
                                  Aucune transaction ne correspond à ce filtre.
                                </td>
                              </tr>
                            ) : null}
                            {filteredTransactions.map((tx) => (
                              <tr key={tx.id} className="group/row transition-colors hover:bg-[var(--cjp-dark)]/50">
                                <td className="px-6 py-4 font-mono text-xs text-[var(--cjp-text-muted)] whitespace-nowrap">
                                  {formatFinanceDate(tx.transactionAt)}
                                </td>
                                <td className="px-6 py-4 font-medium text-[var(--cjp-white)]">
                                  {tx.description}
                                </td>
                                <td
                                  className={cn(
                                    "px-6 py-4 font-bold text-right font-mono whitespace-nowrap",
                                    tx.signedAmount >= 0
                                      ? "text-[var(--cjp-gold)]"
                                      : "text-zinc-400",
                                  )}
                                >
                                  {formatSignedGnf(tx.signedAmount)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {tx.receiptUrl ? (
                                    <a
                                      href={tx.receiptUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center rounded-full bg-[var(--cjp-dark)] p-2 text-[var(--cjp-text-muted)] transition-colors hover:bg-[var(--cjp-gold)]/10 hover:text-[var(--cjp-gold)]"
                                      title="Voir le justificatif"
                                    >
                                      <FileText className="h-4 w-4" />
                                    </a>
                                  ) : (
                                    <span className="text-[var(--cjp-text-muted)]/50">—</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className="inline-flex items-center rounded-full border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-2.5 py-0.5 text-xs font-semibold text-[var(--cjp-text-muted)]">
                                    {tx.category}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CjpReveal>
                </>
              ) : null}
            </>
          )}
        </div>
      </section>
    </CjpPublicLayout>
  );
}
