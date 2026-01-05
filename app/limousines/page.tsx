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
import { Crown, Gem, Wine, Shield } from "lucide-react";

export const metadata = pageMetadata({
  title: "Limousines",
  description:
    "Browse luxury limousines including stretch limos, SUV limos, and classic town cars. Find the perfect elegant ride for your special occasion.",
  path: "/limousines",
});

const LIMO_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "The word 'limousine' comes from a French region famous for shepherds' cloaks.",
    answer: "True! Limousin, France was known for hooded cloaks. Early luxury cars had covered driver compartments that resembled these hoods, inspiring the name 'limousine.'",
    category: "Etymology",
    source: "Oxford English Dictionary",
  },
  {
    id: "2",
    question: "What year was the first stretch limousine created?",
    answer: "1928! Armbruster & Company of Fort Smith, Arkansas built the first stretch limo to transport big band leaders and their orchestras between venues.",
    category: "History",
    source: "Limousine History Archives",
  },
  {
    id: "3",
    question: "The longest limousine ever built is longer than a basketball court.",
    answer: "True! The American Dream, built by Jay Ohrberg, measures 100 feet—longer than a standard basketball court (94 feet). It features a swimming pool and helipad!",
    category: "Records",
    source: "Guinness World Records",
  },
  {
    id: "4",
    question: "Which color limousine is most popular for weddings?",
    answer: "White limousines dominate wedding transportation at 68%, followed by black (24%) and silver (5%). Specialty colors like pink are growing in popularity for bridal showers.",
    category: "Trends",
    source: "Wedding Industry Report 2024",
  },
  {
    id: "5",
    question: "Presidential limousines are known by what nickname?",
    answer: "The President's limousine is called 'The Beast' or 'Cadillac One.' It weighs approximately 20,000 pounds and features 8-inch thick armor plating and run-flat tires.",
    category: "Famous Limos",
    source: "Secret Service History",
  },
];

const LIMO_FACTS: FactItem[] = [
  {
    id: "1",
    stat: "72%",
    label: "Of brides choose limousines",
    description: "Nearly three-quarters of brides select limousine transportation for their wedding day, making weddings the #1 occasion for limo rentals.",
    icon: "star",
    category: "stat",
  },
  {
    id: "2",
    stat: "$8.5B",
    label: "US limousine market value",
    description: "The American limousine industry generates over $8.5 billion annually, employing approximately 150,000 chauffeurs nationwide.",
    icon: "trending",
    category: "stat",
  },
  {
    id: "3",
    stat: "6-20",
    label: "Typical limo capacity",
    description: "Limousines range from intimate 6-passenger Lincoln Town Cars to 20-passenger Hummer and Escalade stretch limos.",
    icon: "users",
    category: "stat",
  },
  {
    id: "4",
    stat: "15-20%",
    label: "Standard chauffeur gratuity",
    description: "Industry standard gratuity for limousine services ranges from 15-20%, similar to restaurant service.",
    icon: "zap",
    category: "tip",
  },
  {
    id: "5",
    stat: "2-4 wks",
    label: "Ideal booking window",
    description: "For best selection, book your limousine 2-4 weeks in advance. Prom and wedding season require 4-6 weeks.",
    icon: "clock",
    category: "tip",
  },
  {
    id: "6",
    stat: "$100-300",
    label: "Typical hourly rate",
    description: "Limousine rates vary by size and type, ranging from $100/hr for sedans to $300+/hr for specialty stretch limos.",
    icon: "trending",
    category: "insight",
  },
];

const LIMO_FEATURES: FeatureItem[] = [
  { icon: "sparkles", title: "Leather Interior", description: "Premium leather seating with plush comfort for the ultimate luxury experience" },
  { icon: "wine", title: "Bar & Champagne", description: "Built-in bar with ice cooler, glassware, and champagne bucket service" },
  { icon: "tv", title: "Entertainment", description: "Flat-screen TVs, premium sound system, and ambient lighting" },
  { icon: "climate", title: "Climate Control", description: "Individual zone climate control for perfect comfort" },
  { icon: "shield", title: "Privacy Partition", description: "Tinted windows and privacy partition for confidential conversations" },
  { icon: "star", title: "Professional Service", description: "Uniformed chauffeurs trained in luxury hospitality and etiquette" },
];

const LIMO_SPECS: SpecItem[] = [
  { label: "Capacity", value: "6-20" },
  { label: "Min Hours", value: "3-4" },
  { label: "Hourly Rate", value: "$100-300" },
  { label: "TVs", value: "1-3" },
  { label: "Sound", value: "Premium" },
  { label: "Bar", value: "Built-in" },
];

const LIMO_BEST_FOR = [
  "Weddings",
  "Prom Night",
  "Anniversary",
  "Airport Transfer",
  "Corporate Events",
  "Wine Tours",
  "Date Night",
  "Romantic Getaway",
  "VIP Transport",
  "Special Occasions",
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/party-buses", label: "Explore Party Buses", description: "High-energy mobile nightclub experience", category: "fleet" },
  { href: "/coach-buses", label: "View Coach Buses", description: "Comfortable large group transportation", category: "fleet" },
  { href: "/fleet", label: "Full Fleet Overview", description: "Compare all vehicle types", category: "fleet" },
  { href: "/pricing", label: "Limousine Pricing", description: "Transparent rates and packages", category: "resources" },
  { href: "/events/wedding", label: "Wedding Transportation", description: "Elegant wedding day logistics", category: "events" },
  { href: "/events/prom", label: "Prom Limo Guide", description: "Make prom night unforgettable", category: "events" },
  { href: "/events/anniversary", label: "Anniversary Celebrations", description: "Romantic milestone ideas", category: "events" },
  { href: "/locations", label: "Service Areas", description: "Cities and regions we cover", category: "locations" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.nla.org/", label: "National Limousine Association", source: "Industry Association" },
  { href: "https://www.theknot.com/content/wedding-transportation-guide", label: "Wedding Transportation Tips", source: "The Knot" },
  { href: "https://www.brides.com/story/wedding-transportation-etiquette", label: "Transportation Etiquette", source: "Brides" },
  { href: "https://www.usdot.gov/", label: "DOT Safety Standards", source: "Government" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "limo-history",
    title: "The Elegant History of Limousines",
    content: `
      <p>The limousine has been synonymous with luxury transportation for over a century, evolving from horse-drawn carriages to today's sophisticated vehicles.</p>
      
      <h4>Origins of the Name</h4>
      <p>The term "limousine" derives from Limousin, a region in central France. Local shepherds wore hooded cloaks that resembled the covered compartments on early luxury vehicles. When enclosed automobile bodies became popular, the name stuck.</p>
      
      <h4>The First Luxury Automobiles</h4>
      <p>In the early 1900s, wealthy families commissioned custom-built automobiles with enclosed passenger compartments. These vehicles featured plush interiors, privacy partitions, and professional chauffeurs—establishing the template for modern limousine service.</p>
      
      <h4>The Stretch Revolution</h4>
      <p>In 1928, Armbruster & Company created the first stretch limousine to transport big band musicians. This innovation allowed larger groups to travel in luxury, forever changing the industry.</p>
      
      <h4>Modern Luxury</h4>
      <p>Today's limousines feature fiber optic lighting, premium sound systems, champagne bars, and climate-controlled interiors. The industry continues evolving with hybrid and electric luxury vehicles leading the way.</p>
    `,
  },
  {
    id: "limo-types",
    title: "Types of Limousines Explained",
    content: `
      <p>The limousine market offers diverse options for different occasions and group sizes. Understanding the types helps you choose perfectly.</p>
      
      <h4>Stretch Limousines</h4>
      <p>The classic choice, stretch limos are extended versions of luxury sedans like Lincoln Town Cars and Chrysler 300s. They typically seat 8-12 passengers and feature bar areas, mood lighting, and privacy partitions.</p>
      
      <h4>SUV Limousines</h4>
      <p>Built on platforms like the Cadillac Escalade or Hummer H2, SUV limos offer commanding presence and spacious interiors. They seat 12-20 passengers and feature higher ceilings for easier movement.</p>
      
      <h4>Sedan Limousines</h4>
      <p>Elegant and understated, sedan limos seat 3-4 passengers in pure luxury. Perfect for corporate executives, airport transfers, and intimate occasions where sophistication matters most.</p>
      
      <h4>Exotic and Vintage Limousines</h4>
      <p>For unique occasions, consider exotic models (Bentley, Rolls-Royce) or vintage vehicles (classic Rolls, antique Packards). These create unforgettable photo opportunities and memorable arrivals.</p>
      
      <h4>Specialty Limousines</h4>
      <p>Some companies offer themed vehicles like pink "princess" limos, all-white wedding limos, or custom-built unique designs. These specialty options make specific occasions even more memorable.</p>
    `,
  },
  {
    id: "wedding-limos",
    title: "Limousines for Your Wedding Day",
    content: `
      <p>Your wedding day transportation sets the tone for the entire celebration. Limousines remain the most popular choice for couples seeking elegance and romance.</p>
      
      <h4>Choosing Your Wedding Limousine</h4>
      <p>Consider your wedding style when selecting a vehicle. Classic white stretch limos suit traditional ceremonies, while black SUV limos complement modern celebrations. Vintage vehicles add nostalgic charm.</p>
      
      <h4>Coordinating Wedding Party Transportation</h4>
      <p>Plan transportation for the entire wedding party. The bride typically arrives separately for dramatic effect, while groomsmen and bridesmaids can share larger vehicles. Consider guest shuttles between ceremony and reception.</p>
      
      <h4>Timeline Considerations</h4>
      <p>Build buffer time into your transportation schedule. Allow 30 minutes extra for photos, traffic, and unexpected delays. Coordinate pickup times with your photographer for arrival shots.</p>
      
      <h4>Romantic Touches</h4>
      <p>Many couples request champagne service, "Just Married" signs, and decorated interiors. Discuss customization options with your limousine company well in advance.</p>
      
      <h4>The Grand Exit</h4>
      <p>End your reception with a memorable departure. Your limousine serves as the backdrop for sparkler send-offs and farewell photos—a perfect conclusion to your celebration.</p>
    `,
  },
  {
    id: "prom-limos",
    title: "Making Prom Night Unforgettable",
    content: `
      <p>Prom represents a milestone moment for teenagers, and arriving in a limousine adds magic to the memory.</p>
      
      <h4>Group Coordination</h4>
      <p>Prom groups typically range from 6-15 students. Coordinate early to determine group size and split costs fairly. Larger groups can afford more impressive vehicles.</p>
      
      <h4>Parent Considerations</h4>
      <p>Parents appreciate knowing their teens are with professional chauffeurs rather than driving themselves. Many companies offer parent communication packages with pickup confirmations and safe arrival notifications.</p>
      
      <h4>Photography Time</h4>
      <p>Schedule your limousine to arrive early for pre-prom photos. The vehicle makes an excellent backdrop for group shots and adds excitement to the photo session.</p>
      
      <h4>Rules and Expectations</h4>
      <p>Discuss behavior expectations with your group before booking. Most companies have strict no-alcohol policies for prom rentals. Violating policies can result in immediate trip termination.</p>
      
      <h4>Post-Prom Plans</h4>
      <p>Many groups extend rentals for post-prom activities. Discuss safe, supervised after-party options and ensure your rental covers the full evening's timeline.</p>
    `,
  },
  {
    id: "limo-etiquette",
    title: "Limousine Etiquette and Tips",
    content: `
      <p>Knowing proper limousine etiquette ensures a smooth experience and helps you make the most of your luxury transportation.</p>
      
      <h4>Boarding and Seating</h4>
      <p>Allow the chauffeur to open doors—it's part of the service. Enter feet-first, sliding across seats rather than climbing over. The guest of honor typically sits farthest from the door, entering last and exiting first.</p>
      
      <h4>Interacting with Your Chauffeur</h4>
      <p>Your chauffeur is a professional. Communicate your needs clearly but respect their role. They're not party participants—treat them with the courtesy you'd extend to any service professional.</p>
      
      <h4>Food and Beverages</h4>
      <p>Most limousines allow champagne and light snacks. Avoid messy foods that can stain upholstery. If BYOB is permitted, never bring glass bottles that could break during travel.</p>
      
      <h4>Tipping Guidelines</h4>
      <p>Standard gratuity ranges from 15-20% of the rental cost. Some companies include gratuity in the total; verify before booking. Exceptional service warrants additional recognition.</p>
      
      <h4>End of Service</h4>
      <p>Gather all belongings before exiting. Check for dropped items under seats. Leave the vehicle in the condition you found it—cleaning fees for excessive mess can be significant.</p>
    `,
  },
  {
    id: "booking-guide",
    title: "How to Book the Perfect Limousine",
    content: `
      <p>Securing the right limousine requires planning and asking the right questions. Follow this guide for a smooth booking experience.</p>
      
      <h4>Start Early</h4>
      <p>Premium vehicles book quickly, especially during peak seasons (prom, weddings, holidays). Begin your search 4-6 weeks in advance for best selection. Last-minute bookings limit options significantly.</p>
      
      <h4>Determine Your Needs</h4>
      <p>List your requirements: passenger count, pickup/dropoff locations, event type, and any special requests. This information helps companies match you with appropriate vehicles.</p>
      
      <h4>Compare Multiple Companies</h4>
      <p>Get quotes from at least three reputable companies. Compare not just price but also vehicle age, amenities, insurance coverage, and customer reviews.</p>
      
      <h4>Inspect Before Signing</h4>
      <p>Reputable companies offer vehicle tours. Verify the condition matches photos, amenities work properly, and the interior is clean. Never sign a contract without seeing the actual vehicle.</p>
      
      <h4>Understand the Contract</h4>
      <p>Review payment terms, cancellation policies, overtime rates, and liability clauses carefully. Ask questions about anything unclear before signing.</p>
    `,
  },
];

async function getPageData() {
  const vehicles = (await getVehiclesByType("limo", "min_hours", 10)) ?? [];
  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;
  return { vehicles, reviews, totalReviewsCount };
}

export default async function LimousinesPage() {
  const { vehicles, reviews, totalReviewsCount } = await getPageData();

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="limousines" />

      <FleetGrid 
        title="Limousine Collection" 
        vehicles={vehicles} 
      />

      <SpecsPanel
        specs={LIMO_SPECS}
        title="Limousine Specifications"
        gradient="from-amber-400 to-yellow-500"
      />

      <FeatureGrid
        features={LIMO_FEATURES}
        title="Luxury Limousine Features"
        subtitle="Experience the finest in luxury ground transportation"
        gradient="from-amber-400 to-yellow-500"
      />

      <BestForTags
        tags={LIMO_BEST_FOR}
        title="Perfect For These Occasions"
        gradient="from-amber-400 to-yellow-500"
      />

      <CTABand
        title="Ready for Elegance?"
        subtitle="Get an instant quote for your luxury limousine rental"
        gradient="from-amber-400 to-yellow-500"
      />

      <PremiumDivider />

      <WhySection slug="limousines" />

      <SectionDivider variant="gradient" />

      <FactsShowcase
        facts={LIMO_FACTS}
        title="Limousine Industry Insights"
        subtitle="Fascinating facts about the luxury limousine market"
      />

      <SectionDivider variant="dots" />

      <OtherFleets currentType="limo" />

      <PremiumDivider />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Complete Limousine Guide"
        subtitle="Everything you need to know about choosing and enjoying luxury limousine service"
        readTime="14 min"
        wordCount={2500}
      />

      <SectionDivider variant="glow" />

      <TriviaBookingSection
        triviaItems={LIMO_TRIVIA}
        title="Limousine Trivia & How to Book"
        subtitle="Discover fascinating facts and learn our simple booking process"
        bookingTitle="How to Book a Limousine"
      />

      <SectionDivider variant="gradient" />

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <GlobalCTAs source="Limousines - After Reviews" />

      <SectionDivider variant="dots" />

      <PollsGrid
        columnCategories={["limo", "weddings", "prom"]}
        hideCities
        title="Limousine Polls"
      />

      <SectionDivider variant="glow" />

      <BookingProcessSection />

      <PremiumDivider />

      <ToolsGrid category="limo" />

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
        category="limousines"
        title="Everything about limo timelines & etiquette"
        aboveTitle="Limousine FAQ"
        description="Find answers about photo timing, multi-stop routes, gratuity, and formal arrival etiquette before you lock in your limo."
        inputPlaceholder='Try "prom rules", "wedding photo buffer", "pickup windows"…'
      />

      <GlobalCTAs source="Limousines - Footer" variant="banner" />
    </main>
  );
}
