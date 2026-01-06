"use client";

import * as React from "react";
import { Loader2, Code, BarChart2, Sparkles, TrendingUp, Users } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import type { PollWithOptions } from "@/lib/data/polls";
import { cn } from "@/lib/utils";
import { PollEmbedModal } from "./poll-embed-modal";

interface PollCardProps {
  poll: PollWithOptions;
  backgroundClassName?: string;
  noLoadSpinner?: boolean;
  showEmbed?: boolean;
  compact?: boolean;
}

const GRADIENT_CLASSES = [
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-blue-600 via-cyan-600 to-teal-600",
  "from-violet-600 via-fuchsia-600 to-rose-600",
  "from-emerald-600 via-green-600 to-lime-600",
  "from-orange-600 via-red-600 to-pink-600",
  "from-amber-600 via-yellow-600 to-orange-600",
];

export function PollCard({
                           poll,
                           backgroundClassName,
                           noLoadSpinner = false,
                           showEmbed = true,
                           compact = false,
                         }: PollCardProps) {
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [embedModalOpen, setEmbedModalOpen] = React.useState(false);
  const [embedType, setEmbedType] = React.useState<"live" | "results">("live");

  const options = poll.options ?? [];

  /* -----------------------------------------
     Stable background gradient
  ----------------------------------------- */
  const gradientClass = React.useMemo(() => {
    const index =
      poll.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      GRADIENT_CLASSES.length;
    return GRADIENT_CLASSES[index];
  }, [poll.id]);

  /* -----------------------------------------
     Intersection Observer
  ----------------------------------------- */
  const { ref, entry } = useInView({
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  const visibility = entry?.intersectionRatio ?? 0;
  const opacity =
    visibility >= 0.75 ? 1 : visibility >= 0.5 ? 0.7 : visibility >= 0.25 ? 0.4 : 0.2;

  /* -----------------------------------------
     View counter
  ----------------------------------------- */
  const hasLoggedViewRef = React.useRef(false);

  React.useEffect(() => {
    if (visibility > 0.25 && !hasLoggedViewRef.current) {
      hasLoggedViewRef.current = true;
      createClient().rpc("increment_poll_view", { p_poll_id: poll.id });
    }
  }, [visibility, poll.id]);

  /* -----------------------------------------
     Votes
  ----------------------------------------- */
  const [votes, setVotes] = React.useState<Record<string, number>>(() =>
    options.reduce((acc, opt) => {
      acc[opt.id] = Number(opt.vote_count ?? 0);
      return acc;
    }, {} as Record<string, number>)
  );

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  /* -----------------------------------------
     Voting
  ----------------------------------------- */
  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting) return;

    setHasVoted(true);
    setIsSubmitting(true);

    setVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] ?? 0) + 1,
    }));

    const { error } = await createClient().rpc("increment_poll_vote1", {
      p_option_id: optionId,
    });

    if (error) console.error("Vote failed:", error);
    setIsSubmitting(false);
  };

  /* -----------------------------------------
     Embed handlers
  ----------------------------------------- */
  const openEmbedModal = (type: "live" | "results") => {
    setEmbedType(type);
    setEmbedModalOpen(true);
  };

  /* -----------------------------------------
     Render
  ----------------------------------------- */
  return (
    <>
      <Card
        ref={ref}
        style={{ opacity }}
        className={cn(
          "transition-all duration-500 ease-out group",
          "h-full rounded-3xl border-2 shadow-xl flex flex-col overflow-hidden",
          "bg-gradient-to-br",
          gradientClass,
          compact && "rounded-xl",
          backgroundClassName,
          "hover:scale-[1.02] hover:shadow-2xl hover:border-white/40 hover:z-50 relative"
        )}
      >
        <div className={cn("h-fit", compact ? "pb-3" : "pb-8")}>
        <CardHeader className={cn("relative z-10", compact ? "pb-1.5 px-3 pt-2.5" : "pb-3")}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Live Poll</span>
            </div>
            {totalVotes > 0 && (
              <div className="flex items-center gap-1 text-xs text-white/70">
                <Users className="w-3 h-3" />
                <span>{totalVotes.toLocaleString()}</span>
              </div>
            )}
          </div>
          <CardTitle className={cn("text-lg text-white font-bold leading-tight drop-shadow-lg mb-4", compact && "text-sm")}>
            {poll.question}
          </CardTitle>
        </CardHeader>

        <CardContent className={cn("relative flex flex-col z-10 h-fit", compact ? "px-3 pb-2" : "")}>
          <div className={cn("flex flex-col", hasVoted ? "gap-2" : "gap-3")}>
            {(() => {
              // Sort options by vote count when results are shown
              const sortedOptions = hasVoted 
                ? [...options].sort((a, b) => {
                    const aCount = votes[a.id] ?? 0;
                    const bCount = votes[b.id] ?? 0;
                    return bCount - aCount;
                  })
                : options;
              
              return sortedOptions.map((option, idx) => {
                const count = votes[option.id] ?? 0;
                const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                const isTop = hasVoted && idx === 0 && percent > 0;

              return (
                <div key={option.id} className={hasVoted ? "space-y-1" : "space-y-1.5"}>
                  {hasVoted ? (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className={cn(
                          "text-white font-medium",
                          isTop && "text-yellow-200 font-bold"
                        )}>
                          {option.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {isTop && <TrendingUp className="w-3.5 h-3.5 text-yellow-300" />}
                          <span className={cn(
                            "font-bold",
                            isTop ? "text-yellow-200" : "text-white/90"
                          )}>
                            {percent}%
                          </span>
                        </div>
                      </div>
                      <div className="relative h-2 rounded-full bg-white/20 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isTop 
                              ? "bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/50"
                              : "bg-gradient-to-r from-white/40 to-white/60"
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/50 text-right leading-tight">{count.toLocaleString()} votes</p>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => handleVote(option.id)}
                      className={cn(
                        "w-full py-3.5 rounded-xl border-2 transition-all duration-200",
                        "bg-white/10 backdrop-blur-sm border-white/20",
                        "hover:bg-white/20 hover:border-white/40 hover:scale-[1.02]",
                        "text-white font-medium text-sm shadow-lg",
                        isSubmitting && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-auto flex-shrink-0" />}
                    </Button>
                  )}
                </div>
              );
            });
            })()}
          </div>

          {/* EMBED BUTTONS */}
          {showEmbed && (
            <div className={cn("border-t h-fit border-white/20 space-y-2 flex-shrink-0 mt-4", compact ? "pb-2 pt-1" : "pb-10 pt-1")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEmbedModal("live")}
                className={cn(
                  "w-full text-xs text-white/90 hover:text-white hover:bg-white/20 gap-2 rounded-lg transition-all duration-200 hover:scale-[1.02]",
                  compact && "text-[10px] py-1.5"
                )}
              >
                <Code className={cn("h-4 w-4 flex-shrink-0", compact && "h-3 w-3")} />
                <span className="font-medium truncate">Embed Live Poll</span>
                <Sparkles className={cn("h-3 w-3 ml-auto text-violet-300 flex-shrink-0", compact && "h-2.5 w-2.5")} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEmbedModal("results")}
                className={cn(
                  "w-full text-xs text-white/90 hover:text-white hover:bg-white/20 gap-2 rounded-lg transition-all duration-200 hover:scale-[1.02]",
                  compact && "text-[10px] py-1.5"
                )}
              >
                <BarChart2 className={cn("h-4 w-4 flex-shrink-0", compact && "h-3 w-3")} />
                <span className="font-medium truncate">Embed Results</span>
                <Sparkles className={cn("h-3 w-3 ml-auto text-amber-300 flex-shrink-0", compact && "h-2.5 w-2.5")} />
              </Button>
            </div>
          )}
        </CardContent>
        </div>
      </Card>

      <PollEmbedModal
        poll={poll}
        embedType={embedType}
        isOpen={embedModalOpen}
        onClose={() => setEmbedModalOpen(false)}
      />
    </>
  );
}
