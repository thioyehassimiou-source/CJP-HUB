import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CjpLogo } from "@/components/cjp/cjp-logo";
import { AuthHeroCarousel } from "@/components/layout/auth-hero-carousel";
import type { AuthHeroSlide } from "@/lib/auth-data";
import { cn } from "@/lib/utils";

type AuthSplitLayoutProps = {
  title: string;
  description: string;
  slides: AuthHeroSlide[];
  children: React.ReactNode;
  footer?: React.ReactNode;
  wideForm?: boolean;
};

export function AuthSplitLayout({
  title,
  description,
  slides,
  children,
  footer,
  wideForm = false,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--cjp-offwhite)] font-[family-name:var(--cjp-font-sans)] lg:flex-row">
      <AuthHeroCarousel slides={slides} />

      <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col lg:w-1/2 lg:flex-none">
        <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div
            className={cn(
              "mx-auto w-full",
              wideForm ? "max-w-[640px]" : "max-w-[440px]",
            )}
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-light text-[var(--cjp-text-muted)] transition-colors hover:text-[var(--cjp-black)]"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                Retour à l&apos;accueil
              </Link>
              <CjpLogo variant="on-light" size="sm" to="/" className="lg:hidden" />
            </div>

            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--cjp-border)_25%,#ddd)] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-8">
              <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold tracking-tight text-[var(--cjp-black)]">
                {title}
              </h1>
              <p className="cjp-text-lead mt-3 text-sm">{description}</p>

              {children}
              {footer}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
