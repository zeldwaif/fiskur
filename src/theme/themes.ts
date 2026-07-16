/**
 * Theme registry. The base (monochrome) theme is the default template.
 * Future themes are registered here and defined as [data-theme="id"] blocks in tokens.css
 * (or a co-located CSS file). Feature code never references a theme directly.
 */
export interface ThemeMeta {
  id: string;
  label: string;
  description: string;
  /** Whether the theme is available to select in the UI yet. */
  available: boolean;
}

export const themes: ThemeMeta[] = [
  { id: "base", label: "Prototype (B/W)", description: "Neutral black-and-white template.", available: true },
  { id: "coastal-light", label: "Light Coastal", description: "Bright coastal palette.", available: false },
  { id: "marine-dark", label: "Dark Marine", description: "Deep marine dark mode.", available: false },
  { id: "commercial", label: "Commercial Dashboard", description: "Dense B2B dashboard theme.", available: false },
  { id: "recreational", label: "Recreational", description: "Friendly angler theme.", available: false },
  { id: "high-contrast", label: "High Contrast", description: "Accessibility-first theme.", available: false },
  { id: "field-mobile", label: "Field Mode", description: "Mobile-first outdoor field mode.", available: false },
];

export const DEFAULT_THEME_ID = "base";
