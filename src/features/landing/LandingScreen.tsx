import { useEffect, useRef } from "react";
import { appConfig } from "@/app/config";
import { motion } from "@/theme/motion";
import "./landing.css";

/**
 * Full-screen entry overlay. It only handles input; the parent (App) coordinates the
 * simultaneous slide of landing-out + app-in. Styling/timing come from the design system.
 */
export function LandingScreen({ exiting, onBegin }: { exiting: boolean; onBegin: () => void }) {
  const done = useRef(false);

  function begin() {
    if (done.current) return; // prevent repeated inputs during the transition
    done.current = true;
    onBegin();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); begin(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fk-landing${exiting ? " fk-landing--exit" : ""}`}
      style={{ ["--landing-exit" as string]: motion.landing.outgoingTransform }}
      role="button"
      tabIndex={0}
      aria-label={`${appConfig.appName}. Press anywhere to continue.`}
      onClick={begin}
    >
      <h1 className="fk-landing__title">{appConfig.appName}</h1>
      <p className="fk-landing__credit">{appConfig.creatorCredit}</p>
      <p className="fk-landing__continue">Press anywhere to continue</p>
    </div>
  );
}
