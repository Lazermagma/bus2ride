import { Suspense } from "react";
import { HeroClient } from "./hero.client";
import { HeroSkeleton } from "./hero-skeleton";
import { getHeroBySlug } from "@/lib/data/heroes";
import { getRandomVehiclesImages } from "@/lib/data/vehicles";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import type { HeroData } from "@/types/hero.types";
import type { EventData } from "@/lib/data/events";

interface HeroProps {
  slug: string;
  event?: EventData | null;
}

export default async function Hero({ slug, event }: HeroProps) {
  let heroData = await getHeroBySlug(slug);

  // If no hero data found and we have event data, create event-specific hero
  if (!heroData && event) {
    heroData = {
      id: `event-${event.slug}`,
      slug: event.slug,
      title: `${event.title} Transportation`,
      subtitle: event.description || `Premium transportation for your ${event.title?.toLowerCase()} event. Book your group ride today.`,
      ctas: [
        { href: "/contact", label: "Get Instant Quote", style: "primary" },
        { href: "tel:8885352566", label: "Call (888) 535-2566", style: "secondary" },
      ],
      storage_bucket: "Events1",
      image_keys: event.images || null,
      autoplay_ms: 5500,
      darken: 0.4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as HeroData;
  }

  const heroImages = heroData?.image_keys?.map((imagePath) =>
    toPublicStorageUrl(heroData.storage_bucket, imagePath),
  );

  const imagesForHeroSlide = heroImages || (await getRandomVehiclesImages());

  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroClient hero={heroData} slideImageUrls={imagesForHeroSlide} />
    </Suspense>
  );
}
