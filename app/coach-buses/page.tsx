import Hero from "@/components/layout/hero";
import { FleetGrid } from "@/components/sections/fleet-grid.client";
import { WhySection } from "@/components/sections/content-features";
import { OtherFleets } from "@/components/sections/content-with-images";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getVehiclesByType } from "@/lib/data/vehicles";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { FeatureGrid, SpecsPanel, BestForTags, CTABand, type FeatureItem, type SpecItem } from "@/components/sections/fleet-features";
import { pageMetadata } from "@/lib/seo/metadata";
import { GlobalCTAs } from "@/components/GlobalCTAs";
import { Bus, Users, MapPin, Shield, Wifi, Coffee } from "lucide-react";

export const metadata = pageMetadata({
  title: "Coach Buses",
  description:
    "Find coach buses for comfortable group transportation. Compare capacity and amenities for longer routes, tours, and event shuttles.",
  path: "/coach-buses",
});

const COACH_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "The term 'coach' comes from a Hungarian town that pioneered horse-drawn carriages.",
    answer: "True! The word 'coach' derives from Kocs, Hungary, where enclosed horse-drawn carriages were first developed in the 15th century for comfortable long-distance travel.",
    category: "Etymology",
    source: "Oxford English Dictionary",
  },
  {
    id: "2",
    question: "How many miles does the average charter bus travel annually?",
    answer: "The average charter coach travels 50,000-80,000 miles per year! That's equivalent to circling the Earth twice. Top tour companies log over 100,000 miles annually.",
    category: "Industry",
    source: "American Bus Association",
  },
  {
    id: "3",
    question: "What percentage of NFL teams use charter buses for away games?",
    answer: "100% of NFL teams use charter buses for games within driving distance. Most teams prefer bus travel for trips under 300 miles, citing team bonding and schedule flexibility.",
    category: "Sports",
    source: "NFL Operations Report",
  },
  {
    id: "4",
    question: "Coach buses are the safest form of ground transportation.",
    answer: "True! According to DOT statistics, coach buses have the lowest fatality rate of any ground transportation mode—8 times safer than passenger cars per mile traveled.",
    category: "Safety",
    source: "US Department of Transportation",
  },
  {
    id: "5",
    question: "The longest non-stop coach bus journey covered how many miles?",
    answer: "The record for longest non-stop coach journey is 2,545 miles, from Los Angeles to Washington D.C., completed in 48 hours with rotating drivers.",
    category: "Records",
    source: "Guinness World Records",
  },
];

const COACH_FACTS: FactItem[] = [
  {
    id: "1",
    stat: "600M+",
    label: "Annual US charter passengers",
    description: "Over 600 million passengers ride charter and motor coaches in the US annually, making it a major transportation industry.",
    icon: "users",
    category: "stat",
  },
  {
    id: "2",
    stat: "8x",
    label: "Safer than passenger cars",
    description: "Coach buses have 8 times fewer fatalities per mile traveled compared to passenger vehicles, according to federal safety data.",
    icon: "star",
    category: "stat",
  },
  {
    id: "3",
    stat: "25-56",
    label: "Typical passenger capacity",
    description: "Coach buses range from 25-seat mini-coaches to full-size 56-passenger motorcoaches, with various configurations available.",
    icon: "users",
    category: "stat",
  },
  {
    id: "4",
    stat: "206%",
    label: "More fuel efficient than cars",
    description: "A full coach bus is 206% more fuel-efficient per passenger mile than single-occupancy vehicles, making it the greenest choice.",
    icon: "trending",
    category: "insight",
  },
  {
    id: "5",
    stat: "4-6 wks",
    label: "Recommended booking window",
    description: "For major events and peak seasons, book your coach bus 4-6 weeks in advance to ensure availability and best pricing.",
    icon: "clock",
    category: "tip",
  },
  {
    id: "6",
    stat: "$1,200-2,500",
    label: "Typical daily charter rate",
    description: "Full-day coach bus charters typically range from $1,200-$2,500 depending on distance, amenities, and seasonal demand.",
    icon: "trending",
    category: "insight",
  },
];

const COACH_FEATURES: FeatureItem[] = [
  { icon: "wifi", title: "WiFi Connectivity", description: "Complimentary high-speed WiFi for work or entertainment during travel" },
  { icon: "climate", title: "Climate Control", description: "Powerful A/C and heating systems for comfortable year-round travel" },
  { icon: "tv", title: "Entertainment", description: "Multiple flat-screen TVs, PA system, and USB charging ports" },
  { icon: "users", title: "Spacious Seating", description: "Reclining seats with generous legroom and overhead storage" },
  { icon: "shield", title: "Safety Certified", description: "DOT certified drivers with impeccable safety records" },
  { icon: "check", title: "ADA Accessible", description: "Wheelchair lifts and accessible seating available on request" },
];

const COACH_SPECS: SpecItem[] = [
  { label: "Capacity", value: "25-56" },
  { label: "Daily Rate", value: "$1.2-2.5K" },
  { label: "Luggage", value: "Full Bay" },
  { label: "Restroom", value: "Onboard" },
  { label: "WiFi", value: "Included" },
  { label: "Outlets", value: "Every Seat" },
];

const COACH_BEST_FOR = [
  "Corporate Events",
  "Wedding Guest Shuttles",
  "Sports Teams",
  "School Field Trips",
  "Church Groups",
  "Tour Groups",
  "Convention Transport",
  "Airport Shuttles",
  "Multi-Day Trips",
  "Concert Transportation",
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/party-buses", label: "Explore Party Buses", description: "Entertainment-focused group transportation", category: "fleet" },
  { href: "/limousines", label: "View Limousines", description: "Luxury transportation for smaller groups", category: "fleet" },
  { href: "/fleet", label: "Full Fleet Overview", description: "Compare all vehicle types", category: "fleet" },
  { href: "/pricing", label: "Coach Bus Pricing", description: "Transparent rates for group travel", category: "resources" },
  { href: "/events/corporate", label: "Corporate Events", description: "Professional group transportation solutions", category: "events" },
  { href: "/events/wedding", label: "Wedding Guest Shuttles", description: "Seamless wedding day logistics", category: "events" },
  { href: "/tools", label: "Planning Calculators", description: "Budget and capacity tools", category: "tools" },
  { href: "/locations", label: "Service Areas", description: "Regions and cities we serve", category: "locations" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.buses.org/", label: "American Bus Association", source: "Industry Association" },
  { href: "https://www.fmcsa.dot.gov/", label: "Federal Motor Carrier Safety", source: "Government" },
  { href: "https://www.usdot.gov/", label: "US Department of Transportation", source: "Government" },
  { href: "https://www.nsc.org/road/resources/motor-coach-safety", label: "Motor Coach Safety Resources", source: "National Safety Council" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "coach-overview",
    title: "What Makes Coach Buses Ideal for Groups",
    content: `
      <p>Coach buses represent the gold standard for comfortable, efficient group transportation. Whether you're organizing a corporate retreat, wedding guest shuttle, or multi-day tour, coaches deliver unmatched value.</p>
      
      <h4>Capacity Meets Comfort</h4>
      <p>Modern coach buses seat 25-56 passengers in airline-style reclining seats with generous legroom. Unlike cramped vehicles, passengers can relax, work, or socialize during travel. Many coaches feature forward-facing seats for motion comfort.</p>
      
      <h4>Onboard Amenities</h4>
      <p>Today's coaches offer climate control, overhead storage, onboard restrooms, WiFi connectivity, power outlets, and entertainment systems. Premium models include tables, refreshment centers, and enhanced suspension for smooth rides.</p>
      
      <h4>Professional Operation</h4>
      <p>Commercial coach drivers maintain CDL certifications, complete rigorous training, and adhere to federal hours-of-service regulations. This professional operation ensures safety and reliability for your group.</p>
      
      <h4>Economic Efficiency</h4>
      <p>When calculated per person, coach travel often costs less than individual car rentals or rideshares. Groups of 20+ especially benefit from the economics of shared transportation.</p>
    `,
  },
  {
    id: "coach-types",
    title: "Types of Coach Buses Available",
    content: `
      <p>The coach bus market offers various sizes and configurations to match different group needs and budgets.</p>
      
      <h4>Mini Coaches (25-35 Passengers)</h4>
      <p>Compact coaches perfect for medium-sized groups. They navigate city streets easily while offering most full-size coach amenities. Ideal for corporate shuttles, wedding parties, and day trips.</p>
      
      <h4>Standard Coaches (40-45 Passengers)</h4>
      <p>The most common charter size, balancing capacity with maneuverability. Features include restrooms, climate control, and entertainment systems. Perfect for most group travel needs.</p>
      
      <h4>Full-Size Motorcoaches (50-56 Passengers)</h4>
      <p>Maximum capacity for large groups. These double-axle coaches offer the smoothest ride and most generous amenities. Ideal for tours, conventions, and large wedding groups.</p>
      
      <h4>Executive Coaches</h4>
      <p>Premium configurations with leather seating, table configurations, enhanced entertainment, and VIP amenities. Popular for corporate travel, sports teams, and luxury tours.</p>
      
      <h4>Sleeper Coaches</h4>
      <p>Specialized coaches with bunk beds for overnight travel. Used by touring bands, sports teams, and groups covering long distances who want to travel while passengers rest.</p>
    `,
  },
  {
    id: "corporate-travel",
    title: "Coach Buses for Corporate Events",
    content: `
      <p>Businesses increasingly choose coach buses for group transportation, recognizing the productivity and branding benefits over individual travel.</p>
      
      <h4>Team Building en Route</h4>
      <p>Coach travel transforms transit time into team bonding opportunity. Colleagues can interact, network, and prepare for events together. Many companies use travel time for informal meetings or icebreakers.</p>
      
      <h4>Productivity Features</h4>
      <p>WiFi, power outlets, and table configurations enable work during travel. Executives can conduct calls, review presentations, or hold impromptu meetings—turning travel time into productive time.</p>
      
      <h4>Professional Image</h4>
      <p>Arriving as a group in a clean, modern coach projects professionalism and organization. Some companies brand vehicles with logos for conferences and trade shows.</p>
      
      <h4>Simplified Logistics</h4>
      <p>One vehicle, one schedule, one contact. Group travel eliminates coordination headaches of multiple cars, parking logistics, and arrival timing. Everyone arrives together, on time.</p>
      
      <h4>Cost Control</h4>
      <p>Predictable fixed costs replace variable expenses like parking fees, gas reimbursements, and mileage. Finance teams appreciate straightforward budgeting.</p>
    `,
  },
  {
    id: "wedding-shuttles",
    title: "Wedding Guest Shuttle Services",
    content: `
      <p>Guest shuttles have become essential for modern weddings, ensuring smooth logistics and happy guests.</p>
      
      <h4>Why Shuttles Matter</h4>
      <p>Destination weddings, venue parking limitations, and separated ceremony/reception locations all create guest transportation challenges. Shuttles solve these problems elegantly.</p>
      
      <h4>Hotel-to-Venue Service</h4>
      <p>Coordinated pickup from guest hotels eliminates navigation confusion and parking stress. Guests arrive relaxed and ready to celebrate rather than frustrated from logistics.</p>
      
      <h4>Open Bar? No Problem</h4>
      <p>Guest shuttles eliminate drunk driving concerns. Guests can celebrate freely knowing safe transportation is arranged. Many couples consider this a gift to their guests.</p>
      
      <h4>Timeline Management</h4>
      <p>Shuttles help control wedding timeline. Scheduled departure times ensure guests arrive together, and post-reception shuttles provide clear endpoint for celebrations.</p>
      
      <h4>Coordination Tips</h4>
      <p>Work with your venue coordinator and transportation company on timing. Build buffer time for photos. Consider multiple pickup locations for guest convenience.</p>
    `,
  },
  {
    id: "tour-travel",
    title: "Multi-Day Tours and Long-Distance Travel",
    content: `
      <p>Coach buses excel at extended travel, offering comfort and convenience that other options can't match.</p>
      
      <h4>Cross-Country Capability</h4>
      <p>Modern coaches handle any distance with ease. Professional drivers rotate according to DOT regulations, ensuring safety on multi-day journeys. Onboard restrooms minimize stop requirements.</p>
      
      <h4>Luggage Capacity</h4>
      <p>Undercarriage storage compartments hold significant luggage. Most coaches accommodate one large suitcase and one carry-on per passenger, with additional space for equipment or supplies.</p>
      
      <h4>Tour Group Benefits</h4>
      <p>For sightseeing tours, coaches provide consistent, comfortable experience. Groups stay together, guides can narrate from the front, and stops are coordinated for maximum enjoyment.</p>
      
      <h4>Overnight Travel Options</h4>
      <p>Some itineraries benefit from overnight driving while passengers sleep. This maximizes destination time and can reduce hotel costs. Sleeper coaches or reclining seats enable rest during travel.</p>
      
      <h4>Planning Long Trips</h4>
      <p>Work with your charter company on rest stops, meal breaks, and driver requirements. Build flexibility into schedules for traffic and weather. Confirm all permits for multi-state travel.</p>
    `,
  },
  {
    id: "booking-tips",
    title: "How to Book the Right Coach Bus",
    content: `
      <p>Securing the perfect coach requires understanding your needs and asking the right questions.</p>
      
      <h4>Determine Requirements</h4>
      <p>List your passenger count (plan for 10% buffer), pickup/dropoff locations, date/time, and any special needs like ADA accessibility, WiFi, or luggage capacity.</p>
      
      <h4>Start Early</h4>
      <p>Premium coaches book quickly, especially during wedding season, prom weekends, and major events. Begin your search 4-6 weeks in advance for best selection.</p>
      
      <h4>Verify Credentials</h4>
      <p>Confirm the company's DOT number, insurance coverage, and safety record. The Federal Motor Carrier Safety Administration maintains public records of company safety ratings.</p>
      
      <h4>Compare Carefully</h4>
      <p>Get quotes from multiple companies. Compare not just price but vehicle age, amenities, driver experience, and customer reviews. The cheapest option isn't always best value.</p>
      
      <h4>Understand the Contract</h4>
      <p>Review payment terms, cancellation policies, overtime charges, and fuel surcharges. Understand what's included and what costs extra before signing.</p>
    `,
  },
];

async function getPageData() {
  const vehicles = (await getVehiclesByType("coach", "min_hours", 10)) ?? [];
  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;
  return { vehicles, reviews, totalReviewsCount };
}

export default async function CoachBusesPage() {
  const { vehicles, reviews, totalReviewsCount } = await getPageData();

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="coach-buses" />

      <FleetGrid 
        title="Coach Bus Fleet" 
        vehicles={vehicles} 
      />

      <SpecsPanel
        specs={COACH_SPECS}
        title="Coach Bus Specifications"
        gradient="from-emerald-400 to-teal-500"
      />

      <FeatureGrid
        features={COACH_FEATURES}
        title="Premium Coach Bus Features"
        subtitle="Everything you need for comfortable group travel"
        gradient="from-emerald-400 to-teal-500"
      />

      <BestForTags
        tags={COACH_BEST_FOR}
        title="Ideal For These Events"
        gradient="from-emerald-400 to-teal-500"
      />

      <CTABand
        title="Ready to Travel?"
        subtitle="Get an instant quote for your charter bus rental"
        gradient="from-emerald-400 to-teal-500"
      />

      <PremiumDivider />

      <WhySection slug="coach-buses" />

      <SectionDivider variant="gradient" />

      <FactsShowcase
        facts={COACH_FACTS}
        title="Coach Bus Industry Insights"
        subtitle="Fascinating statistics about charter bus transportation"
      />

      <SectionDivider variant="dots" />

      <OtherFleets currentType="coach" />

      <PremiumDivider />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Complete Coach Bus Guide"
        subtitle="Everything you need to know about chartering coach buses for any occasion"
        readTime="13 min"
        wordCount={2500}
      />

      <SectionDivider variant="glow" />

      <TriviaBookingSection
        triviaItems={COACH_TRIVIA}
        title="Coach Bus Trivia & How to Book"
        subtitle="Test your knowledge and learn our simple booking process"
        bookingTitle="How to Book a Coach Bus"
      />

      <SectionDivider variant="gradient" />

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <GlobalCTAs source="Coach Buses - After Reviews" />

      <SectionDivider variant="dots" />

      <PollsGrid
        columnCategories={["coach-bus", "corporate-discounts", "sporting-events"]}
        hideCities
        title="Coach Bus Polls"
      />

      <SectionDivider variant="glow" />

      <BookingProcessSection />

      <PremiumDivider />

      <ToolsGrid category="coach" />

      <SectionDivider variant="gradient" />

      <EventsGrid />

      <SectionDivider variant="gradient" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Continue Exploring"
      />

      <SectionDivider variant="dots" />

      <FaqSearchSection
        category="coach-buses"
        title="Coach bus logistics, timing & compliance"
        aboveTitle="Coach & Charter FAQ"
        description="Search answers about driver hours, luggage staging, ADA requests, rest stops, and multi-day itineraries before you submit your manifest."
        inputPlaceholder='Try "driver hours", "rest stops", "luggage"…'
      />

      <GlobalCTAs source="Coach Buses - Footer" variant="banner" />
    </main>
  );
}
