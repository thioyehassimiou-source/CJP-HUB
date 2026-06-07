import { CjpButton } from "@/components/cjp/cjp-button";
import { CjpDashboardShell } from "@/features/dashboard/components/cjp-dashboard-shell";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpThemedContent } from "@/components/cjp/cjp-themed-content";
import { cn } from "@/lib/utils";

type CjpDashboardPageProps = {
  children: React.ReactNode;
  titleBold?: string;
  titleLight?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  fullWidth?: boolean;
  hideSidebar?: boolean;
  light?: boolean;
  bare?: boolean;
  contentClassName?: string;
  fab?: {
    onClick: () => void;
    ariaLabel: string;
  };
  className?: string;
};

export function CjpDashboardPage({
  children,
  titleBold,
  titleLight = "",
  subtitle,
  actions,
  fullWidth = false,
  hideSidebar = false,
  light = false,
  bare = false,
  contentClassName,
  fab,
  className,
}: CjpDashboardPageProps) {
  return (
    <CjpDashboardShell fullWidth={fullWidth} hideSidebar={hideSidebar} fab={fab}>
      <div className={cn(!fullWidth && "space-y-8", className)}>
        {titleBold ? (
          <div className="cjp-page-header">
            <div className="min-w-0">
              <CjpDisplayTitle
                as="h1"
                bold={titleBold}
                light={titleLight}
                lightOnDark={!light}
                className="!text-[clamp(1.75rem,3vw,2.5rem)]"
              />
              {subtitle ? <p className="cjp-text-lead mt-3 text-base">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        ) : null}
        {bare ? (
          children
        ) : (
          <CjpThemedContent light={light} className={contentClassName}>
            {children}
          </CjpThemedContent>
        )}
      </div>
    </CjpDashboardShell>
  );
}

export { CjpButton };
