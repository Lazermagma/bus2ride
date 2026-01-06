import Hero from "@/components/layout/hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import { Mail, Phone, Clock, MessageCircle, Zap, ArrowRight, Headphones, Timer, MapPin, CheckCircle2 } from "lucide-react";
import { InstantQuoteButton } from "@/components/InstantQuoteButton";
import { BookingProcessSection } from "@/components/sections/content-booking";
import FleetSection from "@/components/sections/fleet-section";
import Link from "next/link";
import { FactsShowcase } from "@/components/sections/facts-showcase";
import { TriviaBookingSection } from "@/components/sections/trivia-booking-section";
import { getFacts } from "@/lib/data/facts";
import { pageMetadata } from "@/lib/seo/metadata";
import { SectionDivider } from "@/components/layout/section-dividers";
import { WhyRepliesInstantSection } from "@/components/sections/why-replies-instant";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get an instant quote or ask a booking question. Tell us your date, pickup area, group size, and itinerary — we'll help you lock in the right vehicle.",
  path: "/contact",
});

const CONTACT_TRIVIA = [
  { id: "ct1", question: "What's our average reply time?", answer: "Under 3 minutes! We have dedicated staff ready 24/7 to respond to your inquiries.", category: "Response Speed" },
  { id: "ct2", question: "Can I change my booking after confirming?", answer: "Yes! We offer flexible modifications up to 48 hours before your event at no extra charge.", category: "Flexibility" },
  { id: "ct3", question: "Do you offer last-minute bookings?", answer: "Absolutely! We've fulfilled same-day requests. Just call us directly for fastest service.", category: "Availability" },
  { id: "ct4", question: "Is there a deposit required?", answer: "A small deposit secures your date, with the balance due before your event. We accept all major cards.", category: "Payments" },
];

export default async function ContactPage() {
  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;
  const facts = (await getFacts()) ?? [];

  const contactFacts = facts.length > 0 ? facts.slice(0, 4) : [
    { id: "f1", stat: "2m 11s", label: "Median Reply Time", icon: "clock", category: "stat" as const },
    { id: "f2", stat: "24/7", label: "Live Support Coverage", icon: "clock", category: "stat" as const },
    { id: "f3", stat: "38+", label: "Metro Areas Served", icon: "location", category: "stat" as const },
    { id: "f4", stat: "97%", label: "Quote Accuracy Rate", icon: "trending", category: "stat" as const },
  ];

  return (
    <main className="bg-[#0a1628]">
      <Hero slug="contact" />

      <SectionDivider variant="glow" />

      <FactsShowcase
        facts={contactFacts}
        title="Bus2Ride By The Numbers"
        subtitle="Real-time stats from our booking system"
        variant="grid"
      />

      <SectionDivider variant="gradient" />

      <section className="py-12 md:py-16 bg-gradient-to-b from-[#0d1d3a] to-[#0a1628]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-300">
                  Get in Touch
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  We&apos;re Ready to Help
                </h2>
                <p className="text-white/70">
                  Have a question or need a custom quote? Fill out the form and our team will respond within minutes.
                </p>
              </div>

              <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/95 text-white shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">Send us a message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="first-name" className="text-white/80 text-sm">First name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/15"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="last-name" className="text-white/80 text-sm">Last name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/15"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
                      <Input
                        id="email"
                        placeholder="john@example.com"
                        type="email"
                        className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/15"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-white/80 text-sm">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        type="tel"
                        className="h-10 border-white/15 bg-white/5 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/15"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-white/80 text-sm">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your event..."
                      className="min-h-[100px] border-white/15 bg-white/5 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/15"
                    />
                  </div>
                  <Button type="submit" className="w-full font-bold text-base h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400">
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-transparent p-5 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Live Chat Available</div>
                    <div className="text-xs text-green-300/70">Avg. response: 2 minutes</div>
                  </div>
                </div>
                <InstantQuoteButton 
                  source="Contact Page - Live Chat" 
                  className="w-full rounded-xl"
                />
              </Card>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4">
                <Card className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/90 text-white shadow-xl">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="h-11 w-11 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Call Us 24/7</h3>
                      <p className="text-white/70 text-sm">(888) 535-2566</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/90 text-white shadow-xl">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="h-11 w-11 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Email Support</h3>
                      <p className="text-white/70 text-sm">bookings@bus2ride.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/90 text-white shadow-xl">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="h-11 w-11 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Office Hours</h3>
                      <p className="text-white/70 text-sm">Mon-Sun: 24 Hours</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs">
                    BALLPARK PRICING
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-3 text-white">Quick ballpark numbers (no pressure)</CardTitle>
                <p className="text-white/60 text-sm mb-4">
                  Final price depends on date, vehicle class, and drive time.
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Party bus</span>
                    <span className="text-white/60">often $120–$250/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Limo</span>
                    <span className="text-white/60">often $90–$200/hr</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Coach</span>
                    <span className="text-white/60">often $130–$260/hr</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button asChild size="sm" className="rounded-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400">
                    <Link href="/pricing">See Pricing Guides</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="rounded-lg border-white/15 bg-white/5 text-white/80 hover:bg-white/10">
                    <Link href="/fleet">Browse Fleet</Link>
                  </Button>
                </div>
              </Card>

              <div className="grid gap-4">
                <Card className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-5 text-white">
                  <Badge variant="outline" className="mb-2 border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs">
                    FAST REPLY
                  </Badge>
                  <CardTitle className="text-lg mb-2 text-white">What to send for speed</CardTitle>
                  <ul className="text-white/60 text-sm space-y-1.5">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Date + start time window</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Pickup + drop-off areas</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Headcount + hours needed</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Event type (wedding, prom, night out)</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="dots" />

      <WhyRepliesInstantSection />

      <SectionDivider variant="glow" />

      <BookingProcessSection />

      <SectionDivider variant="glow" />

      <TriviaBookingSection
        triviaItems={CONTACT_TRIVIA}
        title="Contact & Booking Trivia"
        subtitle="Quick answers to common questions"
        bookingTitle="How to Book With Us"
      />

      <SectionDivider variant="gradient" />

      <FleetSection />
      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />
      <PollsGrid
        columnCategories={["booking-lead-times", "pricing", "weddings"]}
        hideCities
        title="Booking Polls"
      />
      <EventsGrid />
      <FaqSection category="contact" title="Booking FAQs" />
    </main>
  );
}
