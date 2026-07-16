import { useState, type KeyboardEvent } from "react";
import { SearchInput } from "@/components/ui";
import { useMapContext } from "../context/MapContext";
import "./map.css";

/** Search box wired to the live map: Enter geocodes the query and moves the camera there. */
export function LocationSearch() {
  const { provider } = useMapContext();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function runSearch() {
    if (!provider || !query.trim()) return;
    setSearching(true);
    setNotFound(false);
    try {
      const result = await provider.searchLocation(query.trim());
      if (result) {
        provider.moveCamera({ center: result, zoom: 13, animate: true });
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setSearching(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  }

  return (
    <div className="fk-searchwrap">
      <SearchInput
        label="Search locations"
        placeholder="Search waters, ramps, marinas…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setNotFound(false);
        }}
        onKeyDown={onKeyDown}
        aria-busy={searching}
      />
      {notFound && <p className="fk-searchwrap__hint">No location found for "{query}".</p>}
    </div>
  );
}
