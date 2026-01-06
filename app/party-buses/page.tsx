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
import { 
  Music, 
  Users, 
  Sparkles, 
  Shield, 
  Star, 
  Heart,
  PartyPopper,
  Mic2,
  Zap
} from "lucide-react";

export const metadata = pageMetadata({
  title: "Party Buses",
  description:
    "Browse party buses by size and amenities. Search capacity, compare layouts, and book a chauffeur-driven ride for your event.",
  path: "/party-buses",
});

const PARTY_BUS_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "The first party bus was converted from a school bus in 1995 in Las Vegas.",
    answer: "True! A Vegas entrepreneur saw people struggling to travel between casinos while partying and converted a yellow school bus into the first mobile nightclub.",
    category: "History",
    source: "Las Vegas Transportation Archives",
  },
  {
    id: "2",
    question: "How many watts does a typical party bus sound system produce?",
    answer: "Premium party buses feature 3,000-10,000 watt sound systems—that's louder than most nightclubs! The speakers are strategically placed to create an immersive audio experience.",
    category: "Tech",
    source: "Party Bus Industry Survey",
  },
  {
    id: "3",
    question: "What's the most popular song played on party buses in 2024?",
    answer: "While it varies by region, hip-hop and dance music dominate with about 65% of playlists. Country music is growing fast, especially for bachelorette parties in Nashville!",
    category: "Music",
    source: "DJ Industry Report 2024",
  },
  {
    id: "4",
    question: "The largest party bus in the world holds how many people?",
    answer: "The world's largest party bus, built in Dubai, can accommodate 120 passengers! It features a rooftop deck, three dance floors, and a full kitchen.",
    category: "Records",
    source: "Luxury Vehicle Magazine",
  },
  {
    id: "5",
    question: "What percentage of party bus rentals are for bachelorette parties?",
    answer: "Bachelorette parties account for approximately 28% of all party bus bookings, making them the #1 event type, followed by birthdays (22%) and prom (18%).",
    category: "Statistics",
    source: "Party Bus Industry Report 2024",
  },
];

const PARTY_BUS_FACTS: FactItem[] = [
  {
    id: "1",
    stat: "28%",
    label: "Of bookings are bachelorette parties",
    description: "Bachelorette parties are the most popular event for party bus rentals, followed by birthdays and milestone celebrations.",
    icon: "users",
    category: "stat",
  },
  {
    id: "2",
    stat: "5,000+",
    label: "LED lights on premium buses",
    description: "High-end party buses feature over 5,000 programmable LED lights that can sync to music and change colors to match your party theme.",
    icon: "zap",
    category: "insight",
  },
  {
    id: "3",
    stat: "4-6 hrs",
    label: "Average rental duration",
    description: "Most party bus rentals last between 4-6 hours, perfect for bar crawls, concert transportation, or pre-event celebrations.",
    icon: "clock",
    category: "stat",
  },
  {
    id: "4",
    stat: "BYOB",
    label: "Most allow drinks",
    description: "Over 90% of party bus companies allow BYOB (bring your own beverage). Check local laws and company policies for specific rules.",
    icon: "star",
    category: "tip",
  },
  {
    id: "5",
    stat: "15-50",
    label: "Typical passenger capacity",
    description: "Party buses range from intimate 15-passenger mini-buses to massive 50-passenger mega-buses with multiple zones.",
    icon: "users",
    category: "stat",
  },
  {
    id: "6",
    stat: "3 wks",
    label: "Ideal booking window",
    description: "For the best selection and competitive pricing, book your party bus 3-4 weeks in advance, especially for weekend events.",
    icon: "trending",
    category: "tip",
  },
];

const PARTY_BUS_FEATURES: FeatureItem[] = [
  { icon: "music", title: "Premium Sound System", description: "3,000-10,000 watt systems with Bluetooth, subwoofers, and party playlists" },
  { icon: "sparkles", title: "LED Lighting", description: "Color-changing LEDs, laser systems, and fiber optic ceilings that sync to music" },
  { icon: "wine", title: "Bar & Coolers", description: "Built-in bar areas with ice coolers, cup holders, and BYOB-friendly setup" },
  { icon: "tv", title: "Entertainment", description: "Flat-screen TVs, karaoke systems, and gaming consoles on premium buses" },
  { icon: "climate", title: "Climate Control", description: "Powerful A/C and heating systems for year-round comfort" },
  { icon: "shield", title: "Safety Features", description: "Licensed chauffeurs, insurance, and emergency exits on all vehicles" },
];

const PARTY_BUS_SPECS: SpecItem[] = [
  { label: "Capacity", value: "15-50" },
  { label: "Min Hours", value: "4-5" },
  { label: "Sound", value: "10K W" },
  { label: "Dance Poles", value: "1-3" },
  { label: "TVs", value: "2-4" },
  { label: "A/C Units", value: "2+" },
];

const PARTY_BUS_BEST_FOR = [
  "Bachelorette Parties",
  "Bachelor Parties",
  "Birthday Celebrations",
  "Prom Night",
  "Concert Transportation",
  "Bar & Club Hopping",
  "Brewery Tours",
  "Winery Tours",
  "Graduation Parties",
  "Holiday Celebrations",
  "Corporate Events",
  "Sports Game Transportation",
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/limousines", label: "Explore Limousines", description: "Elegant stretch limos for smaller groups", category: "fleet" },
  { href: "/coach-buses", label: "View Coach Buses", description: "Comfortable large group transportation", category: "fleet" },
  { href: "/fleet", label: "Full Fleet Overview", description: "Compare all vehicle types", category: "fleet" },
  { href: "/pricing", label: "Party Bus Pricing", description: "Transparent rates and what affects your quote", category: "resources" },
  { href: "/events/bachelorette-party", label: "Bachelorette Party Guide", description: "Plan the perfect girls' night out", category: "events" },
  { href: "/events/bachelor-party", label: "Bachelor Party Ideas", description: "Epic celebration planning tips", category: "events" },
  { href: "/events/birthday-party", label: "Birthday Celebrations", description: "Make their birthday unforgettable", category: "events" },
  { href: "/tools", label: "Planning Calculators", description: "Budget, capacity, and timing tools", category: "tools" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.nhtsa.gov/vehicle-safety", label: "Vehicle Safety Standards (NHTSA)", source: "Government" },
  { href: "https://www.responsibility.org/", label: "Responsible Drinking Guidelines", source: "Foundation" },
  { href: "https://www.theknot.com/content/bachelorette-party-ideas", label: "Bachelorette Party Ideas", source: "The Knot" },
  { href: "https://www.brides.com/", label: "Wedding Planning Resources", source: "Brides Magazine" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "what-is-party-bus",
    title: "What Exactly Is a Party Bus?",
    content: `
      <p>A party bus is a converted bus designed specifically for mobile entertainment and group celebrations. Unlike standard transportation, party buses transform the journey itself into a central part of your event.</p>
      
      <h4>The Evolution of Party Transportation</h4>
      <p>Party buses emerged in the 1990s as an innovative solution for groups who wanted to maintain their celebration momentum while traveling between venues. What started as converted school buses has evolved into sophisticated entertainment vehicles rivaling nightclubs.</p>
      
      <h4>Key Features That Define Party Buses</h4>
      <p>Modern party buses feature professional-grade sound systems with subwoofers, LED and laser lighting systems, dance poles, wraparound seating, bar areas with ice coolers, and flat-screen TVs. Premium models include fog machines, karaoke systems, and even stripper poles.</p>
      
      <h4>Who Rents Party Buses?</h4>
      <p>Party buses attract diverse clientele: bachelorette parties seeking a fun ride between bars, birthday groups wanting a unique celebration venue, corporate teams for team-building outings, concert-goers traveling to shows, and friends celebrating any occasion worth remembering.</p>
    `,
  },
  {
    id: "choosing-size",
    title: "Choosing the Right Size Party Bus",
    content: `
      <p>Selecting the appropriate party bus size is crucial for both comfort and budget. Too small and guests feel cramped; too large and you're paying for unused space.</p>
      
      <h4>15-20 Passenger Buses</h4>
      <p>Perfect for intimate gatherings, small wedding parties, and close friend groups. These compact buses offer all the amenities of larger models in a cozier setting. Ideal for groups who prioritize conversation alongside celebration.</p>
      
      <h4>25-35 Passenger Buses</h4>
      <p>The sweet spot for most events. Large enough for a significant party atmosphere but intimate enough for everyone to interact. Popular for bachelorette parties, birthday celebrations, and corporate outings.</p>
      
      <h4>40-50 Passenger Mega Buses</h4>
      <p>When you need to bring the entire crew, mega buses deliver. These mobile nightclubs feature multiple entertainment zones, expanded dance floors, and impressive amenity packages. Perfect for large wedding parties, prom groups, and major celebrations.</p>
      
      <h4>The 75% Rule</h4>
      <p>Pro tip: aim to fill your bus to about 75% capacity. This ensures everyone has space to move, dance, and enjoy the amenities without feeling crowded or leaving empty seats you're paying for.</p>
    `,
  },
  {
    id: "amenities-explained",
    title: "Party Bus Amenities Explained",
    content: `
      <p>Understanding party bus amenities helps you compare options and ensure your chosen vehicle delivers the experience you want.</p>
      
      <h4>Sound Systems</h4>
      <p>Quality matters enormously. Look for systems with multiple speakers, subwoofers for bass, and Bluetooth connectivity. Premium buses feature systems ranging from 3,000 to 10,000 watts. Ask about aux cables, CD players, and whether you can control the music.</p>
      
      <h4>Lighting Systems</h4>
      <p>LED lighting has transformed party bus interiors. Color-changing lights, laser systems, and fiber optic ceilings create immersive atmospheres. Some buses feature lights that sync to music for a true nightclub experience.</p>
      
      <h4>Bar and Cooler Areas</h4>
      <p>Most party buses include built-in bar areas with ice coolers, cup holders, and storage. Verify BYOB policies and whether glassware is allowed. Some companies offer upgraded drink packages.</p>
      
      <h4>Dance Features</h4>
      <p>Dance poles are standard on many party buses and add to the entertainment value. Ensure adequate floor space for dancing and that the ceiling height accommodates standing and movement.</p>
      
      <h4>Entertainment Extras</h4>
      <p>Flat-screen TVs, gaming consoles, karaoke systems, and fog machines are available on premium buses. Discuss your entertainment priorities when booking to find the perfect match.</p>
    `,
  },
  {
    id: "booking-tips",
    title: "Expert Party Bus Booking Tips",
    content: `
      <p>Smart booking strategies help you secure the best vehicle at the best price while avoiding common pitfalls.</p>
      
      <h4>Timing Your Booking</h4>
      <p>Book 3-4 weeks in advance for weekend events. Prom season (April-May) and summer weekends require even earlier booking—sometimes 6-8 weeks. Last-minute bookings are possible but limit your options significantly.</p>
      
      <h4>Understanding Pricing</h4>
      <p>Party bus pricing typically ranges from $150-$400 per hour depending on size and amenities. Most companies have 4-5 hour minimums. Weekend evenings cost more than weekday rentals. Ask about package deals for longer rentals.</p>
      
      <h4>Questions to Ask</h4>
      <p>Before booking, confirm: BYOB policies, gratuity expectations (typically 15-20%), overtime rates, cancellation policies, deposit requirements, and what happens if the bus breaks down.</p>
      
      <h4>Red Flags to Avoid</h4>
      <p>Be wary of companies that don't offer vehicle tours, lack proper licensing and insurance documentation, have significantly lower prices than competitors, or pressure you to book immediately without answering questions.</p>
      
      <h4>The Day-Of Checklist</h4>
      <p>Confirm pickup time and location, have the driver's contact information, designate a group leader for communication, plan your route/stops in advance, and establish ground rules with your group about behavior and responsibilities.</p>
    `,
  },
  {
    id: "event-ideas",
    title: "Creative Party Bus Event Ideas",
    content: `
      <p>Party buses work for far more occasions than most people realize. Here are creative ways to maximize your mobile celebration.</p>
      
      <h4>Progressive Dinner Tours</h4>
      <p>Visit multiple restaurants for different courses—appetizers at one spot, entrees at another, dessert elsewhere. The party bus keeps the group together and the energy high between stops.</p>
      
      <h4>Concert and Festival Transportation</h4>
      <p>Skip parking hassles and ride-share surge pricing. A party bus delivers your group directly to the venue and picks you up after, letting the party continue during travel.</p>
      
      <h4>Brewery and Winery Tours</h4>
      <p>Visit multiple craft breweries or wineries without worrying about designated drivers. Many party bus companies offer pre-planned routes with popular stops.</p>
      
      <h4>Surprise Celebrations</h4>
      <p>Coordinate with family and friends for a surprise pickup. Imagine the birthday person getting into what they think is a regular ride, only to find their friends waiting with music and decorations.</p>
      
      <h4>Theme Parties</h4>
      <p>Decade themes (80s, 90s), costume parties, sports championship celebrations, and holiday events all work brilliantly on party buses. Coordinate decorations and dress codes for maximum impact.</p>
    `,
  },
  {
    id: "safety-etiquette",
    title: "Party Bus Safety and Etiquette",
    content: `
      <p>A great party bus experience requires respect for safety rules and fellow passengers. Here's how to party responsibly.</p>
      
      <h4>Alcohol Guidelines</h4>
      <p>While most buses allow BYOB, all passengers must be of legal drinking age. Never bring glass bottles (they can break during travel). The chauffeur may refuse service to anyone who appears dangerously intoxicated.</p>
      
      <h4>Behavior Expectations</h4>
      <p>Keep body parts inside the vehicle at all times. Don't distract the driver. Respect the vehicle—you'll be charged for damage. Follow the chauffeur's instructions; they're responsible for everyone's safety.</p>
      
      <h4>Emergency Preparedness</h4>
      <p>Know where emergency exits are located. Keep the aisle clear. Designate a sober contact person who can communicate with the driver if needed. Have a backup plan if someone needs to leave early.</p>
      
      <h4>Protecting Your Deposit</h4>
      <p>Most companies charge cleaning fees for excessive mess. Avoid confetti and glitter (nearly impossible to clean). Don't attach decorations with tape that damages surfaces. Contain food and drink spills immediately.</p>
      
      <h4>Respecting Your Chauffeur</h4>
      <p>Your driver is a professional, not a party participant. Don't pressure them to break rules. Tip appropriately (15-20% is standard). Treat them with the same respect you'd give any service professional.</p>
    `,
  },
];

async function getPageData() {
  const vehicles = (await getVehiclesByType("party-bus", "min_hours", 10)) ?? [];
  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;
  return { vehicles, reviews, totalReviewsCount };
}

export default async function PartyBusPage() {
  const { vehicles, reviews, totalReviewsCount } = await getPageData();

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="party-buses" />

      <FleetGrid 
        title="Party Bus Fleet" 
        vehicles={vehicles} 
      />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Ultimate Party Bus Guide"
        subtitle="Everything you need to know about renting and enjoying a party bus"
        readTime="15 min"
        wordCount={2500}
      />

      <SectionDivider variant="glow" />

      <TriviaBookingSection
        triviaItems={PARTY_BUS_TRIVIA}
        title="Party Bus Trivia & How to Book"
        subtitle="Test your knowledge and learn our simple booking process"
        bookingTitle="How to Book a Party Bus"
      />

      <SectionDivider variant="dots" />

      <OtherFleets currentType="party-bus" />

      <PremiumDivider />

      <SpecsPanel
        specs={PARTY_BUS_SPECS}
        title="Party Bus Specifications"
        gradient="from-pink-500 to-purple-500"
      />

      <FeatureGrid
        features={PARTY_BUS_FEATURES}
        title="Premium Party Bus Features"
        subtitle="Everything you need for the ultimate mobile celebration"
        gradient="from-pink-500 to-purple-500"
      />

      <BestForTags
        tags={PARTY_BUS_BEST_FOR}
        title="Perfect For These Events"
        gradient="from-pink-500 to-purple-500"
      />

      <CTABand
        title="Ready to Party?"
        subtitle="Get an instant quote for your party bus rental"
        gradient="from-pink-500 to-purple-500"
      />

      <PremiumDivider />

      <WhySection slug="party-buses" />

      <SectionDivider variant="gradient" />

      <FactsShowcase
        facts={PARTY_BUS_FACTS}
        title="Party Bus By The Numbers"
        subtitle="Interesting statistics about the party bus industry"
      />

      <SectionDivider variant="gradient" />

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <GlobalCTAs source="Party Buses - After Reviews" />

      <SectionDivider variant="dots" />

      <PollsGrid
        columnCategories={["party-bus", "bachelor-parties", "bachelorette-parties"]}
        hideCities
        title="Party Bus Polls"
      />

      <SectionDivider variant="glow" />

      <BookingProcessSection />

      <PremiumDivider />

      <ToolsGrid category="party-bus" />

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
        category="party-buses"
        title="Everything about party bus bookings"
        aboveTitle="Party Bus FAQ"
        description="Search through the most common questions groups ask about BYOB rules, pricing windows, pickup timing, and post-ride cleanup before locking in a bus."
        inputPlaceholder='Try "BYOB", "pricing", "pickup windows"…'
      />

      <GlobalCTAs source="Party Buses - Footer" variant="banner" />
    </main>
  );
}
