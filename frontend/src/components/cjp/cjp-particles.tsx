import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

type Particle = {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  variant: "gold" | "white" | "dim";
};

type CjpParticlesProps = {
  /** Nombre de particules (défaut 36). */
  count?: number;
  className?: string;
  /** Les particules suivent le curseur avec inertie (défaut true). */
  followCursor?: boolean;
};

/** Amplitude de déplacement (px) par couche — les grosses particules bougent plus. */
const LAYER_DEPTHS = [26, 52, 88] as const;

function buildParticles(count: number): Particle[] {
  const variants: Particle["variant"][] = ["gold", "gold", "white", "dim"];

  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 2 + Math.random() * 3.5,
    duration: 9 + Math.random() * 14,
    delay: -Math.random() * 20,
    drift: -14 + Math.random() * 28,
    variant: variants[Math.floor(Math.random() * variants.length)] ?? "gold",
  }));
}

/**
 * Champ de particules dorées qui dérivent vers le haut et suivent le curseur
 * avec un effet de profondeur (3 couches de parallaxe, lissage par inertie).
 */
export function CjpParticles({ count = 36, className, followCursor = true }: CjpParticlesProps) {
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const layers = useMemo(() => {
    // Tri par taille : petites particules → couche lointaine (bouge peu),
    // grosses → couche proche (bouge beaucoup).
    const sorted = [...buildParticles(count)].sort((a, b) => a.size - b.size);
    const perLayer = Math.ceil(sorted.length / LAYER_DEPTHS.length);
    return LAYER_DEPTHS.map((_, index) =>
      sorted.slice(index * perLayer, (index + 1) * perLayer),
    );
  }, [count]);

  useEffect(() => {
    if (!followCursor) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onMouseMove = (event: MouseEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };

    const tick = () => {
      // Lissage : les particules « rattrapent » le curseur avec inertie.
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      layerRefs.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = LAYER_DEPTHS[index] ?? 20;
        layer.style.transform = `translate3d(${currentX * depth * 2}px, ${currentY * depth * 2}px, 0)`;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [followCursor]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {layers.map((layerParticles, layerIndex) => (
        <div
          key={layerIndex}
          ref={(node) => {
            layerRefs.current[layerIndex] = node;
          }}
          className="absolute inset-0 will-change-transform"
        >
          {layerParticles.map((particle) => (
            <span
              key={particle.id}
              className={cn("cjp-particle", `cjp-particle-${particle.variant}`)}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
                ["--cjp-particle-drift" as string]: `${particle.drift}px`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
