import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { pageMetadata } from "@/lib/seo/metadata";
import { Calculator, Sparkles  } from "lucide-react";
import Link from "next/link";
import { PricingFaqClient } from "@/components/sections/pricing-faq.client";
import { PricingCardsClient } from "@/components/sections/pricing-cards.client";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Get clear pricing guidance for party buses, limos, and coach buses — plus instant answers to common cost questions before you book.",
  path: "/pricing",
});

const PRICING_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What day of the week offers the best limousine pricing?",
    answer: "Tuesday and Wednesday typically offer 15-25% lower rates than weekend bookings. Many companies also offer 'Sunday Funday' specials with reduced minimums.",
    category: "Savings Tip",
    source: "Industry Pricing Survey 2024",
  },
  {
    id: "2",
    question: "The average American wedding spends how much on transportation?",
    answer: "$800-$1,500 for wedding day transportation. This includes bridal party transport, guest shuttles, and the getaway car. High-end weddings often exceed $3,000.",
    category: "Statistics",
    source: "The Knot Real Weddings Survey",
  },
  {
    id: "3",
    question: "What's the #1 hidden cost that surprises first-time renters?",
    answer: "Gratuity! Standard 15-20% gratuity often isn't included in quoted prices. Always ask if gratuity is included to avoid surprises on your final bill.",
    category: "Pro Tip",
    source: "Customer Feedback Analysis",
  },
  {
    id: "4",
    question: "Prom season pricing can be how much higher than normal?",
    answer: "During peak prom season (late April to early June), limousine rates can be 30-50% higher due to extreme demand. Booking 6-8 weeks early often locks in pre-season rates.",
    category: "Seasonal",
    source: "Prom Industry Report",
  },
  {
    id: "5",
    question: "What time of day typically has the lowest rental rates?",
    answer: "Daytime rentals (10am-4pm) often cost 20-30% less than evening rentals. Perfect for wine tours, corporate events, or airport transfers.",
    category: "Savings Tip",
    source: "Pricing Analysis 2024",
  },
];

const PRICING_FACTS: FactItem[] = [
  {
    id: "1",
    stat: "$150-400",
    label: "Party bus hourly range",
    description: "Party bus pricing varies by size, amenities, and location. 15-passenger mini buses start around $150/hr while 50-passenger mega buses reach $400+/hr.",
    icon: "trending",
    category: "stat",
  },
  {
    id: "2",
    stat: "$100-300",
    label: "Limousine hourly range",
    description: "Sedan limos start around $100/hr, stretch limos average $150-200/hr, and specialty vehicles like Hummer limos reach $250-300/hr.",
    icon: "trending",
    category: "stat",
  },
  {
    id: "3",
    stat: "4-5 hrs",
    label: "Typical minimum rental",
    description: "Most companies require 4-5 hour minimums, especially on weekends. Some offer 2-3 hour minimums for weekday bookings.",
    icon: "clock",
    category: "insight",
  },
  {
    id: "4",
    stat: "15-20%",
    label: "Standard gratuity",
    description: "Industry-standard gratuity for chauffeur services. Some companies include it in pricing; always ask to avoid surprises.",
    icon: "users",
    category: "tip",
  },
  {
    id: "5",
    stat: "25-50%",
    label: "Typical deposit required",
    description: "Most companies require 25-50% deposit to secure your booking, with the balance due before or on the day of service.",
    icon: "zap",
    category: "insight",
  },
  {
    id: "6",
    stat: "3-4 wks",
    label: "Best booking window",
    description: "Booking 3-4 weeks ahead typically offers the best balance of availability and competitive pricing.",
    icon: "clock",
    category: "tip",
  },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/party-buses", label: "Party Bus Fleet", description: "Browse party buses and get specific quotes", category: "fleet" },
  { href: "/limousines", label: "Limousine Collection", description: "Explore our luxury limo options", category: "fleet" },
  { href: "/coach-buses", label: "Coach Bus Fleet", description: "View coach bus pricing and availability", category: "fleet" },
  { href: "/tools", label: "Budget Calculator", description: "Estimate your transportation costs", category: "tools" },
  { href: "/contact", label: "Get a Quote", description: "Request personalized pricing", category: "resources" },
  { href: "/events", label: "Event Ideas", description: "Inspiration for your occasion", category: "events" },
  { href: "/locations", label: "Service Areas", description: "Check coverage in your area", category: "locations" },
  { href: "/reviews", label: "Customer Reviews", description: "See what others paid and thought", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.theknot.com/content/wedding-budget-breakdown", label: "Wedding Budget Guide", source: "The Knot" },
  { href: "https://www.bbb.org/", label: "Better Business Bureau", source: "BBB" },
  { href: "https://www.nla.org/", label: "National Limousine Association", source: "Industry Standards" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "pricing-factors",
    title: "What Affects Your Transportation Price",
    content: `
      <p>Understanding the factors that influence pricing helps you budget effectively and find the best value for your event.</p>
      
      <h4>Vehicle Type and Size</h4>
      <p>Larger vehicles with more amenities naturally cost more. A 50-passenger party bus with LED lighting and premium sound costs more than a 15-passenger mini bus. Similarly, specialty limousines like Hummer or Escalade stretches command higher rates than standard Lincoln stretches.</p>
      
      <h4>Day and Time</h4>
      <p>Weekend evenings (especially Fridays and Saturdays from 5pm-midnight) are peak demand periods with premium pricing. Weekday daytime rentals often cost 20-30% less. Sunday afternoons and Monday-Thursday evenings offer the best rates.</p>
      
      <h4>Seasonal Demand</h4>
      <p>Prom season (April-June), wedding season (May-October), and holidays (New Year's Eve, Valentine's Day) see highest demand and pricing. Booking during off-peak periods or well in advance can yield significant savings.</p>
      
      <h4>Duration and Distance</h4>
      <p>Most companies set minimum hour requirements (typically 4-5 hours on weekends). Longer rentals may qualify for discounted hourly rates. Extended travel distances may include fuel surcharges or deadhead charges for pickup locations far from the fleet base.</p>
      
      <h4>Location</h4>
      <p>Major metropolitan areas typically have higher rates due to operating costs, traffic considerations, and demand. Rural or suburban pickups may include travel fees if far from the company's base.</p>
    `,
  },
  {
    id: "party-bus-pricing",
    title: "Party Bus Pricing Breakdown",
    content: `
      <p>Party buses represent the best value for medium to large groups seeking an entertainment-focused experience.</p>
      
      <h4>Small Party Buses (15-20 Passengers)</h4>
      <p>Expect $150-$200 per hour for compact party buses. These offer all the fun features—sound systems, LED lighting, and bar areas—in a more intimate setting. Perfect for birthday groups and small friend gatherings.</p>
      
      <h4>Standard Party Buses (25-35 Passengers)</h4>
      <p>The most popular size range, pricing typically falls between $200-$300 per hour. These buses feature expanded dance floors, multiple entertainment zones, and generous amenity packages.</p>
      
      <h4>Mega Party Buses (40-50 Passengers)</h4>
      <p>Premium mega buses range from $300-$400+ per hour. These mobile nightclubs offer the most impressive experience with professional-grade sound, elaborate lighting, and VIP amenities.</p>
      
      <h4>Per-Person Economics</h4>
      <p>Despite higher total costs, party buses often provide the best per-person value. A $300/hour bus for 30 guests over 5 hours costs only $50 per person for the entire experience.</p>
    `,
  },
  {
    id: "limo-pricing",
    title: "Limousine Pricing Explained",
    content: `
      <p>Limousine pricing varies significantly based on vehicle type, creating options for every budget.</p>
      
      <h4>Sedan Limousines</h4>
      <p>Luxury sedans (Lincoln Town Car, Mercedes) start around $75-$100 per hour. Perfect for airport transfers, corporate transportation, and intimate occasions for 2-4 passengers.</p>
      
      <h4>Standard Stretch Limousines</h4>
      <p>Classic stretch limos (Lincoln, Chrysler 300) range from $125-$175 per hour, accommodating 8-12 passengers. These remain the most popular choice for weddings, proms, and special occasions.</p>
      
      <h4>SUV Limousines</h4>
      <p>Escalade, Navigator, and Hummer stretches command $200-$300 per hour. These premium vehicles seat 14-20 passengers and make dramatic statements for high-profile events.</p>
      
      <h4>Specialty and Exotic Limousines</h4>
      <p>Vintage vehicles, exotic brands (Bentley, Rolls-Royce), and custom-built specialty limos can exceed $350 per hour. These unique options create truly unforgettable experiences.</p>
    `,
  },
  {
    id: "coach-pricing",
    title: "Coach Bus Pricing Guide",
    content: `
      <p>Coach buses offer the most economical per-person pricing for large groups, especially for longer trips.</p>
      
      <h4>Mini Coaches (25-35 Passengers)</h4>
      <p>Compact coaches range from $125-$175 per hour. They navigate city streets easily while providing full coach amenities. Ideal for corporate shuttles and wedding guest transportation.</p>
      
      <h4>Standard Coaches (40-50 Passengers)</h4>
      <p>Full-size motorcoaches typically cost $150-$225 per hour. These workhorses offer the best value for larger groups with restrooms, reclining seats, and entertainment systems.</p>
      
      <h4>Executive Coaches</h4>
      <p>Premium configurations with leather seating, WiFi, and VIP amenities range from $200-$300 per hour. Popular for corporate travel and sports teams.</p>
      
      <h4>Daily vs. Hourly Rates</h4>
      <p>For extended use, many companies offer daily rates ($1,200-$2,500) that provide better value than hourly billing. Multi-day tours receive additional discounts.</p>
    `,
  },
  {
    id: "hidden-costs",
    title: "Understanding All Potential Costs",
    content: `
      <p>Transparent pricing requires understanding all potential charges beyond the base hourly rate.</p>
      
      <h4>Gratuity</h4>
      <p>Industry standard is 15-20% of the total rental cost. Some companies include it; others don't. Always confirm whether gratuity is included in your quote.</p>
      
      <h4>Fuel Surcharges</h4>
      <p>Some companies add fuel charges, especially for long-distance travel. Ask about fuel policy when getting quotes.</p>
      
      <h4>Overtime Charges</h4>
      <p>Exceeding your contracted time typically incurs overtime at 1.5x the hourly rate. Build buffer time into your reservation to avoid surprises.</p>
      
      <h4>Cleaning Fees</h4>
      <p>Excessive mess, spills, or damage can result in cleaning charges ranging from $150-$500. Most reasonable use doesn't trigger these fees.</p>
      
      <h4>Tolls and Parking</h4>
      <p>Depending on your itinerary, tolls and parking fees may apply. Some companies include these; others pass them through.</p>
      
      <h4>Airport Fees</h4>
      <p>Airport pickups and dropoffs often include surcharges ($20-$75) to cover airport access fees and waiting time.</p>
    `,
  },
  {
    id: "saving-money",
    title: "How to Get the Best Price",
    content: `
      <p>Strategic booking decisions can significantly reduce your transportation costs without sacrificing quality.</p>
      
      <h4>Book Early</h4>
      <p>Reserving 4-6 weeks ahead typically secures better rates and vehicle selection. Last-minute bookings limit options and may include premium charges.</p>
      
      <h4>Choose Off-Peak Times</h4>
      <p>Weekday rentals, daytime hours, and non-peak seasons offer 15-30% savings. Consider Sunday afternoons or Thursday evenings for significant discounts.</p>
      
      <h4>Right-Size Your Vehicle</h4>
      <p>Don't overpay for unused capacity. A vehicle at 75-80% capacity offers comfortable space without wasting money on empty seats.</p>
      
      <h4>Compare Multiple Quotes</h4>
      <p>Get quotes from at least three reputable companies. Prices vary significantly, and competition often yields better deals.</p>
      
      <h4>Ask About Packages</h4>
      <p>Many companies offer package deals for specific events (weddings, proms) or longer rentals that provide better value than hourly billing.</p>
      
      <h4>Negotiate Thoughtfully</h4>
      <p>For large bookings or repeat business, ask about discounts. Many companies offer flexibility, especially during slower periods.</p>
    `,
  },
];

export default async function PricingPage() {
  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="pricing" />

      <SectionDivider variant="glow" />

      <section className="bg-gradient-to-b from-[#060e23] to-[#0a1628] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <PricingCardsClient />

          <PricingFaqClient />
        </div>
      </section>

      <PremiumDivider />

      <FactsShowcase
        facts={PRICING_FACTS}
        title="Pricing By The Numbers"
        subtitle="Key statistics to help you budget for your transportation"
      />

      <SectionDivider variant="gradient" />

      <TriviaBookingSection
        triviaItems={PRICING_TRIVIA}
        title="Pricing Secrets & How to Book"
        subtitle="Insider knowledge to help you get the best value"
        bookingTitle="How to Book with Bus2Ride"
      />

      <SectionDivider variant="dots" />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Complete Pricing Guide"
        subtitle="Everything you need to understand transportation costs and find the best value"
        readTime="12 min"
        wordCount={2500}
      />

      <PremiumDivider />

      <section className="py-16 bg-gradient-to-b from-[#0a1628] to-[#060e23]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif mb-6">
            Ready for Your Custom Quote?
          </h2>
          <p className="text-blue-100/70 mb-8 max-w-2xl mx-auto">
            Every event is unique. Get a personalized quote based on your specific 
            date, group size, and itinerary.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
            >
              <Sparkles className="w-5 h-5" />
              Get Your Quote
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition"
            >
              <Calculator className="w-5 h-5" />
              Use Budget Calculator
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider variant="glow" />

      <FleetSection />

      <PremiumDivider />

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <SectionDivider variant="gradient" />

      <PollsGrid
        columnCategories={["pricing", "booking-lead-times", "corporate-discounts"]}
        hideCities
        title="Pricing Polls"
      />

      <SectionDivider variant="dots" />

      <ToolsGrid category="pricing" />

      <SectionDivider variant="glow" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Explore More"
      />

      <PremiumDivider />

      <EventsGrid />

      <SectionDivider variant="gradient" />

      <FaqSearchSection
        category="pricing"
        title="More pricing questions answered"
        aboveTitle="Pricing FAQ"
        description="Search answers about hourly rates, deposits, gratuity, and all the costs involved in renting transportation."
        inputPlaceholder='Try "deposit", "hourly rate", "gratuity"…'
      />
    </main>
  );
}
