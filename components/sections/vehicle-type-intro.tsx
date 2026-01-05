"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PartyPopper, Crown, Bus, ArrowRight, Sparkles, Users, Music, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const normalizeVehicleType = (type: string): string => {
  const typeMap: Record<string, string> = {
    "party-bus": "party-bus",
    "coach-bus": "coach",
    "coach": "coach",
    "limo": "limo",
    "limousine": "limo",
  };
  return typeMap[type] || type;
};

const VEHICLE_TYPE_CONFIG = {
  "party-bus": {
    title: "Party Buses",
    subtitle: "The Life of Every Party",
    description: "Transform your group outing into an unforgettable celebration. Party buses combine spacious interiors with premium sound systems, LED lighting, and a dance floor—so the party starts the moment you step aboard.",
    features: [
      { icon: Music, label: "Premium Sound System", desc: "Bluetooth-connected speakers for your playlist" },
      { icon: Sparkles, label: "LED Dance Floor", desc: "Multi-color lighting sets the mood" },
      { icon: Users, label: "Group Seating", desc: "Comfortable perimeter seating for 15-40 guests" },
    ],
    badge: "Most Popular for Celebrations",
    icon: PartyPopper,
    gradient: "from-pink-500/20 via-purple-500/20 to-blue-500/20",
    borderColor: "border-pink-500/30",
    badgeColor: "bg-pink-500/10 border-pink-500/30 text-pink-300",
    buttonColor: "from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400",
    href: "/party-buses",
  },
  limo: {
    title: "Luxury Limousines",
    subtitle: "Elegance Meets Comfort",
    description: "Make an unforgettable entrance with a classic stretch limousine. Perfect for weddings, proms, and VIP occasions where style and sophistication matter most.",
    features: [
      { icon: Crown, label: "White Exterior", desc: "Perfect for photos day or night" },
      { icon: Star, label: "VIP Amenities", desc: "Champagne service, privacy partition" },
      { icon: Users, label: "Intimate Seating", desc: "Ideal for groups of 6-18" },
    ],
    badge: "Classic Luxury Choice",
    icon: Crown,
    gradient: "from-amber-500/20 via-yellow-500/20 to-amber-500/20",
    borderColor: "border-amber-500/30",
    badgeColor: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    buttonColor: "from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400",
    href: "/limousines",
  },
  coach: {
    title: "Coach Buses",
    subtitle: "Travel in Style & Comfort",
    description: "When you need to move a large group comfortably across town or across the country, our coach buses deliver. Reclining seats, climate control, and onboard amenities make every journey enjoyable.",
    features: [
      { icon: Bus, label: "Reclining Seats", desc: "Plush seating with extra legroom" },
      { icon: Sparkles, label: "Climate Control", desc: "Individual AC vents for comfort" },
      { icon: Users, label: "Large Capacity", desc: "Transport 30-56 passengers" },
    ],
    badge: "Best for Large Groups",
    icon: Bus,
    gradient: "from-emerald-500/20 via-teal-500/20 to-emerald-500/20",
    borderColor: "border-emerald-500/30",
    badgeColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    buttonColor: "from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400",
    href: "/coach-buses",
  },
};

interface VehicleTypeIntroProps {
  vehicleType: string;
}

export function VehicleTypeIntro({ vehicleType }: VehicleTypeIntroProps) {
  const normalizedType = normalizeVehicleType(vehicleType);
  const config = VEHICLE_TYPE_CONFIG[normalizedType as keyof typeof VEHICLE_TYPE_CONFIG];
  
  if (!config) return null;

  const Icon = config.icon;

  return (
    <section className="py-16 bg-gradient-to-b from-[#0d1d3a] to-[#0a1628]">
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn(
          "rounded-3xl border p-8 md:p-12 bg-gradient-to-br backdrop-blur-sm",
          config.gradient,
          config.borderColor
        )}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className={cn("w-fit", config.badgeColor)}>
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {config.badge}
              </Badge>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {config.title}
                </h2>
                <p className="mt-2 text-xl text-white/80 font-medium">
                  {config.subtitle}
                </p>
              </div>

              <p className="text-white/70 text-lg leading-relaxed">
                {config.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild className={cn("rounded-xl font-bold bg-gradient-to-r", config.buttonColor)}>
                  <Link href={config.href}>
                    Browse {config.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/20 !bg-transparent !text-white hover:!bg-white/10 hover:!text-white">
                  <Link href="/contact">
                    Get a Quote
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {config.features.map((feature, idx) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <FeatureIcon className="w-5 h-5 text-white/80" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{feature.label}</h3>
                        <p className="text-sm text-white/60 mt-0.5">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
