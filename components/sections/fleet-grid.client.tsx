"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VehicleData } from "@/lib/data/vehicles";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { Users, Phone, ChevronRight, Check, ChevronLeft, ZoomIn, Mail, Sparkles, Search, X, ArrowRight, Info } from "lucide-react";
import { InstantQuoteButton } from "@/components/InstantQuoteButton";
import { openLiveChat } from "@/lib/livechat";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FleetGridProps {
  title?: string;
  vehicles: VehicleData[];
  sectionClassName?: string;
}

const vehicleNameMap: Record<string, string> = {
  limo: "Limousine",
  "stretch-limo": "Stretch Limo",
  "party-bus": "Party Bus",
  "party-bus-lux": "Luxury Party Bus",
  coach: "Coach Bus",
  "coach-bus": "Coach Bus",
  sprinter: "Sprinter Van",
  "sprinter-van": "Sprinter Van",
  sedan: "Luxury Sedan",
  suv: "SUV",
};

const typeGradients: Record<string, string> = {
  limo: "from-amber-500 via-yellow-400 to-amber-500",
  "stretch-limo": "from-amber-500 via-yellow-400 to-amber-500",
  "party-bus": "from-pink-500 via-purple-500 to-blue-500",
  "party-bus-lux": "from-pink-500 via-fuchsia-500 to-purple-500",
  coach: "from-emerald-500 via-teal-400 to-emerald-500",
  "coach-bus": "from-emerald-500 via-teal-400 to-emerald-500",
  sprinter: "from-sky-500 via-cyan-400 to-sky-500",
  "sprinter-van": "from-sky-500 via-cyan-400 to-sky-500",
  sedan: "from-slate-500 via-gray-400 to-slate-500",
  suv: "from-indigo-500 via-violet-400 to-indigo-500",
};

function getVehicleLabel(type: string): string {
  if (!type) return "Unknown";
  return vehicleNameMap[type] || type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getVehicleGradient(type: string): string {
  if (!type) return typeGradients["party-bus"];
  if (typeGradients[type]) return typeGradients[type];
  if (type.includes("limo")) return typeGradients["limo"];
  if (type.includes("party") || type.includes("bus")) return typeGradients["party-bus"];
  if (type.includes("coach")) return typeGradients["coach"];
  if (type.includes("sprinter") || type.includes("van")) return typeGradients["sprinter"];
  return typeGradients["party-bus"];
}

function AmenityModal({
                        isOpen,
                        onClose,
                        vehicleName,
                        amenity,
                        gradient,
                      }: {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
  amenity: string | null;
  gradient: string;
}) {
  if (!amenity) return null;

  const amenityDescriptionMap: Record<string, string> = {
    "Pro Driver": "Professional drivers with experience and safety training.",
    "Bluetooth": "Enjoy your music or calls via Bluetooth connection.",
    "Hourly Rates": "Flexible hourly rental rates for your convenience.",
    "BYOB Friendly": "Bring your own beverages and enjoy responsibly.",
  };

  const description = amenityDescriptionMap[amenity] || "Premium feature included with this vehicle.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span className={cn("w-2 h-6 rounded-full bg-gradient-to-b", gradient)} />
            {vehicleName} - {amenity}
          </DialogTitle>
          <DialogDescription className="text-white/60">{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex gap-3">
          <Button
            className={cn("flex-1 rounded-full font-bold bg-gradient-to-r cursor-pointer", gradient, "text-white border-0")}
            onClick={() => {
              openLiveChat(`Amenity Modal - ${amenity} - ${vehicleName}`, window.location.pathname);
              onClose();
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Quote
          </Button>
          <Button variant="outline" onClick={onClose} className="rounded-full border-white/20 text-black hover:bg-white/10">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GalleryModal({
                        isOpen,
                        onClose,
                        images,
                        vehicleName,
                        initialIndex,
                      }: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  vehicleName: string;
  initialIndex: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-white/10 text-white p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            <span>{vehicleName} Gallery</span>
            <span className="text-sm font-normal text-white/50">
              {currentIndex + 1} of {images.length}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-[16/10] w-full bg-black/50">
          <Image src={images[currentIndex]} alt={`${vehicleName} view ${currentIndex + 1}`} fill sizes="(max-width: 1200px) 100vw, 900px" quality={90} className="object-contain" />
          {images.length > 1 && (
            <>
              <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="p-4 pt-2 flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button key={idx} onClick={() => setCurrentIndex(idx)} className={cn("relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all", idx === currentIndex ? "ring-2 ring-blue-500 scale-105" : "opacity-60 hover:opacity-100")}>
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="80px" quality={60} className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FleetVehicleCard({ vehicle }: { vehicle: VehicleData }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeAmenity, setActiveAmenity] = useState<string | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  const images = useMemo(() => (vehicle.images?.length ? vehicle.images.map((key) => toPublicStorageUrl("vehicles1", key)) : ["/placeholder-vehicle.jpg"]), [vehicle.images]);
  const amenities = useMemo(() => vehicle.amenities || ["Pro Driver", "Bluetooth", "Hourly Rates", "BYOB Friendly"], [vehicle.amenities]);
  const displayAmenities = amenities.slice(0, 3);
  const vehicleType = vehicle.type ?? "party-bus";
  const typeGradient = getVehicleGradient(vehicleType);
  const vehicleLabel = getVehicleLabel(vehicleType);

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border border-white/10 shadow-2xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Vehicle Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image src={images[activeImageIndex]} alt={vehicle.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={90} className={cn("object-cover transition-all duration-700", isHovered && "scale-110")} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          {vehicle.capacity && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
              <Users className="w-3 h-3 text-white/80" />
              <span className="text-xs font-semibold text-white">{vehicle.capacity.replace(" pax", "")}</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{vehicle.name}</h3>
            <div className="flex flex-wrap gap-1.5">
              {displayAmenities.map((tag, i) => (
                <button key={i} onClick={() => setActiveAmenity(tag)} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 backdrop-blur-sm text-white/90 border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer">{tag}</button>
              ))}
              {amenities.length > 3 && (
                <button onClick={() => setActiveAmenity("all")} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/20 backdrop-blur-sm text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all cursor-pointer">
                  +{amenities.length - 3} more
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery Thumbnails */}
        {images.length > 1 && (
          <div className="px-3 py-2 bg-slate-950/80 border-t border-white/5">
            <div className="flex gap-2">
              {images.slice(0, 4).map((img, idx) => (
                <button key={idx} onClick={() => { setGalleryInitialIndex(idx); setShowGalleryModal(true); }} onMouseEnter={() => setActiveImageIndex(idx)} className={cn("relative flex-1 aspect-[4/3] rounded-lg overflow-hidden transition-all duration-300 group/thumb", activeImageIndex === idx ? "ring-2 ring-white/60 scale-[1.02]" : "opacity-60 hover:opacity-100")}>
                  <Image src={img} alt={`View ${idx + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={90} className={cn("object-cover transition-transform duration-200 ease-out", isHovered && "scale-110")} />
                  <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors duration-150 flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="p-4 space-y-3">
          <Link 
            href={vehicle.slug ? `/vehicles/${vehicle.slug}` : "#"} 
            className={cn(
              "group relative flex items-center justify-center gap-2 w-full py-3 rounded-xl",
              "font-semibold text-white transition-all duration-300 overflow-hidden",
              "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
              "hover:from-pink-600 hover:via-purple-600 hover:to-blue-600",
              "hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/50",
              "active:scale-[0.98]"
            )}
          >
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            <Info className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Learn More</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 rounded-lg border-white/20 bg-white/5 text-white text-xs font-semibold hover:bg-white hover:text-slate-900 transition-all" asChild>
              <a href="tel:8885352566" className="flex items-center justify-center gap-1"><Phone className="w-3 h-3" />Call</a>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 rounded-lg border-white/20 bg-white/5 text-white text-xs font-semibold hover:bg-white hover:text-slate-900 transition-all" asChild>
              <a href="mailto:info@bus2ride.com" className="flex items-center justify-center gap-1"><Mail className="w-3 h-3" />Email</a>
            </Button>
          </div>
          <InstantQuoteButton source={`Fleet - ${vehicle.name}`} size="sm" variant="pulse" className="w-full rounded-lg text-xs" />
        </div>
      </div>

      <AmenityModal isOpen={!!activeAmenity} onClose={() => setActiveAmenity(null)} vehicleName={vehicle.name} amenity={activeAmenity} gradient={typeGradient} />
      <GalleryModal isOpen={showGalleryModal} onClose={() => setShowGalleryModal(false)} images={images} vehicleName={vehicle.name} initialIndex={galleryInitialIndex} />
    </>
  );
}

// Common amenities for filtering
const AMENITY_FILTERS = [
  "Bluetooth",
  "LED Lights",
  "Bar",
  "Restroom",
  "TV",
  "Leather Seats",
  "Privacy Partition",
  "Fiber Optics",
  "Dance Pole",
  "Karaoke",
  "BYOB Friendly",
  "Pro Driver",
];

// Capacity ranges
const CAPACITY_RANGES = [
  { label: "15-20", min: 15, max: 20 },
  { label: "21-30", min: 21, max: 30 },
  { label: "31-40", min: 31, max: 40 },
  { label: "41-50", min: 41, max: 50 },
  { label: "50+", min: 50, max: 999 },
];

export function FleetGrid({ title, vehicles = [], sectionClassName }: FleetGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCapacityRanges, setSelectedCapacityRanges] = useState<string[]>([]);

  // Extract all unique amenities from vehicles
  const availableAmenities = useMemo(() => {
    const allAmenities = new Set<string>();
    vehicles.forEach(v => {
      v.amenities?.forEach(a => {
        // Check if amenity matches any filter (case-insensitive)
        const matched = AMENITY_FILTERS.find(filter => 
          a.toLowerCase().includes(filter.toLowerCase()) || 
          filter.toLowerCase().includes(a.toLowerCase())
        );
        if (matched) allAmenities.add(matched);
      });
    });
    return Array.from(allAmenities).sort();
  }, [vehicles]);

  // Parse capacity from string like "25 pax" to number
  const parseCapacity = (capacity?: string | null): number => {
    if (!capacity) return 0;
    const match = capacity.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // 1. Text Search (Name, description, capacity, amenities, type, price)
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = v.name?.toLowerCase().includes(searchLower);
      const capacityMatch = v.capacity?.toLowerCase().includes(searchLower);
      const descriptionMatch = v.description?.toLowerCase().includes(searchLower);
      
      // Search through amenities
      const amenitiesMatch = v.amenities?.some(amenity => 
        amenity.toLowerCase().includes(searchLower)
      ) || false;
      
      // Search through type
      const typeMatch = v.type?.toLowerCase().includes(searchLower) || false;
      
      // Search through price
      const priceMatch = v.price_hourly?.toLowerCase().includes(searchLower) || false;
      
      const matchesSearch = !searchTerm || nameMatch || capacityMatch || descriptionMatch || amenitiesMatch || typeMatch || priceMatch;

      // 2. Amenity Filter (Must have ALL selected amenities)
      const vehicleAmenitiesLower = v.amenities?.map(a => a.toLowerCase()) || [];
      const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(filter => {
        return vehicleAmenitiesLower.some(vAmenity => 
          vAmenity.includes(filter.toLowerCase()) || 
          filter.toLowerCase().includes(vAmenity)
        );
      });

      // 3. Capacity Range Filter
      const vehicleCapacity = parseCapacity(v.capacity);
      const matchesCapacity = selectedCapacityRanges.length === 0 || selectedCapacityRanges.some(rangeLabel => {
        const range = CAPACITY_RANGES.find(r => r.label === rangeLabel);
        if (!range) return false;
        return vehicleCapacity >= range.min && vehicleCapacity <= range.max;
      });

      return matchesSearch && matchesAmenities && matchesCapacity;
    });
  }, [vehicles, searchTerm, selectedAmenities, selectedCapacityRanges]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  const toggleCapacityRange = (rangeLabel: string) => {
    setSelectedCapacityRanges(prev => 
      prev.includes(rangeLabel) 
        ? prev.filter(r => r !== rangeLabel) 
        : [...prev, rangeLabel]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedAmenities([]);
    setSelectedCapacityRanges([]);
  };

  const hasActiveFilters = searchTerm || selectedAmenities.length > 0 || selectedCapacityRanges.length > 0;

  if (!vehicles.length) return null;

  return (
    <section className={cn("relative overflow-hidden bg-[#0a1628]", sectionClassName)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="relative py-12 md:py-16 max-w-7xl mx-auto px-4">
        {title && (
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-pink-400 via-purple-500 to-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          </div>
        )}

        {/* Enhanced Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <Input
              type="text"
              placeholder="Search by name, capacity, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 w-full rounded-full bg-white/5 border-2 border-white/10 pl-12 pr-12 text-white text-lg placeholder:text-white/40 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-end gap-4">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-white/60 hover:text-white gap-2"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Filter Panel - Always Visible */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
            {/* Capacity Filters */}
            <div>
              <Label className="text-white font-semibold mb-3 block">Capacity</Label>
              <div className="flex flex-wrap gap-3">
                {CAPACITY_RANGES.map(range => (
                  <div key={range.label} className="flex items-center space-x-2">
                    <Checkbox
                      id={`capacity-${range.label}`}
                      checked={selectedCapacityRanges.includes(range.label)}
                      onCheckedChange={() => toggleCapacityRange(range.label)}
                      className="border-white/30 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                    />
                    <Label
                      htmlFor={`capacity-${range.label}`}
                      className="text-sm cursor-pointer font-medium text-white/90 hover:text-white transition-colors"
                    >
                      {range.label} passengers
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenity Filters */}
            {availableAmenities.length > 0 && (
              <div>
                <Label className="text-white font-semibold mb-3 block">Amenities</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableAmenities.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                        className="border-white/30 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                      />
                      <Label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm cursor-pointer font-medium text-white/90 hover:text-white transition-colors"
                      >
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        {hasActiveFilters && (
          <div className="mb-6 text-white/70 text-sm">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </div>
        )}

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map(vehicle => (
              <FleetVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <Search className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No vehicles found</h3>
            <p className="text-white/60 mb-4">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="rounded-full border-white/20 text-white hover:bg-white/10"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
