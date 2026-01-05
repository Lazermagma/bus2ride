"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bus, Crown, Users } from "lucide-react";
import { LocationsData } from "@/lib/data/locations";

type FleetType = "party-buses" | "limousines" | "coach-buses";

interface LocationFleetNavProps {
  currentType: FleetType;
  location: LocationsData;
}

const FLEET_TYPES: Array<{
  type: FleetType;
  label: string;
  icon: typeof Bus;
  description: string;
}> = [
  {
    type: "party-buses",
    label: "Party Buses",
    icon: Bus,
    description: "Celebrations & events",
  },
  {
    type: "limousines",
    label: "Limousines",
    icon: Crown,
    description: "Elegant arrivals",
  },
  {
    type: "coach-buses",
    label: "Coach Buses",
    icon: Users,
    description: "Large groups",
  },
];

export function LocationFleetNav({ currentType, location }: LocationFleetNavProps) {
  return (
    <section className="relative py-8 bg-gradient-to-b from-[#0a1628] to-[#0d1d3a]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-6">
          <p className="text-sm text-white/60 mb-2">View {location.city_name} by Vehicle Type</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Choose Your Transportation
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {FLEET_TYPES.map((fleet) => {
            const Icon = fleet.icon;
            const isActive = fleet.type === currentType;
            const href = `/locations/${location.state_slug}/${fleet.type}-${location.city_slug}`;
            
            return (
              <Link
                key={fleet.type}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 px-6 py-4 rounded-xl",
                  "border-2 transition-all duration-300 min-w-[200px]",
                  "hover:scale-105 hover:shadow-lg",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-[0_10px_30px_rgba(59,130,246,0.4)]"
                    : "bg-slate-900/80 border-white/20 text-white hover:border-white/40 hover:bg-slate-800/80"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-white" : "text-blue-400"
                )} />
                <div className="flex-1 text-left">
                  <div className={cn(
                    "font-semibold text-base",
                    isActive ? "text-white" : "text-white"
                  )}>
                    {fleet.label}
                  </div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    isActive ? "text-blue-100" : "text-white/60"
                  )}>
                    {fleet.description}
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

