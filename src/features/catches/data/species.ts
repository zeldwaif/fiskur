/**
 * Species reference data.
 *
 * Scoped to the current demo region (Toronto — Lake Ontario, Toronto Harbour, the
 * Islands, and the Humber/Don/Rouge tributaries) so the catch form's species picker
 * and the Species page show real, regionally-plausible fish rather than an arbitrary
 * global list. Multi-region species data is a later tier.
 *
 * Fields are intentionally conservative and factual. `waterType` and `habitat` are
 * general descriptors; they are NOT a substitute for official regulations — Ontario
 * size, season and sanctuary limits live in a separate (Tier 1) regulation lookup,
 * not here.
 */
export type WaterType = "saltwater" | "freshwater" | "brackish";

/**
 * General behavior tags used by the recommendation engine (features/recommendations)
 * to score species against real-time conditions. These reflect widely-known, general
 * angling patterns (e.g. "walleye feed hardest in low light") — not precise scientific
 * data, and never a substitute for the separate regulation lookup for legal limits.
 */
export interface RecommendationTags {
  /** Feeds most actively in low light (dawn/dusk) rather than bright midday. */
  lowLightFeeder?: boolean;
  /** Commonly sight-fished in clear, calm shallow water — wind chop hurts visibility. */
  sightFishable?: boolean;
  /** Holds tight to structure/cover — feeding is less affected by wind than open water. */
  structureOriented?: boolean;
  /** Tolerates rougher, windier conditions well (open water / less sight-dependent). */
  windTolerant?: boolean;
  /** Cold-water species — most catchable in cooler months and cooler surface temps. */
  coldWater?: boolean;
  /** Warm-water species — most active through the warm part of the season. */
  warmWater?: boolean;
  /** Pacific salmon that stage nearshore and run tributaries in autumn. */
  fallRun?: boolean;
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
  { id: "smallmouth-bass", commonName: "Smallmouth Bass", scientificName: "Micropterus dolomieu", waterType: "freshwater", habitat: "Rocky shoals and drop-offs off the Scarborough Bluffs and Humber Bay; holds on current-swept structure.", tags: { structureOriented: true, warmWater: true, sightFishable: true } },
  { id: "largemouth-bass", commonName: "Largemouth Bass", scientificName: "Micropterus salmoides", waterType: "freshwater", habitat: "Toronto Islands lagoons and weedy back bays; ambushes prey along vegetation edges.", tags: { lowLightFeeder: true, structureOriented: true, warmWater: true } },
  { id: "northern-pike", commonName: "Northern Pike", scientificName: "Esox lucius", waterType: "freshwater", habitat: "Weedy bays around the Toronto Islands and Ashbridges Bay; ambush predator in cabbage weed.", tags: { structureOriented: true, sightFishable: true } },
  { id: "walleye", commonName: "Walleye", scientificName: "Sander vitreus", waterType: "freshwater", habitat: "Deeper water off the harbour and river mouths; light-sensitive, feeds hardest at dusk and after dark.", tags: { lowLightFeeder: true, windTolerant: true } },
  { id: "yellow-perch", commonName: "Yellow Perch", scientificName: "Perca flavescens", waterType: "freshwater", habitat: "Schools over sand and weed edges in the harbour and off the Islands; a reliable panfish target.", tags: { structureOriented: true, warmWater: true } },
  { id: "chinook-salmon", commonName: "Chinook Salmon", scientificName: "Oncorhynchus tshawytscha", waterType: "freshwater", habitat: "Open Lake Ontario, staging off river mouths before running the Humber and Credit in early autumn.", tags: { coldWater: true, fallRun: true, windTolerant: true, lowLightFeeder: true } },
  { id: "coho-salmon", commonName: "Coho Salmon", scientificName: "Oncorhynchus kisutch", waterType: "freshwater", habitat: "Nearshore Lake Ontario in autumn, entering tributaries slightly later in the run than chinook.", tags: { coldWater: true, fallRun: true, windTolerant: true } },
  { id: "rainbow-trout", commonName: "Rainbow Trout (Steelhead)", scientificName: "Oncorhynchus mykiss", waterType: "freshwater", habitat: "Runs the Humber, Don and Rouge in spring and late autumn; holds nearshore through the cold months.", tags: { coldWater: true, lowLightFeeder: true } },
  { id: "brown-trout", commonName: "Brown Trout", scientificName: "Salmo trutta", waterType: "freshwater", habitat: "Harbour walls, piers and river mouths in cold water; most active in low light and rough weather.", tags: { coldWater: true, lowLightFeeder: true, structureOriented: true } },
  { id: "lake-trout", commonName: "Lake Trout", scientificName: "Salvelinus namaycush", waterType: "freshwater", habitat: "Deep, cold open water of Lake Ontario; moves shallower as surface temperatures drop.", tags: { coldWater: true, windTolerant: true } },
  { id: "muskellunge", commonName: "Muskellunge", scientificName: "Esox masquinongy", waterType: "freshwater", habitat: "Large weed flats and drop-offs in the outer harbour; a low-density apex ambush predator.", tags: { structureOriented: true } },
  { id: "common-carp", commonName: "Common Carp", scientificName: "Cyprinus carpio", waterType: "freshwater", habitat: "Shallow, warm harbour flats and marina edges; often visible tailing and highly sight-fishable in spring.", tags: { sightFishable: true, warmWater: true } },
  { id: "black-crappie", commonName: "Black Crappie", scientificName: "Pomoxis nigromaculatus", waterType: "freshwater", habitat: "Marina docks and Island lagoons; suspends around submerged wood and dock structure.", tags: { lowLightFeeder: true, structureOriented: true, warmWater: true } },
  { id: "pumpkinseed", commonName: "Pumpkinseed", scientificName: "Lepomis gibbosus", waterType: "freshwater", habitat: "Shallow weedy margins in the Island lagoons; an accessible, abundant panfish.", tags: { sightFishable: true, warmWater: true } },
];

const speciesById = new Map(species.map((s) => [s.id, s]));

export function getSpecies(id: string): Species | undefined {
  return speciesById.get(id);
}

/** Fallback id used when a catch is logged with a species not in the reference list. */
export const OTHER_SPECIES_ID = "other";
