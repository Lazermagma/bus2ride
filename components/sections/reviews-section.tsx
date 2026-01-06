"use client";

import * as React from "react";
import { Search, Check, Filter, Quote, Sparkles, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReviewsData } from "@/lib/data/reviews";
import { FactsShowcase, type FactItem } from "@/components/sections/facts-showcase";
import { TriviaBookingSection, type TriviaItem } from "@/components/sections/trivia-booking-section";

interface ReviewsSectionProps {
  reviews: ReviewsData[];
  title?: string;
  defaultFilters?: (typeof FILTERS)[number]["tag"][];
  totalCount?: number;
  facts?: FactItem[];
  trivia?: TriviaItem[];
}

const FILTERS = [
  { label: "Party Bus", tag: "party-bus" },
  { label: "Limo", tag: "limo" },
  { label: "Weddings", tag: "wedding" },
  { label: "Drivers", tag: "driver" },
  { label: "On Time", tag: "punctuality" },
] as const;

export function ReviewsSection({
  reviews,
  title,
  defaultFilters,
  totalCount,
  facts,
  trivia,
}: ReviewsSectionProps) {
  const pathname = usePathname();
  const isReviewsPage = pathname === "/reviews";
  const [showAll, setShowAll] = React.useState(isReviewsPage);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<string[]>(
    defaultFilters || [],
  );

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((f) => f !== tag) : [...prev, tag],
    );
  };

  const filteredReviews = React.useMemo(() => {
    return reviews.filter((review) => {
      const matchesSearch =
        (review.body?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (review.author_display?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      const matchesTags =
        activeFilters.length === 0 ||
        activeFilters.some((filterTag) => {
          const reviewLabels = [];
          if (review.tags) reviewLabels.push(...review.tags);
          if (review.city_slug) reviewLabels.push(review.city_slug);
          if (review.state_slug) reviewLabels.push(review.state_slug);
          if (review.event_slug) reviewLabels.push(review.event_slug);
          if (review.body) {
            reviewLabels.push(...review.body.toLowerCase().split(" "));
          }
          return reviewLabels.includes(filterTag);
        });

      return matchesSearch && matchesTags;
    });
  }, [reviews, searchQuery, activeFilters]);

  return (
    <section className="relative w-full overflow-hidden bg-[#0a1628]">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-blue-500/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-orb-drift" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-12">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                Verified Riders
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif text-glow-white">
              {title || "People can't stop talking about us"}
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel">
                <StarRating rating={5} />
                <span className="text-lg font-bold text-white">5.0</span>
                <span className="text-sm text-white/60">Perfect Score</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-white/60">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>{(totalCount ?? reviews.length)}+ verified reviews</span>
              </div>
            </div>
          </div>
          
          {!isReviewsPage && (
            <Link
              href="/reviews"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full 
                glass-panel-hover text-white font-semibold transition-all duration-300
                hover:scale-105 animate-fade-up-delay-1"
            >
              <span>Read all reviews</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          )}
        </div>

        <div className="mb-12 glass-panel rounded-3xl p-6 animate-fade-up-delay-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 rounded-2xl border-white/10 bg-white/5 pl-12 text-white text-lg
                  placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20
                  transition-all duration-300"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 text-sm font-medium text-white/60">
                <Filter className="h-4 w-4" /> Filter:
              </span>
              {FILTERS.map((filter) => {
                const isActive = activeFilters.includes(filter.tag);
                return (
                  <button
                    key={filter.tag}
                    onClick={() => toggleFilter(filter.tag)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                      isActive
                        ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105"
                        : "glass text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {isActive && <Check className="inline-block h-3 w-3 mr-1" />}
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredReviews.length > 0 ? (
          <>
            {(() => {
              const reviewsToShow = showAll ? filteredReviews : filteredReviews.slice(0, 9);
              const chunks: Array<{ reviews: typeof reviewsToShow; breakItem?: { type: "fact" | "trivia"; data: any; key: string } }> = [];
              
              // Split reviews into chunks of 6, with breaks between
              if (showAll) {
                for (let i = 0; i < reviewsToShow.length; i += 6) {
                  const chunk = reviewsToShow.slice(i, i + 6);
                  const chunkIndex = Math.floor(i / 6);
                  const breakItem = chunkIndex > 0 && i < reviewsToShow.length ? 
                    (chunkIndex % 2 === 0 && facts && facts.length > 0 ? {
                      type: "fact" as const,
                      data: facts[(chunkIndex - 1) % facts.length],
                      key: `fact-${chunkIndex}`
                    } : trivia && trivia.length > 0 ? {
                      type: "trivia" as const,
                      data: trivia[(chunkIndex - 1) % trivia.length],
                      key: `trivia-${chunkIndex}`
                    } : undefined) : undefined;
                  
                  chunks.push({ reviews: chunk, breakItem });
                }
              } else {
                chunks.push({ reviews: reviewsToShow });
              }
              
              return (
                <div className="space-y-8">
                  {chunks.map((chunk, chunkIdx) => (
                    <React.Fragment key={`chunk-${chunkIdx}`}>
                      {chunk.breakItem && (
                        <div key={chunk.breakItem.key} className="w-full">
                          {chunk.breakItem.type === "fact" ? (
                            <FactsShowcase
                              facts={[chunk.breakItem.data]}
                              title=""
                              subtitle=""
                            />
                          ) : (
                            <TriviaBookingSection
                              triviaItems={[chunk.breakItem.data]}
                              title=""
                              subtitle=""
                            />
                          )}
                        </div>
                      )}
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {chunk.reviews.map((review, idx) => (
                          <Card
                            key={`review-${review.id}-${chunkIdx}-${idx}`}
                            className={cn(
                              "group relative overflow-hidden rounded-3xl p-0 border-0",
                              "glass-panel-hover cursor-default",
                              "animate-fade-up"
                            )}
                            style={{ animationDelay: `${(chunkIdx * 6 + idx) * 0.05}s` }}
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative p-6">
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <Quote className="w-10 h-10 text-blue-400/30 -scale-x-100" />
                                <StarRating rating={review.rating || 5} />
                              </div>
                              
                              <p className="text-base leading-relaxed text-white/90 line-clamp-4 mb-6">
                                &quot;{review.body || 'Great service!'}&quot;
                              </p>
                              
                              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 
                                  flex items-center justify-center text-white font-bold text-sm">
                                  {(review.author_display || "A")[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-white">
                                    {review.author_display || "Anonymous"}
                                  </p>
                                  <p className="text-xs text-white/50 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    Verified Rider
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}
          </>
        ) : (
          <div className="glass-panel rounded-3xl py-20 text-center">
            <h3 className="text-xl font-semibold text-white">No reviews found</h3>
            <p className="mt-2 text-white/60">Try adjusting your search or filters.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setActiveFilters([]);
              }}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {!isReviewsPage && (
          <div className="mt-16 text-center">
            <Button
              asChild
              size="lg"
              className="inline-flex items-center justify-center rounded-full
                px-10 py-6 text-lg font-bold transition-all duration-300
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                shadow-[0_20px_50px_rgba(59,130,246,0.3)]
                hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(59,130,246,0.4)]"
            >
              <Link href="/reviews">See all {totalCount ?? reviews.length}+ reviews</Link>
            </Button>
          </div>
        )}
        
        {isReviewsPage && !showAll && filteredReviews.length > 9 && (
          <div className="mt-16 text-center">
            <Button
              onClick={() => setShowAll(true)}
              size="lg"
              className="inline-flex items-center justify-center rounded-full
                px-10 py-6 text-lg font-bold transition-all duration-300
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                shadow-[0_20px_50px_rgba(59,130,246,0.3)]
                hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(59,130,246,0.4)]"
            >
              <ChevronDown className="w-5 h-5 mr-2" />
              Show all {filteredReviews.length} reviews
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
