import { cn } from "@/lib/utils";

type CjpDisplayTitleProps = {
  bold: string;
  light: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  lightOnDark?: boolean;
};

export function CjpDisplayTitle({
  bold,
  light,
  className,
  as: Tag = "h1",
  lightOnDark = true,
}: CjpDisplayTitleProps) {
  return (
    <Tag
      className={cn(
        "cjp-display-title",
        lightOnDark ? "text-[var(--cjp-white)]" : "text-[var(--cjp-black)]",
        className,
      )}
    >
      <span className="font-extrabold">{bold}</span>{" "}
      <span className="font-light">{light}</span>
    </Tag>
  );
}
