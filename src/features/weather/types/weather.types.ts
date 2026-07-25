export interface WeatherSnapshot {
  temperatureF: number;
  windMph: number;
  /** Compass label, e.g. "SE". */
  windDirection: string;
  /** Raw WMO weather code from the provider (see conditionLabel for a human label). */
  weatherCode: number;
  conditionLabel: string;
  /** ISO timestamp from the provider, or "sample" if this is placeholder data. */
  updatedAt: string;
}
