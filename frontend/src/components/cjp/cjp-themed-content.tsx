import { cn } from "@/lib/utils";

type CjpThemedContentProps = {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
};

export function CjpThemedContent({ children, light = false, className }: CjpThemedContentProps) {
  return (
    <div
      data-cjp-dashboard={light ? "light" : "dark"}
      className={cn(
        light &&
          "rounded-xl border border-[var(--cjp-border)] bg-[var(--cjp-offwhite)] p-6 text-[var(--cjp-black)] md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
