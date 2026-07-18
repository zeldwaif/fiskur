import type { MapProvider, MapInitOptions, MarkerOptions, CameraOptions, LatLng, MapType, LocationSuggestion } from "../types/map.types";

let scriptPromise: Promise<void> | null = null;
function loadGoogleMaps(apiKey: string): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if ((window as any).google?.maps) return resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Google Maps implementation of the provider interface. Kept isolated here. */
export class GoogleMapsProvider implements MapProvider {
  readonly id = "google";
  private map: google.maps.Map | null = null;
  private markers = new Map<string, google.maps.Marker>();

  constructor(private apiKey: string) {}

  async initializeMap(options: MapInitOptions): Promise<void> {
    await loadGoogleMaps(this.apiKey);
    this.map = new google.maps.Map(options.container, {
      center: options.center,
      zoom: options.zoom,
      mapTypeId: options.mapType,
      disableDefaultUI: true,
      gestureHandling: "greedy",
    });
  }

  addMarker(marker: MarkerOptions): void {
    if (!this.map) return;
    const m = new google.maps.Marker({ position: marker.position, map: this.map, title: marker.title });
    (m as any).__layerId = marker.layerId;
    this.markers.set(marker.id, m);
  }
  removeMarker(id: string): void { this.markers.get(id)?.setMap(null); this.markers.delete(id); }
  clearLayer(layerId: string): void {
    for (const [id, m] of this.markers) if ((m as any).__layerId === layerId) { m.setMap(null); this.markers.delete(id); }
  }
  moveCamera(options: CameraOptions): void {
    if (!this.map) return;
    if (options.animate) this.map.panTo(options.center); else this.map.setCenter(options.center);
    if (options.zoom != null) this.map.setZoom(options.zoom);
  }
  zoomBy(delta: number): void {
    if (!this.map) return;
    const current = this.map.getZoom() ?? 12;
    this.map.setZoom(current + delta);
  }
  getCamera(): CameraOptions | null {
    if (!this.map) return null;
    const center = this.map.getCenter();
    if (!center) return null;
    return { center: { lat: center.lat(), lng: center.lng() }, zoom: this.map.getZoom() };
  }
  onCameraChange(listener: (camera: CameraOptions) => void): () => void {
    if (!this.map) return () => {};
    const l = this.map.addListener("idle", () => {
      const cam = this.getCamera();
      if (cam) listener(cam);
    });
    return () => l.remove();
  }
  setMapType(type: MapType): void { this.map?.setMapTypeId(type); }
  getCurrentLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        (e) => reject(e),
      );
    });
  }
  async searchLocation(query: string): Promise<LatLng | null> {
    const geocoder = new google.maps.Geocoder();
    const res = await geocoder.geocode({ address: query });
    const loc = res.results[0]?.geometry.location;
    return loc ? { lat: loc.lat(), lng: loc.lng() } : null;
  }
  async searchSuggestions(query: string): Promise<LocationSuggestion[]> {
    if (!query.trim()) return [];
    const geocoder = new google.maps.Geocoder();
    const res = await geocoder.geocode({ address: query });
    return res.results.slice(0, 5).map((r, i) => ({
      id: r.place_id ?? String(i),
      label: r.formatted_address,
      position: { lat: r.geometry.location.lat(), lng: r.geometry.location.lng() },
    }));
  }
  destroy(): void { this.markers.forEach((m) => m.setMap(null)); this.markers.clear(); this.map = null; }
}
