

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/icon";
import { MOBILE_NAV, isNavActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-surface-container-lowest md:hidden">
      {MOBILE_NAV.map((item) => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              active ? "text-primary" : "text-on-surface-variant",
            )}
          >
            <Icon name={item.icon} className="text-2xl" filled={active} />
            <span className="text-[10px] font-bold">{item.mobileLabel ?? item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
