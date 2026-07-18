import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useMapContext } from "../context/MapContext";
import type { LocationSuggestion } from "../types/map.types";
import "./map.css";

const DEBOUNCE_MS = 300;

/**
 * Search box wired to the live map: type to see live suggestions (debounced), pick one
 * (click or arrow keys + Enter) to move the camera there. Enter with no selection falls
 * back to a direct top-match search, so the box still works the moment you hit Enter fast.
 */
export function LocationSearch() {
  const { provider } = useMapContext();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setNotFound(false);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!provider || !value.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const thisRequest = ++requestIdRef.current;
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await provider.searchSuggestions(value.trim());
        if (requestIdRef.current !== thisRequest) return; // stale response, a newer keystroke already fired
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        if (requestIdRef.current === thisRequest) setSuggestions([]);
      }
    }, DEBOUNCE_MS);
  }

  function selectSuggestion(s: LocationSuggestion) {
    if (!provider) return;
    provider.moveCamera({ center: s.position, zoom: 13, animate: true });
    setQuery(s.label);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  async function searchTopMatch() {
    if (!provider || !query.trim()) return;
    setSearching(true);
    setNotFound(false);
    try {
      const result = await provider.searchLocation(query.trim());
      if (result) {
        provider.moveCamera({ center: result, zoom: 13, animate: true });
        setOpen(false);
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
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && activeIndex >= 0 && suggestions[activeIndex]) {
        selectSuggestion(suggestions[activeIndex]);
      } else {
        searchTopMatch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="fk-searchbox">
      <div className="fk-searchbox__row">
        <span className="fk-searchbox__icon" aria-hidden="true">⌕</span>
        <input
          className="fk-searchbox__input"
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-label="Search locations"
          placeholder="Search waters, ramps, marinas…"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => {
            // Delay so a click on a suggestion registers before the list unmounts.
            blurTimeoutRef.current = setTimeout(() => setOpen(false), 150);
          }}
          aria-busy={searching}
        />
      </div>
      {open && suggestions.length > 0 && (
        <ul className="fk-searchbox__suggestions" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === activeIndex}
              className={i === activeIndex ? "fk-searchbox__suggestion fk-searchbox__suggestion--active" : "fk-searchbox__suggestion"}
              onMouseDown={(e) => e.preventDefault()} // keep input focused so onBlur doesn't fire before click
              onClick={() => selectSuggestion(s)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
      {notFound && <p className="fk-searchbox__hint">No location found for "{query}".</p>}
    </div>
  );
}
