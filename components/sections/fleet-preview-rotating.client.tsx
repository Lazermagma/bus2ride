"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VehicleData } from "@/lib/data/vehicles";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { ArrowRight, Sparkles, Users, Phone, Mail, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { InstantQuoteButton } from "../InstantQuoteButton";

const ROTATION_INTERVAL_MS = 3000;
const VEHICLES_PER_ROW = 3;

interface FleetPreviewRotatingProps {
  title?: string;
  viewAllLink?: string;
  vehicles: VehicleData[];
  showNavigation?: boolean;
  sectionClassName?: string;
  amenityMode?: "link" | "badge";
  cardLinkTarget?: string;
  compact?: boolean;
  hideButtons?: boolean;
}

function hashStringToSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stableShuffle<T>(items: T[], seedKey: string): T[] {
  const rng = mulberry32(hashStringToSeed(seedKey));
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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
  return vehicleNameMap[type] || type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getVehicleGradient(type: string): string {
  if (typeGradients[type]) return typeGradients[type];
  if (type.includes("limo")) return typeGradients["limo"];
  if (type.includes("party") || type.includes("bus")) return typeGradients["party-bus"];
  if (type.includes("coach")) return typeGradients["coach"];
  if (type.includes("sprinter") || type.includes("van")) return typeGradients["sprinter"];
  return typeGradients["party-bus"];
}

function getRandomVehicle(
  allVehicles: VehicleData[],
  excludeIds: Set<string>
): VehicleData | null {
  const available = allVehicles.filter(v => !excludeIds.has(v.id));
  if (available.length === 0) {
    const shuffled = [...allVehicles].sort(() => Math.random() - 0.5);
    return shuffled[0] || null;
  }
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled[0];
}

function RotatingVehicleCard({
  vehicle,
  cardLink,
  animationKey,
  amenityMode = "badge",
  hideButtons = false,
  isPriority = false,
}: {
  vehicle: VehicleData;
  cardLink?: string;
  animationKey: number;
  amenityMode?: "link" | "badge";
  hideButtons?: boolean;
  isPriority?: boolean;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = useMemo(() => {
    if (!vehicle?.images || vehicle.images.length === 0)
      return ["/placeholder-vehicle.jpg"];
    return vehicle.images.map((key) => toPublicStorageUrl("vehicles1", key));
  }, [vehicle]);

  const activeImage = images[activeImageIndex] ?? images[0];

  const features = useMemo(() => {
    const fallbackAmenities = ["Pro Driver", "Bluetooth", "Hourly Rates", "BYOB Friendly"];
    const amenities = vehicle.amenities?.slice(0, 4) || fallbackAmenities;
    return stableShuffle(amenities, `${vehicle.id}-amenities`);
  }, [vehicle.amenities, vehicle.id]);

  const vehicleType = vehicle.type || "party-bus";
  const typeGradient = getVehicleGradient(vehicleType);
  const vehicleLabel = getVehicleLabel(vehicleType);

  const getAmenityLink = () => {
    if (vehicleType.includes("limo")) return "/limousines";
    if (vehicleType.includes("coach")) return "/coach-buses";
    return "/party-buses";
  };


  function getVehicleTypeLink(type?: string | null) {
    if (!type) return "/fleet";

    if (type.includes("limo")) return "/limousines";
    if (type.includes("coach")) return "/coach-buses";
    if (type.includes("sprinter")) return "/sprinter-vans";
    if (type.includes("suv")) return "/suvs";
    if (type.includes("sedan")) return "/sedans";
    if (type.includes("party")) return "/party-buses";

    return "/fleet";
  }


  return (
    <div
      key={animationKey}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "bg-gradient-to-b from-slate-900/95 to-slate-950",
        "border border-white/10 shadow-2xl",
        "transition-all duration-500",
        "hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
        "animate-fade-in"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={activeImage}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
          priority={isPriority}
          loading={isPriority ? "eager" : "lazy"}
          className={cn(
            "object-cover transition-all duration-700",
            isHovered && "scale-110"
          )}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute top-3 left-3 z-10">
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            "bg-gradient-to-r", typeGradient, "text-white shadow-lg"
          )}>
            {vehicleLabel}
          </div>
        </div>

        {vehicle.capacity && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
            <Users className="w-3 h-3 text-white/80" />
            <span className="text-xs font-semibold text-white">
              {vehicle.capacity.replace(" pax", "")}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
            {vehicle.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((tag, i) => (
              amenityMode === "link" ? (
                <Link
                  key={i}
                  href={getAmenityLink()}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium
                    bg-white/10 backdrop-blur-sm text-white/90 border border-white/10
                    hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer"
                >
                  {tag}
                </Link>
              ) : (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium
                    bg-white/10 backdrop-blur-sm text-white/90 border border-white/10"
                >
                  {tag}
                </span>
              )
            ))}
          </div>
        </div>

        <Link
          href={cardLink || `/vehicles/${vehicle.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`View ${vehicle.name}`}
        />
      </div>

      {images.length > 1 && (
        <div className="px-3 py-2 bg-slate-950/80 border-t border-white/5">
          <div className="flex gap-2">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                onDoubleClick={() => {
                  if (cardLink) window.location.href = cardLink;
                }}
                className={cn(
                  "relative flex-1 aspect-[4/3] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer",
                  activeImageIndex === idx
                    ? "ring-2 ring-white/60 scale-[1.02]"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt={`View ${idx + 1}`}
                  fill
                  sizes="80px"
                  quality={75}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <div className="w-full px-4 mt-2">
          <Link
            href={getVehicleTypeLink(vehicle.type)}
            className="
      block w-full
      bg-white py-1.5 rounded-xl
      text-black text-center font-semibold
      animate-pulse
      hover:animate-none hover:scale-[1.02]
      transition
    "
          >
            Learn more
          </Link>
        </div>



        {!hideButtons && (
          <div className="p-4 pt-3 space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg border-white/20 bg-white/5 text-white text-xs font-semibold
            hover:bg-white hover:text-slate-900 transition-all"
                asChild
              >
                <a href="tel:8885352566">
                  <Phone className="w-3 h-3 mr-1.5" />
                  Call
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-lg border-white/20 bg-white/5 text-white text-xs font-semibold
            hover:bg-white hover:text-slate-900 transition-all"
                asChild
              >
                <a href="mailto:info@bus2ride.com">
                  <Mail className="w-3 h-3 mr-1.5" />
                  Email
                </a>
              </Button>
            </div>

            <InstantQuoteButton
              source={`Homepage - ${vehicle.name}`}
              size="sm"
              variant="pulse"
              className="w-full rounded-lg text-xs"
            />
          </div>
        )}

      </div>


    </div>
  );
}

export function FleetPreviewRotating({
  title,
  viewAllLink,
  vehicles = [],
  showNavigation = true,
  sectionClassName,
  amenityMode = "badge",
  cardLinkTarget,
  compact = false,
  hideButtons = false,
}: FleetPreviewRotatingProps) {
  const vehiclesPerRow = compact ? 2 : VEHICLES_PER_ROW;
  const [displayedVehicles, setDisplayedVehicles] = useState<VehicleData[]>(
    () => vehicles.slice(0, vehiclesPerRow)
  );
  const [animationKeys, setAnimationKeys] = useState<number[]>(
    () => Array(vehiclesPerRow).fill(0)
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (vehicles.length > 0) {
      setDisplayedVehicles(vehicles.slice(0, vehiclesPerRow));
    }
  }, [vehicles, vehiclesPerRow]);

  useEffect(() => {
    if (!isClient || vehicles.length <= vehiclesPerRow) return;

    const rotateRandomVehicle = () => {
      const randomSlot = Math.floor(Math.random() * vehiclesPerRow);
      
      setDisplayedVehicles(prev => {
        const currentIds = new Set(prev.map(v => v.id));
        const newVehicle = getRandomVehicle(vehicles, currentIds);
        
        if (!newVehicle) return prev;
        
        const updated = [...prev];
        updated[randomSlot] = newVehicle;
        return updated;
      });
      
      setAnimationKeys(prev => {
        const updated = [...prev];
        updated[randomSlot] = prev[randomSlot] + 1;
        return updated;
      });
    };

    const interval = setInterval(rotateRandomVehicle, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isClient, vehicles, vehiclesPerRow]);

  if (!vehicles.length) return null;

  return (
    <section className={cn(
      "relative overflow-hidden",
      compact ? "bg-transparent" : "bg-[#0a1628]",
      sectionClassName
    )}>
      {!compact && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
      )}
      
      <div className={cn(
        "relative max-w-7xl mx-auto",
        compact ? "py-0 px-0" : "py-12 md:py-16 px-4"
      )}>
        {title && !compact && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-400 to-indigo-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h2>
            </div>

            {showNavigation && viewAllLink && (
              <Link
                href={viewAllLink}
                className="group inline-flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-white transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}

        <div className={cn(
          "grid gap-5",
          compact ? "grid-cols-1 sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {displayedVehicles.map((vehicle, idx) => (
            <RotatingVehicleCard
              key={`slot-${idx}`}
              vehicle={vehicle}
              cardLink={cardLinkTarget || viewAllLink}
              animationKey={animationKeys[idx]}
              amenityMode={amenityMode}
              hideButtons={hideButtons}
              isPriority={idx < 3}
            />
          ))}
        </div>

        {showNavigation && viewAllLink && !compact && (
          <div className="mt-8 text-center sm:hidden">
            <Button 
              asChild 
              className="w-full max-w-xs rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.4)] transition-all duration-300"
            >
              <Link href={viewAllLink}>
                <Sparkles className="w-4 h-4 mr-2" />
                View All
              </Link>
            </Button>
          </div>
        )}

        {compact && viewAllLink && (
          <div className="mt-4 text-center">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-white transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
