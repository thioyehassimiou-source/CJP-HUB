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
};

export function CjpButton({
  children,
  to,
  href,
  variant = "primary",
  className,
  onClick,
  type = "button",
  showArrow = true,
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

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
