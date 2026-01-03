import { Suspense } from "react";
import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { getReviews } from "@/lib/data/reviews";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import FleetSection from "@/components/sections/fleet-section";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { pageMetadata } from "@/lib/seo/metadata";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { FactsShowcase } from "@/components/sections/facts-showcase";
import { getFacts } from "@/lib/data/facts";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { GlobalCTAs } from "@/components/GlobalCTAs";

export const revalidate = 300;

const TRIVIA_ITEMS: TriviaItem[] = [
  {
    id: "1",
    question: "What's the most popular party bus rental occasion in America?",
    answer: "Bachelor and bachelorette parties account for 34% of all party bus bookings, followed by birthday celebrations at 28%.",
    category: "Industry Trends",
    source: "Transportation Association 2024",
  },
  {
    id: "2",
    question: "How much can you save by booking a party bus vs individual rideshares?",
    answer: "Groups of 15+ typically save 40-60% compared to booking individual Ubers or Lyfts for the same route.",
    category: "Money Saver",
    source: "Consumer Reports",
  },
  {
    id: "3",
    question: "What's the average length of a party bus rental?",
    answer: "4-5 hours is the sweet spot. Shorter rentals feel rushed, while longer ones often have unused time.",
    category: "Booking Tips",
    source: "Bus2Ride Booking Data",
  },
  {
    id: "4",
    question: "When did luxury limousines become popular for weddings?",
    answer: "The 1920s! Wealthy families started using chauffeur-driven vehicles for weddings during the Roaring Twenties.",
    category: "History",
    source: "Automotive History Museum",
  },
  {
    id: "5",
    question: "What's the largest party bus ever built?",
    answer: "A 70-passenger double-decker party bus in Las Vegas featuring a rooftop lounge and two full bars.",
    category: "Fun Fact",
    source: "Vegas Transportation Guide",
  },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "why-bus2ride",
    title: "Why Choose Bus2Ride for Group Transportation?",
    content: `When it comes to group transportation, the difference between an ordinary experience and an extraordinary one often comes down to the details. Bus2Ride has spent over a decade perfecting those details, building a network of premium vehicles and professional drivers that transforms group travel from a logistical headache into a genuine highlight of any event.<br><br>Our fleet includes everything from intimate 15-passenger party buses perfect for bachelorette parties to spacious 50-passenger coach buses ideal for corporate retreats. Every vehicle undergoes rigorous safety inspections, and our drivers complete extensive background checks and customer service training. We're not just moving people from point A to point B—we're creating experiences that guests remember long after the event ends.`,
  },
  {
    id: "party-bus-experience",
    title: "The Party Bus Experience",
    content: `Modern party buses bear little resemblance to their predecessors. Today's premium party buses feature state-of-the-art sound systems, LED lighting that syncs with music, comfortable leather seating, and climate control that keeps everyone comfortable regardless of the weather outside. Many include wet bars, dance poles, flat-screen TVs, and even laser light shows.<br><br>The real magic happens when your group steps aboard. There's something transformative about having your own mobile venue—no waiting for rideshares, no splitting up the group, no designated driver worries. The party starts the moment you board and continues until you reach your destination. For events like bachelor parties, birthday celebrations, and concert shuttles, a party bus doesn't just provide transportation—it becomes part of the entertainment itself.`,
  },
  {
    id: "limousine-elegance",
    title: "Limousine Elegance for Special Occasions",
    content: `Some occasions call for refined luxury rather than party atmosphere, and our limousine fleet delivers exactly that. From classic stretch limousines that add Hollywood glamour to any event, to sleek SUV limos that combine space with sophistication, we have options for every style preference.<br><br>Weddings remain our most popular limousine occasions, and for good reason. A luxury limousine provides the perfect backdrop for wedding photos, gives the bridal party a private space to relax between ceremony and reception, and ensures the newlyweds arrive in style. But limousines also elevate proms, anniversaries, corporate events, and airport transfers. When first impressions matter, nothing makes a statement quite like stepping out of a professionally chauffeured limousine.`,
  },
  {
    id: "coach-bus-travel",
    title: "Coach Buses for Extended Group Travel",
    content: `When your group needs to travel longer distances or prioritizes comfort over amenities, our coach bus fleet offers the perfect solution. These full-size coaches seat 40-56 passengers in airline-style reclining seats, with overhead storage, climate control, restrooms, and WiFi connectivity.<br><br>Corporate clients love coach buses for team retreats, conference shuttles, and client entertainment. Schools and universities rely on them for athletic team travel, field trips, and campus tours. Church groups use them for retreats and mission trips. Whatever your purpose, coach buses combine the efficiency of group travel with comfort that makes even long journeys enjoyable. Our drivers are specially trained for extended routes and know how to manage rest stops, meal breaks, and arrival timing to keep your group on schedule.`,
  },
  {
    id: "booking-process",
    title: "Our Simple Booking Process",
    content: `We've streamlined the booking process to get you from inquiry to confirmation in minutes, not days. Start by telling us your date, group size, and pickup/dropoff locations. Our system instantly shows available vehicles with transparent pricing—no hidden fees, no surprise charges, no bait-and-switch tactics.<br><br>Once you select a vehicle, you can customize your experience with add-ons like decorations, beverages, or extended hours. Our team reviews every booking personally to ensure we've matched you with the perfect vehicle for your needs. Most bookings are confirmed within hours, and you'll receive detailed information about your vehicle and driver as your event approaches.<br><br>Need to make changes? Our flexible policies allow modifications up to 72 hours before your event, and our support team is available 24/7 to handle any questions or concerns.`,
  },
  {
    id: "safety-standards",
    title: "Our Commitment to Safety & Quality",
    content: `Safety isn't just a checkbox at Bus2Ride—it's the foundation of everything we do. Every vehicle in our network carries comprehensive commercial insurance with $5 million in liability coverage. Our drivers undergo thorough background checks, drug testing, and defensive driving certification.<br><br>Beyond the basics, we maintain strict vehicle maintenance schedules that exceed DOT requirements. Our buses are inspected before and after every trip, with detailed logs maintained for every vehicle. We've never had a major safety incident in over a decade of operation, and we intend to keep that record perfect.<br><br>Quality extends beyond safety to the overall experience. Our vehicles are professionally cleaned and detailed between every rental. Climate control, sound systems, and lighting are tested to ensure everything works perfectly. When you book with Bus2Ride, you're getting a premium experience from start to finish.`,
  },
  {
    id: "pricing-transparency",
    title: "Transparent Pricing You Can Trust",
    content: `We believe you deserve to know exactly what you're paying for before you book. That's why we've built our pricing model around complete transparency. When you request a quote, you'll see a detailed breakdown of every cost: base hourly rate, fuel surcharges (if any), driver gratuity guidelines, and any applicable taxes or fees.<br><br>We also offer price matching on comparable vehicles and services. If you find a lower quote for a similar vehicle from a reputable operator, let us know and we'll do our best to match or beat it. Our goal isn't to be the cheapest option—it's to provide the best value for premium group transportation.`,
  },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/party-buses", label: "Party Bus Fleet", description: "Browse our party buses", category: "fleet" },
  { href: "/limousines", label: "Limousine Fleet", description: "Explore luxury limos", category: "fleet" },
  { href: "/coach-buses", label: "Coach Bus Fleet", description: "View coach options", category: "fleet" },
  { href: "/pricing", label: "Pricing Guide", description: "Transparent pricing info", category: "resources" },
  { href: "/events", label: "Event Ideas", description: "Inspiration for celebrations", category: "events" },
  { href: "/reviews", label: "Customer Reviews", description: "Real rider experiences", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.theknot.com/", label: "Wedding Planning", source: "The Knot" },
  { href: "https://www.brides.com/", label: "Bridal Resources", source: "Brides" },
  { href: "https://www.weddingwire.com/", label: "Wedding Vendors", source: "WeddingWire" },
  { href: "https://www.eventbrite.com/", label: "Event Discovery", source: "Eventbrite" },
  { href: "https://www.yelp.com/", label: "Local Reviews", source: "Yelp" },
  { href: "https://www.nhtsa.gov/", label: "Vehicle Safety Info", source: "NHTSA" },
  { href: "https://www.fmcsa.dot.gov/", label: "DOT Regulations", source: "FMCSA" },
  { href: "https://www.consumerreports.org/", label: "Consumer Guides", source: "Consumer Reports" },
  { href: "https://www.tripadvisor.com/", label: "Travel Reviews", source: "TripAdvisor" },
  { href: "https://www.zola.com/", label: "Wedding Registry", source: "Zola" },
  { href: "https://www.marthastewart.com/weddings", label: "Wedding Ideas", source: "Martha Stewart Weddings" },
  { href: "https://www.bbb.org/", label: "Business Ratings", source: "Better Business Bureau" },
];

export default async function Home() {
  const reviews = (await getReviews()) ?? [];
  const facts = await getFacts("home", 6);

  return (
    <div className="bg-[#0a1628]">
      <Suspense fallback={<div className="h-[100vh] bg-[#0a1628] animate-pulse" />}>
        <Hero slug="home" />
      </Suspense>

      <FleetSection />

      <GlobalCTAs source="Homepage - After Fleet" variant="banner" />

      <SectionDivider variant="glow" />

      <FactsShowcase
        facts={facts}
        title="Bus2Ride By The Numbers"
        subtitle="Key statistics that set us apart in group transportation"
      />

      <PremiumDivider />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Complete Guide to Group Transportation"
        subtitle="Everything you need to know about party buses, limousines, and coach buses"
        wordCount={3500}
        readTime="12 min read"
      />

      <SectionDivider variant="gradient" />

      <TriviaBookingSection
        triviaItems={TRIVIA_ITEMS}
        title="Transportation Trivia & How to Book"
        subtitle="Fun facts about group travel and our simple 3-step booking process"
      />

      <PremiumDivider />

      <ReviewsSection reviews={reviews} />

      <GlobalCTAs source="Homepage - After Reviews" />

      <SectionDivider variant="gradient" />

      <PollsGrid
        category="home"
        columnCategories={["party-bus", "limo", "coach-bus"]}
        hideCities
        title="Trending Polls"
      />

      <PremiumDivider />

      <ToolsGrid category="home" />

      <SectionDivider variant="dots" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Explore More"
      />

      <SectionDivider variant="glow" />

      <EventsGrid />

      <PremiumDivider />

      {/*<FaqSearchSection*/}
      {/*  category="home"*/}
      {/*  title="Homepage FAQ"*/}
      {/*  description="Search across the 50 most common things riders ask before they book. Everything is curated directly from real conversations, so you get honest answers fast."*/}
      {/*/>*/}

      <GlobalCTAs source="Homepage - Footer" variant="banner" />
    </div>
  );
}

export const metadata = pageMetadata({
  title: "Party Bus, Limo & Coach Bus Rentals",
  description:
    "Browse premium party buses, limousines, and coach buses. Get a fast quote, confirm capacity, and book with a professional driver.",
  path: "/",
});
