import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { CjpReveal } from "@/components/cjp/cjp-reveal";
import { CjpParticles } from "@/components/cjp/cjp-particles";
import { LibraryApiDashboard } from "@/features/library/components/library-api-dashboard";

export function CjpBibliothequePage() {
  return (
    <CjpPublicLayout variant="dark">
      <section className="relative min-h-screen py-12 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(245,166,35,0.08),transparent_60%)]"
          aria-hidden
        />
        <CjpParticles count={25} />
        
        <div className="cjp-container relative z-10">
          <CjpReveal>
            <p className="cjp-label-gold mb-4">Ressources & Archives</p>
            <CjpDisplayTitle
              as="h1"
              bold="Bibliothèque"
              light=" du CJP"
              className="!text-[clamp(2rem,5vw,3.5rem)]"
            />
            <p className="cjp-text-lead mt-4 mb-12">
              Consultez et téléchargez les ressources académiques, tutoriels et documents officiels du Club des Jeunes Programmeurs.
            </p>
          </CjpReveal>

          <LibraryApiDashboard />
        </div>
      </section>
    </CjpPublicLayout>
  );
}
