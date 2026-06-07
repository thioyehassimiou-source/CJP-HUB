import { cn } from "@/lib/utils";

type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
  style?: React.CSSProperties;
};

export function Icon({ name, className, filled = false, size, style }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", filled && "filled", className)}
      style={size ? { fontSize: size, ...style } : style}
    >
      {name}
    </span>
  );
}
