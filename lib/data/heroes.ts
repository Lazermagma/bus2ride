import { createClient } from "@/lib/supabase/server";
import { HeroData } from "@/types/hero.types";
import { cache } from "react";

const fallbackHeroes: Record<string, HeroData> = {
  home: {
    id: "fallback-home",
    slug: "home",
    title: "Bus2ride—Group Transport Made Easy",
    subtitle: "Instant Quotes, Transparent Pricing, And Clean Vehicles For Every Event.",
    ctas: [
      { href: "/contact", label: "Contact Us", style: "secondary" },
      { href: "/party-buses", label: "View Fleet", style: "primary" },
      { href: "/pricing", label: "Get Instant Quote", style: "outline" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  "party-buses": {
    id: "fallback-party-buses",
    slug: "party-buses",
    title: "Party Buses—Mobile Nightclub Experience",
    subtitle: "From minis to mega buses—clean, comfy, and loaded with premium sound systems, LED lighting, and everything you need to party on wheels.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
      { href: "tel:8885352566", label: "Call Now", style: "secondary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.4,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  limousines: {
    id: "fallback-limousines",
    slug: "limousines",
    title: "Luxury Limousines—Timeless Elegance",
    subtitle: "Sleek sedans, SUV stretches, and Sprinter limos—tuned for weddings, corporate transfers, and VIP arrivals.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
      { href: "tel:8885352566", label: "Call Now", style: "secondary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.4,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  "coach-buses": {
    id: "fallback-coach-buses",
    slug: "coach-buses",
    title: "Coach Buses—Group Travel Excellence",
    subtitle: "From 25-passenger mini coaches to 56-passenger motorcoaches—pick the capacity and amenities your journey demands.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
      { href: "tel:8885352566", label: "Call Now", style: "secondary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.4,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  fleet: {
    id: "fallback-fleet",
    slug: "fleet",
    title: "Our Fleet—Premium Vehicles",
    subtitle: "Browse our complete fleet of party buses, limousines, and coach buses available for your next event.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
      { href: "tel:8885352566", label: "Call Now", style: "secondary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  polls: {
    id: "fallback-polls",
    slug: "polls",
    title: "Transportation Polls—Your Voice Matters",
    subtitle: "Vote on party planning topics and see what others think about transportation, events, and celebrations.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
      { href: "tel:8885352566", label: "Call Now", style: "secondary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  pricing: {
    id: "fallback-pricing",
    slug: "pricing",
    title: "Pricing—Transparent Rates",
    subtitle: "Get instant quotes and see our competitive pricing for party buses, limousines, and coach buses.",
    ctas: [
      { href: "/contact", label: "Contact Us", style: "primary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  faq: {
    id: "fallback-faq",
    slug: "faq",
    title: "FAQ—Your Questions Answered",
    subtitle: "Find answers to common questions about bookings, pricing, vehicles, and policies.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
      { href: "tel:8885352566", label: "Call Now", style: "secondary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  tools: {
    id: "fallback-tools",
    slug: "tools",
    title: "Planning Tools—Make It Easy",
    subtitle: "Calculators, checklists, and guides to help you plan the perfect group transportation.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
      { href: "tel:8885352566", label: "Call Now", style: "secondary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  "industry-secrets": {
    id: "fallback-industry-secrets",
    slug: "industry-secrets",
    title: "Industry Secrets—Insider Knowledge",
    subtitle: "Tips, tricks, and insights from transportation industry professionals.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  blog: {
    id: "fallback-blog",
    slug: "blog",
    title: "Blog—Stories & Inspiration",
    subtitle: "Event ideas, planning guides, and stories from memorable celebrations.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
      { href: "tel:8885352566", label: "Call Now", style: "secondary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  reviews: {
    id: "fallback-reviews",
    slug: "reviews",
    title: "Reviews—What Our Customers Say",
    subtitle: "Real feedback from real customers who trusted us with their special occasions.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  contact: {
    id: "fallback-contact",
    slug: "contact",
    title: "Contact Us—We're Here to Help",
    subtitle: "Get in touch with our team for quotes, questions, or special requests.",
    ctas: [
      { href: "tel:8885352566", label: "Call Now", style: "primary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  events: {
    id: "fallback-events",
    slug: "events",
    title: "Events—Perfect Transportation",
    subtitle: "From weddings to corporate events, we have the perfect vehicle for every occasion.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
  locations: {
    id: "fallback-locations",
    slug: "locations",
    title: "Locations—Nationwide Service",
    subtitle: "Find party bus and limousine rentals in your city or state.",
    ctas: [
      { href: "/pricing", label: "Get Quote", style: "primary" },
    ],
    storage_bucket: "vehicles1",
    image_keys: null,
    autoplay_ms: 5500,
    darken: 0.35,
    created_at: new Date("2023-01-01").toISOString(),
    updated_at: new Date("2023-01-01").toISOString(),
  },
};

export const getHeroBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: hero, error } = await supabase
    .from("homepage_hero")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getHeroBySlug", error);
    return fallbackHeroes[slug] || fallbackHeroes.home;
  }

  if (!hero) {
    return fallbackHeroes[slug] || fallbackHeroes.home;
  }

  return hero;
});
