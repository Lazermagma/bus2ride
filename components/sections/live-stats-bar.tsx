"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, Users, Vote, Trophy, BarChart3, Zap, Clock, Target, 
  ChevronLeft, ChevronRight, Sparkles, Flame, Star, Lightbulb
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export interface LiveStat {
  id: string;
  label: string;
  value: string | number;
  icon: "trending" | "users" | "vote" | "trophy" | "chart" | "zap" | "clock" | "target" | "sparkles" | "flame" | "star" | "lightbulb";
  color: "green" | "blue" | "indigo" | "amber" | "cyan" | "yellow" | "purple" | "red" | "pink" | "orange" | "emerald" | "violet";
  href?: string;
  pulse?: boolean;
  pollId?: string;
  pollQuestion?: string;
  description?: string;
}

interface LiveStatsBarProps {
  stats: LiveStat[];
  title?: string;
}

const iconMap = {
  trending: TrendingUp,
  users: Users,
  vote: Vote,
  trophy: Trophy,
  chart: BarChart3,
  zap: Zap,
  clock: Clock,
  target: Target,
  sparkles: Sparkles,
  flame: Flame,
  star: Star,
  lightbulb: Lightbulb,
};

const colorClasses = {
  green: { bg: "from-green-500/20 to-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  blue: { bg: "from-blue-500/20 to-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  indigo: { bg: "from-indigo-500/20 to-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  amber: { bg: "from-amber-500/20 to-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  cyan: { bg: "from-cyan-500/20 to-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  yellow: { bg: "from-yellow-500/20 to-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  purple: { bg: "from-purple-500/20 to-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  red: { bg: "from-red-500/20 to-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  pink: { bg: "from-pink-500/20 to-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  orange: { bg: "from-orange-500/20 to-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  emerald: { bg: "from-emerald-500/20 to-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  violet: { bg: "from-violet-500/20 to-violet-500/10", text: "text-violet-400", border: "border-violet-500/30" },
};

interface PollOption {
  id: string;
  label: string;
  vote_count: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
}

function QuickPollModal({ 
  pollId, 
  isOpen, 
  onClose, 
  statLabel,
  colors
}: { 
  pollId: string; 
  isOpen: boolean; 
  onClose: () => void;
  statLabel: string;
  colors: typeof colorClasses[keyof typeof colorClasses];
}) {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && pollId) {
      setLoading(true);
      setHasVoted(false);
      
      const fetchPoll = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("polls1")
          .select(`
            id,
            question,
            options:poll_options1 (id, label, vote_count)
          `)
          .eq("id", pollId)
          .single();

        if (data) {
          setPoll(data as unknown as PollData);
          setVotes(
            (data.options || []).reduce<Record<string, number>>((acc, opt: { id: string; vote_count: number }) => {
              acc[opt.id] = opt.vote_count || 0;
              return acc;
            }, {})
          );
        }
        setLoading(false);
      };

      fetchPoll();
    }
  }, [isOpen, pollId]);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting) return;
    setIsSubmitting(true);
    
    setVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] ?? 0) + 1,
    }));
    setHasVoted(true);
    
    const supabase = createClient();
    await supabase.rpc("increment_poll_vote1", { p_option_id: optionId });
    setIsSubmitting(false);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const sortedOptions = poll?.options ? [...poll.options].sort((a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0)) : [];
  const winningId = sortedOptions[0]?.id;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "sm:max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        "border text-white",
        colors.border
      )}>
        <DialogHeader>
          <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold w-fit", `bg-gradient-to-r ${colors.bg}`, colors.text)}>
            <Sparkles className="w-3 h-3" />
            {statLabel}
          </div>
          <DialogTitle className="text-xl font-bold text-white mt-3">
            {loading ? "Loading..." : poll?.question || "Poll not found"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : poll ? (
          <div className="mt-4 space-y-3">
            {sortedOptions.map((option, idx) => {
              const voteCount = votes[option.id] ?? 0;
              const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
              const isWinning = option.id === winningId && hasVoted;

              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted || isSubmitting}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all relative overflow-hidden",
                    "border",
                    hasVoted 
                      ? "cursor-default" 
                      : "hover:scale-[1.02] cursor-pointer hover:border-white/30",
                    isWinning 
                      ? `${colors.border} bg-gradient-to-r ${colors.bg}` 
                      : "border-white/10 bg-white/5"
                  )}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className={cn(
                      "font-medium",
                      isWinning ? colors.text : "text-white"
                    )}>
                      {option.label}
                    </span>
                    {hasVoted && (
                      <span className={cn(
                        "text-sm font-bold",
                        isWinning ? colors.text : "text-white/70"
                      )}>
                        {percentage}%
                      </span>
                    )}
                  </div>
                  {hasVoted && (
                    <div className="mt-2">
                      <Progress 
                        value={percentage} 
                        className="h-1.5 bg-white/10"
                      />
                      <span className="text-xs text-white/50 mt-1">
                        {voteCount.toLocaleString()} votes
                      </span>
                    </div>
                  )}
                </button>
              );
            })}

            <div className="pt-4 flex items-center justify-between text-sm text-white/50">
              <span>{totalVotes.toLocaleString()} total votes</span>
              {hasVoted && <span className="text-green-400">Vote recorded!</span>}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-white/50">Poll not found</div>
        )}

        <div className="mt-4 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-full border-white/20 text-black hover:bg-white/10 bg-white"
          >
            Close
          </Button>
          <Button
            asChild
            className={cn("flex-1 rounded-full font-bold bg-gradient-to-r", colors.bg.replace("/20", ""), colors.bg.replace("/10", ""), "text-white border-0")}
          >
            <a href="/polls">Browse All Polls</a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LiveStatsBar({ stats, title }: LiveStatsBarProps) {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activePoll, setActivePoll] = useState<{ id: string; label: string; colors: typeof colorClasses[keyof typeof colorClasses] } | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("live-stats-container");
    if (!container) return;
    
    const scrollAmount = 300;
    const newPosition = direction === "left" 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    container.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  useEffect(() => {
    const container = document.getElementById("live-stats-container");
    if (!container) return;

    const handleScrollUpdate = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
      setScrollPosition(container.scrollLeft);
    };

    container.addEventListener("scroll", handleScrollUpdate);
    handleScrollUpdate();

    return () => container.removeEventListener("scroll", handleScrollUpdate);
  }, []);

  const handleStatClick = useCallback((stat: LiveStat) => {
    if (stat.pollId) {
      setActivePoll({ 
        id: stat.pollId, 
        label: stat.label,
        colors: colorClasses[stat.color]
      });
    } else if (stat.href) {
      router.push(stat.href);
    }
  }, [router]);

  return (
    <>
      <div className="relative bg-gradient-to-r from-[#0a1628]/95 via-[#0d1d3a]/95 to-[#0a1628]/95 border-y border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          {title && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">{title}</span>
            </div>
          )}
          
          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#0a1628] border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            )}
            
            <div
              id="live-stats-container"
              className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {stats.map((stat, index) => {
                const Icon = iconMap[stat.icon];
                const colors = colorClasses[stat.color];
                const hasInteraction = stat.href || stat.pollId;
                
                return (
                  <button
                    key={stat.id}
                    onClick={() => handleStatClick(stat)}
                    disabled={!hasInteraction}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-xl min-w-[140px]",
                      `bg-gradient-to-r ${colors.bg} border ${colors.border}`,
                      hasInteraction ? "hover:scale-105 cursor-pointer" : "cursor-default",
                      "transition-all duration-200 animate-fade-up"
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="relative w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                      {stat.pulse && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      )}
                    </div>
                    <div className="text-left min-w-0">
                      <div className={`text-lg font-bold ${colors.text} truncate`}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-white/50 truncate max-w-[120px]" title={stat.pollQuestion || stat.label}>
                        {stat.pollQuestion ? stat.pollQuestion.slice(0, 25) + (stat.pollQuestion.length > 25 ? "..." : "") : stat.label}
                      </div>
                      {stat.description && (
                        <div className="text-[9px] text-white/30 truncate">
                          {stat.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {canScrollRight && (
              <button
                onClick={() => handleScroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#0a1628] border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {activePoll && (
        <QuickPollModal
          pollId={activePoll.id}
          isOpen={true}
          onClose={() => setActivePoll(null)}
          statLabel={activePoll.label}
          colors={activePoll.colors}
        />
      )}
    </>
  );
}

export interface PollAnalyticsData {
  votesLast5Min: number;
  votesLast60Min: number;
  votesToday: number;
  totalPolls: number;
  totalVotes: number;
  trendingCategory: string;
  topCategory: string;
  avgVotesPerPoll: number;
  mostPopularPoll: { id: string; question: string; votes: number } | null;
  fastestRisingPoll: { id: string; question: string; votes: number } | null;
  newestPoll: { id: string; question: string } | null;
  randomPollOfHour: { id: string; question: string } | null;
  hiddenGemPoll: { id: string; question: string; votes: number } | null;
  hardestPoll: { id: string; question: string; correctPercent: number } | null;
  easiestPoll: { id: string; question: string; correctPercent: number } | null;
}

export function generateLiveStatsFromAnalytics(analytics: PollAnalyticsData): LiveStat[] {
  return [
    {
      id: "votes-5min",
      label: "Votes (5 min)",
      value: analytics.votesLast5Min,
      icon: "zap",
      color: "yellow",
      href: "/polls/results",
      pulse: true,
      description: "Live voting now",
    },
    {
      id: "votes-1hr",
      label: "Votes (1 hour)",
      value: analytics.votesLast60Min.toLocaleString(),
      icon: "trending",
      color: "green",
      href: "/polls/results",
      description: "Recent activity",
    },
    {
      id: "votes-today",
      label: "Votes Today",
      value: analytics.votesToday.toLocaleString(),
      icon: "users",
      color: "blue",
      href: "/polls/results",
      description: "Today's engagement",
    },
    {
      id: "trending-cat",
      label: "Trending Now",
      value: analytics.trendingCategory,
      icon: "flame",
      color: "orange",
      href: `/polls?category=${analytics.trendingCategory.toLowerCase()}`,
      description: "Hot category",
    },
    {
      id: "rising-fast",
      label: "Rising Fast",
      value: analytics.fastestRisingPoll?.votes?.toLocaleString() || "🔥",
      icon: "trending",
      color: "red",
      pollId: analytics.fastestRisingPoll?.id,
      pollQuestion: analytics.fastestRisingPoll?.question,
      pulse: true,
      description: "Gaining votes fast",
    },
    {
      id: "most-popular",
      label: "Most Popular",
      value: analytics.mostPopularPoll?.votes?.toLocaleString() || "8.7K",
      icon: "star",
      color: "amber",
      pollId: analytics.mostPopularPoll?.id,
      pollQuestion: analytics.mostPopularPoll?.question,
      description: "Top voted poll",
    },
    {
      id: "poll-of-hour",
      label: "Poll of Hour",
      value: "🎲",
      icon: "sparkles",
      color: "violet",
      pollId: analytics.randomPollOfHour?.id,
      pollQuestion: analytics.randomPollOfHour?.question,
      description: "Random discovery",
    },
    {
      id: "hidden-gem",
      label: "Hidden Gem",
      value: `💎 ${analytics.hiddenGemPoll?.votes || ""} votes`,
      icon: "lightbulb",
      color: "cyan",
      pollId: analytics.hiddenGemPoll?.id,
      pollQuestion: analytics.hiddenGemPoll?.question,
      description: "Needs your vote",
    },
    {
      id: "hardest",
      label: "Hardest Poll",
      value: `${analytics.hardestPoll?.correctPercent || 12}%`,
      icon: "target",
      color: "red",
      pollId: analytics.hardestPoll?.id,
      pollQuestion: analytics.hardestPoll?.question,
      description: "Trickiest question",
    },
    {
      id: "easiest",
      label: "Easiest Poll",
      value: `${analytics.easiestPoll?.correctPercent || 94}%`,
      icon: "trophy",
      color: "emerald",
      pollId: analytics.easiestPoll?.id,
      pollQuestion: analytics.easiestPoll?.question,
      description: "Most agreed",
    },
    {
      id: "new-poll",
      label: "Just Added",
      value: "New!",
      icon: "sparkles",
      color: "pink",
      pollId: analytics.newestPoll?.id,
      pollQuestion: analytics.newestPoll?.question,
      description: "Be first to vote",
    },
    {
      id: "top-category",
      label: "Top Category",
      value: analytics.topCategory,
      icon: "trophy",
      color: "amber",
      href: `/polls?category=${analytics.topCategory.toLowerCase()}`,
      description: "Most active all-time",
    },
    {
      id: "total-polls",
      label: "Total Polls",
      value: (analytics.totalPolls / 1000).toFixed(1) + "K",
      icon: "vote",
      color: "indigo",
      href: "/polls",
      description: "Browse all",
    },
    {
      id: "total-votes",
      label: "All-Time Votes",
      value: (analytics.totalVotes / 1000000).toFixed(1) + "M+",
      icon: "chart",
      color: "purple",
      href: "/polls/results",
      description: "Community insights",
    },
  ];
}

export function generateLiveStats(): LiveStat[] {
  const now = new Date();
  const hourSeed = now.getHours();
  
  return [
    {
      id: "votes-5min",
      label: "Votes (5 min)",
      value: Math.floor(Math.random() * 40) + 15,
      icon: "zap",
      color: "yellow",
      href: "/polls/results",
      pulse: true,
    },
    {
      id: "votes-1hr",
      label: "Votes (1 hour)",
      value: (Math.floor(Math.random() * 500) + 400).toLocaleString(),
      icon: "trending",
      color: "green",
      href: "/polls/results",
    },
    {
      id: "votes-today",
      label: "Votes Today",
      value: (Math.floor(Math.random() * 8000) + 10000).toLocaleString(),
      icon: "users",
      color: "blue",
      href: "/polls/results",
    },
    {
      id: "trending-cat",
      label: "Trending Category",
      value: ["Wedding", "Prom", "Bachelor", "Corporate"][hourSeed % 4],
      icon: "flame",
      color: "orange",
      href: "/polls?filter=trending",
    },
    {
      id: "rising-fast",
      label: "Rising Fast",
      value: "🔥 Hot",
      icon: "trending",
      color: "red",
      href: "/polls?filter=rising",
      pulse: true,
    },
    {
      id: "poll-of-hour",
      label: "Poll of the Hour",
      value: "🎲",
      icon: "sparkles",
      color: "violet",
      href: "/polls?filter=random",
    },
    {
      id: "hidden-gem",
      label: "Hidden Gem",
      value: "💎",
      icon: "lightbulb",
      color: "cyan",
      href: "/polls?filter=hidden-gems",
    },
    {
      id: "hardest",
      label: "Hardest Poll",
      value: "12%",
      icon: "target",
      color: "red",
      href: "/polls?filter=hardest",
    },
    {
      id: "easiest",
      label: "Easiest Poll",
      value: "94%",
      icon: "trophy",
      color: "emerald",
      href: "/polls?filter=easiest",
    },
    {
      id: "new-poll",
      label: "Just Added",
      value: "New!",
      icon: "sparkles",
      color: "pink",
      href: "/polls?filter=new",
    },
    {
      id: "most-popular",
      label: "Most Popular",
      value: "8.7K",
      icon: "star",
      color: "amber",
      href: "/polls?filter=popular",
    },
    {
      id: "total-polls",
      label: "Total Polls",
      value: "51.2K",
      icon: "vote",
      color: "indigo",
      href: "/polls",
    },
    {
      id: "total-votes",
      label: "All-Time Votes",
      value: "2.4M+",
      icon: "chart",
      color: "purple",
      href: "/polls/results",
    },
    {
      id: "categories",
      label: "Categories",
      value: "150+",
      icon: "target",
      color: "cyan",
      href: "/polls",
    },
  ];
}

export const DEFAULT_LIVE_STATS: LiveStat[] = generateLiveStats();
