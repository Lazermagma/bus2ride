"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VehicleData } from "@/lib/data/vehicles";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { Users, Phone, ChevronRight, Check, ChevronLeft, ZoomIn, Mail, Sparkles } from "lucide-react";
import { InstantQuoteButton } from "@/components/InstantQuoteButton";
import { openLiveChat } from "@/lib/livechat";
import { Button } from "../ui/button";
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
          <Link href="/faq" className="block w-full py-2 rounded-xl text-center font-semibold text-black bg-white animate-pulse hover:animate-none hover:scale-[1.02] transition-all">Learn more</Link>
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

export function FleetGrid({ title, vehicles = [], sectionClassName }: FleetGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  const vehicleTypes = useMemo(() => Array.from(new Set(vehicles.map(v => v.type ?? "unknown"))), [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const nameMatch = v.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filters.length ? filters.includes(v.type ?? "unknown") : true;
      return nameMatch && typeMatch;
    });
  }, [vehicles, searchTerm, filters]);

  const toggleFilter = (type: string) => {
    setFilters(prev => prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]);
  };

  if (!vehicles.length) return null;

  return (
    <section className={cn("relative overflow-hidden bg-[#0a1628]", sectionClassName)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="relative py-12 md:py-16 max-w-7xl mx-auto px-4">
        {title && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-400 to-indigo-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <input type="text" placeholder="Search vehicles..." className="flex-1 p-2 rounded-lg text-black" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map(type => (
              <button key={type} onClick={() => toggleFilter(type)} className={cn(
                "px-3 py-1 rounded-full text-sm font-semibold border transition-all",
                filters.includes(type) ? "bg-blue-500 text-white border-blue-500" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              )}>
                {getVehicleLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map(vehicle => <FleetVehicleCard key={vehicle.id} vehicle={vehicle} />)}
        </div>
      </div>
    </section>
  );
}
