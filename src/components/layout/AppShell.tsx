import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { Sidebar } from "./Sidebar";
import { MobileNavigation } from "./MobileNavigation";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { useIsMobile } from "@/hooks/useMediaQuery";
import "./layout.css";

/** Global application frame. Owns header/nav/content composition - not feature logic. */
export function AppShell({ children, headerActions }: { children: ReactNode; headerActions?: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <div className="fk-shell">
      <AppHeader actions={headerActions} />
      <InstallPrompt />
      <div className="fk-shell__body">
        {!isMobile && <Sidebar />}
        <main className="fk-main">{children}</main>
      </div>
      {isMobile && <MobileNavigation />}
    </div>
  );
}
