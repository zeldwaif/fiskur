export interface LatLng { lat: number; lng: number; }

export interface MarkerOptions {
  id: string;
  position: LatLng;
  title?: string;
  layerId?: string;
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

/** Provider-agnostic map interface. Feature code depends on THIS, never on Google directly. */
export interface MapProvider {
  readonly id: string;
  initializeMap(options: MapInitOptions): Promise<void>;
  addMarker(marker: MarkerOptions): void;
  removeMarker(id: string): void;
  clearLayer(layerId: string): void;
  moveCamera(options: CameraOptions): void;
  setMapType(type: MapType): void;
  getCurrentLocation(): Promise<LatLng>;
  searchLocation(query: string): Promise<LatLng | null>;
  destroy(): void;
}
