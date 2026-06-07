import { Link } from "react-router-dom";
import { CJP_BRAND_NAME, CJP_CLUB_NAME, CJP_LOGO } from "@/lib/cjp-brand";
import { cn } from "@/lib/utils";

type CjpLogoVariant = "on-dark" | "on-light";
type CjpLogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<CjpLogoSize, string> = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

type CjpLogoProps = {
  variant?: CjpLogoVariant;
  size?: CjpLogoSize;
  showWordmark?: boolean;
  wordmark?: string;
  wordmarkClassName?: string;
  className?: string;
  imageClassName?: string;
  to?: string | null;
  alt?: string;
};

export function CjpLogo({
  variant = "on-dark",
  size = "sm",
  showWordmark = false,
  wordmark = CJP_BRAND_NAME,
  wordmarkClassName,
  className,
  imageClassName,
  to = "/",
  alt = CJP_CLUB_NAME,
}: CjpLogoProps) {
  const src = variant === "on-dark" ? CJP_LOGO.onDark : CJP_LOGO.onLight;

  const content = (
    <>
      <img
        src={src}
        alt={alt}
        className={cn(SIZE_CLASSES[size], "shrink-0 object-contain", imageClassName)}
      />
      {showWordmark ? (
        <span
          className={cn(
            "text-sm font-semibold tracking-widest",
            variant === "on-dark" ? "text-[var(--cjp-white)]" : "text-[var(--cjp-black)]",
            wordmarkClassName,
          )}
        >
          {wordmark}
        </span>
      ) : null}
    </>
  );

  const classes = cn("flex shrink-0 items-center gap-3", className);

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={`${wordmark} — accueil`}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
