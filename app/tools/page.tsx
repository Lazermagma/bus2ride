import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getTools } from "@/lib/data/tools";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { ToolsGridClient } from "@/components/sections/tools-grid.client";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Planning Tools",
  description:
    "Use calculators, checklists, and guides to plan routes, set budgets, and book the right vehicle with confidence.",
  path: "/tools",
});

const TOOLS_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What's the #1 tool used by event planners?",
    answer: "Budget calculators! Over 85% of event planners say budget tracking is their most-used digital tool. Getting costs right from the start prevents overspending and surprise fees.",
    category: "Industry Stat",
    source: "Event Planning Survey 2024",
  },
  {
    id: "2",
    question: "How much can proper planning tools save you?",
    answer: "Event planners using digital tools save an average of 23% on their total event budget. Checklists alone reduce forgotten expenses by 40%!",
    category: "Cost Savings",
    source: "Event Cost Analysis",
  },
  {
    id: "3",
    question: "What's the most overlooked planning detail?",
    answer: "Timeline buffers! 67% of events run behind schedule because planners didn't account for setup time, traffic, or unexpected delays. Always add 20% buffer time.",
    category: "Pro Tip",
    source: "Event Coordinator Feedback",
  },
  {
    id: "4",
    question: "How early should you start planning?",
    answer: "For major events like weddings, start 12 months ahead. Corporate events need 3-6 months. Even simple celebrations benefit from 4-6 weeks of planning.",
    category: "Timeline",
    source: "Professional Planners Association",
  },
  {
    id: "5",
    question: "What percentage of events need last-minute changes?",
    answer: "A whopping 78% of events require at least one significant change within the final week. Having contingency plans and flexible vendors is crucial!",
    category: "Reality Check",
    source: "Event Industry Report",
  },
];

const TOOLS_FACTS: FactItem[] = [
  { id: "1", stat: "79+", label: "Planning Tools", category: "stat" },
  { id: "2", stat: "15", label: "Categories", category: "stat" },
  { id: "3", stat: "10k+", label: "Users Helped", category: "stat" },
  { id: "4", stat: "23%", label: "Average Savings", category: "stat" },
  { id: "5", stat: "99%", label: "Satisfaction", category: "stat" },
  { id: "6", stat: "24/7", label: "Access", category: "stat" },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/pricing", label: "Pricing Guide", description: "Understand transportation costs", category: "resources" },
  { href: "/fleet", label: "Browse Fleet", description: "Explore vehicle options", category: "fleet" },
  { href: "/events", label: "Event Ideas", description: "Inspiration for your celebration", category: "events" },
  { href: "/contact", label: "Get a Quote", description: "Personalized pricing", category: "resources" },
  { href: "/locations", label: "Service Areas", description: "Find coverage in your city", category: "locations" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.theknot.com/", label: "Wedding Planning", source: "The Knot" },
  { href: "https://www.weddingwire.com/", label: "Vendor Resources", source: "WeddingWire" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "getting-started",
    title: "Getting Started with Event Planning",
    content: `
      <p>Successful event planning starts with the right tools. Whether you're organizing a wedding, corporate retreat, or birthday celebration, having the proper resources at your fingertips makes all the difference between a stressful scramble and a smooth execution.</p>
      
      <h4>Define Your Event Goals</h4>
      <p>Before diving into spreadsheets and calculators, clarify what success looks like. Is it staying under budget? Ensuring every guest has transportation? Creating an unforgettable experience? Your goals determine which tools you'll need most.</p>
      
      <h4>Build Your Planning Toolkit</h4>
      <p>Essential tools include: a budget calculator to track all expenses, a timeline builder to map out your schedule, guest management for tracking RSVPs and headcounts, and vendor comparison tools for evaluating quotes.</p>
      
      <h4>Start Early, Stay Organized</h4>
      <p>The earlier you begin planning, the more options you'll have and the better deals you'll find. Use digital tools to keep everything in one place—scattered notes and mental checklists are recipes for forgotten details.</p>
    `,
  },
  {
    id: "budgeting-mastery",
    title: "Mastering Your Event Budget",
    content: `
      <p>Budget management is where most events succeed or fail. A realistic budget prevents stress and ensures you can afford what matters most to you.</p>
      
      <h4>Build a Comprehensive Budget</h4>
      <p>Include all categories: venue, transportation, catering, entertainment, decorations, photography, and a contingency fund (typically 10-15% of total budget). Don't forget smaller expenses like tips, permits, and insurance.</p>
      
      <h4>Prioritize Ruthlessly</h4>
      <p>Rank your spending categories by importance. For a wedding, transportation and photography might top the list. For a corporate event, venue and catering may be priorities. Allocate funds accordingly.</p>
      
      <h4>Track Everything</h4>
      <p>Use budget tracking tools religiously. Log every quote, deposit, and payment. Compare actual spending to projections weekly. Catching overruns early gives you time to adjust.</p>
      
      <h4>Negotiate Smartly</h4>
      <p>Many vendors offer discounts for off-peak dates, package deals, or early booking. Use comparison tools to understand market rates before negotiating.</p>
    `,
  },
  {
    id: "timeline-planning",
    title: "Building the Perfect Timeline",
    content: `
      <p>A detailed timeline is your event's roadmap. It keeps vendors synchronized, prevents bottlenecks, and ensures nothing falls through the cracks.</p>
      
      <h4>Work Backwards</h4>
      <p>Start from your event date and work backwards. When must the venue be booked? When should invitations go out? When do you need final headcounts? Create deadlines for each milestone.</p>
      
      <h4>Build in Buffer Time</h4>
      <p>The #1 timeline mistake is underestimating how long things take. Add 20-30% buffer to every task. If setup "should" take 2 hours, plan for 3. Traffic is worse than expected? No problem.</p>
      
      <h4>Coordinate Vendor Schedules</h4>
      <p>Share your timeline with all vendors. Make sure the florist arrives before the photographer. Ensure transportation knows exactly when to pick up guests. Miscommunication causes chaos.</p>
      
      <h4>Day-Of Schedule</h4>
      <p>Create a minute-by-minute schedule for event day. Include contact information for every vendor. Designate a point person who can make decisions if you're unavailable.</p>
    `,
  },
  {
    id: "vendor-selection",
    title: "Choosing the Right Vendors",
    content: `
      <p>Your vendors can make or break your event. The right team turns your vision into reality; the wrong choice leads to disappointment and stress.</p>
      
      <h4>Research Thoroughly</h4>
      <p>Read reviews, check references, and verify credentials. Look for vendors with experience in your event type. A corporate event specialist may not be ideal for an intimate wedding.</p>
      
      <h4>Compare Apples to Apples</h4>
      <p>Use comparison tools to evaluate quotes. Ensure you're comparing similar services—a cheap quote that doesn't include essentials isn't actually cheaper.</p>
      
      <h4>Meet in Person When Possible</h4>
      <p>Chemistry matters, especially with photographers, planners, and entertainment. Can you communicate easily? Do they understand your vision? Trust your instincts.</p>
      
      <h4>Get Everything in Writing</h4>
      <p>Contracts should specify: exact services provided, pricing and payment schedule, cancellation policies, backup plans, and contact information. Never proceed on verbal agreements alone.</p>
    `,
  },
  {
    id: "guest-management",
    title: "Managing Your Guest Experience",
    content: `
      <p>Your guests are the heart of your event. Managing their experience—from invitation to farewell—requires thoughtful planning and the right tools.</p>
      
      <h4>Streamline RSVPs</h4>
      <p>Use digital RSVP tools for faster responses and easier tracking. Set clear deadlines and send reminders. Have a system for tracking dietary restrictions, accessibility needs, and plus-ones.</p>
      
      <h4>Plan Transportation Carefully</h4>
      <p>Group transportation simplifies logistics for you and your guests. Use headcount tools to ensure adequate capacity. Share clear pickup times and locations.</p>
      
      <h4>Create a Guest Communication Plan</h4>
      <p>Send save-the-dates early, followed by formal invitations. Provide directions, parking information, and event schedules. Consider a simple website or app for real-time updates.</p>
      
      <h4>Think About Comfort</h4>
      <p>Consider guest comfort throughout: adequate seating, temperature control, accessible facilities, and refreshments. Happy guests make for memorable events.</p>
    `,
  },
  {
    id: "contingency-planning",
    title: "Planning for the Unexpected",
    content: `
      <p>Even the best-planned events face surprises. Smart contingency planning means you can handle problems gracefully without derailing your celebration.</p>
      
      <h4>Identify Potential Risks</h4>
      <p>What could go wrong? Weather for outdoor events, vendor no-shows, equipment failures, health emergencies. List possible problems and rank them by likelihood and impact.</p>
      
      <h4>Create Backup Plans</h4>
      <p>For each major risk, have a Plan B ready. Indoor backup for outdoor venues. Backup vendor contacts. Extra supplies for emergencies. The goal isn't to prevent problems—it's to solve them quickly.</p>
      
      <h4>Build a Emergency Kit</h4>
      <p>Prepare an event-day kit: first aid supplies, sewing kit, stain remover, phone chargers, snacks, cash, and important phone numbers. Small problems solved quickly don't become big problems.</p>
      
      <h4>Designate Decision Makers</h4>
      <p>If you're the honoree (bride, birthday person, etc.), designate someone else to handle emergencies. They should have authority to make decisions and spend money if needed.</p>
    `,
  },
];

export default async function ToolsPage() {
  const tools = await getTools(100);
  const reviews = (await getReviews()) ?? [];

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="tools" />

      <SectionDivider variant="glow" />

      <FactsShowcase
        facts={TOOLS_FACTS}
        title="Tools By The Numbers"
        subtitle="Everything you need to plan the perfect event"
      />

      <PremiumDivider />

      <ToolsGridClient tools={tools} />

      <SectionDivider variant="gradient" />

      <FactsShowcase
        facts={[
          { id: "1", stat: "2.4M+", label: "Votes Cast", description: "Real opinions from riders nationwide", icon: "trending", category: "stat" },
          { id: "2", stat: "89%", label: "Prefer LED Lighting", description: "The most-requested party bus feature", icon: "zap", category: "insight" },
          { id: "3", stat: "6 Weeks", label: "Ideal Booking Lead", description: "Sweet spot for availability and pricing", icon: "clock", category: "tip" },
          { id: "4", stat: "18-22", label: "Optimal Group Size", description: "Best energy without overcrowding", icon: "users", category: "insight" },
          { id: "5", stat: "$45-65", label: "Per Person Average", description: "Typical cost when splitting 4-hour rental", icon: "star", category: "stat" },
          { id: "6", stat: "Saturday 7PM", label: "Peak Booking Time", description: "Most popular departure for events", icon: "clock", category: "tip" },
        ]}
        title="Poll Insights at a Glance"
        subtitle="Key statistics from our community voting data"
      />

      <SectionDivider variant="glow" />

      <TriviaBookingSection
        triviaItems={TOOLS_TRIVIA}
        title="Planning Trivia & How to Book"
        subtitle="Insider knowledge and step-by-step booking guide"
        bookingTitle="How to Book with Bus2Ride"
      />

      <SectionDivider variant="gradient" />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Complete Event Planning Guide"
        subtitle="Everything you need to know about organizing a successful event"
        readTime="15 min"
        wordCount={2500}
      />

      <PremiumDivider />

      <FleetSection />

      <SectionDivider variant="glow" />

      <ReviewsSection reviews={reviews} />

      <PremiumDivider />

      <PollsGrid
        columnCategories={["pricing", "booking-lead-times", "entertainment-tours"]}
        hideCities
        title="Planning Polls"
      />

      <SectionDivider variant="dots" />

      <BookingProcessSection />

      <SectionDivider variant="gradient" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Continue Planning"
      />

      <PremiumDivider />

      <EventsGrid />

      <SectionDivider variant="dots" />

      <FaqSection category="tools" title="Tools FAQs" />
    </main>
  );
}
