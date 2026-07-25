export interface LatLng { lat: number; lng: number; }

/**
 * Visual treatment for a marker. Kept as a semantic name rather than raw colours so the
 * provider decides how to draw it — a Google implementation and an OpenLayers one style
 * these very differently.
 */
export type MarkerVariant = "default" | "pending" | "live";

export interface MarkerOptions {
  id: string;
  position: LatLng;
  title?: string;
  layerId?: string;
  variant?: MarkerVariant;
}

export interface CameraOptions {
  center: LatLng;
  zoom?: number;
  animate?: boolean;
}

export type MapType = "roadmap" | "satellite" | "hybrid" | "terrain";

export interface MapInitOptions {
  container: HTMLElement;
  center: LatLng;
  zoom: number;
  mapType: MapType;
}

/** Modifier keys held during a map click. */
export interface ClickModifiers {
  shift: boolean;
  alt: boolean;
  ctrl: boolean;
  meta: boolean;
}

/** A single geocoding suggestion shown in the search dropdown. */
export interface LocationSuggestion {
  id: string;
  label: string;
  position: LatLng;
}

/** Provider-agnostic map interface. Feature code depends on THIS, never on Google directly. */
export interface MapProvider {
  readonly id: string;
  initializeMap(options: MapInitOptions): Promise<void>;
  addMarker(marker: MarkerOptions): void;
  removeMarker(id: string): void;
  clearLayer(layerId: string): void;
  moveCamera(options: CameraOptions): void;
  /** Zoom in (positive delta) or out (negative delta) relative to the current zoom level. */
  zoomBy(delta: number): void;
  /** Reads back the current camera so it can be persisted or inspected. */
  getCamera(): CameraOptions | null;
  /** Fires whenever the user pans/zooms the map (for persistence, etc). Returns an unsubscribe function. */
  onCameraChange(listener: (camera: CameraOptions) => void): () => void;
  /**
   * Fires when the user taps/clicks a point on the map. Returns an unsubscribe function.
   * `modifiers` reports which keys were held, so callers can distinguish a plain click
   * (which must stay a normal pan/inspect gesture) from a deliberate modified click.
   */
  onMapClick(listener: (position: LatLng, modifiers: ClickModifiers) => void): () => void;
  setMapType(type: MapType): void;
  getCurrentLocation(): Promise<LatLng>;
  searchLocation(query: string): Promise<LatLng | null>;
  /** Up to a handful of candidate matches for a partial query, for a search-as-you-type dropdown. */
  searchSuggestions(query: string): Promise<LocationSuggestion[]>;
  destroy(): void;
}
