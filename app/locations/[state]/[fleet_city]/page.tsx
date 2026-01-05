import { notFound } from "next/navigation";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { LocationPollsGrid } from "@/components/sections/location-polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";

import FleetSection from "@/components/sections/fleet-section";
import LocationReadyToPlan from "@/components/sections/location-ready-to-plan";
import LocationWhyBook from "@/components/sections/location-why-book";
import LocationHowToBook from "@/components/sections/location-how-to-book";
import LocationCitiesAcross from "@/components/sections/location-cities-across";
import LocationPlanningGuide from "@/components/sections/location-planning-guide";
import LocationCompleteGuide from "@/components/sections/location-complete-guide";
import LocationPlanningChecklist from "@/components/sections/location-planning-checklist";
import LocationTransportationOverview from "@/components/sections/location-transportation-overview";
import LocationExtraPlanningNotes from "@/components/sections/location-extra-planning-notes";
import LocationTopHotspots from "@/components/sections/location-top-hotspots";
import LocationComfortChecklist from "@/components/sections/location-comfort-checklist";
import Hero from "@/components/layout/hero";
import Link from "next/link";
import { OtherFleets } from "@/components/sections/content-with-images";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { getRandomVehiclesImages } from "@/lib/data/vehicles";
import { getLocationWithContent } from "@/lib/data/locations";
import { LocationFleetNav } from "@/components/sections/location-fleet-nav";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

type FleetType = "party-buses" | "limousines" | "coach-buses";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; fleet_city: string }>;
}): Promise<Metadata> {
  const { state, fleet_city } = await params;
  const fleetType =
    (fleet_city.match(
      /(party-buses)|(limousines)|(coach-buses)/g,
    )?.[0] as FleetType) ?? "party-buses";

  const city = fleet_city.replace(`${fleetType}-`, "");
  const location = await getLocationWithContent({
    slug: `${city}-${state}`,
    fleetType,
  });

  if (!location) {
    return pageMetadata({
      title: "Location Not Found",
      description: "This location page doesn’t exist or may have moved.",
      noIndex: true,
    });
  }

  const fleetLabel =
    fleetType === "party-buses"
      ? "Party Bus"
      : fleetType === "limousines"
        ? "Limo"
        : "Coach Bus";

  const title = `${fleetLabel} Rentals in ${location.city_name}, ${location.state_name}`;
  const description =
    location.header?.description ??
    `Compare ${fleetLabel.toLowerCase()} options in ${location.city_name}, ${location.state_name}. Browse amenities, group sizes, and booking tips.`;

  return pageMetadata({
    title,
    description,
    path: `/locations/${location.state_slug}/${fleetType}-${location.city_slug}`,
  });
}

export default async function FleetCityPage({
  params,
}: {
  params: Promise<{ state: string; fleet_city: string }>;
}) {
  const { state, fleet_city } = await params;

  const fleetType =
    (fleet_city.match(
      /(party-buses)|(limousines)|(coach-buses)/g,
    )?.[0] as FleetType) ?? "party-buses";

  const city = fleet_city.replace(`${fleetType}-`, "");

  const location = await getLocationWithContent({
    slug: `${city}-${state}`,
    fleetType: fleetType,
  });

  if (!location) return notFound();

  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;

  const fleetTypeMap = {
    "party-buses": "party-bus",
    limousines: "limo",
    "coach-buses": "coach",
  } as const;

  const vehicles_images = (await getRandomVehiclesImages(12, fleetType)) ?? [];

  return (
    <main>
      {/* Hero Section */}
      <Hero slug={location.city_slug} />

      {/* Fleet Type Navigation */}
      <LocationFleetNav currentType={fleetType} location={location} />

      <LocationWhyBook location={location} />

      <FleetSection
        showPartyBuses={fleetType === "party-buses"}
        showLimousines={fleetType === "limousines"}
        showCoachBuses={fleetType === "coach-buses"}
        location={{ stateSlug: state, citySlug: city }}
      />

      <LocationHowToBook location={location} />

      <LocationCitiesAcross location={location} />

      <LocationPlanningGuide location={location} />

      <LocationCompleteGuide location={location} />

      <section className="max-w-7xl mx-auto my-8 px-6 space-y-8">
        <div
          className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-400
            text-black p-6 shadow-lg flex flex-col sm:flex-row items-center
            justify-between gap-4"
        >
          <div className="text-sm sm:text-base font-semibold">
            Ready to lock a vehicle for {location.city_name}? Get an instant
            quote with driver notes and aurora-flex options.
          </div>
          <div className="flex gap-3">
            <Link
              href="/contact"
              aria-label="Get an instant quote"
              className="inline-block rounded-full bg-black text-yellow-300
                font-bold px-5 py-3 shadow hover:brightness-95 transition"
            >
              ⚡ Instant Quote
            </Link>
            <Link
              href="tel:8885352566"
              aria-label="Call to book"
              className="inline-block rounded-full bg-white text-blue-900
                font-bold px-5 py-3 shadow hover:opacity-95 transition text-sm"
            >
              📞 Call (888) 535-2566
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <LocationPlanningChecklist location={location} />

      <LocationTransportationOverview location={location} />

      <LocationExtraPlanningNotes location={location} />

      <LocationTopHotspots location={location} />

      <LocationComfortChecklist
        location={location}
        vehicles_images={vehicles_images}
      />

      {/* Other fleet types - moved below main content */}
      <OtherFleets currentType={fleetTypeMap[fleetType]} location={location} />

      <LocationPollsGrid
        cityName={location.city_name}
        stateName={location.state_name}
        title={`${location.city_name} Transportation Polls`}
      />

      <ToolsGrid category={location.city_slug} />

      <EventsGrid />

      <FaqSearchSection
        category={location.city_slug ?? "home"}
        title={`${location.city_name} FAQs`}
      />

      <LocationReadyToPlan location={location} />
    </main>
  );
}
