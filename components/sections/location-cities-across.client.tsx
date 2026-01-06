"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { LocationsData } from "@/lib/data/locations";

interface LocationCitiesAcrossClientProps {
  cities: LocationsData[];
  stateName: string;
  stateSlug: string;
  citiesServed?: {
    description?: string;
    label?: string;
  };
}

const FLEET_TYPES = [
  { id: "party-buses", label: "Party Buses" },
  { id: "limousines", label: "Limousines" },
  { id: "coach-buses", label: "Coach Buses" },
] as const;

const INITIAL_DISPLAY = 12;

export function LocationCitiesAcrossClient({
  cities,
  stateName,
  stateSlug,
  citiesServed,
}: LocationCitiesAcrossClientProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFleetTypes, setSelectedFleetTypes] = React.useState<string[]>([
    "party-buses",
    "limousines",
    "coach-buses",
  ]);
  const [showAll, setShowAll] = React.useState(false);

  const filteredCities = React.useMemo(() => {
    let filtered = cities;

    // Filter by search query
    if (searchQuery.trim()) {
      const normalized = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((city) =>
        city.city_name?.toLowerCase().includes(normalized)
      );
    }

    return filtered;
  }, [cities, searchQuery]);

  const displayedCities = showAll
    ? filteredCities
    : filteredCities.slice(0, INITIAL_DISPLAY);
  const hasMore = filteredCities.length > INITIAL_DISPLAY && !showAll;

  const handleFleetTypeToggle = (fleetType: string) => {
    setSelectedFleetTypes((prev) =>
      prev.includes(fleetType)
        ? prev.filter((type) => type !== fleetType)
        : [...prev, fleetType]
    );
  };

  return (
    <section
      className="relative max-w-7xl mx-auto overflow-hidden rounded-[40px]
        border border-white/10 py-14 px-6 mb-16 via-[#050f24]
        shadow-[0_60px_160px_rgba(2,6,23,0.65)] bg-gradient-to-b
        from-blue-900/90 to-black"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0
            bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_55%)]"
        ></div>
      </div>

      <div className="relative z-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-blue-200/80 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link className="hover:underline" href="/locations">
                Locations
              </Link>{" "}
              »
            </li>
            <li className="text-blue-100 font-semibold">
              {stateName} Overview
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-blue-200/70">
              Coverage Map
            </p>
            <h2
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r
                from-white via-blue-200 to-blue-500 bg-clip-text
                text-transparent drop-shadow-lg font-serif tracking-tight"
              id={`cities-we-serve-across-${stateSlug}-2`}
            >
              Cities We Serve Across {stateName}
            </h2>
            <p className="mt-3 text-blue-100/80 max-w-2xl">
              {citiesServed?.description}
            </p>
          </div>

          <div className="md:ml-auto flex flex-col items-start gap-3">
            <span
              className="inline-flex items-center rounded-full bg-white/95
                text-blue-900 border border-blue-200 px-5 py-2 text-sm font-bold
                shadow"
            >
              {filteredCities.length}{" "}
              {filteredCities.length === 1 ? "city" : "cities"}
            </span>
            <span
              className="inline-flex items-center rounded-full border
                border-white/20 px-4 py-2 text-xs uppercase tracking-[0.35em]
                text-white/80"
            >
              {citiesServed?.label}
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
            <Input
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 rounded-2xl border-white/10 bg-white/5 pl-12 text-white text-lg
                placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20
                transition-all duration-300"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-white/60">
              Filter by fleet:
            </span>
            {FLEET_TYPES.map((fleetType) => {
              const isChecked = selectedFleetTypes.includes(fleetType.id);
              return (
                <label
                  key={fleetType.id}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer group",
                    "px-3 py-2 rounded-lg transition-all",
                    isChecked
                      ? "bg-blue-500/20 border border-blue-500/40"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleFleetTypeToggle(fleetType.id)}
                    className="border-white/40 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isChecked ? "text-white" : "text-white/70 group-hover:text-white/90"
                    )}
                  >
                    {fleetType.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Cities Grid */}
        {displayedCities.length > 0 ? (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                gap-5"
            >
              {displayedCities.map((city) => {
                const cityHref = `/locations/${stateSlug}/party-buses-${city.city_slug}`;

                return (
                  <div
                    key={city.id}
                    className="group relative overflow-hidden rounded-3xl border
                      border-white/15 bg-gradient-to-br from-[#0b1d3c] via-[#0a1730]
                      to-[#050b18] text-white shadow-lg transition hover:-translate-y-1
                      hover:shadow-2xl"
                  >
                    <div
                      className="absolute inset-0 opacity-0 transition
                        group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/10
                          via-cyan-500/10 to-purple-500/10"
                      ></div>
                    </div>

                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Link
                          href={cityHref}
                          className="text-2xl font-extrabold leading-tight text-white
                            hover:underline"
                          aria-label={`Open ${city.city_name}, ${stateName}`}
                        >
                          {city.city_name}
                        </Link>
                        <Link
                          href={cityHref}
                          className="text-sky-300 text-lg transition
                            group-hover:translate-x-1"
                          aria-hidden="true"
                          tabIndex={-1}
                        >
                          →
                        </Link>
                      </div>

                      <Link
                        href={`/locations/${stateSlug}`}
                        className="text-sm font-semibold text-white/70"
                      >
                        {stateName}
                      </Link>

                      <div
                        className="mt-5 flex flex-wrap gap-2 text-xs font-semibold
                          uppercase tracking-wide text-white/80"
                      >
                        {FLEET_TYPES.map((fleetType) => (
                          <Link
                            key={fleetType.id}
                            href={`/locations/${stateSlug}/${fleetType.id}-${city.city_slug}`}
                            className="inline-flex items-center rounded-full border
                              border-white/20 px-3 py-1 text-white/80 hover:text-white
                              hover:border-white/40"
                          >
                            {fleetType.label}
                          </Link>
                        ))}
                        <Link
                          href="/contact"
                          className="inline-flex items-center rounded-full border
                            border-white/20 px-3 py-1 text-white/80 hover:text-white
                            hover:border-white/40"
                        >
                          Instant Quote
                        </Link>
                      </div>

                      <div
                        className="mt-5 flex gap-2 text-[11px] font-semibold uppercase
                          tracking-[0.3em] text-sky-400"
                      >
                        <span>Year-round</span>
                        <span>•</span>
                        <span>Local support</span>
                      </div>
                    </div>

                    <div
                      className="pointer-events-none absolute inset-x-6 bottom-4 h-12
                        rounded-full bg-gradient-to-r from-blue-400/40 via-indigo-500/40
                        to-blue-600/40 blur-2xl"
                      aria-hidden="true"
                    ></div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  onClick={() => setShowAll(true)}
                  size="lg"
                  className="inline-flex items-center justify-center rounded-full
                    px-10 py-6 text-lg font-bold transition-all duration-300
                    bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                    shadow-[0_20px_50px_rgba(59,130,246,0.3)]
                    hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(59,130,246,0.4)]"
                >
                  <ChevronDown className="w-5 h-5 mr-2" />
                  Show all {filteredCities.length} cities
                </Button>
              </div>
            )}

            {filteredCities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 text-lg">
                  No cities found matching "{searchQuery}"
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-blue-400 hover:text-blue-300"
                >
                  Clear search
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No cities found</p>
          </div>
        )}

        {/* Not seeing your city? */}
        <div className="mt-12 flex justify-center">
          <div
            className="rounded-3xl border border-white/15 bg-white/10 px-8 py-6
              text-center shadow-lg backdrop-blur"
          >
            <p className="text-white font-semibold text-lg">
              Not seeing your city? We likely still serve it.
            </p>
            <div
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full
                  bg-white text-blue-900 font-bold px-6 py-3 shadow
                  hover:bg-blue-50"
              >
                Get a Free Quote
              </Link>
              <a
                href="tel:8885352566"
                className="inline-flex items-center justify-center rounded-full
                  border border-white/30 px-6 py-3 text-white font-bold
                  hover:bg-white/10"
              >
                Call (888) 535-2566
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

