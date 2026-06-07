import { AnimatedSection } from "@/features/landing/components/animated-section";
import { cn } from "@/lib/utils";

type LandingSectionProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  immediate?: boolean;
  bleed?: boolean;
};

export function LandingSection({
  children,
  className,
  innerClassName,
  id,
  immediate,
  bleed = false,
}: LandingSectionProps) {
  return (
    <AnimatedSection
      id={id}
      immediate={immediate}
      className={cn("w-full", className)}
    >
      {bleed ? (
        children
      ) : (
        <div className={cn("landing-container", innerClassName)}>{children}</div>
      )}
    </AnimatedSection>
  );
}
