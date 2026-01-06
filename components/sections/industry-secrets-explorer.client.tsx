"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeDollarSign,
  CalendarClock,
  ClipboardCheck,
  FileCheck,
  Gavel,
  MapPinned,
  ShieldCheck,
  Timer,
  Search,
  X,
  ChevronDown,
  Lock,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SecretsData } from "@/lib/data/secrets";

export type IndustrySecretCategory =
  | "pricing"
  | "billing"
  | "booking"
  | "seasonal"
  | "fees"
  | "routing"
  | "policy"
  | "quality"
  | "safety";

const CATEGORY_LABELS: Record<IndustrySecretCategory, string> = {
  pricing: "Pricing",
  billing: "Billing",
  booking: "Booking",
  seasonal: "Seasonal",
  fees: "Fees",
  routing: "Routing",
  policy: "Policy",
  quality: "Quality",
  safety: "Safety",
};

const CATEGORY_COLORS: Record<IndustrySecretCategory, string> = {
  pricing: "from-green-500 to-emerald-500",
  billing: "from-blue-500 to-indigo-500",
  booking: "from-purple-500 to-pink-500",
  seasonal: "from-orange-500 to-amber-500",
  fees: "from-red-500 to-rose-500",
  routing: "from-teal-500 to-cyan-500",
  policy: "from-slate-500 to-gray-500",
  quality: "from-amber-500 to-yellow-500",
  safety: "from-emerald-500 to-green-500",
};

const CATEGORY_ICONS: Record<
  IndustrySecretCategory,
  React.ComponentType<{ className?: string }>
> = {
  pricing: BadgeDollarSign,
  billing: FileCheck,
  booking: ClipboardCheck,
  seasonal: CalendarClock,
  fees: AlertTriangle,
  routing: MapPinned,
  policy: Gavel,
  quality: Timer,
  safety: ShieldCheck,
};

function isIndustrySecretCategory(
  value: unknown,
): value is IndustrySecretCategory {
  return typeof value === "string" && value in CATEGORY_LABELS;
}

function SecretCard({ secret }: { secret: SecretsData }) {
  const category: IndustrySecretCategory = isIndustrySecretCategory(
    secret.category,
  )
    ? secret.category
    : "pricing";
  const Icon = CATEGORY_ICONS[category];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="group h-full cursor-pointer rounded-2xl border border-white/10
            bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-red-500/30"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <Badge
                className={cn(
                  "text-xs font-bold text-white border-0",
                  `bg-gradient-to-r ${CATEGORY_COLORS[category]}`
                )}
              >
                {CATEGORY_LABELS[category].toUpperCase()}
              </Badge>
              <div
                className="flex h-9 w-9 items-center justify-center
                  rounded-xl bg-red-500/10 text-red-400"
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2">
              <h3
                className="text-lg font-bold leading-tight text-white
                  group-hover:text-red-300 transition-colors line-clamp-2"
              >
                {secret.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                {secret.summary}
              </p>
            </div>

            <div className="flex items-center text-red-400 text-sm font-medium">
              <span>Read full secret</span>
              <span className="ml-1">→</span>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-xl border-red-500/30 bg-[#060E23] text-white"
      >
        <DialogHeader>
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center
              rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-400"
          >
            <Icon className="h-7 w-7" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            {secret.title}
          </DialogTitle>
          <DialogDescription className="text-base text-white/60">
            {CATEGORY_LABELS[category]} Secret
          </DialogDescription>
        </DialogHeader>

        <div
          className="my-2 max-h-[60vh] overflow-y-auto rounded-xl bg-white/5 p-5
            text-sm leading-relaxed text-white/80 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
        >
          <div dangerouslySetInnerHTML={{ __html: secret.body_html }} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button asChild className="rounded-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" size="lg">
            <Link href="/contact">Get a quote</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CtaBreak({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Card
      className="group rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10
        via-orange-500/10 to-transparent p-6 text-white transition
        hover:border-red-500/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Pro Tip</span>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2 text-white">
        {title}
      </h3>
      <p className="text-white/70 mb-4 text-sm">{description}</p>
      <Button asChild className="rounded-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" size="sm">
        <Link href={href}>{cta}</Link>
      </Button>
    </Card>
  );
}

export function IndustrySecretsExplorer({
  secrets,
  defaultSelected,
}: {
  secrets: SecretsData[];
  defaultSelected?: IndustrySecretCategory[];
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<IndustrySecretCategory[]>(
    defaultSelected ?? [],
  );
  const [visibleCount, setVisibleCount] = React.useState(12);
  const [showAll, setShowAll] = React.useState(false);

  const categories = React.useMemo(() => {
    const counts: Record<string, number> = {};
    secrets.forEach((s) => {
      if (isIndustrySecretCategory(s.category)) {
        counts[s.category] = (counts[s.category] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat as IndustrySecretCategory);
  }, [secrets]);

  const toggleCategory = (cat: IndustrySecretCategory) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setVisibleCount(12);
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    return secrets.filter((s) => {
      const category = isIndustrySecretCategory(s.category) ? s.category : null;
      const matchesCategory =
        selected.length === 0 ||
        (category ? selected.includes(category) : false);

      const hay = `${s.title} ${s.summary}`.toLowerCase();
      const matchesQuery = !normalizedQuery || hay.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [secrets, selected, normalizedQuery]);

  const TRIVIA_BREAKS = [
    { id: "trivia-1", title: "Did You Know?", text: "35% of quotes have flexibility—ask politely and you might save!" },
    { id: "trivia-2", title: "Insider Tip", text: "Tuesday-Thursday bookings have 3x more vehicle availability." },
    { id: "trivia-3", title: "Pro Move", text: "Book 6-8 weeks early for prom and wedding dates." },
  ];

  const withBreaks = React.useMemo(() => {
    const visibleSecrets = showAll ? filtered : filtered.slice(0, visibleCount);
    const out: Array<
      { kind: "secret"; secret: SecretsData } | { kind: "cta"; id: string } | { kind: "trivia"; trivia: typeof TRIVIA_BREAKS[0] }
    > = [];
    
    visibleSecrets.forEach((s, idx) => {
      out.push({ kind: "secret", secret: s });
      if (idx === 5) out.push({ kind: "cta", id: "quote-checklist" });
      if (idx === 11) out.push({ kind: "trivia", trivia: TRIVIA_BREAKS[0] });
      if (idx === 17) out.push({ kind: "cta", id: "off-peak" });
      if (idx === 23) out.push({ kind: "trivia", trivia: TRIVIA_BREAKS[1] });
      if (idx === 29) out.push({ kind: "cta", id: "contact" });
      if (idx === 35) out.push({ kind: "trivia", trivia: TRIVIA_BREAKS[2] });
      if (idx === 47) out.push({ kind: "cta", id: "fleet" });
      if (idx === 59) out.push({ kind: "cta", id: "pricing" });
    });
    return out;
  }, [filtered, visibleCount, showAll]);

  const hasMore = filtered.length > visibleCount && !showAll;

  return (
    <section className="py-16 bg-gradient-to-b from-[#060e23] to-[#0a1628]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-4">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-red-300">
              Insider Knowledge
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            The Secrets Behind Party Bus Rentals
          </h2>
          <p className="text-blue-200/60 max-w-xl mx-auto text-sm">
            {secrets.length} insider tips to help you book smarter and save money
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-red-300/50" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(12);
              }}
              placeholder="Search secrets (pricing, prom, cleaning fees...)"
              className="h-14 w-full rounded-full bg-[#0f1f46] text-blue-50 text-lg border-2 border-red-500/30 pl-14 pr-14 placeholder:text-blue-300/40 focus:border-red-400/60 focus:ring-red-400/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const active = selected.includes(cat);
            const Icon = CATEGORY_ICONS[cat];
            const count = secrets.filter(s => s.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  active
                    ? `bg-gradient-to-r ${CATEGORY_COLORS[cat]} text-white shadow-lg`
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{CATEGORY_LABELS[cat]}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  active ? "bg-white/20" : "bg-white/10"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {(query || selected.length > 0) && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-blue-200/70">
              {filtered.length} secret{filtered.length !== 1 ? "s" : ""} found
              {selected.length > 0 && ` in ${selected.map(s => CATEGORY_LABELS[s]).join(", ")}`}
              {query && ` matching "${query}"`}
            </p>
            <Button
              size="sm"
              onClick={() => {
                setQuery("");
                setSelected([]);
                setVisibleCount(12);
              }}
              className="bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-white hover:border-red-500/50"
            >
              Clear filters
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {withBreaks.map((item, idx) => {
            if (item.kind === "cta") {
              if (item.id === "quote-checklist") {
                return (
                  <CtaBreak
                    key={`${item.id}-${idx}`}
                    title="Get an all-in quote checklist"
                    description="Make sure your quote includes hourly base, taxes, fuel, tolls, cleaning, and gratuity—so you can compare apples to apples."
                    href="/pricing"
                    cta="See Pricing"
                  />
                );
              }
              if (item.id === "off-peak") {
                return (
                  <CtaBreak
                    key={`${item.id}-${idx}`}
                    title="Prom + peak Saturdays = plan early"
                    description="Weekdays and daytime slots usually unlock better availability and lower minimums. Flexibility is your secret weapon."
                    href="/contact"
                    cta="Ask about off-peak"
                  />
                );
              }
              if (item.id === "contact") {
                return (
                  <CtaBreak
                    key={`${item.id}-${idx}`}
                    title="Have questions?"
                    description="Our team is available 24/7 to help you navigate these industry secrets and get the best deal."
                    href="/contact"
                    cta="Contact Us"
                  />
                );
              }
              if (item.id === "fleet") {
                return (
                  <CtaBreak
                    key={`${item.id}-${idx}`}
                    title="See Our Vehicles"
                    description="Browse party buses, limos, and coach buses to find the perfect fit for your group size and style."
                    href="/fleet"
                    cta="View Fleet"
                  />
                );
              }
              if (item.id === "pricing") {
                return (
                  <CtaBreak
                    key={`${item.id}-${idx}`}
                    title="Ready to Book?"
                    description="Get transparent pricing with all fees included. No hidden charges, no surprises."
                    href="/pricing"
                    cta="Get a Quote"
                  />
                );
              }
              return null;
            }

            if (item.kind === "trivia") {
              return (
                <Card
                  key={`${item.trivia.id}-${idx}`}
                  className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent p-6 text-white"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">{item.trivia.title}</span>
                  </div>
                  <p className="text-blue-100/90 text-sm leading-relaxed">{item.trivia.text}</p>
                </Card>
              );
            }

            return <SecretCard key={item.secret.id} secret={item.secret} />;
          })}
        </div>

        {hasMore && (
          <div className="text-center mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="rounded-full border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 px-8 font-semibold"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Show More
            </Button>
            <Button
              size="lg"
              onClick={() => setShowAll(true)}
              className="rounded-full border-2 border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/60 px-8 font-semibold"
            >
              Show All {filtered.length} Secrets
            </Button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">No secrets found matching your search</p>
            <Button
              onClick={() => {
                setQuery("");
                setSelected([]);
              }}
              className="mt-4 rounded-full border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 font-semibold"
            >
              Browse all secrets
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
