"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FleetPreviewRotating } from "@/components/sections/fleet-preview-rotating.client";
import { VehicleData } from "@/lib/data/vehicles";

const AMENITY_FILTERS = [
  "Bluetooth",
  "LED Lights",
  "Bar",
  "Restroom",
  "TV",
  "Leather Seats",
  "Privacy Partition",
  "Fiber Optics",
];

interface FleetListRotatingProps {
  vehicles: VehicleData[];
  title: string;
}

export function FleetListRotating({ vehicles, title }: FleetListRotatingProps) {
  const [search, setSearch] = React.useState("");
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const filteredVehicles = React.useMemo(() => {
    return vehicles.filter((v) => {
      // Text Search (Name, capacity, description, amenities, type, price)
      const searchLower = search.toLowerCase();
      const nameMatch = v.name.toLowerCase().includes(searchLower);
      const capacityMatch = v.capacity?.toLowerCase().includes(searchLower) || false;
      const descriptionMatch = v.description?.toLowerCase().includes(searchLower) || false;
      
      // Search through amenities
      const amenitiesMatch = v.amenities?.some(amenity => 
        amenity.toLowerCase().includes(searchLower)
      ) || false;
      
      // Search through type
      const typeMatch = v.type?.toLowerCase().includes(searchLower) || false;
      
      // Search through price
      const priceMatch = v.price_hourly?.toLowerCase().includes(searchLower) || false;
      
      const matchesSearch = !search || nameMatch || capacityMatch || descriptionMatch || amenitiesMatch || typeMatch || priceMatch;

      const vehicleAmenitiesLower =
        v.amenities?.map((a) => a.toLowerCase()) || [];
      const matchesAmenities = selectedAmenities.every((filter) =>
        vehicleAmenitiesLower.some((vAmenity) =>
          vAmenity.includes(filter.toLowerCase()),
        ),
      );

      return matchesSearch && matchesAmenities;
    });
  }, [vehicles, search, selectedAmenities]);

  return (
    <div className="min-h-screen bg-[#0B1938]">
      <div
        className="sticky top-16 z-40 w-full border-b border-blue-800/40
          bg-[#060E23]/95 backdrop-blur
          supports-[backdrop-filter]:bg-[#060E23]/60"
      >
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div
            className="flex flex-col md:flex-row gap-4 items-center
              justify-between"
          >
            <h1
              className="text-white/90 text-2xl font-bold tracking-tight
                shrink-0 hidden md:block"
            >
              {title}
            </h1>

            <div className="flex w-full md:w-auto gap-3 items-center">
              <div className="relative w-full md:w-80 text-white">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
                    text-white/70"
                />
                <Input
                  placeholder="Search fleet (e.g. '24 pax')..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-[#14285D]/50 focus:bg-[#0B1938] h-10
                    placeholder:text-white/80 border-white/30
                    focus-visible:ring-white/60 focus-visible:ring-[2px]"
                />
              </div>

              <Button
                variant={
                  showFilters || selectedAmenities.length > 0
                    ? "default"
                    : "outline"
                }
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 h-10 px-4"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {selectedAmenities.length > 0 && (
                  <span
                    className="ml-1 rounded-full bg-foreground/20 px-1.5 py-0.5
                      text-[10px]"
                  >
                    {selectedAmenities.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {showFilters && (
            <div
              className="mt-4 pt-4 border-t border-border/50 animate-in
                slide-in-from-top-2"
            >
              <div
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                {AMENITY_FILTERS.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`filter-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label
                      htmlFor={`filter-${amenity}`}
                      className="text-sm cursor-pointer font-medium leading-none
                        peer-disabled:cursor-not-allowed
                        peer-disabled:opacity-70 text-white/90"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedAmenities.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAmenities([])}
                    className="text-muted-foreground hover:text-destructive
                      gap-1"
                  >
                    <X className="h-3 w-3" /> Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        {filteredVehicles.length > 0 ? (
          <FleetPreviewRotating 
            vehicles={filteredVehicles} 
            showNavigation={false} 
          />
        ) : (
          <div className="py-32 text-center container px-4">
            <div
              className="mx-auto max-w-2xl border border-dashed border-white p-8
                rounded-2xl bg-[#0E1F46]"
            >
              <h3 className="text-xl font-semibold mb-2 text-white">
                No vehicles found
              </h3>
              <p className="mb-4 text-blue-100/90">
                We couldn&apos;t find any vehicles matching &quot;{search}&quot;
                with those filters.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearch("");
                  setSelectedAmenities([]);
                }}
                className="text-primary font-bold"
              >
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
