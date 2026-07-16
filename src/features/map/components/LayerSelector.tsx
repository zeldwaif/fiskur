import { Panel, SectionHeader, Toggle } from "@/components/ui";
import { availableLayers } from "../layers/layerRegistry";
import { useAppStore } from "@/store/appStore";
import "./map.css";

/** Renders map layers from the registry; toggles global active-layer state. */
export function LayerSelector() {
  const { activeMapLayers, dispatch } = useAppStore();
  return (
    <Panel>
      <SectionHeader title="Map Layers" />
      <div className="fk-layerlist">
        {availableLayers().map((layer) => (
          <div className="fk-layerrow" key={layer.id}>
            <span>{layer.label}</span>
            <Toggle
              label={layer.label}
              checked={activeMapLayers.includes(layer.id)}
              onChange={() => dispatch({ type: "TOGGLE_LAYER", id: layer.id })}
            />
          </div>
        ))}
      </div>
    </Panel>
  );
}
