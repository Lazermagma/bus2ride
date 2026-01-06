import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { getEvents } from "@/lib/data/events";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { EventsGridClient } from "@/components/sections/events-grid.client";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { pageMetadata } from "@/lib/seo/metadata";
import { Sparkles } from "lucide-react";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Browse event guides for weddings, bachelor(ette) parties, proms, nights out, and more — with route tips and booking playbooks.",
  path: "/events",
});

const EVENT_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What's the most popular event type for party bus rentals?",
    answer: "Bachelorette parties take the crown at 28% of all bookings! Bachelor parties (18%), birthdays (17%), and proms (15%) round out the top four.",
    category: "Statistics",
    source: "Party Bus Industry Survey 2024",
  },
  {
    id: "2",
    question: "The average bachelorette party has how many stops?",
    answer: "The typical bachelorette party bar crawl includes 4-6 stops over 5 hours. Nashville leads with an average of 6.2 stops, while Vegas averages just 3.4 (but longer at each!).",
    category: "Fun Fact",
    source: "Bachelorette Travel Report",
  },
  {
    id: "3",
    question: "What percentage of prom-goers arrive in a limousine?",
    answer: "Approximately 35% of prom attendees rent limousines or party buses, up from 22% in 2010. Group rentals have driven this increase.",
    category: "Trends",
    source: "Prom Industry Analysis",
  },
  {
    id: "4",
    question: "Wedding transportation is booked how far in advance on average?",
    answer: "8-12 weeks ahead of the wedding date. However, premium vehicles during peak wedding season (June and October) often book 4-6 months in advance.",
    category: "Planning",
    source: "Wedding Wire Survey",
  },
];

const EVENT_FACTS: FactItem[] = [
  {
    id: "1",
    stat: "28%",
    label: "Bachelorette parties lead",
    description: "More than a quarter of all party bus bookings are for bachelorette celebrations.",
    icon: "users",
    category: "stat",
  },
  {
    id: "2",
    stat: "72%",
    label: "Weddings choose limos",
    description: "Nearly three-quarters of brides select limousine transportation for their special day.",
    icon: "star",
    category: "stat",
  },
  {
    id: "3",
    stat: "5.2 hrs",
    label: "Average event rental",
    description: "The typical event rental lasts just over 5 hours, perfect for most celebrations.",
    icon: "clock",
    category: "insight",
  },
  {
    id: "4",
    stat: "4-6",
    label: "Average stops per trip",
    description: "Most bar crawls and night-out events include 4-6 venue stops during their rental.",
    icon: "location",
    category: "insight",
  },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/party-buses", label: "Party Bus Fleet", description: "Perfect for high-energy celebrations", category: "fleet" },
  { href: "/limousines", label: "Limousine Collection", description: "Elegant transportation for special occasions", category: "fleet" },
  { href: "/pricing", label: "Event Pricing", description: "Get quotes for your specific event", category: "resources" },
  { href: "/tools", label: "Planning Tools", description: "Calculators and checklists", category: "tools" },
  { href: "/locations", label: "Service Areas", description: "Find coverage in your city", category: "locations" },
  { href: "/blog", label: "Planning Tips", description: "Expert advice for your event", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.theknot.com/", label: "Wedding Planning Resources", source: "The Knot" },
  { href: "https://www.brides.com/", label: "Bridal Inspiration", source: "Brides Magazine" },
  { href: "https://www.pinterest.com/", label: "Event Ideas & Inspiration", source: "Pinterest" },
];

export default async function EventsPage() {
  const events = (await getEvents()) ?? [];
  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="events" />

      <section className="relative py-16 md:py-20 bg-gradient-to-b from-[#0a1628] to-[#060e23]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-300">
                Browse & Search
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Find Your Event Guide
            </h2>
            <p className="text-blue-200/70 max-w-2xl mx-auto">
              Jump to your event type or search by name. Each guide includes route tips, 
              timing recommendations, and booking playbooks.
            </p>
          </div>

          <EventsGridClient events={events} />
        </div>
      </section>

      <PremiumDivider />

      <FactsShowcase
        facts={EVENT_FACTS}
        title="Event Transportation Insights"
        subtitle="Interesting statistics about celebration transportation"
      />

      <SectionDivider variant="gradient" />

      <TriviaBookingSection
        triviaItems={EVENT_TRIVIA}
        title="Event Planning Trivia & How to Book"
        subtitle="Fun facts about celebrations and our simple booking process"
        bookingTitle="How to Book Event Transportation"
      />

      <SectionDivider variant="dots" />

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <PremiumDivider />

      <PollsGrid
        columnCategories={["weddings", "concerts", "sporting-events"]}
        hideCities
        title="Event Transportation Polls"
      />

      <SectionDivider variant="glow" />

      <FleetSection />

      <SectionDivider variant="gradient" />

      <ToolsGrid category="events" />

      <PremiumDivider />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Continue Planning"
      />

      <SectionDivider variant="dots" />

      <FaqSearchSection
        category="events"
        title="Event planning, timing & logistics"
        aboveTitle="Event FAQ"
        description="Search answers about planning timelines, group coordination, venue pickups, and celebration logistics."
        inputPlaceholder='Try "wedding timeline", "prom rules", "bar crawl"…'
      />
    </main>
  );
}
