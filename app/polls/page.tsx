import Hero from "@/components/layout/hero";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { EventsGrid } from "@/components/sections/events-grid";
import { pageMetadata } from "@/lib/seo/metadata";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider } from "@/components/layout/section-dividers";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { PollsExplorer } from "@/components/sections/polls-explorer.client";
import { FilteredPollsClient } from "@/components/sections/filtered-polls.client";
import { LiveStatsBar, DEFAULT_LIVE_STATS, type LiveStat } from "@/components/sections/live-stats-bar";
import { PollFilterTabs } from "@/components/sections/poll-filter-tabs";
import { getPollAnalytics, analyticsToLiveStats, type LiveStatData } from "@/lib/data/poll-analytics";

const TRIVIA_ITEMS: TriviaItem[] = [
  {
    id: "1",
    question: "What percentage of group event planners say transportation is their biggest stress?",
    answer: "78% of event planners cite transportation coordination as their top logistical concern, ahead of catering and venue.",
    category: "Industry Stats",
    source: "Event Planning Association 2024",
  },
  {
    id: "2",
    question: "How far in advance do most couples book wedding transportation?",
    answer: "6-9 months before the wedding date. Peak season bookings (May-October) often require 12+ months advance notice.",
    category: "Booking Tips",
    source: "The Knot Wedding Study",
  },
  {
    id: "3",
    question: "What's the most popular party bus feature according to rider polls?",
    answer: "LED lighting systems and sound systems tie for first place, with 42% of riders ranking each as essential.",
    category: "Rider Preferences",
    source: "Bus2Ride Community Polls",
  },
  {
    id: "4",
    question: "What day of the week has the lowest party bus rental rates?",
    answer: "Tuesday and Wednesday rentals can be 30-40% cheaper than Friday or Saturday bookings.",
    category: "Money Saver",
    source: "Industry Pricing Data",
  },
  {
    id: "5",
    question: "How many guests is the sweet spot for party bus group size?",
    answer: "15-20 passengers is ideal—large enough for great energy, small enough that everyone stays connected.",
    category: "Planning Tips",
    source: "Event Coordinator Survey",
  },
];

const FACT_ITEMS: FactItem[] = [
  { id: "1", stat: "2.4M+", label: "Votes Cast", description: "Real opinions from riders nationwide", icon: "trending", category: "stat" },
  { id: "2", stat: "89%", label: "Prefer LED Lighting", description: "The most-requested party bus feature", icon: "zap", category: "insight" },
  { id: "3", stat: "6 Weeks", label: "Ideal Booking Lead", description: "Sweet spot for availability and pricing", icon: "clock", category: "tip" },
  { id: "4", stat: "18-22", label: "Optimal Group Size", description: "Best energy without overcrowding", icon: "users", category: "insight" },
  { id: "5", stat: "$45-65", label: "Per Person Average", description: "Typical cost when splitting 4-hour rental", icon: "star", category: "stat" },
  { id: "6", stat: "Saturday 7PM", label: "Peak Booking Time", description: "Most popular departure for events", icon: "clock", category: "tip" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "understanding-polls",
    title: "Understanding Community Polls",
    content: `Community polls are the heartbeat of the Bus2Ride experience. Unlike generic review sites that only capture post-event feedback, our polling system captures real-time preferences, concerns, and priorities from riders at every stage of the booking journey. This creates an invaluable resource for anyone planning group transportation—whether it's your first party bus rental or your fiftieth corporate shuttle booking.<br><br>Our polls cover everything from pricing expectations to amenity preferences, safety priorities to booking timing. Each vote contributes to a growing database of rider intelligence that helps future customers make more informed decisions. When you vote on a poll, you're not just sharing your opinion—you're contributing to a community knowledge base that benefits everyone.`,
  },
  {
    id: "how-voting-works",
    title: "How Voting Works",
    content: `The voting process is designed to be simple, anonymous, and impactful. When you cast a vote, it's recorded instantly and the poll results update in real-time. You don't need an account to vote, but registered users can track their voting history and see how community preferences change over time.<br><br>Each poll is crafted to address a specific decision point in the transportation booking process. Some polls are straightforward preference questions (LED lights vs. traditional lighting), while others explore more nuanced trade-offs (cost savings vs. newer vehicles). The diversity of poll topics ensures that riders with different priorities all find relevant insights.<br><br>Results are displayed as percentage breakdowns with vote counts, giving you both relative preferences and absolute numbers. High-vote polls carry more statistical weight, while newer polls with fewer votes show emerging trends that may shift as more community members participate.`,
  },
  {
    id: "poll-categories",
    title: "Poll Categories Explained",
    content: `Our polls are organized into intuitive categories that align with common transportation decisions. <strong>Party Bus polls</strong> focus on nightlife, celebrations, and entertainment-focused rentals—think bachelorette parties, birthday celebrations, and concert shuttles. <strong>Limousine polls</strong> address luxury transportation needs including weddings, proms, corporate events, and airport transfers.<br><br><strong>Coach Bus polls</strong> cover group travel, corporate shuttles, school trips, and multi-day excursions where capacity and comfort take priority. <strong>Pricing polls</strong> help you understand what others are paying and expecting, from hourly rates to tipping norms. <strong>Booking Experience polls</strong> capture insights about the reservation process itself—preferred contact methods, contract expectations, and customer service priorities.<br><br>The <strong>Events category</strong> cuts across vehicle types to address specific occasions: weddings, proms, sporting events, concerts, and corporate functions. These polls help you see how others approach transportation for events similar to yours.`,
  },
  {
    id: "using-poll-insights",
    title: "Using Poll Insights for Better Decisions",
    content: `Poll data becomes most powerful when applied to your specific situation. Start by identifying polls relevant to your event type and vehicle preference. If you're planning a bachelorette party, filter to party bus and events categories. Planning a corporate retreat? Focus on coach bus and booking experience polls.<br><br>Look for consensus results (70%+ agreement) as strong indicators of best practices. For example, if 85% of riders say they'd pay more for a newer vehicle, that's a clear signal that vehicle age should factor into your decision. Split results (45-55%) indicate areas where personal preference matters more than community consensus.<br><br>Don't just look at what won—pay attention to the losing options too. If 30% of riders prioritize price over amenities, and you're in that 30%, you know that budget-focused options will serve you well even if they're not the majority preference. Poll insights should inform your decision, not dictate it.`,
  },
  {
    id: "contributing-value",
    title: "Contributing to Community Knowledge",
    content: `Every vote matters. Our poll results are cited by industry publications, used by transportation companies to improve their offerings, and referenced by thousands of event planners each month. When you participate, you're shaping the future of group transportation.<br><br>Beyond voting, consider the context you bring. Polls are most valuable when they reflect diverse perspectives—first-time renters and frequent bookers, budget-conscious planners and luxury seekers, small groups and large parties. Your unique viewpoint adds dimension to our community intelligence.<br><br>We regularly introduce new polls based on emerging trends, seasonal events, and community suggestions. If there's a question you wish we'd asked, reach out through our contact page. The best poll ideas often come from riders facing real decisions.`,
  },
];

const ADDITIONAL_INTERNAL_LINKS: InternalLink[] = [
  { href: "/fleet/party-buses", label: "Party Bus Fleet", description: "Browse available party buses", category: "fleet" },
  { href: "/fleet/limousines", label: "Limousine Fleet", description: "Explore luxury limousines", category: "fleet" },
  { href: "/fleet/coach-buses", label: "Coach Bus Fleet", description: "View group travel options", category: "fleet" },
  { href: "/events/weddings", label: "Wedding Transport", description: "Wedding transportation guide", category: "events" },
  { href: "/events/prom", label: "Prom Packages", description: "Prom night transportation", category: "events" },
];

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Transportation Polls",
  description:
    "Vote on real booking questions and see what riders prioritize — pricing, safety, accessibility, and party bus rules.",
  path: "/polls",
});

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/fleet", label: "Browse Fleet", description: "Explore our vehicle options", category: "fleet" },
  { href: "/pricing", label: "Pricing Guide", description: "Understand transportation costs", category: "resources" },
  { href: "/events", label: "Event Ideas", description: "Find inspiration for celebrations", category: "events" },
  { href: "/reviews", label: "Customer Reviews", description: "Real experiences from riders", category: "resources" },
  { href: "/tools", label: "Planning Tools", description: "Calculators and checklists", category: "tools" },
  { href: "/faq", label: "FAQ Center", description: "Answers to common questions", category: "resources" },
  { href: "/blog", label: "Transportation Blog", description: "Tips and industry insights", category: "resources" },
  { href: "/contact", label: "Get a Quote", description: "Request personalized pricing", category: "resources" },
  ...ADDITIONAL_INTERNAL_LINKS,
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.theknot.com/", label: "Wedding Planning", source: "The Knot" },
  { href: "https://www.brides.com/", label: "Bridal Resources", source: "Brides" },
  { href: "https://www.weddingwire.com/", label: "Vendor Reviews", source: "WeddingWire" },
  { href: "https://www.eventbrite.com/", label: "Event Discovery", source: "Eventbrite" },
  { href: "https://www.yelp.com/", label: "Local Reviews", source: "Yelp" },
  { href: "https://www.promgirl.com/", label: "Prom Inspiration", source: "PromGirl" },
  { href: "https://www.zola.com/", label: "Wedding Registry", source: "Zola" },
  { href: "https://www.pinterest.com/", label: "Event Ideas", source: "Pinterest" },
  { href: "https://www.bachelorparty.com/", label: "Bachelor Party Ideas", source: "BachelorParty.com" },
  { href: "https://www.tripadvisor.com/", label: "Travel Reviews", source: "TripAdvisor" },
  { href: "https://www.honeybook.com/", label: "Event Management", source: "HoneyBook" },
  { href: "https://www.thumbtack.com/", label: "Local Vendors", source: "Thumbtack" },
];

const CATEGORY_CONFIGS = [
  { slug: "party-bus", title: "Party Bus", gradient: "from-indigo-500 to-purple-500", textColor: "text-indigo-400", hoverColor: "hover:border-indigo-500/50", iconName: "Music" },
  { slug: "limousines", title: "Limousine", gradient: "from-amber-400 to-yellow-500", textColor: "text-amber-400", hoverColor: "hover:border-amber-500/50", iconName: "Car" },
  { slug: "coach-buses", title: "Coach Bus", gradient: "from-teal-500 to-emerald-500", textColor: "text-teal-400", hoverColor: "hover:border-teal-500/50", iconName: "Car" },
  { slug: "pricing", title: "Pricing", gradient: "from-green-500 to-emerald-500", textColor: "text-green-400", hoverColor: "hover:border-green-500/50", iconName: "TrendingUp" },
  { slug: "weddings", title: "Wedding", gradient: "from-rose-400 to-pink-500", textColor: "text-rose-400", hoverColor: "hover:border-rose-500/50", iconName: "Heart" },
  { slug: "prom", title: "Prom", gradient: "from-pink-500 to-rose-500", textColor: "text-pink-400", hoverColor: "hover:border-pink-500/50", iconName: "GraduationCap" },
  { slug: "bachelorette-parties", title: "Bachelorette", gradient: "from-fuchsia-500 to-purple-500", textColor: "text-fuchsia-400", hoverColor: "hover:border-fuchsia-500/50", iconName: "Sparkles" },
  { slug: "bachelor-parties", title: "Bachelor Party", gradient: "from-blue-500 to-cyan-500", textColor: "text-blue-400", hoverColor: "hover:border-blue-500/50", iconName: "PartyPopper" },
  { slug: "corporate", title: "Corporate", gradient: "from-slate-500 to-gray-500", textColor: "text-slate-400", hoverColor: "hover:border-slate-500/50", iconName: "Briefcase" },
  { slug: "graduation", title: "Graduation", gradient: "from-purple-500 to-violet-500", textColor: "text-purple-400", hoverColor: "hover:border-purple-500/50", iconName: "GraduationCap" },
  { slug: "sweet-16", title: "Sweet 16", gradient: "from-pink-400 to-fuchsia-500", textColor: "text-pink-400", hoverColor: "hover:border-pink-500/50", iconName: "Crown" },
  { slug: "birthday", title: "Birthday", gradient: "from-orange-500 to-red-500", textColor: "text-orange-400", hoverColor: "hover:border-orange-500/50", iconName: "PartyPopper" },
  { slug: "quinceanera", title: "Quinceañera", gradient: "from-pink-500 to-purple-500", textColor: "text-pink-400", hoverColor: "hover:border-pink-500/50", iconName: "Crown" },
  { slug: "anniversary", title: "Anniversary", gradient: "from-red-500 to-rose-500", textColor: "text-red-400", hoverColor: "hover:border-red-500/50", iconName: "Heart" },
  { slug: "concert", title: "Concert", gradient: "from-violet-500 to-purple-500", textColor: "text-violet-400", hoverColor: "hover:border-violet-500/50", iconName: "Music" },
  { slug: "sporting-events", title: "Sports Events", gradient: "from-emerald-500 to-green-500", textColor: "text-emerald-400", hoverColor: "hover:border-emerald-500/50", iconName: "TrendingUp" },
  { slug: "airport", title: "Airport Transfer", gradient: "from-sky-500 to-blue-500", textColor: "text-sky-400", hoverColor: "hover:border-sky-500/50", iconName: "Car" },
  { slug: "wine-tours", title: "Wine Tours", gradient: "from-red-400 to-rose-500", textColor: "text-red-400", hoverColor: "hover:border-red-500/50", iconName: "Sparkles" },
  { slug: "brewery-tours", title: "Brewery Tours", gradient: "from-amber-500 to-orange-500", textColor: "text-amber-400", hoverColor: "hover:border-amber-500/50", iconName: "Music" },
  { slug: "nightclub", title: "Nightclub", gradient: "from-purple-600 to-indigo-600", textColor: "text-purple-400", hoverColor: "hover:border-purple-500/50", iconName: "Music" },
  { slug: "casino", title: "Casino Trips", gradient: "from-yellow-500 to-amber-500", textColor: "text-yellow-400", hoverColor: "hover:border-yellow-500/50", iconName: "Sparkles" },
  { slug: "holiday", title: "Holiday Events", gradient: "from-red-500 to-green-500", textColor: "text-red-400", hoverColor: "hover:border-red-500/50", iconName: "PartyPopper" },
  { slug: "funeral", title: "Funeral Services", gradient: "from-gray-600 to-slate-600", textColor: "text-gray-400", hoverColor: "hover:border-gray-500/50", iconName: "Car" },
];

const LOCATION_CONFIGS = [
  ...["california", "texas", "florida", "new-york", "illinois", "ohio", "georgia", "pennsylvania", "michigan", "north-carolina", "arizona", "colorado"].map(s => ({
    name: s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    slug: s,
    type: "state" as const
  })),
  ...["los-angeles", "houston", "miami", "chicago", "phoenix", "dallas", "atlanta", "denver", "seattle", "boston", "austin", "san-diego"].map(c => ({
    name: c.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    slug: c,
    type: "city" as const
  })),
];

export default async function PollsPage() {
  const analytics = await getPollAnalytics();
  const liveStats = analyticsToLiveStats(analytics);
  
  return (
    <main>
      <Hero slug="polls" />

      <LiveStatsBar 
        stats={liveStats as LiveStat[]} 
        title="Live Poll Activity"
      />

      <section className="py-8 bg-gradient-to-b from-[#0a1628] to-[#0d1d3a]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-6">
            <p className="text-lg text-blue-100/80 leading-relaxed">
              Transportation polls are the heartbeat of the Bus2Ride experience. With over 51,000 polls and 2.4 million votes, 
              our community shares real preferences on everything from pricing to amenities. Browse by category or location 
              to find insights for your specific event.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <PollFilterTabs />
          </div>
        </div>
      </section>

      <FilteredPollsClient categories={CATEGORY_CONFIGS} />

      <PollsExplorer 
        categories={CATEGORY_CONFIGS}
        locations={LOCATION_CONFIGS}
      />

      <SectionDivider variant="glow" />

      <TriviaBookingSection
        triviaItems={TRIVIA_ITEMS}
        title="Transportation Trivia & How to Book"
        subtitle="Fun facts about group transportation and our simple booking process"
        bookingTitle="How to Book with Bus2Ride"
      />

      <SectionDivider variant="gradient" />

      <FactsShowcase
        facts={FACT_ITEMS}
        title="Poll Insights at a Glance"
        subtitle="Key statistics from our community voting data"
      />

      <SectionDivider variant="glow" />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="Understanding Transportation Polls"
        subtitle="Everything you need to know about our community voting system"
      />

      <SectionDivider variant="dots" />

      <ToolsGrid category="polls" />

      <SectionDivider variant="glow" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Explore More"
      />

      <SectionDivider variant="gradient" />

      <FaqSection category="polls" title="Poll FAQs" />

      <SectionDivider variant="dots" />

      <EventsGrid />
    </main>
  );
}
