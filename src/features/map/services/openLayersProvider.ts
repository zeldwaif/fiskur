import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import type { MapProvider, MapInitOptions, MarkerOptions, CameraOptions, LatLng, MapType } from "../types/map.types";

/** Free satellite imagery (Esri World Imagery) — no API key required. */
const ESRI_SATELLITE =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

/**
 * OpenLayers implementation of the provider interface.
 * Uses free OSM / Esri tiles, so it works with no API key. Isolated here like every provider.
 */
export class OpenLayersProvider implements MapProvider {
  readonly id = "openlayers";
  private map: Map | null = null;
  private base: TileLayer<any> | null = null;
  private markerSource = new VectorSource();

  private sourceFor(type: MapType) {
    return type === "roadmap" ? new OSM() : new XYZ({ url: ESRI_SATELLITE, attributions: "Esri, Maxar, Earthstar Geographics" });
  }

  async initializeMap(options: MapInitOptions): Promise<void> {
    this.base = new TileLayer({ source: this.sourceFor(options.mapType) });
    const markerLayer = new VectorLayer({ source: this.markerSource });
    this.map = new Map({
      target: options.container,
      layers: [this.base, markerLayer],
      view: new View({ center: fromLonLat([options.center.lng, options.center.lat]), zoom: options.zoom }),
    });
  }

  addMarker(marker: MarkerOptions): void {
    const f = new Feature({ geometry: new Point(fromLonLat([marker.position.lng, marker.position.lat])) });
    f.setId(marker.id);
    f.set("layerId", marker.layerId);
    f.setStyle(new Style({
      image: new CircleStyle({ radius: 7, fill: new Fill({ color: "#000" }), stroke: new Stroke({ color: "#fff", width: 2 }) }),
    }));
    this.markerSource.addFeature(f);
  }
  removeMarker(id: string): void {
    const f = this.markerSource.getFeatureById(id);
    if (f) this.markerSource.removeFeature(f);
  }
  clearLayer(layerId: string): void {
    this.markerSource.getFeatures().filter((f) => f.get("layerId") === layerId).forEach((f) => this.markerSource.removeFeature(f));
  }
  moveCamera(options: CameraOptions): void {
    const view = this.map?.getView();
    if (!view) return;
    const center = fromLonLat([options.center.lng, options.center.lat]);
    if (options.animate) view.animate({ center, zoom: options.zoom ?? view.getZoom() });
    else { view.setCenter(center); if (options.zoom != null) view.setZoom(options.zoom); }
  }
  zoomBy(delta: number): void {
    const view = this.map?.getView();
    if (!view) return;
    const current = view.getZoom() ?? 12;
    view.animate({ zoom: current + delta, duration: 200 });
  }
  getCamera(): CameraOptions | null {
    const view = this.map?.getView();
    if (!view) return null;
    const center = view.getCenter();
    if (!center) return null;
    const [lng, lat] = toLonLat(center);
    return { center: { lat, lng }, zoom: view.getZoom() };
  }
  onCameraChange(listener: (camera: CameraOptions) => void): () => void {
    if (!this.map) return () => {};
    const handler = () => {
      const cam = this.getCamera();
      if (cam) listener(cam);
    };
    this.map.on("moveend", handler);
    return () => this.map?.un("moveend", handler);
  }
  setMapType(type: MapType): void { this.base?.setSource(this.sourceFor(type)); }
  getCurrentLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        (e) => reject(e),
      ),
    );
  }
  async searchLocation(query: string): Promise<LatLng | null> {
    // Free OpenStreetMap Nominatim geocoder.
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    return data[0] ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
  }
  destroy(): void { this.map?.setTarget(undefined); this.map = null; }
}
