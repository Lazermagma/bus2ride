import { getPolls, PollWithOptions } from "@/lib/data/polls";
import { PollsColumnsClient } from "./polls-columns.client";
import Link from "next/link";
import Locations from "../../lib/data/local/locations.json";
import { Zap, TrendingUp, MessageCircle, Sparkles } from "lucide-react";

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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1d3a] via-[#0a1628] to-[#060e23] py-20 md:py-32">
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[200px] pointer-events-none animate-orb-drift" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[250px] pointer-events-none" />

      <div className="relative container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel mb-6 border border-yellow-500/20">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
              Live Community
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-serif mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            See what other riders are thinking. Cast your vote to reveal the results instantly.
          </p>

          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-panel border border-green-500/20 hover:border-green-500/40 transition-all hover:scale-105">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wide">Total Votes</p>
                <p className="text-lg font-bold text-green-300">{totalVotes.toLocaleString()}+</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-panel border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-105">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wide">Questions</p>
                <p className="text-lg font-bold text-blue-300">{col1.length + col2.length + col3.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-8 lg:p-10 animate-fade-up-delay-1 border border-white/10 shadow-2xl backdrop-blur-xl">
          <PollsColumnsClient columns={columns} columnTitles={columnTitles} />
        </div>

        <div className="mt-16 flex justify-center animate-fade-up-delay-2">
          <Link
            href="/polls"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full
              bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg
              shadow-[0_20px_50px_rgba(59,130,246,0.4)] transition-all duration-300
              hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(59,130,246,0.5)] hover:scale-105
              border-2 border-white/20"
          >
            <Sparkles className="w-5 h-5" />
            <span>Explore all polls</span>
            <span className="group-hover:translate-x-1 transition-transform text-2xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
