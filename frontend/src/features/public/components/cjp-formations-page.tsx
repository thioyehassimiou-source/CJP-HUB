import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code2 } from "lucide-react";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { CjpReveal } from "@/components/cjp/cjp-reveal";
import { CjpParticles } from "@/components/cjp/cjp-particles";
import { ApiClientError } from "@/lib/api/client";
import { fetchFormations } from "@/lib/api/formations";
import type { ApiFormation } from "@/lib/api/types";
import { getFormationImage } from "@/lib/catalog-display";

export function CjpFormationsPage() {
  const [formations, setFormations] = useState<ApiFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    fetchFormations()
      .then(({ formations: data }) => {
        if (!cancelled) setFormations(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error instanceof ApiClientError ? error.message : "Impossible de charger les formations",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cjp-gold)]/10 text-[var(--cjp-gold)]">
                <Code2 className="h-5 w-5" />
              </span>
              <p className="cjp-label-gold !mb-0">Forum CJP</p>
            </div>
            <CjpDisplayTitle
              as="h1"
              bold="Formations"
              light="du Forum"
              className="!text-[clamp(2rem,5vw,3.5rem)]"
            />
            <p className="cjp-text-lead mt-6 max-w-2xl">
              Découvrez les parcours intensifs encadrés par nos mentors lors de notre grand Forum technologique. Formez-vous aux standards de l'industrie technologique.
            </p>
          </CjpReveal>

          {errorMessage ? (
            <p className="mt-8 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </p>
          ) : null}

          {loading ? (
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="cjp-card-dark h-[450px] animate-pulse" />
              ))}
            </div>
          ) : null}

          {!loading && !errorMessage && formations.length === 0 ? (
            <CjpReveal delay={200}>
              <div className="mt-16 rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-dark)]/50 p-12 text-center backdrop-blur-sm">
                <Code2 className="mx-auto h-12 w-12 text-[var(--cjp-text-muted)] opacity-50 mb-4" />
                <p className="text-lg font-bold text-[var(--cjp-white)]">Programme en cours d'élaboration</p>
                <p className="mt-2 text-sm text-[var(--cjp-text-muted)]">
                  Le programme des formations du prochain Forum est en cours d'élaboration.
                </p>
              </div>
            </CjpReveal>
          ) : null}

          {!loading && formations.length > 0 ? (
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {formations.map((formation, index) => (
                <CjpReveal key={formation.id} delay={(index % 3) * 150}>
                  <article className="cjp-card-dark group flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,166,35,0.2)]">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--cjp-black)]/40 transition-colors duration-500 group-hover:bg-transparent z-10" />
                      <img
                        src={getFormationImage(formation.program)}
                        alt=""
                        className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--cjp-black)] via-[var(--cjp-black)]/80 to-transparent p-6 z-20">
                        <span className="inline-block rounded-full border border-[var(--cjp-gold)]/50 bg-[var(--cjp-black)]/80 px-3 py-1 text-xs font-bold text-[var(--cjp-gold)] backdrop-blur-md">
                          {formation.program}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-xl font-bold text-[var(--cjp-white)] transition-colors duration-300 group-hover:text-[var(--cjp-gold)]">
                        {formation.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm font-light leading-relaxed text-[var(--cjp-text-muted)] flex-1">
                        {formation.description}
                      </p>
                      
                      <div className="mt-6 space-y-3 border-t border-[var(--cjp-border)] pt-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--cjp-text-muted)]">Niveau requis</span>
                          <span className="font-semibold text-[var(--cjp-white)]">{formation.level}</span>
                        </div>
                        
                        <Link 
                          to="/inscription" 
                          className="group/link mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--cjp-dark)] py-3 text-sm font-bold text-[var(--cjp-gold)] transition-all hover:bg-[var(--cjp-gold)] hover:text-[var(--cjp-black)]"
                        >
                          S'INSCRIRE À LA SESSION
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </CjpReveal>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </CjpPublicLayout>
  );
}
