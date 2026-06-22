import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CjpButtonProps = {
  children: React.ReactNode;
  to?: string;
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  showArrow?: boolean;
  disabled?: boolean;
};

/** Effet « ripple » au clic, positionné au point d'impact du curseur. */
function spawnRipple(event: React.MouseEvent<HTMLElement>, gold: boolean) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;

  const ripple = document.createElement("span");
  ripple.className = gold ? "cjp-ripple cjp-ripple-gold" : "cjp-ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

  target.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 600);
}

export function CjpButton({
  children,
  to,
  href,
  variant = "primary",
  className,
  onClick,
  type = "button",
  showArrow = true,
  disabled,
}: CjpButtonProps) {
  const content = (
    <>
      <span>{children}</span>
      {showArrow ? (
        <span className="cjp-btn-arrow">
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      ) : null}
    </>
  );

  const classes = cn(variant === "primary" ? "btn-cjp" : "btn-cjp-outline", className);
  const handleRipple = (event: React.MouseEvent<HTMLElement>) =>
    spawnRipple(event, variant === "outline");

  if (to) {
    return (
      <Link to={to} className={classes} onMouseDown={handleRipple}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onMouseDown={handleRipple}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={handleRipple}
      className={classes}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
