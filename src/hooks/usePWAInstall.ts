import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Cross-platform PWA install affordance.
 *
 * - Chrome/Android/desktop: fires `beforeinstallprompt`; we capture it and expose
 *   `promptInstall()` to trigger the native install dialog on demand.
 * - iOS Safari: never fires that event (no programmatic install API exists there),
 *   so we detect iOS and expose `isIOS` so the UI can show manual instructions instead
 *   ("Share -> Add to Home Screen").
 * - Already installed (standalone display mode): both flags stay false so no prompt
 *   is shown to someone who's already installed the app.
 */
export function usePWAInstall() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true,
    );
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const onInstalled = () => setDeferredEvent(null);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const canPromptInstall = Boolean(deferredEvent) && !isStandalone;
  const showIOSInstructions = isIOS && !isStandalone && !deferredEvent;

  async function promptInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    setDeferredEvent(null);
  }

  return { canPromptInstall, showIOSInstructions, isStandalone, promptInstall };
}
