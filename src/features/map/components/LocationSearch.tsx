import { SearchInput } from "@/components/ui";
import "./map.css";
export function LocationSearch() {
  return (
    <div className="fk-searchwrap">
      <SearchInput label="Search locations" placeholder="Search waters, ramps, marinas…" />
    </div>
  );
}
