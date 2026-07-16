import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import { AppShell } from "@/components/layout";
import { LandingScreen } from "@/features/landing/LandingScreen";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "@/theme/motion";
import { appRoutes } from "./routes";
import { appConfig } from "./config";

type Phase = "landing" | "transitioning" | "entered";

function RoutedContent() {
  return useRoutes(appRoutes);
}

export function App() {
  const [phase, setPhase] = useState<Phase>("landing");
  const reduced = useReducedMotion();

  useEffect(() => { document.title = appConfig.defaultPageTitle; }, []);

  function begin() {
    if (reduced) { setPhase("entered"); return; }
    setPhase("transitioning"); // landing slides left + app slides in simultaneously
    window.setTimeout(() => setPhase("entered"), motion.landing.duration);
  }

  const showLanding = phase !== "entered";
  const appIn = phase === "transitioning" || phase === "entered";

  return (
    <>
      {showLanding && <LandingScreen exiting={phase === "transitioning"} onBegin={begin} />}
      <div className={`fk-appenter${appIn ? " fk-appenter--in" : ""}`} aria-hidden={!appIn}>
        <AppShell>
          <RoutedContent />
        </AppShell>
      </div>
    </>
  );
}
