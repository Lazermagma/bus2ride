import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getFaqs } from "@/lib/data/faqs";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { FaqGridClient } from "@/components/sections/faq-grid.client";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";
import { ContentExpansion, type ContentBlock } from "@/components/sections/content-expansion";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { LinkConstellation, type InternalLink, type ExternalLink } from "@/components/sections/link-constellation";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Search answers about booking, pricing, timing, vehicle rules, and event logistics — curated from real rider questions.",
  path: "/faq",
});

const FAQ_TRIVIA: TriviaItem[] = [
  {
    id: "1",
    question: "What's the #1 question we get asked?",
    answer: "How far in advance should I book? For peak dates (prom, weddings, NYE), book 6-8 weeks ahead. Regular weekends need 2-3 weeks. Last minute? Call us - we'll try our best!",
    category: "Booking Insight",
    source: "Customer Service Data",
  },
  {
    id: "2",
    question: "What surprise do most first-timers not expect?",
    answer: "Gratuity isn't usually included in the quoted price! Standard tip is 15-20% of rental cost. Some packages include it, so always ask when booking.",
    category: "Pro Tip",
    source: "Customer Feedback",
  },
  {
    id: "3",
    question: "What's the most common mistake when booking?",
    answer: "Underestimating group size! Book for your maximum possible headcount. It's much easier to have extra space than to scramble for a bigger vehicle last minute.",
    category: "Avoid This",
    source: "Booking Team Insights",
  },
  {
    id: "4",
    question: "What policy confuses people most?",
    answer: "BYOB rules vary by state and company. Most party buses allow alcohol for 21+ passengers, but some states have strict regulations. Always confirm when booking!",
    category: "Policy Alert",
    source: "Legal Compliance Team",
  },
  {
    id: "5",
    question: "What's the best way to save money?",
    answer: "Book on off-peak days! Thursday or Sunday events are often 20-30% cheaper than Saturday nights. Mid-month dates beat end-of-month too.",
    category: "Money Saver",
    source: "Pricing Analysis",
  },
];

const FAQ_FACTS: FactItem[] = [
  { id: "1", stat: "500+", label: "Questions Answered", category: "stat" },
  { id: "2", stat: "6", label: "Categories", category: "stat" },
  { id: "3", stat: "24/7", label: "Support Available", category: "stat" },
  { id: "4", stat: "98%", label: "Issues Resolved", category: "stat" },
  { id: "5", stat: "<2min", label: "Avg Response Time", category: "stat" },
  { id: "6", stat: "15+", label: "Years Experience", category: "stat" },
];

const INTERNAL_LINKS: InternalLink[] = [
  { href: "/contact", label: "Contact Us", description: "Get personalized help with your questions", category: "resources" },
  { href: "/pricing", label: "Pricing Guide", description: "Detailed pricing information", category: "resources" },
  { href: "/fleet", label: "Browse Fleet", description: "Explore our vehicle options", category: "fleet" },
  { href: "/events", label: "Event Ideas", description: "Inspiration for your celebration", category: "events" },
  { href: "/reviews", label: "Customer Stories", description: "Real experiences from riders", category: "resources" },
];

const EXTERNAL_LINKS: ExternalLink[] = [
  { href: "https://www.nla.org/", label: "Industry Standards", source: "National Limousine Association" },
  { href: "https://www.fmcsa.dot.gov/", label: "Safety Regulations", source: "FMCSA" },
];

const FAQ_CONTENT_BLOCKS: ContentBlock[] = [
  {
    id: "understanding-faqs",
    title: "Understanding Our FAQ System",
    content: `Our FAQ section is designed to answer the most common questions about booking, pricing, vehicles, and policies. We've compiled hundreds of real questions from customers to help you find answers quickly and easily.<br><br>Questions are organized by category—booking, pricing, vehicles, events, safety, and locations. Each answer is written by our team based on actual customer inquiries and our years of experience in the transportation industry.<br><br>Can't find your answer? Use the search function or contact us directly. Our customer service team is available 24/7 to help with any questions not covered in our FAQ library.`,
  },
  {
    id: "booking-questions",
    title: "Common Booking Questions",
    content: `Booking group transportation can raise many questions, especially for first-time renters. Here are the most frequently asked questions about the booking process.<br><br><strong>How far in advance should I book?</strong> For peak dates (prom, weddings, NYE), book 6-8 weeks ahead. Regular weekends need 2-3 weeks minimum. Last-minute bookings are possible but have limited vehicle selection.<br><br><strong>What information do I need to book?</strong> You'll need: your event date and time, pickup and dropoff locations, estimated group size, event type, and any special requirements. We'll use this to provide accurate pricing and vehicle recommendations.<br><br><strong>Can I make changes after booking?</strong> Most changes can be accommodated with advance notice. Contact us as soon as possible if you need to modify your booking. Changes may affect pricing depending on the modification.`,
  },
  {
    id: "pricing-questions",
    title: "Pricing & Payment FAQs",
    content: `Understanding pricing is crucial for planning your event budget. Here's what you need to know about transportation costs.<br><br><strong>What's included in the quoted price?</strong> Base pricing includes the vehicle rental, driver, fuel, and standard amenities. Additional costs may include: gratuity (typically 15-20%), overtime charges if you exceed booked hours, and any special requests or add-ons.<br><br><strong>When is payment due?</strong> Most companies require a deposit (typically 25-50%) to secure your booking, with the balance due before or on the event day. Payment methods vary by company—ask about accepted forms of payment when booking.<br><br><strong>Are there hidden fees?</strong> Reputable companies are transparent about pricing. Ask about: cancellation fees, change fees, overtime rates, and any additional charges. Get everything in writing to avoid surprises.`,
  },
  {
    id: "vehicle-questions",
    title: "Vehicle & Amenity Questions",
    content: `Choosing the right vehicle is key to a successful event. Here are answers to common questions about our fleet.<br><br><strong>What's the difference between party buses, limos, and coach buses?</strong> Party buses are designed for celebrations with entertainment systems, LED lighting, and space for dancing. Limousines offer luxury and intimacy for smaller groups. Coach buses prioritize capacity and comfort for large groups and longer distances.<br><br><strong>What amenities are included?</strong> Standard amenities vary by vehicle type. Party buses typically include: sound systems, LED lighting, climate control, and seating. Limousines may include: premium sound, mood lighting, and refreshment areas. Ask about specific amenities when booking.<br><br><strong>Can I bring food and drinks?</strong> Most vehicles allow food and non-alcoholic beverages. BYOB policies vary by state and company—always confirm alcohol policies when booking. Some companies provide refreshments as part of premium packages.`,
  },
  {
    id: "safety-policy-questions",
    title: "Safety & Policy FAQs",
    content: `Safety and clear policies ensure a smooth experience for everyone. Here's what you need to know.<br><br><strong>What are the age requirements?</strong> For events involving alcohol, all passengers must be 21+. For non-alcohol events, age requirements vary. Prom and school events typically require chaperones. Always confirm age policies when booking.<br><br><strong>What's the cancellation policy?</strong> Policies vary by company and booking timing. Most companies offer full refunds for cancellations made 2+ weeks in advance. Closer to the event date, partial refunds or credits may apply. Read your contract carefully.<br><br><strong>What happens if the vehicle breaks down?</strong> Reputable companies have backup vehicles and 24/7 support. If a breakdown occurs, they'll arrange a replacement vehicle as quickly as possible. This is why choosing a licensed, insured company matters.`,
  },
  {
    id: "using-faqs-effectively",
    title: "Getting the Most from Our FAQs",
    content: `Our FAQ library is a powerful resource when used effectively. Here's how to find the answers you need quickly.<br><br><strong>Use the search function</strong> - Type keywords related to your question. Our search looks through both questions and answers, so you can find relevant information even if the exact wording differs.<br><br><strong>Browse by category</strong> - If you're not sure what to search, browse by category. Booking questions cover the reservation process, pricing questions address costs, and vehicle questions explain our fleet options.<br><br><strong>Check most clicked questions</strong> - The "Most Clicked This Week" section shows what other customers are asking about. These are often the most relevant questions for current events or seasonal concerns.<br><br><strong>Still have questions?</strong> If you can't find your answer, don't hesitate to contact us. Our team is here to help, and your question might become part of our FAQ library to help future customers.`,
  },
];

export default async function FaqPage() {
  const faqs = (await getFaqs()) ?? [];
  const reviews = (await getReviews()) ?? [];

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="faq" />

      <SectionDivider variant="glow" />

      <FactsShowcase
        facts={FAQ_FACTS}
        title="FAQ By The Numbers"
        subtitle="Your questions, our expertise"
      />

      <PremiumDivider />

      <FaqGridClient faqs={faqs} />

      <SectionDivider variant="gradient" />

      <FleetSection />

      <SectionDivider variant="dots" />

      <TriviaBookingSection
        triviaItems={FAQ_TRIVIA}
        title="FAQ Trivia & How to Book"
        subtitle="Insider answers and step-by-step booking guide"
        bookingTitle="How to Book with Bus2Ride"
      />

      <SectionDivider variant="glow" />

      <ContentExpansion
        blocks={FAQ_CONTENT_BLOCKS}
        title="The Complete Transportation FAQ Guide"
        subtitle="Comprehensive answers to all your transportation questions"
        readTime="10 min"
        wordCount={2000}
      />

      <PremiumDivider />

      <ReviewsSection reviews={reviews} />

      <SectionDivider variant="glow" />

      <PollsGrid
        columnCategories={["booking-lead-times", "pricing", "weddings"]}
        hideCities
        title="FAQ Polls"
      />

      <SectionDivider variant="gradient" />

      <BookingProcessSection />

      <PremiumDivider />

      <EventsGrid />

      <SectionDivider variant="dots" />

      <ToolsGrid category="faq" />

      <SectionDivider variant="glow" />

      <LinkConstellation
        internalLinks={INTERNAL_LINKS}
        externalLinks={EXTERNAL_LINKS}
        title="Still Have Questions?"
      />
    </main>
  );
}
