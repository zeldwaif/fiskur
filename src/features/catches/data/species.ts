/**
 * Species reference data.
 *
 * Scoped to the current demo region (South Florida inshore/nearshore) so the catch
 * form's species picker and the Species page show real, regionally-plausible fish
 * rather than an arbitrary global list. Multi-region species data is a later tier.
 *
 * Fields are intentionally conservative and factual. `waterType` and `habitat` are
 * general descriptors; they are NOT a substitute for official regulations — size and
 * season limits live in a separate (Tier 1) regulation lookup, not here.
 */
export type WaterType = "saltwater" | "freshwater" | "brackish";

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  waterType: WaterType;
  habitat: string;
}

export const species: Species[] = [
  { id: "snook", commonName: "Common Snook", scientificName: "Centropomus undecimalis", waterType: "brackish", habitat: "Mangrove shorelines, inlets, bridges, and canals; ambush predator around structure." },
  { id: "redfish", commonName: "Red Drum (Redfish)", scientificName: "Sciaenops ocellatus", waterType: "saltwater", habitat: "Grass flats, oyster bars, and shallow bays; often tails in skinny water." },
  { id: "spotted-seatrout", commonName: "Spotted Seatrout", scientificName: "Cynoscion nebulosus", waterType: "saltwater", habitat: "Seagrass flats and deeper channels; common on inshore flats." },
  { id: "tarpon", commonName: "Atlantic Tarpon", scientificName: "Megalops atlanticus", waterType: "saltwater", habitat: "Passes, beaches, and backcountry; migratory, prized catch-and-release gamefish." },
  { id: "bonefish", commonName: "Bonefish", scientificName: "Albula vulpes", waterType: "saltwater", habitat: "Shallow tropical flats; sight-fishing target, almost always released." },
  { id: "permit", commonName: "Permit", scientificName: "Trachinotus falcatus", waterType: "saltwater", habitat: "Flats, wrecks, and channels; feeds on crabs and shrimp." },
  { id: "mangrove-snapper", commonName: "Mangrove Snapper", scientificName: "Lutjanus griseus", waterType: "saltwater", habitat: "Mangroves, docks, reefs, and wrecks; structure-oriented." },
  { id: "sheepshead", commonName: "Sheepshead", scientificName: "Archosargus probatocephalus", waterType: "saltwater", habitat: "Pilings, jetties, and reefs; feeds on crustaceans around structure." },
  { id: "jack-crevalle", commonName: "Jack Crevalle", scientificName: "Caranx hippos", waterType: "saltwater", habitat: "Inlets, beaches, and flats; fast-moving schooling predator." },
  { id: "spanish-mackerel", commonName: "Spanish Mackerel", scientificName: "Scomberomorus maculatus", waterType: "saltwater", habitat: "Nearshore and beaches; fast pelagic feeding on baitfish schools." },
  { id: "largemouth-bass", commonName: "Largemouth Bass", scientificName: "Micropterus salmoides", waterType: "freshwater", habitat: "Canals, lakes, and ponds; ambushes prey around cover and vegetation." },
  { id: "peacock-bass", commonName: "Butterfly Peacock Bass", scientificName: "Cichla ocellaris", waterType: "freshwater", habitat: "South Florida urban canals; introduced, aggressive daytime predator." },
];

const speciesById = new Map(species.map((s) => [s.id, s]));

export function getSpecies(id: string): Species | undefined {
  return speciesById.get(id);
}

/** Fallback id used when a catch is logged with a species not in the reference list. */
export const OTHER_SPECIES_ID = "other";
