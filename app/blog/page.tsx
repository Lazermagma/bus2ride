import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import { getBlogPosts } from "@/lib/data/blog";
import { BlogGridClient } from "@/components/sections/blog-grid.client";
import FleetSection from "@/components/sections/fleet-section";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Planning tips, pricing breakdowns, and booking advice for party buses, limos, and coach buses — written for real group trips.",
  path: "/blog",
});

const BLOG_FACTS: FactItem[] = [
  { id: "1", stat: "150+", label: "Blog Posts", description: "Expert guides and planning tips", icon: "trending", category: "stat" },
  { id: "2", stat: "50k+", label: "Monthly Readers", description: "Event planners trust our content", icon: "users", category: "stat" },
  { id: "3", stat: "12", label: "Categories", description: "From weddings to corporate events", icon: "zap", category: "insight" },
  { id: "4", stat: "4.9/5", label: "Content Rating", description: "Readers find our guides helpful", icon: "star", category: "stat" },
  { id: "5", stat: "15min", label: "Avg Read Time", description: "Quick, actionable insights", icon: "clock", category: "tip" },
  { id: "6", stat: "100%", label: "Free Resources", description: "All guides available at no cost", icon: "trending", category: "stat" },
];

const BLOG_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What's the most common mistake first-time party bus renters make?",
    answer: "Underestimating travel time between stops! Traffic, pickup delays, and bathroom breaks can eat 20-30% of your rental time. Build buffer time into your itinerary.",
    category: "Planning Tip",
    source: "Driver Feedback Survey 2024",
  },
  {
    id: "2",
    question: "What percentage of wedding parties book transportation?",
    answer: "About 72% of wedding parties now book professional transportation. The number has grown 15% in the last 5 years as couples prioritize guest experience and safety.",
    category: "Industry Stat",
    source: "Wedding Industry Report",
  },
  {
    id: "3",
    question: "What day has the highest demand for party buses?",
    answer: "Saturday nights account for 45% of all party bus bookings. Prom season Saturdays in April-May see 3x normal demand!",
    category: "Booking Insight",
    source: "Booking Data Analysis",
  },
  {
    id: "4",
    question: "How far in advance should you book for popular dates?",
    answer: "For peak dates (prom, NYE, major holidays), book 6-8 weeks ahead. Regular weekends typically need 2-3 weeks. Last-minute bookings often have limited vehicle choices.",
    category: "Pro Tip",
    source: "Fleet Manager Survey",
  },
  {
    id: "5",
    question: "What's the ideal group size for a party bus?",
    answer: "Fill your bus to 75-80% capacity for the best experience. This allows room to move, dance, and ensures everyone has comfortable seating.",
    category: "Planning Tip",
    source: "Customer Satisfaction Survey",
  },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/events", label: "Event Guides", description: "Detailed playbooks for every occasion", category: "events" },
  { href: "/pricing", label: "Pricing Guide", description: "Understand transportation costs", category: "resources" },
  { href: "/tools", label: "Planning Tools", description: "Calculators and checklists", category: "tools" },
  { href: "/fleet", label: "Browse Fleet", description: "Explore our vehicle options", category: "fleet" },
  { href: "/locations", label: "Service Areas", description: "Find coverage in your city", category: "locations" },
  { href: "/reviews", label: "Customer Stories", description: "Real experiences from real groups", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.theknot.com/", label: "Wedding Planning", source: "The Knot" },
  { href: "https://www.brides.com/", label: "Bridal Resources", source: "Brides" },
  { href: "https://www.weddingwire.com/", label: "Vendor Reviews", source: "WeddingWire" },
];

const CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "blog-resources-overview",
    title: "Using Our Blog for Better Planning",
    content: `
      <p>Our blog is your comprehensive resource for transportation planning, event ideas, and booking insights. With 150+ articles covering everything from wedding transportation to corporate events, you'll find expert guidance for any occasion.</p>
      
      <h4>Browse by Event Type</h4>
      <p>Our blog is organized by event categories—weddings, proms, corporate events, celebrations, and more. Each category includes planning guides, real stories, and practical tips specific to that event type. Start with your event category to find the most relevant content.</p>
      
      <h4>Learn from Real Stories</h4>
      <p>Beyond how-to guides, our blog features real customer stories and case studies. See how others planned their events, what worked well, and lessons learned. These stories provide context and inspiration you won't find in generic planning guides.</p>
      
      <h4>Stay Updated</h4>
      <p>We regularly publish new content covering seasonal trends, industry updates, and emerging planning strategies. Bookmark our blog or subscribe to stay informed about the latest transportation planning insights.</p>
    `,
  },
  {
    id: "blog-content-categories",
    title: "Blog Content Categories",
    content: `
      <p>Our blog covers transportation planning from every angle. Here's what you'll find in each category.</p>
      
      <h4>Planning Guides</h4>
      <p>Step-by-step guides for booking, budgeting, and organizing group transportation. These articles break down complex processes into manageable steps, with checklists and timelines to keep you on track.</p>
      
      <h4>Event-Specific Content</h4>
      <p>Dedicated content for weddings, proms, corporate events, celebrations, and more. Each event type has unique transportation needs, and our blog addresses those specifics with targeted advice.</p>
      
      <h4>Pricing & Budgeting</h4>
      <p>Transparent discussions about transportation costs, what affects pricing, how to save money, and what to expect at different price points. Real pricing examples help you budget accurately.</p>
      
      <h4>Vehicle Spotlights</h4>
      <p>Deep dives into different vehicle types, their features, capacities, and best use cases. Learn what makes each vehicle type unique and how to choose the right one for your event.</p>
    `,
  },
  {
    id: "blog-reading-strategy",
    title: "How to Get the Most from Our Blog",
    content: `
      <p>With 150+ articles, our blog is a comprehensive resource. Here's how to navigate it effectively.</p>
      
      <h4>Start with Your Event Type</h4>
      <p>If you're planning a wedding, start with wedding-specific articles. Planning a corporate event? Jump to corporate content. Event-specific articles address the unique challenges and opportunities for each occasion.</p>
      
      <h4>Use the Search Function</h4>
      <p>Looking for something specific? Use our search to find articles by keyword. Search works across titles, content, and tags, so you'll find relevant articles even if they're in different categories.</p>
      
      <h4>Follow the Planning Timeline</h4>
      <p>Many of our articles are organized by when you need the information. Early planning articles cover booking and budgeting. Closer to your event, focus on day-of logistics and what to expect.</p>
      
      <h4>Bookmark Favorites</h4>
      <p>Found an article particularly helpful? Bookmark it for easy reference. Many readers return to specific guides multiple times during their planning process.</p>
    `,
  },
  {
    id: "blog-statistics-insights",
    title: "Blog Statistics & Insights",
    content: `
      <p>Our blog content is backed by real data and community insights. Here's what the numbers tell us.</p>
      
      <h4>Most Popular Topics</h4>
      <p>Wedding transportation guides receive the most traffic, followed by pricing articles and prom planning content. These topics reflect the most common transportation needs in our community.</p>
      
      <h4>Seasonal Trends</h4>
      <p>Blog traffic spikes during prom season (April-May), wedding season (May-October), and holiday periods. Our seasonal content addresses these peak planning times with timely, relevant advice.</p>
      
      <h4>Reader Engagement</h4>
      <p>Articles with real customer stories and case studies see the highest engagement. Readers value authentic experiences and practical examples over generic advice.</p>
      
      <h4>Content Updates</h4>
      <p>We regularly update our blog with new articles, refreshed statistics, and current industry trends. Check back often for the latest transportation planning insights.</p>
    `,
  },
  {
    id: "contributing-to-blog",
    title: "Contributing to Our Blog Community",
    content: `
      <p>Our blog is a community resource, and your input makes it better. Here's how you can contribute.</p>
      
      <h4>Share Your Story</h4>
      <p>Have a transportation experience worth sharing? Contact us about featuring your story. Real customer experiences help others make informed decisions and add authenticity to our content.</p>
      
      <h4>Suggest Topics</h4>
      <p>Is there a topic you'd like us to cover? We regularly add new content based on reader requests. If you have a question, chances are others do too—your suggestion could become a helpful article.</p>
      
      <h4>Engage with Content</h4>
      <p>Share articles that helped you, comment on stories that resonated, and bookmark guides for future reference. Your engagement helps us understand what content is most valuable.</p>
      
      <h4>Provide Feedback</h4>
      <p>Found an article particularly helpful? Let us know! Your feedback helps us create better content and ensures we're addressing the topics that matter most to our readers.</p>
    `,
  },
  {
    id: "blog-resources-library",
    title: "Building Your Planning Resource Library",
    content: `
      <p>Our blog is designed to be a comprehensive planning resource you can return to throughout your event planning journey.</p>
      
      <h4>Create Your Reading List</h4>
      <p>As you plan your event, bookmark relevant articles to create a personalized reading list. Start with event-specific guides, then add articles about pricing, booking, and day-of logistics as you progress.</p>
      
      <h4>Use Articles as Checklists</h4>
      <p>Many of our planning guides include checklists and timelines. Print or save these articles to use as working documents. Check off items as you complete them to stay organized.</p>
      
      <h4>Share with Your Group</h4>
      <p>Planning with others? Share relevant articles with your planning team. Articles about group size, pricing, and logistics help ensure everyone is on the same page.</p>
      
      <h4>Return for Updates</h4>
      <p>We regularly update articles with new information, statistics, and insights. Revisit articles you've read before—you might find updated information that's relevant to your current planning stage.</p>
    `,
  },
];

export default async function BlogPage() {
  const blogs = (await getBlogPosts()) ?? [];
  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="blog" />

      <SectionDivider variant="glow" />

      <BlogGridClient posts={blogs} />

      <SectionDivider variant="glow" />

      <FactsShowcase
        facts={BLOG_FACTS}
        title="Blog Insights at a Glance"
        subtitle="Key statistics about our transportation planning resources"
      />

      <SectionDivider variant="gradient" />

      <ContentExpansion
        blocks={CONTENT_BLOCKS}
        title="The Complete Transportation Planning Guide"
        subtitle="Everything you need to know about booking and managing group transportation"
        readTime="12 min"
        wordCount={2500}
      />

      <PremiumDivider />

      <FleetSection />

      <SectionDivider variant="gradient" />

      <TriviaBookingSection
        triviaItems={BLOG_TRIVIA}
        title="Transportation Trivia & How to Book"
        subtitle="Insider knowledge and step-by-step booking guide"
        bookingTitle="How to Book with Bus2Ride"
      />

      <PremiumDivider />

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />

      <SectionDivider variant="gradient" />

      <PollsGrid
        columnCategories={["wine-tours", "brewery-tours", "entertainment-tours"]}
        hideCities
        title="Blog Polls"
      />

      <SectionDivider variant="dots" />

      <BookingProcessSection />

      <PremiumDivider />

      <ToolsGrid category="blog" />

      <SectionDivider variant="glow" />

      <EventsGrid />

      <SectionDivider variant="gradient" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Explore More Resources"
      />

      <SectionDivider variant="dots" />

      <FaqSection category="blog" title="Blog & Resources FAQ" />
    </main>
  );
}
