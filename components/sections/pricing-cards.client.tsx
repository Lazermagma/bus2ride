"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Music, Crown, Users } from "lucide-react";

const PRICING_CARDS = [
  {
    id: "party-bus",
    price: "$150-400/hr",
    title: "Party Buses",
    capacity: "15-50 passengers",
    borderColor: "border-blue-500/30",
    gradientFrom: "from-blue-600/20",
    gradientTo: "to-cyan-600/20",
    textColor: "text-blue-200/70",
    icon: Music,
    modalContent: {
      title: "Party Bus Pricing Details",
      description: "Comprehensive pricing information for party buses",
      details: [
        {
          title: "Small Party Buses (15-20 Passengers)",
          price: "$150-$200/hr",
          description: "Compact party buses with sound systems, LED lighting, and bar areas. Perfect for birthday groups and small friend gatherings.",
        },
        {
          title: "Standard Party Buses (25-35 Passengers)",
          price: "$200-$300/hr",
          description: "The most popular size range with expanded dance floors, multiple entertainment zones, and generous amenity packages.",
        },
        {
          title: "Mega Party Buses (40-50 Passengers)",
          price: "$300-$400+/hr",
          description: "Premium mobile nightclubs with professional-grade sound, elaborate lighting, and VIP amenities.",
        },
        {
          title: "Per-Person Value",
          price: "~$50/person",
          description: "A $300/hour bus for 30 guests over 5 hours costs only $50 per person for the entire experience.",
        },
      ],
    },
  },
  {
    id: "limousine",
    price: "$100-300/hr",
    title: "Limousines",
    capacity: "6-20 passengers",
    borderColor: "border-violet-500/30",
    gradientFrom: "from-violet-600/20",
    gradientTo: "to-purple-600/20",
    textColor: "text-violet-200/70",
    icon: Crown,
    modalContent: {
      title: "Limousine Pricing Details",
      description: "Comprehensive pricing information for limousines",
      details: [
        {
          title: "Sedan Limousines",
          price: "$75-$100/hr",
          description: "Luxury sedans (Lincoln Town Car, Mercedes) perfect for airport transfers, corporate transportation, and intimate occasions for 2-4 passengers.",
        },
        {
          title: "Standard Stretch Limousines",
          price: "$125-$175/hr",
          description: "Classic stretch limos (Lincoln, Chrysler 300) accommodating 8-12 passengers. Most popular choice for weddings, proms, and special occasions.",
        },
        {
          title: "SUV Limousines",
          price: "$200-$300/hr",
          description: "Escalade, Navigator, and Hummer stretches seating 14-20 passengers. Make dramatic statements for high-profile events.",
        },
        {
          title: "Specialty & Exotic Limousines",
          price: "$350+/hr",
          description: "Vintage vehicles, exotic brands (Bentley, Rolls-Royce), and custom-built specialty limos for truly unforgettable experiences.",
        },
      ],
    },
  },
  {
    id: "coach-bus",
    price: "$125-350/hr",
    title: "Coach Buses",
    capacity: "25-56 passengers",
    borderColor: "border-emerald-500/30",
    gradientFrom: "from-emerald-600/20",
    gradientTo: "to-teal-600/20",
    textColor: "text-emerald-200/70",
    icon: Users,
    modalContent: {
      title: "Coach Bus Pricing Details",
      description: "Comprehensive pricing information for coach buses",
      details: [
        {
          title: "Mini Coaches (25-35 Passengers)",
          price: "$125-$175/hr",
          description: "Compact coaches that navigate city streets easily while providing full coach amenities. Ideal for corporate shuttles and wedding guest transportation.",
        },
        {
          title: "Standard Coaches (40-50 Passengers)",
          price: "$150-$225/hr",
          description: "Full-size motorcoaches offering the best value for larger groups with restrooms, reclining seats, and entertainment systems.",
        },
        {
          title: "Executive Coaches",
          price: "$200-$300/hr",
          description: "Premium configurations with leather seating, WiFi, and VIP amenities. Popular for corporate travel and sports teams.",
        },
        {
          title: "Daily Rates",
          price: "$1,200-$2,500/day",
          description: "For extended use, daily rates provide better value than hourly billing. Multi-day tours receive additional discounts.",
        },
      ],
    },
  },
];

export function PricingCardsClient() {
  const [openModalId, setOpenModalId] = React.useState<string | null>(null);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {PRICING_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => setOpenModalId(card.id)}
              className={`rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} p-6 text-center transition-all hover:scale-105 hover:shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20`}
            >
              <div className="flex items-center justify-center mb-3">
                <Icon className={`w-8 h-8 ${card.textColor}`} />
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{card.price}</div>
              <div className={`text-sm ${card.textColor} font-medium mb-3`}>{card.title}</div>
              <div className="text-xs text-white/50">{card.capacity}</div>
            </button>
          );
        })}
      </div>

      {PRICING_CARDS.map((card) => (
        <Dialog
          key={card.id}
          open={openModalId === card.id}
          onOpenChange={(open) => setOpenModalId(open ? card.id : null)}
        >
          <DialogContent className="bg-gradient-to-br from-[#0f1f45] via-[#0a1733] to-[#060e23] border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold text-white">
                  {card.modalContent.title}
                </DialogTitle>
              </div>
              <DialogDescription className="text-white/70 text-base">
                {card.modalContent.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              {card.modalContent.details.map((detail, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-semibold text-lg">{detail.title}</h4>
                    <span className="text-lg font-bold text-white/90">{detail.price}</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{detail.description}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}

