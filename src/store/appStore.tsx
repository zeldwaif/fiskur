import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { appConfig } from "@/app/config";

export interface SavedLocation { id: string; name: string; lat: number; lng: number; }

interface AppState {
  selectedLocationId: string | null;
  activeMapLayers: string[];
  savedLocations: SavedLocation[];
}

type Action =
  | { type: "SELECT_LOCATION"; id: string | null }
  | { type: "TOGGLE_LAYER"; id: string }
  | { type: "SET_LAYERS"; ids: string[] }
  | { type: "ADD_SAVED_LOCATION"; location: SavedLocation };

const initialState: AppState = {
  selectedLocationId: null,
  activeMapLayers: ["saved-locations"],
  savedLocations: [],
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
      return { ...state, savedLocations: [...state.savedLocations, action.location] };
    default:
      return state;
  }
}

interface AppStoreValue extends AppState {
  config: typeof appConfig;
  dispatch: React.Dispatch<Action>;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ ...state, config: appConfig, dispatch }), [state]);
  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
