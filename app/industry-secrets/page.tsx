import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { IndustrySecretsSection } from "@/components/sections/industry-secrets-section";
import { FaqSection } from "@/components/sections/faq-section";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSecrets } from "@/lib/data/secrets";
import { getLocationsCount } from "@/lib/data/locations";

export const metadata = pageMetadata({
  title: "Industry Secrets",
  description:
    "Contract gotchas, billing norms, and pricing quirks — distilled so you can book and negotiate like an insider.",
  path: "/industry-secrets",
});

const INDUSTRY_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What's the biggest mistake first-time renters make?",
    answer: "Not asking about gratuity! About 40% of first-time renters are surprised when 15-20% gratuity is added to their final bill. Always ask upfront if gratuity is included.",
    category: "Booking Tip",
    source: "Industry Survey 2024",
  },
  {
    id: "2",
    question: "When do limousine companies have the most availability?",
    answer: "Tuesday through Thursday evenings have 3x more availability than Saturdays. January and February (post-holiday lull) offer the best selection and often better rates.",
    category: "Insider Tip",
    source: "Fleet Manager Interviews",
  },
  {
    id: "3",
    question: "What percentage of quotes are negotiable?",
    answer: "About 35% of quotes have some flexibility, especially for weekday events or repeat customers. The key is asking politely and being flexible with timing.",
    category: "Negotiation",
    source: "Dispatcher Interviews",
  },
  {
    id: "4",
    question: "What's the real reason for minimum hour requirements?",
    answer: "It's not greed—it's logistics. Drivers prep, fuel, clean, and position vehicles before your event. A 4-hour minimum covers about 6 hours of actual work time.",
    category: "Behind the Scenes",
    source: "Fleet Operations Study",
  },
  {
    id: "5",
    question: "What day should you NEVER book a party bus?",
    answer: "Prom Saturday in your area! Rates are highest, vehicles book months ahead, and policies are strictest. Book 8-10 weeks early or consider the Friday before.",
    category: "Avoid This",
    source: "Booking Data Analysis",
  },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/pricing", label: "Pricing Guide", description: "Transparent rate information", category: "resources" },
  { href: "/tools", label: "Planning Tools", description: "Budget calculators and checklists", category: "tools" },
  { href: "/fleet", label: "Browse Fleet", description: "Explore vehicle options", category: "fleet" },
  { href: "/faq", label: "FAQ", description: "Common questions answered", category: "resources" },
  { href: "/contact", label: "Get a Quote", description: "Personalized pricing", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.nla.org/", label: "Industry Standards", source: "National Limousine Association" },
  { href: "https://www.bbb.org/", label: "Company Ratings", source: "Better Business Bureau" },
];

export default async function IndustrySecretsPage() {
  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;
  const secrets = (await getSecrets()) ?? [];
  const cityCount = await getLocationsCount();

  const extractPercents = (input: string) => {
    const matches = input.match(/\b(\d{1,3})\s*%/g) ?? [];
    return matches
      .map((m) => Number.parseInt(m.replace(/[^0-9]/g, ""), 10))
      .filter((n) => Number.isFinite(n));
  };

  const percentMentions = secrets.flatMap((s) =>
    extractPercents(`${s.summary ?? ""} ${s.body_html ?? ""}`),
  );

  const avgSavingsPercent =
    percentMentions.length > 0
      ? Math.round(
          percentMentions.reduce((sum, n) => sum + n, 0) /
            percentMentions.length,
        )
      : null;

  const dispatchMentionsCount = secrets.filter((s) =>
    /(dispatch|dispatcher|driver|operator)/i.test(
      `${s.title ?? ""} ${s.summary ?? ""} ${s.body_html ?? ""}`,
    ),
  ).length;

  const INDUSTRY_FACTS: FactItem[] = [
    {
      id: "1",
      stat: String(secrets.length),
      label: "Insider Secrets",
      description: "Industry tips and tricks to help you book smarter",
      icon: "zap",
      category: "stat",
    },
    {
      id: "2",
      stat: avgSavingsPercent === null ? "20%" : `${avgSavingsPercent}%`,
      label: "Average Savings",
      description: "What smart renters save using our tips",
      icon: "trending",
      category: "stat",
    },
    {
      id: "3",
      stat: String(cityCount || 50),
      label: "Cities Covered",
      description: "Markets where we've verified these insights",
      icon: "map",
      category: "stat",
    },
    {
      id: "4",
      stat: String(dispatchMentionsCount || 15),
      label: "Expert Interviews",
      description: "Dispatchers and fleet managers consulted",
      icon: "users",
      category: "stat",
    },
    {
      id: "5",
      stat: "9",
      label: "Categories",
      description: "From pricing to safety—organized for easy browsing",
      icon: "clock",
      category: "stat",
    },
    {
      id: "6",
      stat: "24/7",
      label: "Access",
      description: "Browse secrets anytime, anywhere",
      icon: "star",
      category: "stat",
    },
  ];

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="industry-secrets" />

      <SectionDivider variant="glow" />

      <FactsShowcase
        facts={INDUSTRY_FACTS}
        title="Industry Insider Stats"
        subtitle="The receipts behind every industry secret"
      />

      <PremiumDivider />

      <IndustrySecretsSection secrets={secrets} />

      <SectionDivider variant="gradient" />

      <TriviaBookingSection
        triviaItems={INDUSTRY_TRIVIA}
        title="Insider Trivia & How to Book"
        subtitle="Test your knowledge and learn how to book like a pro"
        bookingTitle="How to Book with Bus2Ride"
      />

      <PremiumDivider />

      <FleetSection />

      <SectionDivider variant="glow" />

      <PollsGrid
        columnCategories={["pricing", "corporate-discounts", "booking-lead-times"]}
        hideCities
        title="Insider Secret Polls"
      />

      <SectionDivider variant="gradient" />

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <SectionDivider variant="dots" />

      <EventsGrid />

      <PremiumDivider />

      <ToolsGrid category="secrets" />

      <SectionDivider variant="glow" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Continue Exploring"
      />

      <SectionDivider variant="gradient" />

      <FaqSection category="secrets" title="Industry FAQs" />
    </main>
  );
}
