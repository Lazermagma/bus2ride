import Hero from "@/components/layout/hero";
import Image from "next/image";
import Link from "next/link";
import { getRandomVehicleByType } from "@/lib/data/vehicles";
import { getRandomImage } from "@/lib/helpers/storage";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import { pageMetadata } from "@/lib/seo/metadata";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { 
  Sparkles, 
  Users, 
  Music, 
  Shield, 
  Star, 
  ArrowRight,
  Crown,
  Zap,
  Heart
} from "lucide-react";

export const metadata = pageMetadata({
  title: "Fleet",
  description:
    "Explore party buses, limousines, and coach buses. Compare styles, capacity, and amenities to find the right ride for your group.",
  path: "/fleet",
});

type FleetCardConfig = {
  title: string;
  description: string;
  longDescription: string;
  href: string;
  type: "party-bus" | "limo" | "coach";
  features: string[];
  capacity: string;
  priceRange: string;
  borderClassName: string;
  tagClassName: string;
  gradientFrom: string;
  gradientTo: string;
  icon: React.ReactNode;
};

const FLEET_CARDS: FleetCardConfig[] = [
  {
    title: "Party Buses",
    description: "Big energy, big sound, and room for everyone.",
    longDescription: "Transform your journey into the main event with our premium party buses. Featuring club-quality sound systems, LED lighting, and spacious dance floors.",
    href: "/party-buses",
    type: "party-bus",
    features: ["LED Lighting", "Premium Sound", "Dance Poles", "Bar Areas"],
    capacity: "15-50 guests",
    priceRange: "$150-$400/hr",
    borderClassName: "border-blue-500/35",
    tagClassName: "text-blue-200/70",
    gradientFrom: "from-blue-600/20",
    gradientTo: "to-cyan-600/20",
    icon: <Music className="w-5 h-5" />,
  },
  {
    title: "Limousines",
    description: "Clean, classy, and perfect for a polished arrival.",
    longDescription: "Make an unforgettable entrance with our luxury limousines. From classic stretch limos to modern SUV limousines, arrive in style.",
    href: "/limousines",
    type: "limo",
    features: ["Leather Interior", "Privacy Glass", "Champagne Bar", "Climate Control"],
    capacity: "6-20 guests",
    priceRange: "$100-$300/hr",
    borderClassName: "border-violet-500/35",
    tagClassName: "text-violet-200/70",
    gradientFrom: "from-violet-600/20",
    gradientTo: "to-purple-600/20",
    icon: <Crown className="w-5 h-5" />,
  },
  {
    title: "Coach Buses",
    description: "Comfortable group travel for longer routes and events.",
    longDescription: "Perfect for corporate events, weddings, and group tours. Our coach buses combine comfort with capacity for seamless group transportation.",
    href: "/coach-buses",
    type: "coach",
    features: ["Reclining Seats", "Overhead Storage", "WiFi Ready", "Restroom"],
    capacity: "25-56 guests",
    priceRange: "$125-$350/hr",
    borderClassName: "border-emerald-500/35",
    tagClassName: "text-emerald-200/70",
    gradientFrom: "from-emerald-600/20",
    gradientTo: "to-teal-600/20",
    icon: <Users className="w-5 h-5" />,
  },
];

const FLEET_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "The first stretch limousine was created in 1928 and was called a 'big band bus' because it transported musicians and their instruments.",
    answer: "True! Armbruster & Company in Fort Smith, Arkansas built the first stretch limousine to transport famous big band leaders like Benny Goodman and Glenn Miller.",
    category: "History",
    source: "Limousine History Archives",
  },
  {
    id: "2",
    question: "How many LED lights does the average party bus have?",
    answer: "Most modern party buses feature between 500-2,000 LED lights! Some ultra-premium buses have over 5,000 programmable LEDs that can sync to music.",
    category: "Fun Fact",
    source: "Party Bus Industry Survey 2024",
  },
  {
    id: "3",
    question: "The longest limousine in the world is over 100 feet long.",
    answer: "True! The American Dream, built by Jay Ohrberg, measures 100 feet and includes a swimming pool, helipad, and king-size waterbed.",
    category: "Records",
    source: "Guinness World Records",
  },
  {
    id: "4",
    question: "What percentage of brides choose limousines for their wedding day?",
    answer: "Approximately 72% of brides in the US use a limousine or luxury vehicle for their wedding transportation, making weddings the #1 occasion for limo rentals.",
    category: "Statistics",
    source: "Wedding Wire Survey 2024",
  },
  {
    id: "5",
    question: "Party buses were invented in the 1990s as a solution for what problem?",
    answer: "Party buses emerged to solve the issue of groups getting separated while bar-hopping. They allowed the party to continue between venues while keeping everyone together and safe.",
    category: "History",
    source: "Transportation Industry Journal",
  },
];

const FLEET_FACTS: FactItem[] = [
  {
    id: "1",
    stat: "2.5M+",
    label: "Party bus trips annually in the US",
    description: "The party bus industry has grown 340% since 2010, with over 2.5 million trips booked annually across the United States.",
    icon: "trending",
    category: "stat",
  },
  {
    id: "2",
    stat: "94%",
    label: "Customer satisfaction rate",
    description: "Professional chauffeur services maintain an average 94% customer satisfaction rate, compared to 78% for rideshare services.",
    icon: "star",
    category: "stat",
  },
  {
    id: "3",
    stat: "4.5 hrs",
    label: "Average rental duration",
    description: "Most customers rent vehicles for 4-5 hours, with wedding bookings averaging 6-8 hours and prom rentals averaging 5-6 hours.",
    icon: "clock",
    category: "insight",
  },
  {
    id: "4",
    stat: "$12B",
    label: "US limousine market size",
    description: "The US limousine and party bus market is valued at over $12 billion annually, employing over 150,000 professional chauffeurs.",
    icon: "trending",
    category: "stat",
  },
  {
    id: "5",
    stat: "73%",
    label: "Book 2-4 weeks ahead",
    description: "For the best selection and pricing, 73% of satisfied customers book their vehicles 2-4 weeks in advance of their event.",
    icon: "zap",
    category: "tip",
  },
  {
    id: "6",
    stat: "15-20%",
    label: "Standard gratuity",
    description: "Industry standard gratuity for chauffeur services ranges from 15-20%, similar to restaurant service standards.",
    icon: "users",
    category: "tip",
  },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/party-buses", label: "Browse Party Buses", description: "15-50 passenger party buses with premium sound systems", category: "fleet" },
  { href: "/limousines", label: "Explore Limousines", description: "Luxury stretch limos and SUV limousines", category: "fleet" },
  { href: "/coach-buses", label: "View Coach Buses", description: "Comfortable group transportation for any occasion", category: "fleet" },
  { href: "/pricing", label: "Pricing Guide", description: "Transparent pricing and what affects your quote", category: "resources" },
  { href: "/events", label: "Event Ideas", description: "Inspiration for weddings, proms, bachelor parties & more", category: "events" },
  { href: "/locations", label: "Service Areas", description: "Cities and regions we serve across the country", category: "locations" },
  { href: "/tools", label: "Planning Tools", description: "Calculators, checklists, and booking helpers", category: "tools" },
  { href: "/reviews", label: "Customer Reviews", description: "See what real customers say about their experience", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.lctmag.com/", label: "Limousine, Charter & Tour Magazine", source: "Industry News" },
  { href: "https://www.nla.org/", label: "National Limousine Association", source: "Industry Association" },
  { href: "https://www.usdot.gov/", label: "US Department of Transportation Safety", source: "Safety Standards" },
  { href: "https://www.theknot.com/content/wedding-transportation-guide", label: "Wedding Transportation Guide", source: "The Knot" },
  { href: "https://www.weddingwire.com/", label: "Wedding Planning Resources", source: "WeddingWire" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "choosing-vehicle",
    title: "How to Choose the Right Vehicle for Your Event",
    content: `
      <p>Selecting the perfect vehicle for your celebration requires careful consideration of several key factors. The right choice can elevate your event from memorable to absolutely unforgettable.</p>
      
      <h4>Consider Your Group Size</h4>
      <p>The first and most crucial factor is your passenger count. Party buses typically accommodate 15-50 guests, making them ideal for bachelor/bachelorette parties, birthday celebrations, and corporate outings. Limousines work best for intimate groups of 6-20, perfect for weddings, proms, and romantic occasions. Coach buses excel for larger groups of 25-56, ideal for corporate events, sports team transportation, and group tours.</p>
      
      <h4>Match the Occasion</h4>
      <p>Different events call for different vibes. A wild bachelorette party demands a party bus with LED lighting and a pumping sound system. A elegant wedding requires a sophisticated limousine with champagne service. A corporate retreat needs a professional coach bus with business amenities. Consider what atmosphere you want to create.</p>
      
      <h4>Duration and Distance</h4>
      <p>Short trips around town are perfect for limousines and party buses. Longer journeys of several hours benefit from coach buses with restrooms, reclining seats, and climate control. Think about comfort needs based on how long guests will be on board.</p>
      
      <h4>Budget Considerations</h4>
      <p>While price shouldn't be the only factor, it's important to understand value. Party buses often provide the best per-person value for medium-sized groups. Limousines offer luxury at premium rates. Coach buses balance capacity with cost-effectiveness for large groups.</p>
    `,
  },
  {
    id: "amenities-guide",
    title: "Understanding Vehicle Amenities and Features",
    content: `
      <p>Modern luxury transportation vehicles come equipped with an impressive array of features designed to enhance your experience. Understanding these amenities helps you choose wisely.</p>
      
      <h4>Entertainment Systems</h4>
      <p>Party buses lead the pack with club-quality sound systems featuring subwoofers, multiple speakers, and Bluetooth connectivity. Many include flat-screen TVs, karaoke systems, and even gaming consoles. Limousines offer premium sound with privacy partitions and intercom systems. Coach buses feature overhead entertainment and PA systems.</p>
      
      <h4>Lighting and Atmosphere</h4>
      <p>LED lighting has revolutionized party transportation. Modern party buses feature color-changing LEDs, laser lights, and even fog machines. Limousines use fiber optic starlight ceilings and ambient mood lighting. These elements transform the vehicle interior into an immersive experience.</p>
      
      <h4>Comfort Features</h4>
      <p>Premium leather seating, climate control, and ample legroom are standard across our fleet. Party buses include dance poles, wraparound seating, and bar areas. Limousines feature plush interiors with mini-bars and champagne service. Coach buses offer reclining seats, overhead storage, and onboard restrooms.</p>
      
      <h4>Safety Equipment</h4>
      <p>Every vehicle in our fleet includes modern safety features: GPS tracking, backup cameras, fire extinguishers, first aid kits, and emergency exits. Our chauffeurs undergo extensive training and background checks.</p>
    `,
  },
  {
    id: "booking-process",
    title: "The Complete Booking Process Explained",
    content: `
      <p>Booking luxury transportation should be as smooth as the ride itself. Here's exactly what to expect when you reserve a vehicle from our fleet.</p>
      
      <h4>Step 1: Get Your Quote</h4>
      <p>Start by providing your event date, pickup/dropoff locations, group size, and any special requirements. Our team will match you with appropriate vehicle options and provide transparent pricing with no hidden fees.</p>
      
      <h4>Step 2: Vehicle Selection</h4>
      <p>Browse available vehicles that meet your criteria. View detailed photos, amenity lists, and capacity information. Our team can schedule in-person tours for major bookings if you want to see the vehicle before committing.</p>
      
      <h4>Step 3: Confirmation and Deposit</h4>
      <p>Secure your booking with a deposit (typically 25-50% of the total). You'll receive a detailed confirmation including pickup times, addresses, driver information, and our policies on gratuity, BYOB rules, and cancellations.</p>
      
      <h4>Step 4: Day-of Coordination</h4>
      <p>Your chauffeur will contact you before your pickup time. They'll arrive 10-15 minutes early to ensure smooth boarding. Throughout your event, they'll handle all logistics while you focus on celebrating.</p>
      
      <h4>Step 5: Post-Event</h4>
      <p>After your trip, we'll send a follow-up email for feedback. We value your input and use it to continuously improve our service.</p>
    `,
  },
  {
    id: "safety-standards",
    title: "Our Safety Standards and Certifications",
    content: `
      <p>Safety is our absolute priority. Every vehicle in our fleet meets or exceeds federal and state safety requirements, and we go above and beyond to protect our passengers.</p>
      
      <h4>Vehicle Maintenance</h4>
      <p>Our fleet undergoes rigorous inspection schedules far exceeding DOT requirements. Every vehicle receives a comprehensive 150-point inspection before each trip. Annual maintenance includes brake system overhauls, suspension checks, and complete safety system verification.</p>
      
      <h4>Chauffeur Standards</h4>
      <p>Every chauffeur maintains a commercial driver's license (CDL) with passenger endorsement. We conduct thorough background checks, drug testing, and ongoing training programs. Our drivers complete defensive driving courses and customer service training annually.</p>
      
      <h4>Insurance Coverage</h4>
      <p>We carry comprehensive commercial insurance coverage well above minimum requirements. Our policies include passenger liability, collision coverage, and umbrella protection. Certificates of insurance are available upon request for event venues.</p>
      
      <h4>Compliance and Licensing</h4>
      <p>We maintain all required federal, state, and local operating authority. Our company is fully licensed by the Department of Transportation and compliant with all passenger carrier regulations.</p>
    `,
  },
  {
    id: "special-occasions",
    title: "Popular Events and Special Occasion Ideas",
    content: `
      <p>Our fleet serves every type of celebration imaginable. Here are some of the most popular occasions and how we can make them extraordinary.</p>
      
      <h4>Weddings</h4>
      <p>From bridal party transportation to grand exits, limousines are wedding day favorites. Coordinate matching vehicles for the wedding party, ensure on-time arrivals at the ceremony, and celebrate with champagne toasts in style. Many couples book party buses for guest shuttles between ceremony and reception venues.</p>
      
      <h4>Bachelor and Bachelorette Parties</h4>
      <p>Party buses are the ultimate choice for these milestone celebrations. Keep the group together, maintain the party energy between venues, and ensure everyone arrives home safely. Our party buses feature the entertainment systems that make these nights legendary.</p>
      
      <h4>Prom and Homecoming</h4>
      <p>Help students create picture-perfect memories with luxury limousine transportation. Parents love knowing their teens are in the hands of professional chauffeurs. Photo ops, safe transportation, and unforgettable arrivals are guaranteed.</p>
      
      <h4>Corporate Events</h4>
      <p>Impress clients and team members with professional transportation. Coach buses are ideal for conferences, team-building retreats, and holiday parties. We offer corporate accounts with simplified booking and billing.</p>
      
      <h4>Birthdays and Anniversaries</h4>
      <p>Celebrate milestone birthdays and anniversaries in style. Whether it's a surprise pickup or a planned celebration tour, we help create moments that last a lifetime.</p>
    `,
  },
  {
    id: "pricing-factors",
    title: "What Affects Your Rental Price",
    content: `
      <p>Understanding pricing helps you budget effectively and find the best value for your event. Here are the primary factors that influence your quote.</p>
      
      <h4>Vehicle Type and Size</h4>
      <p>Larger vehicles with more amenities command higher rates. A 50-passenger party bus with premium features costs more than a standard 15-passenger bus. Stretch limousines are priced differently than SUV limos. Consider your actual needs versus wants.</p>
      
      <h4>Duration of Rental</h4>
      <p>Most rentals have minimum hour requirements (typically 3-5 hours). Hourly rates may decrease for longer rentals. All-day packages often provide better value than hourly rates for extended events.</p>
      
      <h4>Day and Season</h4>
      <p>Weekend evenings (Friday and Saturday) are peak demand times. Prom season (April-May), wedding season (May-October), and holidays see higher rates. Booking mid-week or during off-peak seasons can offer significant savings.</p>
      
      <h4>Location and Distance</h4>
      <p>Pickup location affects pricing based on distance from our fleet garage. Extended travel to remote locations may include fuel surcharges. Multiple stops and complex itineraries can impact total cost.</p>
      
      <h4>Additional Services</h4>
      <p>Red carpet service, special decorations, champagne packages, and extended wait times are available add-ons. Some are complimentary; others carry additional fees.</p>
    `,
  },
];

export default async function FleetPage() {
  const [vehicles, reviews, totalReviewsCount] = await Promise.all([
    Promise.all(FLEET_CARDS.map((card) => getRandomVehicleByType(card.type))),
    getReviews(),
    getReviewsCount(),
  ]);

  const cardsWithImages = FLEET_CARDS.map((card, idx) => {
    const vehicle = vehicles[idx];
    const imageUrl = getRandomImage(vehicle?.images ?? null, "vehicles1");
    return {
      ...card,
      imageUrl,
      imageAlt: vehicle?.name ? `${vehicle.name} photo` : `${card.title} photo`,
    };
  });

  return (
    <main>
      <Hero slug="fleet" />

      <SectionDivider variant="glow" />

      <section className="bg-gradient-to-b from-[#0a1628] to-[#060e23] py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif mb-4">
              Choose Your Perfect Ride
            </h2>
            <p className="text-blue-200/70 max-w-2xl mx-auto">
              Three distinct vehicle categories, each designed to deliver 
              exceptional experiences for different occasions and group sizes.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {cardsWithImages.map((card, idx) => (
              <Link
                key={card.type}
                href={card.href}
                className="group relative rounded-3xl overflow-hidden border border-white/10 
                  bg-gradient-to-br from-[#0f1f45]/80 to-[#060E23]/80 backdrop-blur
                  shadow-[0_25px_80px_rgba(3,7,18,0.5)] 
                  hover:shadow-[0_35px_100px_rgba(59,130,246,0.15)]
                  hover:border-blue-500/30 hover:-translate-y-2 transition-all duration-500
                  animate-fade-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className={`relative h-64 w-full border-b ${card.borderClassName}`}>
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority={card.type === "party-bus"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060E23] via-[#060E23]/50 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} border border-white/20`}>
                      {card.icon}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-[0.2em] ${card.tagClassName}`}>
                      {card.type.replace("-", " ")}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-medium text-white/80">
                      {card.capacity}
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2 group-hover:text-blue-300 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-blue-100/70 text-sm leading-relaxed mb-4">
                    {card.longDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {card.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/60">
                      {card.priceRange}
                    </span>
                    <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      <span>View Fleet</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-20`} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PremiumDivider />

      <FactsShowcase
        facts={FLEET_FACTS}
        title="Industry Insights & Statistics"
        subtitle="Fascinating numbers that reveal the world of luxury transportation"
      />

      <SectionDivider variant="gradient" />

      <TriviaBookingSection
        triviaItems={FLEET_TRIVIA}
        title="Party Transportation Trivia & How to Book"
        subtitle="Test your knowledge and learn our simple booking process"
        bookingTitle="How to Book Your Perfect Vehicle"
      />

      <SectionDivider variant="dots" />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Complete Fleet Guide"
        subtitle="Everything you need to know about choosing, booking, and enjoying luxury transportation"
        readTime="12 min"
        wordCount={2500}
      />

      <PremiumDivider />

      <ReviewsSection reviews={reviews ?? []} totalCount={totalReviewsCount ?? 0} />

      <SectionDivider variant="glow" />

      <PollsGrid
        columnCategories={["party-bus", "limo", "coach-bus"]}
        hideCities
        title="Fleet Polls"
      />

      <SectionDivider variant="gradient" />

      <ToolsGrid category="fleet" />

      <SectionDivider variant="dots" />

      <EventsGrid />

      <PremiumDivider />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Continue Your Journey"
      />

      <SectionDivider variant="glow" />

      <FaqSearchSection
        category="fleet"
        title="Everything about our fleet answered"
        aboveTitle="Fleet FAQ"
        description="Search through common questions about vehicle types, amenities, capacity, and booking our luxury fleet."
        inputPlaceholder='Try "party bus capacity", "limo amenities", "booking"…'
      />
    </main>
  );
}
