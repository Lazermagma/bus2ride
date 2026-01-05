"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Flame, Star, Zap, Trophy, ThumbsUp, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PollWithOptions } from "@/lib/data/polls";
import { cn } from "@/lib/utils";
import { PollEmbedModal } from "./poll-embed-modal";

interface PollModalProps {
  poll: PollWithOptions | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: "trending" | "random" | "hot" | "popular" | "surprise";
}

const THEME_CONFIG = {
  trending: {
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/20 via-red-500/10 to-orange-500/20",
    borderColor: "border-orange-500/40",
    title: "Trending Poll",
  },
  random: {
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 via-pink-500/10 to-purple-500/20",
    borderColor: "border-purple-500/40",
    title: "Random Poll",
  },
  hot: {
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/20 via-orange-500/10 to-yellow-500/20",
    borderColor: "border-yellow-500/40",
    title: "Hot Right Now",
  },
  popular: {
    icon: Trophy,
    gradient: "from-amber-400 to-yellow-500",
    bgGradient: "from-amber-400/20 via-yellow-500/10 to-amber-400/20",
    borderColor: "border-amber-400/40",
    title: "Most Popular",
  },
  surprise: {
    icon: Star,
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-500/20 via-blue-500/10 to-cyan-500/20",
    borderColor: "border-cyan-500/40",
    title: "Surprise Poll",
  },
};

export function PollModal({ poll, isOpen, onClose, theme = "trending" }: PollModalProps) {
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [votes, setVotes] = React.useState<Record<string, number>>({});
  const [embedModalOpen, setEmbedModalOpen] = React.useState(false);
  const [embedType, setEmbedType] = React.useState<"live" | "results">("live");
  
  const config = THEME_CONFIG[theme];
  const Icon = config.icon;
  
  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  
  React.useEffect(() => {
    if (poll && isOpen) {
      setHasVoted(false);
      setCopied(false);
      setEmbedType("live");
      setVotes(
        (poll.options ?? []).reduce<Record<string, number>>((acc, opt) => {
          acc[opt.id] = Number(opt.vote_count ?? 0);
          return acc;
        }, {})
      );
    }
  }, [poll, isOpen]);
  
  if (!poll) return null;
  
  const options = poll.options ?? [];
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  
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


  const sortedOptions = [...options].sort((a, b) => {
    const aCount = votes[a.id] ?? 0;
    const bCount = votes[b.id] ?? 0;
    return bCount - aCount;
  });
  const winningId = sortedOptions[0]?.id;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "sm:max-w-5xl max-w-[95vw] border bg-[#0d1d3a] p-0 overflow-hidden",
        config.borderColor
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-30 pointer-events-none",
          config.bgGradient
        )} />
        
        <div className="relative">
          <DialogHeader className="p-5 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                config.gradient
              )}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider bg-gradient-to-r bg-clip-text text-transparent",
                  config.gradient
                )}>
                  {config.title}
                </span>
                <DialogTitle className="text-lg text-white mt-0.5 pr-6">
                  {poll.question}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="p-5 border-r border-white/10">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                {hasVoted ? "Results" : "Cast Your Vote"}
              </h4>
              
              <div className="space-y-2">
                {options.map((option) => {
                  const count = votes[option.id] ?? 0;
                  const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                  const isWinner = hasVoted && option.id === winningId;
                  
                  return (
                    <div key={option.id}>
                      {hasVoted ? (
                        <div className={cn(
                          "rounded-lg p-3 transition-all",
                          isWinner 
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30" 
                            : "bg-white/5 border border-white/10"
                        )}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className={cn(
                              "font-medium flex items-center gap-2",
                              isWinner ? "text-green-400" : "text-white"
                            )}>
                              {isWinner && <Trophy className="w-3.5 h-3.5" />}
                              {option.label}
                            </span>
                            <span className={isWinner ? "text-green-400 font-bold" : "text-white/70"}>
                              {percent}%
                            </span>
                          </div>
                          <Progress value={percent} className="h-2" />
                          <p className="text-xs text-white/50 text-right mt-1">
                            {count.toLocaleString()} votes
                          </p>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start h-auto py-3 px-4 rounded-lg",
                            "border border-white/20 bg-white/5 hover:bg-white/15",
                            "text-white text-left whitespace-normal text-sm",
                            "transition-all hover:scale-[1.01] hover:border-white/40",
                            isSubmitting && "opacity-50 pointer-events-none"
                          )}
                          onClick={() => handleVote(option.id)}
                          disabled={isSubmitting}
                        >
                          {option.label}
                          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {hasVoted && (
                <div className="flex items-center justify-center gap-2 mt-4 py-2">
                  <ThumbsUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Thanks for voting!</span>
                </div>
              )}
              
              {!hasVoted && (
                <p className="text-xs text-center text-white/40 mt-4">
                  Click an option to vote • {totalVotes.toLocaleString()} votes so far
                </p>
              )}
            </div>
            
            <div className="p-5 bg-black/20 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Embed Options
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => openEmbedModal("live")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    Embed Live Poll
                  </button>
                  <button
                    onClick={() => openEmbedModal("results")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Embed Poll Results
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-center">
                  <p className="text-xl font-bold text-white">{totalVotes.toLocaleString()}</p>
                  <p className="text-xs text-white/50">Total Votes</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-center">
                  <p className="text-xl font-bold text-white">{options.length}</p>
                  <p className="text-xs text-white/50">Options</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  navigator.share?.({ 
                    title: poll.question, 
                    url: `${origin}/polls?id=${poll.id}` 
                  }).catch(() => {});
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share Poll
              </button>
            </div>
          </div>
        </div>
      </DialogContent>

      {poll && (
        <PollEmbedModal
          poll={poll}
          embedType={embedType}
          isOpen={embedModalOpen}
          onClose={() => setEmbedModalOpen(false)}
        />
      )}
    </Dialog>
  );
}
