

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  immediate?: boolean;
};

export function AnimatedSection({
  children,
  className,
  id,
  immediate = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "w-full transition-all duration-700",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </section>
  );
}
