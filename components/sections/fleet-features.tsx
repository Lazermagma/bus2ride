"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Check, Shield, Clock, Users, Music, Wifi, 
  Sparkles, Zap, Star, Heart, PartyPopper, 
  Mic2, ThermometerSun, Camera, Wine, Tv,
  Flame
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ICON_MAP: Record<string, LucideIcon> = {
  check: Check,
  shield: Shield,
  clock: Clock,
  users: Users,
  music: Music,
  wifi: Wifi,
  sparkles: Sparkles,
  zap: Zap,
  star: Star,
  heart: Heart,
  party: PartyPopper,
  mic: Mic2,
  climate: ThermometerSun,
  camera: Camera,
  wine: Wine,
  tv: Tv,
};

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: FeatureItem[];
  title?: string;
  subtitle?: string;
  gradient?: string;
}

const GRADIENT_STYLES: Record<string, { badgeBg: string; iconColor: string; textColor: string }> = {
  "from-pink-500 to-purple-500": { badgeBg: "bg-pink-500/20", iconColor: "text-pink-400", textColor: "text-pink-300" },
  "from-amber-400 to-yellow-500": { badgeBg: "bg-amber-500/20", iconColor: "text-amber-400", textColor: "text-amber-300" },
  "from-emerald-400 to-teal-500": { badgeBg: "bg-emerald-500/20", iconColor: "text-emerald-400", textColor: "text-emerald-300" },
  "from-blue-500 to-indigo-500": { badgeBg: "bg-blue-500/20", iconColor: "text-blue-400", textColor: "text-blue-300" },
};

function getGradientStyles(gradient: string) {
  return GRADIENT_STYLES[gradient] || GRADIENT_STYLES["from-pink-500 to-purple-500"];
}

export function FeatureGrid({ 
  features, 
  title = "Premium Features",
  subtitle = "Everything you need for an unforgettable experience",
  gradient = "from-pink-500 to-purple-500"
}: FeatureGridProps) {
  const styles = getGradientStyles(gradient);
  const [openModalIndex, setOpenModalIndex] = React.useState<number | null>(null);
  
  return (
    <section className="py-16 bg-gradient-to-b from-[#0a1628] to-[#0d1d3a]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 mb-6",
            styles.badgeBg
          )}>
            <Sparkles className={cn("w-4 h-4", styles.iconColor)} aria-hidden="true" />
            <span className={cn("text-xs font-bold tracking-wider uppercase", styles.textColor)}>Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">{title}</h2>
          <p className="text-blue-100/70 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => {
            const Icon = ICON_MAP[feature.icon] || Check;
            return (
              <button
                key={idx}
                onClick={() => setOpenModalIndex(idx)}
                className="group p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 
                  hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 text-left w-full
                  focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    `bg-gradient-to-br ${gradient}`
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals for each feature */}
      {features.map((feature, idx) => {
        const Icon = ICON_MAP[feature.icon] || Check;
        return (
          <Dialog 
            key={idx} 
            open={openModalIndex === idx} 
            onOpenChange={(open) => setOpenModalIndex(open ? idx : null)}
          >
            <DialogContent className="bg-gradient-to-br from-[#0f1f45] via-[#0a1733] to-[#060e23] border border-white/10 text-white max-w-lg">
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                    `bg-gradient-to-br ${gradient}`
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    {feature.title}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-white/70 text-base">
                  {feature.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Feature Details</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    This is placeholder content for {feature.title}. You can replace this with detailed information about the feature, including specifications, benefits, and usage details.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-semibold">Additional Information</h4>
                  <p className="text-white/60 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })}
    </section>
  );
}

export interface SpecItem {
  label: string;
  value: string;
}

interface SpecsPanelProps {
  specs: SpecItem[];
  title?: string;
  gradient?: string;
}

export function SpecsPanel({ 
  specs, 
  title = "Vehicle Specifications",
  gradient = "from-pink-500 to-purple-500"
}: SpecsPanelProps) {
  const [openModalIndex, setOpenModalIndex] = React.useState<number | null>(null);

  return (
    <section className="py-12 bg-[#0a1628]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className={cn("w-1.5 h-8 rounded-full bg-gradient-to-b", gradient)} />
          {title}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {specs.map((spec, idx) => (
            <button
              key={idx}
              onClick={() => setOpenModalIndex(idx)}
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <p className="text-2xl font-bold text-white mb-1">{spec.value}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">{spec.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modals for each spec */}
      {specs.map((spec, idx) => (
        <Dialog 
          key={idx} 
          open={openModalIndex === idx} 
          onOpenChange={(open) => setOpenModalIndex(open ? idx : null)}
        >
          <DialogContent className="bg-gradient-to-br from-[#0f1f45] via-[#0a1733] to-[#060e23] border border-white/10 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                {spec.label}
              </DialogTitle>
              <DialogDescription className="text-white/70 text-base">
                Specification Details
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-3xl font-bold text-white mb-2">{spec.value}</p>
                <p className="text-white/60 text-sm">
                  This is placeholder content for {spec.label}. You can replace this with detailed information about the specification.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Additional Information</h4>
                <p className="text-white/60 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </section>
  );
}

interface BestForTagsProps {
  tags: string[];
  title?: string;
  gradient?: string;
}

const TAG_COLORS: Record<string, string> = {
  "from-pink-500 to-purple-500": "bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-pink-500/30",
  "from-amber-400 to-yellow-500": "bg-gradient-to-r from-amber-400/30 to-yellow-400/30 border-amber-400/30",
  "from-emerald-400 to-teal-500": "bg-gradient-to-r from-emerald-400/30 to-teal-400/30 border-emerald-400/30",
  "from-blue-500 to-indigo-500": "bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border-blue-500/30",
};

// Map tag names to event page slugs
function getEventSlug(tag: string): string | null {
  const tagToSlugMap: Record<string, string> = {
    "Bachelorette Parties": "/events/bachelorette-party",
    "Bachelor Parties": "/events/bachelor-party",
    "Birthday Celebrations": "/events/birthday-party",
    "Prom Night": "/events/prom-night",
    "Wedding Celebrations": "/events/wedding-celebrations",
    "Night Out on the Town": "/events/night-out-town",
    "Bar & Club Hopping": "/events/night-out-town",
    "Concert Transportation": "/events",
    "Brewery Tours": "/events",
    "Winery Tours": "/events",
    "Graduation Parties": "/events",
    "Holiday Celebrations": "/events",
    "Corporate Events": "/events",
    "Sports Game Transportation": "/events",
  };
  
  return tagToSlugMap[tag] || null;
}

export function BestForTags({ 
  tags, 
  title = "Best For These Events",
  gradient = "from-pink-500 to-purple-500"
}: BestForTagsProps) {
  const tagColor = TAG_COLORS[gradient] || TAG_COLORS["from-pink-500 to-purple-500"];
  
  return (
    <section className="py-12 bg-gradient-to-b from-[#0d1d3a] to-[#0a1628]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className={cn("w-1.5 h-8 rounded-full bg-gradient-to-b", gradient)} />
          {title}
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, idx) => {
            const eventSlug = getEventSlug(tag);
            const baseClasses = cn(
              "px-4 py-2 rounded-full text-sm font-medium",
              "text-white/90 border",
              "hover:scale-105 transition-transform",
              tagColor
            );
            
            if (eventSlug) {
              return (
                <Link
                  key={idx}
                  href={eventSlug}
                  className={cn(baseClasses, "cursor-pointer hover:bg-white/10")}
                >
                  {tag}
                </Link>
              );
            }
            
            return (
              <span 
                key={idx}
                className={cn(baseClasses, "cursor-default")}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface CTABandProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  phone?: string;
  gradient?: string;
}

export function CTABand({
  title = "Ready to Book?",
  subtitle = "Get an instant quote for your event in minutes",
  buttonText = "Get Instant Quote",
  buttonHref = "/pricing",
  phone = "(888) 535-2566",
  gradient = "from-pink-500 to-purple-500"
}: CTABandProps) {
  return (
    <section className={cn("py-16 bg-gradient-to-r", gradient)}>
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">{title}</h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{subtitle}</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={buttonHref}
            className="px-8 py-4 rounded-xl bg-white text-gray-900 font-bold text-lg 
              hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            {buttonText}
          </a>
          <a 
            href={`tel:${phone.replace(/[^0-9]/g, '')}`}
            className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/30 
              text-white font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {phone}
          </a>
        </div>
      </div>
    </section>
  );
}
