import { Panel, SectionHeader, IconButton } from "@/components/ui";
import { CatchLogForm } from "@/features/catches/components/CatchLogForm";
import type { LatLng } from "../types/map.types";

/**
 * "I caught one here" — the panel that opens when the user taps a point on the map.
 *
 * This is the bridge between the two halves of the app: before this existed, the map and
 * the catch log were effectively separate apps, and you could only attach a catch to a
 * spot you'd saved earlier. Tapping the water where it actually happened is both faster
 * and better data (an exact coordinate rather than a nearby named spot).
 */
export function QuickCatchPanel({ position, onClose }: { position: LatLng; onClose: () => void }) {
  return (
    <Panel className="fk-quickcatch">
      <SectionHeader
        title="Log a catch here"
        action={<IconButton label="Cancel" onClick={onClose}>×</IconButton>}
      />
      <CatchLogForm
        presetPosition={position}
        presetLabel="Dropped pin"
        onLogged={onClose}
      />
    </Panel>
  );
}
