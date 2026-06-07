import { cn } from "@/lib/utils";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
};

export function ToggleSwitch({ checked, onChange, ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-12 rounded-full transition-colors",
        checked ? "bg-secondary" : "bg-surface-variant",
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
          checked ? "right-1" : "left-1",
        )}
      />
    </button>
  );
}
