import { notFound } from "next/navigation";
import { VehicleDetail } from "@/components/sections/vehicle-detail";
import { FleetPreview } from "@/components/sections/fleet-preview";
import { WhySection } from "@/components/sections/content-features";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import {
  getSimilarVehiclesByType,
  getVehiclebySlug,
  getVehiclesByCapacityRange,
} from "@/lib/data/vehicles";
import { getReviews } from "@/lib/data/reviews";
import { TriviaBookingSection } from "@/components/sections/trivia-booking-section";
import { SectionDivider } from "@/components/layout/section-dividers";
import { VehicleTypeIntro } from "@/components/sections/vehicle-type-intro";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { toPublicStorageUrl } from "@/lib/helpers/storage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehiclebySlug(slug);

  if (!vehicle) {
    return pageMetadata({
      title: "Vehicle Not Found",
      description: "This vehicle doesn't exist or may have moved.",
      noIndex: true,
    });
  }

  const primaryImage = vehicle.images?.[0]
    ? toPublicStorageUrl("vehicles1", vehicle.images[0])
    : undefined;

  const typeLabel =
    vehicle.type === "party-bus"
      ? "Party Bus"
      : vehicle.type === "limo"
        ? "Limo"
        : "Coach Bus";

  return pageMetadata({
    title: `${vehicle.name ?? typeLabel} Rental`,
    description:
      (vehicle.description ?? "").trim() ||
      `Browse details, photos, and amenities for this ${typeLabel.toLowerCase()}.`,
    path: `/vehicles/${vehicle.slug}`,
    openGraphImages: primaryImage ? [primaryImage] : undefined,
  });
}

const VEHICLE_TRIVIA = [
  { id: "vt1", question: "What's the most popular booking day?", answer: "Saturdays account for 65% of all rentals, but Thursday and Sunday bookings often get better rates!", category: "Booking Tip" },
  { id: "vt2", question: "How early should I book for prom?", answer: "6-8 weeks ahead is ideal. Last-minute bookings may have limited vehicle choices.", category: "Timing" },
  { id: "vt3", question: "What's included in the rental?", answer: "Professional chauffeur, fuel, and vehicle cleaning. Gratuity is typically 15-20% extra.", category: "Pricing" },
  { id: "vt4", question: "Can I bring my own drinks?", answer: "Yes! Most party buses allow BYOB. We provide ice and cups on request.", category: "Amenities" },
];

async function getVehicleData(slug: string) {
  const vehicle = await getVehiclebySlug(slug);

  if (!vehicle) return null;

  const related =
    (await getSimilarVehiclesByType(vehicle.type, vehicle.id, 3)) ?? [];

  const reviews = (await getReviews()) ?? [];

  const capacityNum = parseInt(vehicle.capacity?.replace("pax", "") || "0", 10);
  const minCapacity = Math.max(capacityNum - 8, 6);
  const maxCapacity = capacityNum + 8;
  const similarByCapacity = capacityNum > 0 
    ? (await getVehiclesByCapacityRange(minCapacity, maxCapacity, vehicle.id, 4)) ?? []
    : [];

  return { vehicle, related, reviews, similarByCapacity };
}

export default async function VehiclePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getVehicleData(slug);

  if (!data) return notFound();

  const { vehicle, related, reviews, similarByCapacity } = data;

  const categoryTitle =
    vehicle.type === "party-bus"
      ? "Party Buses"
      : vehicle.type === "limo"
        ? "Limousines"
        : "Coach Buses";

  const categorySlug = categoryTitle.toLowerCase().replace(" ", "-");

  const linkToSameTypeFleetPage =
    vehicle.type === "limo"
      ? "limousines"
      : vehicle.type === "party-bus"
        ? "party-buses"
        : vehicle.type === "coach"
          ? "coach-buses"
          : "fleet";

  const pollCategories =
    vehicle.type === "party-bus"
      ? (["party-bus", "limo", "coach-bus"] as const)
      : vehicle.type === "coach"
        ? (["coach-bus", "party-bus", "limo"] as const)
        : (["limo", "party-bus", "coach-bus"] as const);

  const otherTypes = [
    vehicle.type !== "limo" && "limo",
    vehicle.type !== "coach" && "coach",
    vehicle.type !== "party-bus" && "party-bus",
  ].filter(Boolean) as string[];

  return (
    <main className="bg-[#0a1628]">
      <VehicleDetail vehicle={vehicle} />

      <SectionDivider variant="glow" />

      <WhySection slug={categorySlug} />

      <SectionDivider variant="gradient" />

      {related.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-[#0E1F46] to-[#0a1628]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold tracking-[0.2em] uppercase text-blue-300">
                Explore Similar
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
                Other {categoryTitle} You&apos;ll Love
              </h2>
              <p className="mt-2 text-white/60 max-w-xl mx-auto">
                Browse more {categoryTitle.toLowerCase()} with similar features and capacity
              </p>
            </div>
            <FleetPreview
              vehicles={related}
              showNavigation={false}
              viewAllLink={related[0].type as string}
            />
            <div className="mt-8 text-center">
              <a
                href={`/${linkToSameTypeFleetPage}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-105"
              >
                <span>See All {categoryTitle}</span>
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>
        </section>
      )}

      <SectionDivider variant="dots" />

      {similarByCapacity.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-[#0a1628] to-[#0d1d3a]">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-bold tracking-[0.2em] uppercase text-purple-300">
                Similar Capacity
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
                Vehicles for Groups of {parseInt(vehicle.capacity?.replace("pax", "") || "0", 10) - 5}–{parseInt(vehicle.capacity?.replace("pax", "") || "0", 10) + 5}
              </h2>
              <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
                Other options that fit a similar group size. Explore our full fleet to find the perfect vehicle for your event.
              </p>
            </div>
            <FleetPreview
              vehicles={similarByCapacity}
              showNavigation={false}
              viewAllLink="fleet"
            />
            <div className="mt-10 text-center">
              <a
                href="/fleet"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-lg shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105"
              >
                <span>See All Vehicles</span>
                <span className="text-2xl">→</span>
              </a>
            </div>
          </div>
        </section>
      )}

      <SectionDivider variant="glow" />

      <TriviaBookingSection
        triviaItems={VEHICLE_TRIVIA}
        title="Vehicle Rental Trivia"
        subtitle="Quick facts to help you plan"
        bookingTitle="How to Book This Vehicle"
      />

      <SectionDivider variant="gradient" />

      {otherTypes.map((type, idx) => (
        <div key={type}>
          <VehicleTypeIntro vehicleType={type} />
          {idx < otherTypes.length - 1 && <SectionDivider variant="dots" />}
        </div>
      ))}

      <SectionDivider variant="glow" />

      <ReviewsSection reviews={reviews} />
      <PollsGrid columnCategories={[...pollCategories]} hideCities />
      <ToolsGrid category="pricing" />
      <EventsGrid />
      <FaqSection
        category={vehicle.type as string}
        title={`${categoryTitle} FAQs`}
      />
    </main>
  );
}
