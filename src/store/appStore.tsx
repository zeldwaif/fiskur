import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { appConfig } from "@/app/config";
import { loadPersisted, savePersisted, storageKeys, makeId } from "./persistence";
import type { SavedLocation, NewSavedLocation } from "@/features/locations/types";
import { isSavedLocationArray } from "@/features/locations/types";
import type { CatchLog, NewCatchLog } from "@/features/catches/types";
import { isCatchLogArray } from "@/features/catches/types";

// Re-export so existing imports of SavedLocation from the store keep working.
export type { SavedLocation };

interface AppState {
  selectedLocationId: string | null;
  activeMapLayers: string[];
  savedLocations: SavedLocation[];
  catches: CatchLog[];
}

type Action =
  | { type: "SELECT_LOCATION"; id: string | null }
  | { type: "TOGGLE_LAYER"; id: string }
  | { type: "SET_LAYERS"; ids: string[] }
  | { type: "ADD_SAVED_LOCATION"; location: SavedLocation }
  | { type: "RENAME_SAVED_LOCATION"; id: string; name: string }
  | { type: "REMOVE_SAVED_LOCATION"; id: string }
  | { type: "ADD_CATCH"; entry: CatchLog }
  | { type: "REMOVE_CATCH"; id: string };

const initialState: AppState = {
  selectedLocationId: null,
  activeMapLayers: ["saved-locations"],
  // Domain data is hydrated from localStorage on first render (see below).
  savedLocations: loadPersisted(storageKeys.savedLocations, isSavedLocationArray, []),
  catches: loadPersisted(storageKeys.catches, isCatchLogArray, []),
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SELECT_LOCATION":
      return { ...state, selectedLocationId: action.id };
    case "TOGGLE_LAYER":
      return {
        ...state,
        activeMapLayers: state.activeMapLayers.includes(action.id)
          ? state.activeMapLayers.filter((l) => l !== action.id)
          : [...state.activeMapLayers, action.id],
      };
    case "SET_LAYERS":
      return { ...state, activeMapLayers: action.ids };
    case "ADD_SAVED_LOCATION":
      return { ...state, savedLocations: [action.location, ...state.savedLocations] };
    case "RENAME_SAVED_LOCATION":
      return {
        ...state,
        savedLocations: state.savedLocations.map((l) =>
          l.id === action.id ? { ...l, name: action.name } : l,
        ),
      };
    case "REMOVE_SAVED_LOCATION":
      return {
        ...state,
        savedLocations: state.savedLocations.filter((l) => l.id !== action.id),
        selectedLocationId: state.selectedLocationId === action.id ? null : state.selectedLocationId,
      };
    case "ADD_CATCH":
      return { ...state, catches: [action.entry, ...state.catches] };
    case "REMOVE_CATCH":
      return { ...state, catches: state.catches.filter((c) => c.id !== action.id) };
    default:
      return state;
  }
}

interface AppStoreValue extends AppState {
  config: typeof appConfig;
  dispatch: React.Dispatch<Action>;
  // Domain action creators — features call these instead of dispatching raw actions.
  addSavedLocation: (input: NewSavedLocation) => SavedLocation;
  renameSavedLocation: (id: string, name: string) => void;
  removeSavedLocation: (id: string) => void;
  addCatch: (input: NewCatchLog) => CatchLog;
  removeCatch: (id: string) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist domain data whenever it changes. Keeping this here (not in each feature)
  // means every writer goes through the same durable path automatically.
  useEffect(() => {
    savePersisted(storageKeys.savedLocations, state.savedLocations);
  }, [state.savedLocations]);
  useEffect(() => {
    savePersisted(storageKeys.catches, state.catches);
  }, [state.catches]);

  const value = useMemo<AppStoreValue>(
    () => ({
      ...state,
      config: appConfig,
      dispatch,
      addSavedLocation: (input) => {
        const location: SavedLocation = { ...input, id: makeId("loc"), createdAt: new Date().toISOString() };
        dispatch({ type: "ADD_SAVED_LOCATION", location });
        return location;
      },
      renameSavedLocation: (id, name) => dispatch({ type: "RENAME_SAVED_LOCATION", id, name }),
      removeSavedLocation: (id) => dispatch({ type: "REMOVE_SAVED_LOCATION", id }),
      addCatch: (input) => {
        const entry: CatchLog = { ...input, id: makeId("catch"), createdAt: new Date().toISOString() };
        dispatch({ type: "ADD_CATCH", entry });
        return entry;
      },
      removeCatch: (id) => dispatch({ type: "REMOVE_CATCH", id }),
    }),
    [state],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
