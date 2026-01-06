"use client";

import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  BookOpen, 
  Plus,
  Clock, 
  Users, 
  MapPin, 
  Sparkles,
  CheckCircle2,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventGuideProps {
  eventSlug: string;
  eventTitle: string;
  guideTitle?: string;
  guideSubtitle?: string;
  guideContent?: string;
}

const MOCK_GUIDES: Record<string, {
  title: string;
  subtitle: string;
  sections: {
    heading: string;
    content: string;
    tips?: string[];
  }[];
  highlights: {
    icon: string;
    label: string;
    value: string;
  }[];
}> = {
  "haunted-houses": {
    title: "The Ultimate Guide to Haunted House Group Trips",
    subtitle: "Everything you need to know to plan the perfect spooky group outing",
    sections: [
      {
        heading: "Planning Your Haunted House Adventure",
        content: "The key to a successful haunted house group trip is timing and logistics. Peak nights (the last two weekends before Halloween) can see wait times of 60-90 minutes per attraction. Smart groups arrive early, buy timed-entry or VIP skip-the-line passes, and plan their route to hit multiple locations efficiently.",
        tips: [
          "Book your transportation 2-3 weeks in advance for October dates",
          "Consider weekday visits for shorter lines (Tuesday-Thursday)",
          "VIP passes can cut wait times by 70%"
        ]
      },
      {
        heading: "Choosing the Right Vehicle",
        content: "Your vehicle choice affects the entire experience. Party buses are ideal for groups of 15-30 who want to keep the energy high between stops. Sprinter vans work well for intimate groups of 8-14 navigating tight parking lots. For larger groups or school/corporate outings, charter buses offer comfort and efficiency.",
      },
      {
        heading: "Building the Perfect Itinerary",
        content: "A well-planned haunted house crawl includes buffer time between attractions. Allow 45-60 minutes per haunt (line + walkthrough), plus 30 minutes for regrouping and a food stop midway through. Start earlier than you think—a 6 PM departure for a 3-haunt night is common.",
        tips: [
          "Schedule your most intense haunt for the middle of the night",
          "Plan a food stop after your first attraction",
          "End with a lighter or shorter experience to decompress"
        ]
      }
    ],
    highlights: [
      { icon: "clock", label: "Ideal Duration", value: "4-6 hours" },
      { icon: "users", label: "Best Group Size", value: "12-30 people" },
      { icon: "calendar", label: "Peak Season", value: "Sept 15 - Nov 1" },
      { icon: "star", label: "Advance Booking", value: "2-3 weeks" }
    ]
  },
  "default": {
    title: "Your Complete Event Transportation Guide",
    subtitle: "Expert tips for planning the perfect group outing",
    sections: [
      {
        heading: "Planning Your Group Event",
        content: "Successful group events start with proper planning. Consider your group size, the number of stops, and the overall timeline. Our team helps you build an itinerary that maximizes fun while keeping logistics smooth. Start by determining your group size, preferred date and time, and any special requirements like accessibility needs or specific amenities.",
        tips: [
          "Book early for peak dates and weekends",
          "Share the itinerary with all guests in advance",
          "Designate a point person for communication",
          "Plan buffer time between stops (15-20 minutes minimum)",
          "Confirm pickup and drop-off locations in advance"
        ]
      },
      {
        heading: "Selecting Your Vehicle",
        content: "Match your vehicle to your group's needs. Party buses offer entertainment and space for larger groups with LED lighting, premium sound systems, and room to dance. Limousines provide elegance for smaller celebrations with luxury amenities and professional chauffeurs. Charter buses are perfect for corporate events or large gatherings with comfortable seating and climate control.",
        tips: [
          "Party buses: Best for 15-30 people wanting entertainment",
          "Limousines: Ideal for 6-14 people seeking luxury",
          "Coach buses: Perfect for 30-56 people needing comfort"
        ]
      },
      {
        heading: "Building Your Itinerary",
        content: "A well-planned itinerary ensures your event runs smoothly. Map out all your stops in advance, including addresses, estimated arrival times, and how long you'll spend at each location. Factor in traffic, parking, and any special event considerations. Our experienced planners can help optimize your route for maximum efficiency.",
        tips: [
          "Start with the furthest destination and work your way back",
          "Include a food stop midway through your event",
          "Allow 30-45 minutes per stop including travel time",
          "Have backup plans for weather or unexpected delays"
        ]
      },
      {
        heading: "Booking Timeline & Availability",
        content: "Timing is crucial when booking group transportation. Peak seasons and weekends fill up quickly, sometimes 2-3 weeks in advance. Weekday bookings typically have more availability and may offer better rates. Book as early as possible to secure your preferred vehicle and ensure the best pricing.",
        tips: [
          "Book 2-3 weeks ahead for weekend events",
          "Book 1-2 weeks ahead for weekday events",
          "Last-minute bookings (less than 1 week) have limited options",
          "Holiday weekends require 3-4 weeks advance notice"
        ]
      },
      {
        heading: "Pricing & Payment Options",
        content: "Understanding pricing helps you budget effectively. Most rentals are priced by the hour with a minimum rental period (typically 3-4 hours). Additional fees may apply for extra stops, extended hours, or premium amenities. Payment is usually required at booking or split between deposit and final payment.",
        tips: [
          "Hourly rates typically range from $150-$400 depending on vehicle",
          "Minimum rental periods are usually 3-4 hours",
          "Ask about package deals for longer rentals",
          "Gratuity for drivers is typically 15-20%"
        ]
      },
      {
        heading: "What to Bring & Expect",
        content: "Come prepared to make the most of your transportation experience. Bring IDs for all passengers, especially if your itinerary includes venues that require age verification. Pack essentials like phones, chargers, and any personal items you'll need. The vehicle will have climate control, music systems, and comfortable seating.",
        tips: [
          "Bring valid IDs for all passengers",
          "Pack phone chargers and portable batteries",
          "Dress appropriately for your event and the weather",
          "Respect the vehicle and follow driver instructions",
          "Plan for restroom breaks on longer trips"
        ]
      },
      {
        heading: "Safety & Policies",
        content: "Safety is our top priority. All vehicles are fully insured, regularly maintained, and driven by professional, licensed chauffeurs. We have clear policies regarding alcohol, smoking, and passenger conduct to ensure everyone has a safe and enjoyable experience.",
        tips: [
          "All vehicles are fully insured and DOT compliant",
          "Professional, background-checked drivers",
          "Alcohol policies vary by vehicle and location",
          "No smoking in any vehicles",
          "Respectful conduct is required at all times"
        ]
      }
    ],
    highlights: [
      { icon: "clock", label: "Typical Duration", value: "3-8 hours" },
      { icon: "users", label: "Group Size", value: "8-56 people" },
      { icon: "star", label: "Advance Notice", value: "1-2 weeks" }
    ]
  }
};

export function EventGuide({ eventSlug, eventTitle, guideTitle, guideSubtitle, guideContent }: EventGuideProps) {
  const mockGuide = MOCK_GUIDES[eventSlug] || MOCK_GUIDES["default"];
  
  const guide = {
    title: guideTitle || mockGuide.title,
    subtitle: guideSubtitle || mockGuide.subtitle,
    sections: mockGuide.sections,
    highlights: mockGuide.highlights,
  };
  
  const hasCustomContent = !!guideContent;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "clock": return Clock;
      case "users": return Users;
      case "calendar": return MapPin;
      case "star": return Star;
      default: return Sparkles;
    }
  };

  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-b from-[#0a1628] via-[#0d1d3a] to-[#122a56]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <Badge 
            variant="outline" 
            className="mb-4 border-blue-400/50 text-blue-300 bg-blue-500/10 px-4 py-1.5"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Expert Guide
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            {guide.title}
          </h2>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
            {guide.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {hasCustomContent ? (
              <div 
                className="rounded-2xl border border-blue-500/40 bg-[#0f2347]/80 p-6 shadow-lg shadow-blue-500/10 prose prose-invert max-w-none prose-p:text-blue-100/85"
                dangerouslySetInnerHTML={{ __html: guideContent || "" }}
              />
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="0">
                {guide.sections.map((section, index) => (
                  <AccordionItem
                    key={index}
                    value={String(index)}
                    className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-shadow hover:shadow-lg"
                  >
                    <AccordionTrigger className="px-5 py-5 hover:no-underline">
                      <div className="flex items-center justify-between w-full text-left gap-4">
                        <h3 className="text-base md:text-lg font-semibold text-white leading-tight">
                          {section.heading}
                        </h3>
                        <div className="text-sm text-white/70 shrink-0">
                          <Plus
                            className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-45"
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-6 pt-0 leading-relaxed md:text-base animate-in slide-in-from-top-2 text-base text-white/80">
                      <div className="space-y-4">
                        <p className="text-blue-100/85 leading-relaxed">
                          {section.content}
                        </p>
                        {section.tips && (
                          <ul className="space-y-2">
                            {section.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-blue-100/80 text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-blue-700/40 bg-gradient-to-br from-[#0f2347] to-[#0a1628] p-6 shadow-xl">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-300 mb-4">
                Quick Stats
              </h4>
              <div className="space-y-4">
                {guide.highlights.map((highlight, index) => {
                  const Icon = getIcon(highlight.icon);
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-300/70 uppercase tracking-wide">
                          {highlight.label}
                        </p>
                        <p className="text-white font-semibold">{highlight.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-amber-800/10 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">Pro Tip</span>
              </div>
              <p className="text-amber-100/80 text-sm leading-relaxed">
                Book your {eventTitle.toLowerCase()} transportation 2-3 weeks in advance 
                for the best vehicle selection and availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
