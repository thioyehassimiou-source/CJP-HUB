import { useEffect, useState } from "react";
import { CjpLogo } from "@/components/cjp/cjp-logo";
import type { AuthHeroSlide } from "@/lib/auth-data";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 6000;

type AuthHeroCarouselProps = {
  slides: AuthHeroSlide[];
};

export function AuthHeroCarousel({ slides }: AuthHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <aside className="relative min-h-[280px] w-full shrink-0 overflow-hidden sm:min-h-[360px] lg:sticky lg:top-0 lg:flex lg:h-screen lg:min-h-0 lg:w-1/2 lg:flex-col">
      <div
        className="flex h-full w-full flex-col transition-transform duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateY(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className="relative flex h-[280px] w-full shrink-0 flex-col justify-end sm:h-[360px] lg:h-screen lg:min-h-0"
          >
            <img
              src={slide.image}
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ease-out",
                index === activeIndex ? "scale-105" : "scale-100",
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--cjp-black)] via-[var(--cjp-black)]/55 to-[var(--cjp-black)]/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_100%,rgba(245,166,35,0.15),transparent_55%)]" />

            <div className="relative z-10 p-6 sm:p-8 lg:p-14">
              <CjpLogo variant="on-dark" size="sm" to={null} className="mb-6 lg:mb-8" />
              {slide.eyebrow ? (
                <p className="cjp-label-gold mb-3">{slide.eyebrow}</p>
              ) : null}
              <h2 className="max-w-[16ch] text-2xl font-extrabold leading-tight text-[var(--cjp-white)] sm:max-w-none sm:text-3xl lg:text-5xl">
                {slide.title}
              </h2>
              <p className="cjp-text-lead mt-4 text-sm text-[var(--cjp-text-muted)] sm:text-base lg:text-lg">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-6 bottom-6 left-6 z-20 flex items-center justify-between gap-4 lg:right-14 lg:bottom-10 lg:left-14">
        <div className="flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Afficher : ${slide.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-8 bg-[var(--cjp-gold)]"
                  : "w-1.5 bg-white/35 hover:bg-white/60",
              )}
            />
          ))}
        </div>
        <span className="text-xs font-medium tracking-wider text-white/70">
          {activeIndex + 1} / {slides.length}
        </span>
      </div>
    </aside>
  );
}
