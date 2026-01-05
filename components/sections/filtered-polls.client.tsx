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

  return (
    <section className="py-12 bg-gradient-to-b from-[#0a1628] to-[#0d1d3a]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-serif mb-2">
            Browse All Polls
          </h2>
          <p className="text-white/60">
            Showing {polls.length} {filter !== "all" ? filter : ""} polls
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Polls"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

