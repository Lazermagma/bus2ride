import Hero from "@/components/layout/hero";
import { PollResultsExplorer } from "@/components/sections/poll-results-explorer.client";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { EventsGrid } from "@/components/sections/events-grid";
import FleetSection from "@/components/sections/fleet-section";
import { TriviaCarousel, type TriviaItem } from "@/components/sections/trivia-carousel";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { createClient } from "@/lib/supabase/server";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import { pageMetadata } from "@/lib/seo/metadata";
import { Flame } from "lucide-react";
import { LiveStatsBar, DEFAULT_LIVE_STATS, type LiveStat } from "@/components/sections/live-stats-bar";
import { PollFilterTabs } from "@/components/sections/poll-filter-tabs";
import { getPollAnalytics, analyticsToLiveStats, getPollFactsFromSupabase } from "@/lib/data/poll-analytics";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Hot Results - Transportation Poll Results",
  description:
    "See how the community voted on transportation polls. Browse hot results by category and state. 51,000+ polls and 2.4 million votes.",
  path: "/polls/results",
});

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

// Facts will be fetched from Supabase

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "understanding-results",
    title: "Understanding Poll Results",
    content: `Poll results are the culmination of thousands of community votes, providing real insights into what riders actually prefer. Unlike individual reviews that reflect one person's experience, poll results aggregate preferences across the entire Bus2Ride community, giving you statistically meaningful data to inform your transportation decisions.<br><br>Each result shows the percentage breakdown of votes, so you can see not just what won, but how close the competition was. Results with high consensus (70%+ for one option) indicate strong community agreement, while split results (45-55%) show areas where personal preference matters more than a universal "best" choice.<br><br>Results are updated in real-time as new votes come in, ensuring you're always seeing the most current community preferences. High-vote polls carry more statistical weight, while newer polls with fewer votes may shift as more community members participate.`,
  },
  {
    id: "reading-results",
    title: "How to Read Poll Results",
    content: `Reading poll results effectively means understanding both the numbers and what they mean for your specific situation. Start by looking at the winning option and its percentage—this tells you what the majority of riders prefer. But don't stop there.<br><br>Pay attention to the distribution of votes across all options. If the top choice has 85% of votes, that's a strong consensus. If it has 35% with three other options each getting 20-25%, that indicates the community is divided, and your personal preference matters more.<br><br>Consider the total vote count too. A poll with 10,000 votes is more statistically reliable than one with 50 votes. High-vote polls represent broader community consensus, while lower-vote polls may reflect emerging trends or niche preferences.`,
  },
  {
    id: "using-results",
    title: "Using Results for Better Decisions",
    content: `Poll results become most powerful when applied to your specific event and priorities. If you're planning a bachelorette party, look at party bus and event-specific results. Planning a corporate retreat? Focus on coach bus and corporate category results.<br><br>Use consensus results (70%+ agreement) as strong indicators of best practices. For example, if 85% of riders say they'd pay more for a newer vehicle, that's a clear signal that vehicle age should factor into your decision. Split results (45-55%) indicate areas where personal preference matters more than community consensus.<br><br>Don't just look at what won—pay attention to the losing options too. If 30% of riders prioritize price over amenities, and you're in that 30%, you know that budget-focused options will serve you well even if they're not the majority preference. Results should inform your decision, not dictate it.`,
  },
  {
    id: "embedding-results",
    title: "Embedding Results on Your Website",
    content: `You can embed poll results on your own website to share community insights with your visitors. We provide embed codes for both live polls (where visitors can vote) and results-only displays (showing current vote counts and percentages).<br><br>Results embeds update automatically as new votes come in, so your website always shows current community preferences. This is perfect for event planning websites, transportation company sites, or any platform where community insights add value.<br><br>Each embed is responsive and styled to match your site's design. Simply copy the embed code and paste it into your website's HTML. The results will display with real-time vote counts and percentage breakdowns, giving your visitors access to the same community intelligence that helps Bus2Ride customers make better decisions.`,
  },
  {
    id: "result-categories",
    title: "Result Categories Explained",
    content: `Our poll results are organized into intuitive categories that align with common transportation decisions. <strong>Party Bus results</strong> show preferences for nightlife, celebrations, and entertainment-focused rentals—think bachelorette parties, birthday celebrations, and concert shuttles. <strong>Limousine results</strong> address luxury transportation needs including weddings, proms, corporate events, and airport transfers.<br><br><strong>Coach Bus results</strong> cover group travel, corporate shuttles, school trips, and multi-day excursions where capacity and comfort take priority. <strong>Pricing results</strong> help you understand what others are paying and expecting, from hourly rates to tipping norms. <strong>Booking Experience results</strong> capture insights about the reservation process itself—preferred contact methods, contract expectations, and customer service priorities.<br><br>The <strong>Events category</strong> cuts across vehicle types to address specific occasions: weddings, proms, sporting events, concerts, and corporate functions. These results help you see how others approach transportation for events similar to yours.`,
  },
];

async function getHotPolls() {
  const supabase = await createClient();
  
  const { data: polls, error } = await supabase
    .from("polls1")
    .select(`
      id,
      question,
      category_slug,
      options:poll_options1 (
        id,
        label,
        vote_count,
        ord
      )
    `)
    .order("ord", { referencedTable: "poll_options1", ascending: true })
    .limit(100);
  
  if (error || !polls) {
    return [];
  }

  const pollsWithVotes = polls
    .map(poll => ({
      ...poll,
      category_slug: poll.category_slug ?? undefined,
      totalVotes: (poll.options || []).reduce((sum: number, o: { vote_count?: number }) => sum + (o.vote_count || 0), 0)
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 8);

  return pollsWithVotes;
}

const categoryConfigs = [
  { slug: "party-bus", title: "Party Bus", gradient: "from-indigo-500 to-purple-500", textColor: "text-indigo-400", iconName: "Music" },
  { slug: "limousines", title: "Limousine", gradient: "from-amber-400 to-yellow-500", textColor: "text-amber-400", iconName: "Car" },
  { slug: "coach-buses", title: "Coach Bus", gradient: "from-teal-500 to-emerald-500", textColor: "text-teal-400", iconName: "Car" },
  { slug: "pricing", title: "Pricing", gradient: "from-green-500 to-emerald-500", textColor: "text-green-400", iconName: "TrendingUp" },
  { slug: "weddings", title: "Wedding", gradient: "from-rose-400 to-pink-500", textColor: "text-rose-400", iconName: "Heart" },
  { slug: "prom", title: "Prom", gradient: "from-pink-500 to-rose-500", textColor: "text-pink-400", iconName: "GraduationCap" },
  { slug: "bachelorette-parties", title: "Bachelorette", gradient: "from-fuchsia-500 to-purple-500", textColor: "text-fuchsia-400", iconName: "Sparkles" },
  { slug: "bachelor-parties", title: "Bachelor Party", gradient: "from-blue-500 to-cyan-500", textColor: "text-blue-400", iconName: "PartyPopper" },
  { slug: "corporate", title: "Corporate", gradient: "from-slate-500 to-gray-500", textColor: "text-slate-400", iconName: "Briefcase" },
  { slug: "graduation", title: "Graduation", gradient: "from-purple-500 to-violet-500", textColor: "text-purple-400", iconName: "GraduationCap" },
  { slug: "sweet-16", title: "Sweet 16", gradient: "from-pink-400 to-fuchsia-500", textColor: "text-pink-400", iconName: "Crown" },
  { slug: "birthday", title: "Birthday", gradient: "from-orange-500 to-red-500", textColor: "text-orange-400", iconName: "PartyPopper" },
  { slug: "quinceanera", title: "Quinceañera", gradient: "from-pink-500 to-purple-500", textColor: "text-pink-400", iconName: "Crown" },
  { slug: "anniversary", title: "Anniversary", gradient: "from-red-500 to-rose-500", textColor: "text-red-400", iconName: "Heart" },
  { slug: "concert", title: "Concert", gradient: "from-violet-500 to-purple-500", textColor: "text-violet-400", iconName: "Music" },
  { slug: "sporting-events", title: "Sports Events", gradient: "from-emerald-500 to-green-500", textColor: "text-emerald-400", iconName: "TrendingUp" },
  { slug: "airport", title: "Airport Transfer", gradient: "from-sky-500 to-blue-500", textColor: "text-sky-400", iconName: "Car" },
  { slug: "wine-tours", title: "Wine Tours", gradient: "from-red-400 to-rose-500", textColor: "text-red-400", iconName: "Sparkles" },
  { slug: "brewery-tours", title: "Brewery Tours", gradient: "from-amber-500 to-orange-500", textColor: "text-amber-400", iconName: "Music" },
  { slug: "nightclub", title: "Nightclub", gradient: "from-purple-600 to-indigo-600", textColor: "text-purple-400", iconName: "Music" },
  { slug: "casino", title: "Casino Trips", gradient: "from-yellow-500 to-amber-500", textColor: "text-yellow-400", iconName: "Sparkles" },
  { slug: "holiday", title: "Holiday Events", gradient: "from-red-500 to-green-500", textColor: "text-red-400", iconName: "PartyPopper" },
  { slug: "funeral", title: "Funeral Services", gradient: "from-gray-600 to-slate-600", textColor: "text-gray-400", iconName: "Car" },
];

export default async function PollResultsPage() {
  const [hotPolls, reviews, analytics, totalReviewsCount, pollFacts] = await Promise.all([
    getHotPolls(),
    getReviews(),
    getPollAnalytics(),
    getReviewsCount(),
    getPollFactsFromSupabase(),
  ]);
  
  const liveStats = analyticsToLiveStats(analytics);

  return (
    <main>
      <Hero slug="polls" />

      <LiveStatsBar 
        stats={liveStats as LiveStat[]} 
        title="Live Results Activity"
      />

      <section className="py-12 bg-gradient-to-b from-[#0a1628] via-[#0d1d3a] to-[#0a1628]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-6">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" aria-hidden="true" />
              <span className="text-sm font-bold tracking-wider uppercase text-orange-300">Hot Results</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              See What Everyone's Voting For
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
              Browse poll results across <span className="text-white font-semibold">51,000+ transportation polls</span> with <span className="text-white font-semibold">2.4 million votes</span>. 
              Find out what riders prefer and embed results on your website.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <PollFilterTabs basePath="/polls/results" />
          </div>
        </div>
      </section>

      <PollResultsExplorer 
        categories={categoryConfigs}
        hotPolls={hotPolls}
      />

      <PremiumDivider />

      <FleetSection />

      <SectionDivider variant="glow" />

      <ReviewsSection reviews={reviews ?? []} totalCount={totalReviewsCount ?? undefined} />

      <SectionDivider variant="gradient" />

      <FactsShowcase
        facts={pollFacts}
        title="Poll Insights at a Glance"
        subtitle="Key statistics from our community voting data"
      />

      <SectionDivider variant="glow" />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="Understanding Poll Results"
        subtitle="Everything you need to know about reading and using poll results"
      />

      <SectionDivider variant="dots" />

      <EventsGrid />

      <SectionDivider variant="glow" />

      <FaqSection category="poll-results" title="Poll Results FAQ" />
    </main>
  );
}
