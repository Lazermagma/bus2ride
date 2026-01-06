"use client";

import * as React from "react";
import Link from "next/link";
import { Search, MapPin, X, Sparkles, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LocationsData } from "@/lib/data/locations";
import { cn } from "@/lib/utils";

const REGION_CATEGORIES = [
  { 
    id: "all", 
    label: "All States", 
    color: "from-blue-500 to-indigo-500",
    states: [] 
  },
  { 
    id: "northeast", 
    label: "Northeast", 
    color: "from-purple-500 to-indigo-500",
    states: ["connecticut", "delaware", "maine", "maryland", "massachusetts", "new-hampshire", "new-jersey", "new-york", "pennsylvania", "rhode-island", "vermont", "washington-dc"]
  },
  { 
    id: "southeast", 
    label: "Southeast", 
    color: "from-orange-500 to-red-500",
    states: ["alabama", "arkansas", "florida", "georgia", "kentucky", "louisiana", "mississippi", "north-carolina", "south-carolina", "tennessee", "virginia", "west-virginia"]
  },
  { 
    id: "midwest", 
    label: "Midwest", 
    color: "from-amber-500 to-yellow-500",
    states: ["illinois", "indiana", "iowa", "kansas", "michigan", "minnesota", "missouri", "nebraska", "north-dakota", "ohio", "south-dakota", "wisconsin"]
  },
  { 
    id: "southwest", 
    label: "Southwest", 
    color: "from-red-500 to-orange-500",
    states: ["arizona", "new-mexico", "oklahoma", "texas"]
  },
  { 
    id: "west", 
    label: "West", 
    color: "from-teal-500 to-cyan-500",
    states: ["alaska", "california", "colorado", "hawaii", "idaho", "montana", "nevada", "oregon", "utah", "washington", "wyoming"]
  },
];

type LocationsDirectoryClientProps = {
  locations: LocationsData[];
};

type City = { name: string; slug: string };
type StateGroup = { state: string; state_slug: string; cities: City[] };

export function LocationsDirectoryClient({ locations }: LocationsDirectoryClientProps) {
  const [query, setQuery] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState("all");

  const stateAndCities = React.useMemo<StateGroup[]>(() => {
    const byState = new Map<string, StateGroup>();

    for (const row of locations) {
      if (!row.state_name || !row.state_slug || !row.city_name || !row.city_slug) continue;

      const existing = byState.get(row.state_slug);
      const city: City = { name: row.city_name, slug: row.city_slug };

      if (!existing) {
        byState.set(row.state_slug, {
          state: row.state_name,
          state_slug: row.state_slug,
          cities: [city],
        });
        continue;
      }

      if (!existing.cities.some((c) => c.slug === city.slug)) {
        existing.cities.push(city);
      }
    }

    return Array.from(byState.values())
      .map((group) => ({
        ...group,
        cities: [...group.cities].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.state.localeCompare(b.state));
  }, [locations]);

  const statesByRegion = React.useMemo(() => {
    const grouped: Record<string, StateGroup[]> = {};
    REGION_CATEGORIES.forEach((region) => {
      if (region.id === "all") return;
      grouped[region.id] = stateAndCities.filter((s) => 
        region.states.includes(s.state_slug)
      );
    });
    return grouped;
  }, [stateAndCities]);

  const filteredLocations = React.useMemo(() => {
    let filtered = stateAndCities;

    if (selectedRegion !== "all") {
      const region = REGION_CATEGORIES.find((r) => r.id === selectedRegion);
      if (region) {
        filtered = filtered.filter((s) => region.states.includes(s.state_slug));
      }
    }

    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      filtered = filtered.filter(
        (loc) =>
          loc.state.toLowerCase().includes(normalized) ||
          loc.cities.some((city) => city.name.toLowerCase().includes(normalized))
      );
    }

    return filtered;
  }, [query, selectedRegion, stateAndCities]);

  const totalCities = stateAndCities.reduce((acc, s) => acc + s.cities.length, 0);

  return (
    <section className="py-16 bg-gradient-to-b from-[#060e23] to-[#0a1628]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 mb-4">
            <Globe className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-teal-300">
              Browse by Region
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Find Your City
          </h2>
          <p className="text-blue-200/60 max-w-xl mx-auto text-sm">
            {stateAndCities.length} states and {totalCities} cities with party bus, limo, and coach bus service
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-300/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search states or cities..."
              className="h-14 w-full rounded-full bg-[#0f1f46] text-blue-50 text-lg border-2 border-teal-500/30 pl-14 pr-14 placeholder:text-blue-300/40 focus:border-teal-400/60 focus:ring-teal-400/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {REGION_CATEGORIES.map((region) => {
            const isActive = selectedRegion === region.id;
            const count = region.id === "all" 
              ? stateAndCities.length 
              : (statesByRegion[region.id]?.length || 0);
            
            if (count === 0 && region.id !== "all") return null;
            
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  isActive
                    ? `bg-gradient-to-r ${region.color} text-white shadow-lg`
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                <span>{region.label}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  isActive ? "bg-white/20" : "bg-white/10"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {(query || selectedRegion !== "all") && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-blue-200/70">
              {filteredLocations.length} state{filteredLocations.length !== 1 ? "s" : ""} found
              {selectedRegion !== "all" && ` in ${REGION_CATEGORIES.find(r => r.id === selectedRegion)?.label}`}
              {query && ` matching "${query}"`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setSelectedRegion("all");
              }}
              className="text-teal-300 hover:text-white"
            >
              Clear filters
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLocations.map((loc, idx) => {
            const region = REGION_CATEGORIES.find(r => r.states.includes(loc.state_slug)) || REGION_CATEGORIES[0];
            const colors = [
              { border: "border-blue-500/40", bg: "from-blue-600/30 to-cyan-600/30", hover: "hover:border-blue-400/60", icon: "text-blue-400" },
              { border: "border-purple-500/40", bg: "from-purple-600/30 to-pink-600/30", hover: "hover:border-purple-400/60", icon: "text-purple-400" },
              { border: "border-emerald-500/40", bg: "from-emerald-600/30 to-teal-600/30", hover: "hover:border-emerald-400/60", icon: "text-emerald-400" },
              { border: "border-orange-500/40", bg: "from-orange-600/30 to-red-600/30", hover: "hover:border-orange-400/60", icon: "text-orange-400" },
              { border: "border-pink-500/40", bg: "from-pink-600/30 to-rose-600/30", hover: "hover:border-pink-400/60", icon: "text-pink-400" },
              { border: "border-cyan-500/40", bg: "from-cyan-600/30 to-blue-600/30", hover: "hover:border-cyan-400/60", icon: "text-cyan-400" },
            ];
            const colorScheme = colors[idx % colors.length];
            
            return (
              <div
                key={loc.state_slug}
                className={`group relative rounded-2xl border ${colorScheme.border} bg-gradient-to-br ${colorScheme.bg} p-5 transition-all hover:-translate-y-1 hover:shadow-2xl ${colorScheme.hover} backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Link
                    href={`/locations/${loc.state_slug}`}
                    className={cn(
                      "flex items-center gap-2 text-lg font-bold text-white transition-colors",
                      colorScheme.icon === "text-blue-400" && "hover:text-blue-400",
                      colorScheme.icon === "text-purple-400" && "hover:text-purple-400",
                      colorScheme.icon === "text-emerald-400" && "hover:text-emerald-400",
                      colorScheme.icon === "text-orange-400" && "hover:text-orange-400",
                      colorScheme.icon === "text-pink-400" && "hover:text-pink-400",
                      colorScheme.icon === "text-cyan-400" && "hover:text-cyan-400"
                    )}
                  >
                    <MapPin className={`w-5 h-5 ${colorScheme.icon}`} />
                    {loc.state}
                  </Link>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold text-white shadow-lg">
                    {loc.cities.length}
                  </span>
                </div>

                <div 
                  className={cn(
                    "flex flex-wrap gap-2 mb-4",
                    loc.cities.length > 12 && "max-h-24 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                  )}
                  style={loc.cities.length > 12 ? { scrollbarWidth: "thin" } : undefined}
                >
                  {loc.cities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/locations/${loc.state_slug}/party-buses-${city.slug}`}
                      className={cn(
                        "text-xs px-2 py-1 rounded-lg text-white/70 hover:text-white transition-all border border-transparent hover:border-white/20",
                        colorScheme.icon === "text-blue-400" && "hover:text-blue-300",
                        colorScheme.icon === "text-purple-400" && "hover:text-purple-300",
                        colorScheme.icon === "text-emerald-400" && "hover:text-emerald-300",
                        colorScheme.icon === "text-orange-400" && "hover:text-orange-300",
                        colorScheme.icon === "text-pink-400" && "hover:text-pink-300",
                        colorScheme.icon === "text-cyan-400" && "hover:text-cyan-300"
                      )}
                    >
                      {city.name}
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/locations/${loc.state_slug}`}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-full border-2 bg-white/10 backdrop-blur px-4 py-2.5 text-sm font-bold text-white hover:bg-white/20 transition-all shadow-lg",
                    colorScheme.border,
                    colorScheme.border.includes("blue") && "hover:border-blue-400/60",
                    colorScheme.border.includes("purple") && "hover:border-purple-400/60",
                    colorScheme.border.includes("emerald") && "hover:border-emerald-400/60",
                    colorScheme.border.includes("orange") && "hover:border-orange-400/60",
                    colorScheme.border.includes("pink") && "hover:border-pink-400/60",
                    colorScheme.border.includes("cyan") && "hover:border-cyan-400/60"
                  )}
                >
                  View {loc.state}
                  <span aria-hidden="true" className="text-lg">→</span>
                </Link>
              </div>
            );
          })}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">No locations found matching your search</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSelectedRegion("all");
              }}
              className="mt-4 rounded-full border-white/20 text-white hover:bg-white/10"
            >
              Browse all locations
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
