import { getPolls, PollWithOptions } from "@/lib/data/polls";
import { PollsColumnsClient } from "./polls-columns.client";
import Link from "next/link";
import Locations from "../../lib/data/local/locations.json";
import { Zap, TrendingUp, MessageCircle } from "lucide-react";

const cities = Locations.flatMap((loc) =>
  loc.cities.map((city) => city.toLowerCase()),
);

const CATEGORY_TITLES: Record<string, string> = {
  "party-bus": "Party Buses",
  "coach-bus": "Coach Buses",
  limo: "Limousines",
  "party-van": "Party Vans",
  events: "Events",
  pricing: "Pricing",
  "booking-experience": "Booking Experience",
  "booking-lead-times": "Booking Lead Times",
  "alcohol-policy": "Alcohol Policy",
  "airport-procedures": "Airport Procedures",
  weddings: "Weddings",
  concerts: "Concerts",
  prom: "Prom",
  "sporting-events": "Sporting Events",
  "bachelor-parties": "Bachelor Parties",
  "bachelorette-parties": "Bachelorette Parties",
  "birthday-parties": "Birthday Parties",
  "accessibility-experience": "Accessibility",
  audio: "Audio",
  "bar-area": "Bar Area",
  "wrap-around-seating": "Wrap-Around Seating",
};

const humanizeCategorySlug = (slug: string) => {
  const raw = (slug ?? "").trim();
  if (!raw) return "";
  if (CATEGORY_TITLES[raw]) return CATEGORY_TITLES[raw];

  return raw
    .split("-")
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === "suv") return "SUV";
      if (lower === "ada") return "ADA";
      if (lower === "byob") return "BYOB";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
};

interface PollsGridProps {
  category?: string;
  columnCategories?: string[];
  hideCities?: boolean;
  title?: string;
}

export async function PollsGrid({
  category,
  columnCategories,
  hideCities = true,
  title = "Trending Questions",
}: PollsGridProps) {
  const COLUMN_COUNT = 3;
  const PER_COLUMN = 50;
  const FETCH_LIMIT = 250;

  const categories = (
    columnCategories && columnCategories.length > 0
      ? columnCategories
      : category
        ? [category, "", ""]
        : ["", "", ""]
  )
    .slice(0, COLUMN_COUNT)
    .map((c) => (c ?? "").trim());

  const totalVotesForPoll = (poll: PollWithOptions) =>
    (poll.options ?? []).reduce(
      (sum, opt) => sum + Number(opt.vote_count ?? 0),
      0,
    );

  const sortByMostVotes = (polls: PollWithOptions[]) =>
    [...polls].sort(
      (a, b) =>
        totalVotesForPoll(b) - totalVotesForPoll(a) ||
        (a.question ?? "").localeCompare(b.question ?? ""),
    );

  const [raw1, raw2, raw3] = await Promise.all([
    getPolls(FETCH_LIMIT, categories[0] ?? ""),
    getPolls(FETCH_LIMIT, categories[1] ?? ""),
    getPolls(FETCH_LIMIT, categories[2] ?? ""),
  ]);

  const filterCityPolls = (polls: PollWithOptions[] | null) => {
    if (!hideCities || !polls) return polls;
    return polls.filter((poll) => {
      const question = poll.question?.toLowerCase() ?? "";
      return !cities.some((city) => question.includes(city));
    });
  };

  const col1 = filterCityPolls(raw1)
    ? sortByMostVotes(filterCityPolls(raw1)!).slice(0, PER_COLUMN)
    : [];
  const col2 = filterCityPolls(raw2)
    ? sortByMostVotes(filterCityPolls(raw2)!).slice(0, PER_COLUMN)
    : [];
  const col3 = filterCityPolls(raw3)
    ? sortByMostVotes(filterCityPolls(raw3)!).slice(0, PER_COLUMN)
    : [];

  const columns: PollWithOptions[][] = [col1, col2, col3];
  const columnTitles = categories.map(humanizeCategorySlug);

  const totalVotes = [...col1, ...col2, ...col3].reduce(
    (sum, poll) => sum + totalVotesForPoll(poll),
    0
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1d3a] to-[#0a1628] py-20 md:py-28">
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none animate-orb-drift" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[120px] pointer-events-none" />

      <div className="relative container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
              Live Community
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif text-glow-white">
            {title}
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            See what other riders are thinking. Cast your vote to reveal the results instantly.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/80">{totalVotes.toLocaleString()}+ votes</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/80">{col1.length + col2.length + col3.length} questions</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-8 animate-fade-up-delay-1">
          <PollsColumnsClient columns={columns} columnTitles={columnTitles} />
        </div>

        <div className="mt-12 flex justify-center animate-fade-up-delay-2">
          <Link
            href="/polls"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full
              bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg
              shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all duration-300
              hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(59,130,246,0.4)]"
          >
            <span>Explore all polls</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
