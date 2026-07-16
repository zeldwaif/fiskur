import { useState } from "react";
import { Button } from "@/components/ui";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import "./pwa.css";

/**
 * Dismissible banner offering to install Fiskur to the home screen.
 * Uses the shared design tokens/Button component — restyle via theme, not here.
 */
export function InstallPrompt() {
  const { canPromptInstall, showIOSInstructions, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || (!canPromptInstall && !showIOSInstructions)) return null;

  return (
    <div className="fk-installprompt" role="complementary" aria-label="Install Fiskur">
      <div className="fk-installprompt__text">
        {canPromptInstall ? (
          <>
            <strong>Install Fiskur</strong> for full-screen, offline-ready access.
          </>
        ) : (
          <>
            <strong>Install Fiskur:</strong> tap Share, then "Add to Home Screen".
          </>
        )}
      </div>
      <div className="fk-installprompt__actions">
        {canPromptInstall && (
          <Button variant="primary" size="sm" onClick={promptInstall}>
            Install
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
          Not now
        </Button>
      </div>
    </div>
  );
}
