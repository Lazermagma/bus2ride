"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Copy, Code, BarChart3 } from "lucide-react";
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
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-5 shadow-lg flex flex-col h-full">
      <h3 className="text-white font-semibold text-base mb-4 line-clamp-2 min-h-[48px]">
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

      <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
        <button
          onClick={() => onEmbedLive(poll.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-medium transition"
        >
          <Code className="w-3.5 h-3.5" />
          Embed Poll
        </button>
        <button
          onClick={() => onEmbedResults(poll.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Embed Results
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
