import Hero from "@/components/layout/hero";
import { LocationsDirectoryClient } from "@/components/sections/locations-directory.client";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { FaqSection } from "@/components/sections/faq-section";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import { getLocations } from "@/lib/data/locations";
import FleetSection from "@/components/sections/fleet-section";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { pageMetadata } from "@/lib/seo/metadata";
import { Sparkles } from "lucide-react";

export const metadata = pageMetadata({
  title: "Locations",
  description:
    "Find party bus, limo, and coach bus service by city and state. Browse coverage and get a fast quote for your route.",
  path: "/locations",
});

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/fleet", label: "Browse Fleet", description: "See vehicles available in your area", category: "fleet" },
  { href: "/pricing", label: "Local Pricing", description: "Get rates for your city", category: "resources" },
  { href: "/events", label: "Event Ideas", description: "Popular events in your area", category: "events" },
  { href: "/contact", label: "Get a Quote", description: "Request personalized pricing", category: "resources" },
  { href: "/reviews", label: "Local Reviews", description: "See what customers say", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.tripadvisor.com/", label: "Local Attractions", source: "TripAdvisor" },
  { href: "https://www.yelp.com/", label: "Local Venues", source: "Yelp" },
];

async function getData() {
  const locations = await getLocations();
  const reviews = await getReviews();
  const totalReviewsCount = await getReviewsCount();

  return {
    reviews: reviews || [],
    locations: locations || [],
    totalReviewsCount: totalReviewsCount || 0,
  };
}

export default async function LocationsIndexPage() {
  const { reviews, locations, totalReviewsCount } = await getData();

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="locations" />

      <SectionDivider variant="glow" />

      <LocationsDirectoryClient locations={locations} />

      <PremiumDivider />

      <PollsGrid
        columnCategories={["weddings", "bachelorette-parties", "concerts"]}
        hideCities
        title="Location Polls"
      />

      <SectionDivider variant="dots" />

      <FleetSection />

      <PremiumDivider />

      <ToolsGrid category="locations" />

      <SectionDivider variant="glow" />

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <SectionDivider variant="gradient" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Explore Your Options"
      />

      <PremiumDivider />

      <EventsGrid />

      <SectionDivider variant="dots" />

      <FaqSection category="locations" title="Location FAQs" />
    </main>
  );
}
