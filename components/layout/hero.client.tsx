"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { clampDarkenIntensity } from "@/lib/helpers/hero.helpers";
import { HeroData } from "@/types/hero.types";
import { ChevronDown, Sparkles, Music, Users, Star, Shield, Clock, Phone, CheckCircle2, Award, HeartHandshake } from "lucide-react";
import { InstantQuoteButton } from "@/components/InstantQuoteButton";
import { openLiveChat } from "@/lib/livechat";
import ClientOnly from "@/components/ClientOnly";

const HERO_BADGES: Record<string, { text: string; icon: "sparkles" | "music" | "users" }> = {
  home: { text: "Premium Fleet Rentals", icon: "sparkles" },
  "party-buses": { text: "Mobile Nightclub Experience", icon: "music" },
  limousines: { text: "Luxury Transportation", icon: "sparkles" },
  "coach-buses": { text: "Group Travel Excellence", icon: "users" },
};

const TRUST_MODALS = [
  {
    icon: Star,
    label: "5-Star Rated",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    title: "5-Star Customer Satisfaction",
    description: "We're proud to maintain a consistent 5-star rating across all platforms.",
    features: [
      "4.9/5 average rating on Google Reviews",
      "Top-rated on Yelp and Facebook",
      "98% customer satisfaction rate",
      "1,000+ verified 5-star reviews",
      "Award-winning customer service team",
    ],
  },
  {
    icon: Shield,
    label: "Fully Insured",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
    title: "Comprehensive Insurance Coverage",
    description: "Your safety is our priority. All vehicles carry full commercial insurance.",
    features: [
      "$5M liability coverage per vehicle",
      "Comprehensive collision protection",
      "Medical payments coverage included",
      "Uninsured motorist protection",
      "DOT and PUC compliant fleet",
    ],
  },
  {
    icon: Clock,
    label: "24/7 Support",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    title: "Round-the-Clock Customer Support",
    description: "Our team is always available to assist you, day or night.",
    features: [
      "Live phone support 24 hours a day",
      "Real-time text and chat assistance",
      "Emergency dispatch coordination",
      "Same-day booking available",
      "Dedicated event coordinator assigned",
    ],
  },
  {
    icon: Phone,
    label: "Instant Quotes",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    title: "Get Your Quote in Minutes",
    description: "No waiting around. Get accurate pricing instantly.",
    features: [
      "Free, no-obligation price quotes",
      "Transparent pricing with no hidden fees",
      "Custom packages for any budget",
      "Price match guarantee available",
      "Flexible payment plans offered",
    ],
  },
];

type HeroHeaderProps = {
  hero: HeroData | null;
  slideImageUrls: string[];
};

export function HeroClient({ hero, slideImageUrls }: HeroHeaderProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const slideIntervalRef = useRef<number | null>(null);
  const autoplayDurationMs = useMemo(
    () => Math.max(2500, hero?.autoplay_ms ?? 6000),
    [hero?.autoplay_ms],
  );

  useEffect(() => {
    if (!slideImageUrls.length) return;
    const startInterval = () => {
      slideIntervalRef.current = window.setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slideImageUrls.length);
      }, autoplayDurationMs);
    };
    startInterval();
    return () => {
      if (slideIntervalRef.current)
        window.clearInterval(slideIntervalRef.current);
    };
  }, [slideImageUrls.length, autoplayDurationMs]);

  const darkenIntensity = clampDarkenIntensity(hero?.darken);
  const hasSlideImages = slideImageUrls.length > 0;

  return (
    <section className="relative flex min-h-[60vh] md:min-h-[70vh] flex-col items-center justify-center overflow-hidden">
      {hasSlideImages ? (
        <div className="absolute inset-0 z-0">
          {slideImageUrls.map((imageUrl, slideIndex) => {
            const isActive = slideIndex === currentSlideIndex;
            return (
              <div
                key={slideIndex}
                className={cn(
                  "absolute inset-0 transition-all duration-1000",
                  isActive ? "z-10 opacity-100 scale-105" : "z-0 opacity-0 scale-100"
                )}
              >
                <Image
                  src={imageUrl}
                  alt=""
                  fill
                  sizes="100vw"
                  quality={90}
                  priority={slideIndex < 2}
                  loading={slideIndex < 2 ? "eager" : "lazy"}
                  className="object-cover object-center"
                />
              </div>
            );
          })}
          
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950" />
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50" />
          
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[150px] animate-float" />
            <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[150px] animate-float" style={{ animationDelay: "2s" }} />
            <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] animate-float" style={{ animationDelay: "4s" }} />
          </div>

          <div className="absolute inset-0 z-20 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
            }} />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      )}

      <div className="relative z-30 flex w-full max-w-6xl flex-col items-center gap-5 px-6 text-center pt-8">
        {hero?.slug && HERO_BADGES[hero.slug] && (
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-up">
            {HERO_BADGES[hero.slug].icon === "sparkles" && <Sparkles className="w-4 h-4 text-yellow-400" />}
            {HERO_BADGES[hero.slug].icon === "music" && <Music className="w-4 h-4 text-pink-400" />}
            {HERO_BADGES[hero.slug].icon === "users" && <Users className="w-4 h-4 text-emerald-400" />}
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-white/90">
              {HERO_BADGES[hero.slug].text}
            </span>
          </div>
        )}

        {hero?.title && (
          <h1 className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-2xl">
              {hero.title.split("—")[0]}
            </span>
            {hero.title.includes("—") && (
              <span className="block mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient-shift">
                {hero.title.split("—")[1]}
              </span>
            )}
          </h1>
        )}
        
        {hero?.subtitle && (
          <p className="max-w-2xl text-lg md:text-xl lg:text-2xl text-white/80 font-medium animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {hero.subtitle}
          </p>
        )}
        
        {hero?.ctas && hero.ctas.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {hero.ctas.map((cta) => {
              const isQuoteCta = cta.href === "/pricing" && cta.label.toLowerCase().includes("quote");
              
              if (isQuoteCta) {
                return (
                  <Button
                    key={cta.href}
                    size="lg"
                    onClick={() => openLiveChat("Hero CTA", typeof window !== "undefined" ? window.location.pathname : "/")}
                    className={cn(
                      "rounded-full px-8 py-6 text-base font-bold transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-2xl cursor-pointer",
                      cta.style === "primary" &&
                        "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-[0_10px_40px_rgba(59,130,246,0.4)]",
                      cta.style === "secondary" &&
                        "bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20",
                      cta.style === "outline" &&
                        "bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white"
                    )}
                  >
                    {cta.style === "primary" && <Sparkles className="w-4 h-4 mr-2" />}
                    {cta.label}
                  </Button>
                );
              }
              
              return (
                <Button
                  key={cta.href}
                  asChild
                  size="lg"
                  className={cn(
                    "rounded-full px-8 py-6 text-base font-bold transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-2xl",
                    cta.style === "primary" &&
                      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 shadow-[0_10px_40px_rgba(59,130,246,0.4)]",
                    cta.style === "secondary" &&
                      "bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20",
                    cta.style === "outline" &&
                      "bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white"
                  )}
                >
                  <Link href={cta.href}>
                    {cta.style === "primary" && <Sparkles className="w-4 h-4 mr-2" />}
                    {cta.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}

        {slideImageUrls.length > 1 && (
          <div className="flex gap-2 mt-6 animate-fade-up" style={{ animationDelay: "0.35s" }}>
            {slideImageUrls.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  currentSlideIndex === i
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-30 w-full max-w-4xl mx-auto px-4 mt-8 mb-16 animate-fade-up" style={{ animationDelay: "0.4s" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRUST_MODALS.map((item, i) => (
            <button
              key={i}
              onClick={() => setOpenModalIndex(i)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-2xl",
                "bg-white/5 backdrop-blur-md border border-white/10",
                "hover:bg-white/10 hover:border-white/20 hover:-translate-y-1",
                "transition-all duration-300 cursor-pointer group"
              )}
            >
              <item.icon className={cn("w-5 h-5", item.color)} />
              <span className="text-sm font-semibold text-white/90 group-hover:text-white">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 animate-fade-up" style={{ animationDelay: "0.5s" }}>
        <span className="text-xs text-white/50 tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 h-24 bg-gradient-to-t from-[#0a1628] to-transparent pointer-events-none" />

      {TRUST_MODALS.map((modal, i) => (
        <Dialog key={i} open={openModalIndex === i} onOpenChange={(open) => setOpenModalIndex(open ? i : null)}>
          <DialogContent className="bg-gradient-to-br from-[#0f1f45] via-[#0a1733] to-[#060e23] border border-white/10 text-white max-w-md">
            <DialogHeader>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4", modal.bgColor, "border", modal.borderColor)}>
                <modal.icon className={cn("w-7 h-7", modal.color)} />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">
                {modal.title}
              </DialogTitle>
              <DialogDescription className="text-white/70 text-base">
                {modal.description}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3">
              {modal.features.map((feature, fi) => (
                <div key={fi} className="flex items-start gap-3">
                  <CheckCircle2 className={cn("w-5 h-5 mt-0.5 flex-shrink-0", modal.color)} />
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <InstantQuoteButton
                source={`Hero Modal - ${modal.label}`}
                className="flex-1 rounded-full"
              />


              <Button asChild variant="outline" className="flex-1   rounded-full">
                <Link href="tel:8885352566" >
                  Call Now
                </Link>
              </Button>


            </div>
          </DialogContent>
        </Dialog>
      ))}
    </section>
  );
}
