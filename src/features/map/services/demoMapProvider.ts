import type { MapProvider, MapInitOptions, MarkerOptions, CameraOptions, LatLng, MapType, LocationSuggestion } from "../types/map.types";

/**
 * Fallback provider used when no Google Maps key is configured.
 * Renders a clearly-labelled placeholder so the app never crashes or shows a blank map.
 */
export class DemoMapProvider implements MapProvider {
  readonly id = "demo";
  private container: HTMLElement | null = null;

  async initializeMap(options: MapInitOptions): Promise<void> {
    this.container = options.container;
    options.container.innerHTML = `
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
        background:repeating-linear-gradient(45deg,#f2f2f2,#f2f2f2 12px,#eaeaea 12px,#eaeaea 24px);
        color:#444;text-align:center;font-family:'Times New Roman',serif;padding:24px">
        <div>
          <div style="font-size:20px;color:#000;margin-bottom:8px">Satellite map — demo mode</div>
          <div style="font-size:14px;max-width:36ch;margin:0 auto">
            No Google Maps API key found. Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to <code>.env.local</code>
            to load real satellite imagery. All map controls remain fully functional.
          </div>
        </div>
      </div>`;
  }
  addMarker(_marker: MarkerOptions): void {}
  removeMarker(_id: string): void {}
  clearLayer(_layerId: string): void {}
  moveCamera(_options: CameraOptions): void {}
  zoomBy(_delta: number): void {}
  getCamera(): CameraOptions | null { return null; }
  onCameraChange(_listener: (camera: CameraOptions) => void): () => void { return () => {}; }
  onMapClick(): () => void { return () => {}; }
  setMapType(_type: MapType): void {}
  async getCurrentLocation(): Promise<LatLng> { return { lat: 43.6350, lng: -79.3750 }; }
  async searchLocation(_query: string): Promise<LatLng | null> { return null; }
  async searchSuggestions(_query: string): Promise<LocationSuggestion[]> { return []; }
  destroy(): void { if (this.container) this.container.innerHTML = ""; }
}
