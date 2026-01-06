import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import { getEventBySlug } from "@/lib/data/events";
import { notFound } from "next/navigation";
import FleetSection from "@/components/sections/fleet-section";
import Hero from "@/components/layout/hero";
import EventQuickPlanner from "@/components/sections/event-quick-planner.client";
import { EventGuide } from "@/components/sections/event-guide";
import { EventIntelCard } from "@/components/sections/event-intel-card";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { InstantQuoteButton } from "@/components/InstantQuoteButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const MOCK_EVENT_INTEL: Record<string, {
  quickFacts: { text: string }[];
  trivia: { question: string; answer: string }[];
  proTips: { text: string }[];
}> = {
  "haunted-houses": {
    quickFacts: [
      { text: "Most popular nights: the last 2 Fridays & Saturdays before Halloween." },
      { text: "Average walkthrough time: 20–35 minutes per attraction, not counting the line." },
      { text: "Top add-ons: photo ops, themed bars, escape rooms, and 'no-scare' zones." },
      { text: "Rain usually doesn't cancel haunts—just expect muddier paths and longer lines." },
      { text: "VIP passes can reduce wait times by up to 70% on peak nights." },
    ],
    trivia: [
      { question: "What's the busiest hour of the night for most haunted houses?", answer: "Usually 8:30–10:00 PM—perfect time to already be inside, not still parking." },
      { question: "What's the #1 thing people say they regret?", answer: "Booking too few hours and having to cut the last stop or rush the food break." },
      { question: "Which scares people more: chainsaws or clowns?", answer: "In most polls, clowns win by a hair. Chainsaws just make everybody run." },
    ],
    proTips: [
      { text: "Pick a 'calm buddy' in each friend group to watch for anxiety or motion sickness." },
      { text: "Take a group photo before the first haunt—faces get progressively more destroyed." },
      { text: "Keep the bus as the 'safe zone': music, snacks, and a place to breathe between scares." },
      { text: "Save the most intense haunt for the middle of the night, not the very end." },
      { text: "If anyone has epilepsy, heart conditions, or sensory triggers, plan quiet breaks." },
    ],
  },
  "default": {
    quickFacts: [
      { text: "Weekend bookings fill up 2-3 weeks in advance during peak season." },
      { text: "Average event duration: 4-6 hours including travel time between stops." },
      { text: "Most popular add-ons: photo packages, custom decorations, and refreshment coolers." },
      { text: "Group coordination apps help keep everyone on schedule and connected." },
    ],
    trivia: [
      { question: "What's the most common planning mistake?", answer: "Underestimating travel time between venues—always add a 15-minute buffer." },
      { question: "What makes group transport better than rideshare?", answer: "Everyone arrives together, no one gets lost, and the party starts in the vehicle." },
      { question: "When should you book for best selection?", answer: "2-3 weeks ahead for weekends, 1 week for weekdays during off-peak seasons." },
    ],
    proTips: [
      { text: "Designate a 'point person' who has the driver's contact info." },
      { text: "Share the itinerary with all guests at least 24 hours before the event." },
      { text: "Keep essential items (IDs, phones, jackets) on the bus between stops." },
      { text: "Build in a food stop—hungry guests are grumpy guests." },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return pageMetadata({
      title: "Event Not Found",
      description: "This event page doesn't exist or may have moved.",
      noIndex: true,
    });
  }

  const ogImage = event.images?.[0]
    ? toPublicStorageUrl("Events1", event.images[0])
    : undefined;

  return pageMetadata({
    title: event.title ?? "Event",
    description: (event.description ?? "").trim() || undefined,
    path: `/events/${event.slug}`,
    openGraphImages: ogImage ? [ogImage] : undefined,
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;
  const intel = MOCK_EVENT_INTEL[slug] || MOCK_EVENT_INTEL["default"];

  return (
    <main>
      <Hero slug={event.slug} />

      {/* Event Content + Quick Planner */}
      <section className="bg-gradient-to-b from-[#0a1628] to-[#122a56] py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <article
            className="lg:col-span-2 rounded-3xl border border-blue-500/30 
              bg-gradient-to-br from-[#0d1d3a]/90 to-[#173264]/80 
              backdrop-blur-sm p-8 shadow-2xl shadow-blue-900/20
              prose prose-lg prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
              prose-p:text-slate-200/90 prose-p:leading-relaxed
              prose-a:text-sky-300 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-hr:border-white/10
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-li:text-slate-200/90 prose-li:marker:text-blue-400
              space-y-6"
            dangerouslySetInnerHTML={{ __html: event.page_content ?? "" }}
          />
          <EventQuickPlanner eventSlug={event.slug} />
        </div>
      </section>

      <SectionDivider variant="glow" />

      {/* Event Guide */}
      <EventGuide 
        eventSlug={event.slug} 
        eventTitle={event.title ?? "Event"} 
      />

      <SectionDivider variant="gradient" />

      {/* Party Buses + Quick Facts */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-pink-300/80 mb-3">
              PARTY ON WHEELS
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Party Buses for {event.title}
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Keep the energy high with LED lights, premium sound systems, and room for your whole crew.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FleetSection showPartyBuses showLimousines={false} showCoachBuses={false} compact />
            </div>
            <EventIntelCard
              type="quick-facts"
              title={`${event.title} by the numbers`}
              subtitle="Key stats to help you plan"
              items={intel.quickFacts}
            />
          </div>
        </div>
      </section>

      <SectionDivider variant="dots" />

      {/* Limousines + Trivia */}
      <section className="py-16 bg-gradient-to-b from-[#0d1d3a] to-[#122a56]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300/80 mb-3">
              ELEGANT ARRIVALS
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Limousines for {event.title}
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Make a statement with classic elegance and VIP treatment for smaller groups.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <EventIntelCard
              type="trivia"
              title="Bus-ride conversation starters"
              subtitle="Fun facts to share with your group"
              items={intel.trivia}
              className="order-2 lg:order-1"
            />
            <div className="lg:col-span-2 order-1 lg:order-2">
              <FleetSection showPartyBuses={false} showLimousines showCoachBuses={false} compact />
            </div>
          </div>
        </div>
      </section>

      <PremiumDivider />

      {/* Coach Buses + Pro Tips */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300/80 mb-3">
              BIG GROUP COMFORT
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Coach Buses for {event.title}
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Transport large groups in comfort with professional drivers and modern amenities.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FleetSection showPartyBuses={false} showLimousines={false} showCoachBuses compact />
            </div>
            <EventIntelCard
              type="pro-tips"
              title="Keep everyone happy"
              subtitle="Expert advice from our planners"
              items={intel.proTips}
            />
          </div>
        </div>
      </section>

      <SectionDivider variant="glow" />

      {/* Polls */}
      <PollsGrid
        columnCategories={["weddings", "concerts", "sporting-events"]}
        hideCities
        title="Event Polls"
      />

      {/* Tools */}
      <ToolsGrid category="events" />

      {/* Reviews */}
      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      {/* FAQs */}
      <FaqSection category="events" title={`${event.title} Transport FAQs`} />

      <SectionDivider variant="gradient" />

      {/* Other Events */}
      <EventsGrid 
        excludeSlug={event.slug} 
        title="Other Events We Transport"
        subtitle="From weddings to wine tours, we've got your group covered."
      />

      {/* Ready to ride CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div
          className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800
            border border-blue-400/30 shadow-[0_6px_18px_-2px_rgba(0,0,0,.4)]
            p-8 md:p-10 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
            Ready to book your {event.title?.toLowerCase()} transport?
          </h3>
          <p className="text-blue-100/90 mb-6 max-w-2xl mx-auto">
            Lock in your itinerary before the best dates fill up. Our team is ready to help plan your perfect outing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InstantQuoteButton 
              source={`Event - ${event.title}`}
              size="lg"
              className="px-8 py-4 text-base rounded-full shadow-lg"
            />
            <a
              href="tel:8885352566"
              className="rounded-full font-bold px-8 py-4 text-base shadow-lg
                transition border flex items-center justify-center bg-blue-600
                text-white border-blue-700 hover:bg-blue-700"
            >
              Talk to a Planner
            </a>
            <a
              href="/fleet"
              className="rounded-full font-bold px-8 py-4 text-base shadow-lg
                transition border flex items-center justify-center bg-blue-800/80
                text-white border-blue-900 hover:bg-blue-900"
            >
              Browse Fleet
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
