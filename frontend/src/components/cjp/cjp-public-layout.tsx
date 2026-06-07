import { CjpFooter } from "@/components/cjp/cjp-footer";
import { CjpNavbar } from "@/components/cjp/cjp-navbar";
import { cn } from "@/lib/utils";

type CjpPublicLayoutProps = {
  children: React.ReactNode;
  variant?: "dark" | "light";
  className?: string;
};

export function CjpPublicLayout({
  children,
  variant = "light",
  className,
}: CjpPublicLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col font-[family-name:var(--cjp-font-sans)]",
        variant === "dark" ? "bg-[var(--cjp-black)] text-[var(--cjp-white)]" : "bg-[var(--cjp-offwhite)] text-[var(--cjp-black)]",
        className,
      )}
    >
      <CjpNavbar />
      <main className="flex-1">{children}</main>
      <CjpFooter />
    </div>
  );
}
