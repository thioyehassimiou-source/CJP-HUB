import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CjpRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Délai en ms appliqué une fois l'élément visible (effet cascade). */
  delay?: number;
};

/** Révèle son contenu (fondu + translation) quand il entre dans le viewport. */
export function CjpReveal({ children, className, delay = 0 }: CjpRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
