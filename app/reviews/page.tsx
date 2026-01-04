import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Reviews",
  description:
    "Read verified rider reviews and see why groups trust Bus2Ride for party buses, limos, and coach buses.",
  path: "/reviews",
});

const REVIEW_FACTS: FactItem[] = [
  {
    id: "1",
    stat: "4.9/5",
    label: "Average Rating",
    description: "Our customers consistently rate their experiences highly, with over 94% giving 5-star reviews.",
    icon: "star",
    category: "stat",
  },
  {
    id: "2",
    stat: "10,000+",
    label: "Happy Customers",
    description: "We've helped over 10,000 groups celebrate their special occasions with reliable transportation.",
    icon: "users",
    category: "stat",
  },
  {
    id: "3",
    stat: "94%",
    label: "Would Recommend",
    description: "The vast majority of our customers say they would recommend Bus2Ride to friends and family.",
    icon: "trending",
    category: "stat",
  },
  {
    id: "4",
    stat: "98%",
    label: "On-Time Arrivals",
    description: "Our professional chauffeurs maintain an exceptional on-time record for pickups and events.",
    icon: "clock",
    category: "insight",
  },
  {
    id: "5",
    stat: "500+",
    label: "Reviews This Year",
    description: "Real feedback from real customers across all vehicle types and event categories.",
    icon: "zap",
    category: "stat",
  },
  {
    id: "6",
    stat: "24/7",
    label: "Support Available",
    description: "Our team is here around the clock to ensure your experience exceeds expectations.",
    icon: "star",
    category: "stat",
  },
];

const REVIEW_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What event type gets the most 5-star reviews?",
    answer: "Weddings! Couples consistently rate their wedding transportation experience highest, with 97% giving 5 stars. The key factors: on-time arrival, clean vehicles, and professional chauffeurs.",
    category: "Fun Fact",
    source: "Customer Data 2024",
  },
  {
    id: "2",
    question: "What's the #1 thing customers mention in reviews?",
    answer: "The driver! Over 78% of positive reviews specifically mention their chauffeur by name. A great driver transforms good transportation into an unforgettable experience.",
    category: "Insight",
    source: "Review Analysis",
  },
  {
    id: "3",
    question: "How long does the average customer take to leave a review?",
    answer: "Most reviews are submitted within 48 hours of the event. The best experiences inspire immediate feedback—when you're excited, you want to share!",
    category: "Behind the Scenes",
    source: "Platform Analytics",
  },
  {
    id: "4",
    question: "What vehicle type has the highest satisfaction score?",
    answer: "Party buses lead with a 4.95/5 average rating! The combination of space, amenities, and entertainment creates memorable group experiences that customers love.",
    category: "Stats",
    source: "Customer Surveys",
  },
  {
    id: "5",
    question: "What percentage of customers become repeat bookers?",
    answer: "A impressive 34% of customers book with us again within 2 years. Many become annual customers for recurring events like proms, corporate outings, and birthday celebrations.",
    category: "Loyalty",
    source: "Booking Data",
  },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/fleet", label: "Browse Our Fleet", description: "See the vehicles our customers love", category: "fleet" },
  { href: "/pricing", label: "Get Pricing", description: "Transparent rates for every budget", category: "resources" },
  { href: "/contact", label: "Request a Quote", description: "Start planning your event", category: "resources" },
  { href: "/events", label: "Event Ideas", description: "Find inspiration for your celebration", category: "events" },
  { href: "/locations", label: "Service Areas", description: "Check coverage in your city", category: "locations" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.google.com/maps", label: "Google Reviews", source: "Google" },
  { href: "https://www.yelp.com/", label: "Yelp Reviews", source: "Yelp" },
  { href: "https://www.bbb.org/", label: "BBB Rating", source: "Better Business Bureau" },
];

export default async function ReviewsPage() {
  const reviews = (await getReviews(100)) ?? [];

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="reviews" />

      <SectionDivider variant="glow" />

      <FactsShowcase
        facts={REVIEW_FACTS}
        title="Why Customers Love Us"
        subtitle="The numbers behind our customer satisfaction"
      />

      <PremiumDivider />

      <ReviewsSection reviews={reviews} title="All Customer Reviews" />

      <SectionDivider variant="gradient" />

      <TriviaBookingSection
        triviaItems={REVIEW_TRIVIA}
        title="Review Trivia & How to Book"
        subtitle="Fun facts about our reviews and step-by-step booking guide"
        bookingTitle="How to Book with Bus2Ride"
      />

      <PremiumDivider />

      <FleetSection />

      <SectionDivider variant="dots" />

      <PollsGrid
        columnCategories={["weddings", "bachelorette-parties", "prom"]}
        hideCities
        title="Customer Polls"
      />

      <SectionDivider variant="glow" />

      <BookingProcessSection />

      <PremiumDivider />

      <EventsGrid />

      <SectionDivider variant="gradient" />

      <ToolsGrid category="reviews" />

      <SectionDivider variant="dots" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Ready to Experience It Yourself?"
      />

      <PremiumDivider />

      <FaqSection category="reviews" title="Reviews & Trust FAQ" />
    </main>
  );
}
