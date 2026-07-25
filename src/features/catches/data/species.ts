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

/**
 * General behavior tags used by the recommendation engine (features/recommendations)
 * to score species against real-time conditions. These reflect widely-known,
 * general angling patterns (e.g. "snook feed most actively at dawn/dusk around
 * structure") — not precise scientific data, and never a substitute for the
 * separate regulation lookup for legal season/size limits.
 */
export interface RecommendationTags {
  /** Feeds most actively in low light (dawn/dusk) rather than bright midday. */
  lowLightFeeder?: boolean;
  /** Feeding activity tracks tide movement — most active on a moving (rising/falling) tide. */
  tideDependent?: boolean;
  /** Commonly targeted by sight-fishing in clear, calm water — wind chop hurts visibility. */
  sightFishable?: boolean;
  /** Holds tight to structure/bottom — feeding is less affected by wind/chop than flats species. */
  structureOriented?: boolean;
  /** Tolerates rougher, windier conditions well (open water / less sight-dependent). */
  windTolerant?: boolean;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  waterType: WaterType;
  habitat: string;
  tags?: RecommendationTags;
}

export const species: Species[] = [
  { id: "snook", commonName: "Common Snook", scientificName: "Centropomus undecimalis", waterType: "brackish", habitat: "Mangrove shorelines, inlets, bridges, and canals; ambush predator around structure.", tags: { lowLightFeeder: true, tideDependent: true, structureOriented: true } },
  { id: "redfish", commonName: "Red Drum (Redfish)", scientificName: "Sciaenops ocellatus", waterType: "saltwater", habitat: "Grass flats, oyster bars, and shallow bays; often tails in skinny water.", tags: { tideDependent: true, sightFishable: true } },
  { id: "spotted-seatrout", commonName: "Spotted Seatrout", scientificName: "Cynoscion nebulosus", waterType: "saltwater", habitat: "Seagrass flats and deeper channels; common on inshore flats.", tags: { tideDependent: true, lowLightFeeder: true } },
  { id: "tarpon", commonName: "Atlantic Tarpon", scientificName: "Megalops atlanticus", waterType: "saltwater", habitat: "Passes, beaches, and backcountry; migratory, prized catch-and-release gamefish.", tags: { lowLightFeeder: true, tideDependent: true } },
  { id: "bonefish", commonName: "Bonefish", scientificName: "Albula vulpes", waterType: "saltwater", habitat: "Shallow tropical flats; sight-fishing target, almost always released.", tags: { sightFishable: true } },
  { id: "permit", commonName: "Permit", scientificName: "Trachinotus falcatus", waterType: "saltwater", habitat: "Flats, wrecks, and channels; feeds on crabs and shrimp.", tags: { sightFishable: true, structureOriented: true } },
  { id: "mangrove-snapper", commonName: "Mangrove Snapper", scientificName: "Lutjanus griseus", waterType: "saltwater", habitat: "Mangroves, docks, reefs, and wrecks; structure-oriented.", tags: { structureOriented: true, windTolerant: true } },
  { id: "sheepshead", commonName: "Sheepshead", scientificName: "Archosargus probatocephalus", waterType: "saltwater", habitat: "Pilings, jetties, and reefs; feeds on crustaceans around structure.", tags: { structureOriented: true, windTolerant: true } },
  { id: "jack-crevalle", commonName: "Jack Crevalle", scientificName: "Caranx hippos", waterType: "saltwater", habitat: "Inlets, beaches, and flats; fast-moving schooling predator.", tags: { tideDependent: true, windTolerant: true } },
  { id: "spanish-mackerel", commonName: "Spanish Mackerel", scientificName: "Scomberomorus maculatus", waterType: "saltwater", habitat: "Nearshore and beaches; fast pelagic feeding on baitfish schools.", tags: { tideDependent: true, windTolerant: true } },
  { id: "largemouth-bass", commonName: "Largemouth Bass", scientificName: "Micropterus salmoides", waterType: "freshwater", habitat: "Canals, lakes, and ponds; ambushes prey around cover and vegetation.", tags: { lowLightFeeder: true, structureOriented: true } },
  { id: "peacock-bass", commonName: "Butterfly Peacock Bass", scientificName: "Cichla ocellaris", waterType: "freshwater", habitat: "South Florida urban canals; introduced, aggressive daytime predator.", tags: { sightFishable: true } },
];

const speciesById = new Map(species.map((s) => [s.id, s]));

export function getSpecies(id: string): Species | undefined {
  return speciesById.get(id);
}

/** Fallback id used when a catch is logged with a species not in the reference list. */
export const OTHER_SPECIES_ID = "other";
