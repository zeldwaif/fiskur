import { Navigate, type RouteObject } from "react-router-dom";
import { MapScreen } from "@/features/map/MapScreen";
import { LocationsPage } from "@/features/locations/LocationsPage";
import { LogsPage } from "@/features/catches/LogsPage";
import { SpeciesPage } from "@/features/species/SpeciesPage";
import { ConditionsPage } from "@/features/conditions/ConditionsPage";
import { CommercialPage } from "@/features/commercial/CommercialPage";
import { LeaderboardPage } from "@/features/leaderboard/LeaderboardPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { SettingsPage } from "@/features/settings/SettingsPage";

/** Route table. Add a page here + a navigation entry in app/navigation.ts. */
export const appRoutes: RouteObject[] = [
  { path: "/", element: <Navigate to="/map" replace /> },
  { path: "/map", element: <MapScreen /> },
  { path: "/locations", element: <LocationsPage /> },
  { path: "/logs", element: <LogsPage /> },
  { path: "/species", element: <SpeciesPage /> },
  { path: "/conditions", element: <ConditionsPage /> },
  { path: "/commercial", element: <CommercialPage /> },
  { path: "/leaderboard", element: <LeaderboardPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "*", element: <Navigate to="/map" replace /> },
];
