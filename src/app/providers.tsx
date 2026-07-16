import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { AppStoreProvider } from "@/store/appStore";
import { appConfig } from "./config";

/** Wraps the app in global providers: theme, store, router. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider initial={appConfig.theme.default}>
      <AppStoreProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AppStoreProvider>
    </ThemeProvider>
  );
}
