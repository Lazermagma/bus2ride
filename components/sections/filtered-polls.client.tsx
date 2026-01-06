"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { PollWithOptions } from "@/lib/data/polls";
import { PollCard } from "./poll-card";
import type { FilterType } from "./poll-filter-tabs";

interface FilteredPollsClientProps {
  categories: Array<{
    slug: string;
    title: string;
    gradient: string;
    textColor: string;
    hoverColor: string;
    iconName: string;
  }>;
}

export function FilteredPollsClient({ categories }: FilteredPollsClientProps) {
  const searchParams = useSearchParams();
  const filter = (searchParams.get("filter") as FilterType) || "all";
  const [polls, setPolls] = useState<PollWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      setPolls([]);
      setPage(1);
      
      try {
        const response = await fetch(`/api/polls/analytics?filter=${filter}&limit=30`);
        const data = await response.json();
        
        if (data.polls) {
          setPolls(data.polls);
          setHasMore(data.polls.length >= 30);
        }
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [filter]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/polls/analytics?filter=${filter}&limit=30`);
      const data = await response.json();
      
      if (data.polls && data.polls.length > 0) {
        // For now, just show that we've loaded all available polls
        // In the future, we can implement proper pagination
        setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more polls:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading && polls.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-b from-[#0a1628] to-[#0d1d3a]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (polls.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-b from-[#0a1628] to-[#0d1d3a]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No polls found for this filter.</p>
          </div>
        </div>
      </section>
    );
  }

  const INITIAL_DISPLAY = 6;
  const showScrollable = polls.length > INITIAL_DISPLAY;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1d3a] via-[#0a1628] to-[#060e23] py-20 md:py-32">
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[200px] pointer-events-none animate-orb-drift" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[250px] pointer-events-none" />
      
      <div className="relative container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mb-12 text-center animate-fade-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-serif mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Browse All Polls
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            Showing {polls.length} {filter !== "all" ? filter : ""} polls
          </p>
        </div>

        {showScrollable ? (
          <div className="relative max-w-5xl mx-auto">
            <div className="glass-panel rounded-3xl p-6 md:p-8 lg:p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div
                className="h-[600px] md:h-[700px] overflow-y-scroll rounded-3xl polls-column-scroll
                  scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                  pr-2"
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {polls.map((poll) => (
                    <PollCard key={poll.id} poll={poll} compact />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="glass-panel rounded-3xl p-6 md:p-8 lg:p-10 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {polls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} compact />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

