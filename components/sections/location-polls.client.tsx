"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Copy, Code, BarChart3, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PollEmbedModal } from "./poll-embed-modal";

type PollOption = {
  id: string;
  label: string;
  vote_count: number;
  ord: number;
};

type Poll = {
  id: string;
  question: string;
  category_slug: string | null;
  options: PollOption[];
};

interface LocationPollsClientProps {
  polls: Poll[];
  cityName: string;
}

const GRADIENT_CLASSES = [
  "from-indigo-600 via-purple-600 to-pink-600",
  "from-blue-600 via-cyan-600 to-teal-600",
  "from-violet-600 via-fuchsia-600 to-rose-600",
  "from-emerald-600 via-green-600 to-lime-600",
  "from-orange-600 via-red-600 to-pink-600",
  "from-amber-600 via-yellow-600 to-orange-600",
];

function PollCard({ 
  poll, 
  onEmbedLive, 
  onEmbedResults 
}: { 
  poll: Poll; 
  onEmbedLive: (id: string) => void;
  onEmbedResults: (id: string) => void;
}) {
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
  const [localOptions, setLocalOptions] = useState(poll.options);
  const [isVoting, setIsVoting] = useState(false);

  // Get stable gradient based on poll ID
  const gradientClass = React.useMemo(() => {
    const index =
      poll.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      GRADIENT_CLASSES.length;
    return GRADIENT_CLASSES[index];
  }, [poll.id]);

  const totalVotes = localOptions.reduce((sum, opt) => sum + (opt.vote_count || 0), 0);

  const handleVote = async (optionId: string) => {
    if (votedOptionId || isVoting) return;
    setIsVoting(true);

    const prevOptions = [...localOptions];
    setLocalOptions(opts =>
      opts.map(opt =>
        opt.id === optionId ? { ...opt, vote_count: (opt.vote_count || 0) + 1 } : opt
      )
    );
    setVotedOptionId(optionId);

    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("increment_poll_vote1", { p_option_id: optionId });
      if (error) throw error;
    } catch {
      setLocalOptions(prevOptions);
      setVotedOptionId(null);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={`rounded-2xl border-2 border-white/40 bg-gradient-to-br ${gradientClass} p-5 shadow-xl flex flex-col h-full hover:scale-[1.02] hover:shadow-2xl hover:border-white/60 transition-all duration-300`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
          <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Live Poll</span>
        </div>
        {totalVotes > 0 && (
          <div className="flex items-center gap-1 text-xs text-white/80">
            <span>{totalVotes.toLocaleString()}</span>
          </div>
        )}
      </div>
      <h3 className="text-white font-bold text-base mb-4 line-clamp-2 min-h-[48px] drop-shadow-lg">
        {poll.question}
      </h3>

      <div className="space-y-2 flex-1">
        {localOptions.map((option) => {
          const percentage = totalVotes > 0 
            ? Math.round(((option.vote_count || 0) / totalVotes) * 100) 
            : 0;
          const isVoted = votedOptionId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!votedOptionId || isVoting}
              className={`relative w-full text-left rounded-xl overflow-hidden transition-all ${
                votedOptionId
                  ? "cursor-default"
                  : "cursor-pointer hover:border-teal-400/50"
              } border ${isVoted ? "border-teal-400/50" : "border-white/10"} bg-white/5`}
            >
              {votedOptionId && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}
              <div className="relative px-3 py-2 flex items-center justify-between">
                <span className={`text-sm ${isVoted ? "text-teal-300 font-semibold" : "text-white/80"}`}>
                  {option.label}
                </span>
                {votedOptionId && (
                  <span className="text-xs text-white/60 font-medium ml-2">
                    {percentage}%
                  </span>
                )}
                {isVoted && <Check className="w-4 h-4 text-teal-400 ml-1" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/20 space-y-2">
        <button
          onClick={() => onEmbedLive(poll.id)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          <Code className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium truncate">Embed Live Poll</span>
          <Sparkles className="h-3 w-3 ml-auto text-violet-300 flex-shrink-0" />
        </button>
        <button
          onClick={() => onEmbedResults(poll.id)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          <BarChart3 className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium truncate">Embed Results</span>
          <Sparkles className="h-3 w-3 ml-auto text-amber-300 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

export function LocationPollsClient({ polls, cityName }: LocationPollsClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [embedModalOpen, setEmbedModalOpen] = React.useState(false);
  const [embedPoll, setEmbedPoll] = React.useState<{ id: string; question: string } | null>(null);
  const [embedType, setEmbedType] = React.useState<"live" | "results">("live");

  const pollsPerPage = 3;
  const totalPages = Math.ceil(polls.length / pollsPerPage);

  const nextPage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    
    timerRef.current = setInterval(() => {
      nextPage();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalPages, nextPage]);

  const visiblePolls = polls.slice(
    currentIndex * pollsPerPage,
    (currentIndex + 1) * pollsPerPage
  );

  const handleEmbedLive = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (poll) {
      setEmbedPoll({ id: poll.id, question: poll.question || "" });
      setEmbedType("live");
      setEmbedModalOpen(true);
    }
  };

  const handleEmbedResults = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (poll) {
      setEmbedPoll({ id: poll.id, question: poll.question || "" });
      setEmbedType("results");
      setEmbedModalOpen(true);
    }
  };

  if (polls.length === 0) {
    return (
      <div className="text-center py-12 text-white/50">
        No polls found for {cityName}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {embedPoll && (
        <PollEmbedModal
          poll={embedPoll}
          embedType={embedType}
          isOpen={embedModalOpen}
          onClose={() => {
            setEmbedModalOpen(false);
            setEmbedPoll(null);
          }}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-h-[280px]">
        {visiblePolls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            onEmbedLive={handleEmbedLive}
            onEmbedResults={handleEmbedResults}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={prevPage}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === currentIndex
                    ? "bg-teal-400"
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-white/40 text-sm">
        Showing {visiblePolls.length} of {polls.length} polls • Page {currentIndex + 1} of {totalPages}
      </div>
    </div>
  );
}
