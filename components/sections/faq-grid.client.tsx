"use client";

import * as React from "react";
import { Search, X, HelpCircle, DollarSign, Calendar, Shield, MapPin, Car, PartyPopper, Users, FileText, ChevronDown, ChevronUp, TrendingUp, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  page_slug: string;
  category?: string | null;
  click_count?: number | null;
};

const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle, color: "from-blue-500 to-indigo-500" },
  { id: "booking", label: "Booking", icon: Calendar, color: "from-purple-500 to-pink-500", slugs: ["booking", "home"] },
  { id: "pricing", label: "Pricing & Payments", icon: DollarSign, color: "from-green-500 to-emerald-500", slugs: ["pricing"] },
  { id: "vehicles", label: "Vehicles", icon: Car, color: "from-orange-500 to-amber-500", slugs: ["party-buses", "limousines", "coach-buses"] },
  { id: "events", label: "Events", icon: PartyPopper, color: "from-pink-500 to-rose-500", slugs: ["events"] },
  { id: "safety", label: "Safety & Policies", icon: Shield, color: "from-red-500 to-rose-500", slugs: ["safety", "policies"] },
  { id: "locations", label: "Locations", icon: MapPin, color: "from-teal-500 to-cyan-500", slugs: ["locations"] },
];

interface FaqGridClientProps {
  faqs: FaqItem[];
}

function FaqCard({ faq, onClick }: { faq: FaqItem; onClick?: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          onClick={onClick}
          className="w-full text-left p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition group"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mt-0.5">
              <HelpCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white group-hover:text-blue-300 transition line-clamp-2">
                {faq.question}
              </h3>
              <p className="text-sm text-white/50 mt-1 line-clamp-2">
                {faq.answer}
              </p>
              {faq.click_count && faq.click_count > 0 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
                  <TrendingUp className="w-3 h-3" />
                  <span>{faq.click_count} views</span>
                </div>
              )}
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl rounded-2xl p-0 shadow-2xl border border-blue-700/60 bg-[#050b1f] text-slate-100 overflow-hidden">
        <DialogHeader>
          <div className="flex items-start gap-4 px-6 py-5 border-b border-blue-900/60 bg-[#050b26]">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-400" />
            </div>
            <DialogTitle className="flex-1 text-lg">{faq.question}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="px-6 py-6">
          <p className="text-blue-100/90 leading-relaxed whitespace-pre-wrap">
            {faq.answer}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FaqGridClient({ faqs }: FaqGridClientProps) {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [showAll, setShowAll] = React.useState(false);

  const categorizeFaq = React.useCallback((faq: FaqItem) => {
    const pageSlug = faq.page_slug?.toLowerCase() || "";
    const category = faq.category?.toLowerCase() || "";
    
    for (const cat of FAQ_CATEGORIES) {
      if (cat.id === "all") continue;
      if (cat.slugs?.some(slug => pageSlug.includes(slug) || category.includes(slug))) {
        return cat.id;
      }
    }
    return "booking";
  }, []);

  const faqsByCategory = React.useMemo(() => {
    const grouped: Record<string, FaqItem[]> = {};
    
    faqs.forEach((faq) => {
      const category = categorizeFaq(faq);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(faq);
    });
    
    return grouped;
  }, [faqs, categorizeFaq]);

  const filteredFaqs = React.useMemo(() => {
    let filtered = faqs;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => categorizeFaq(faq) === selectedCategory);
    }
    
    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      filtered = filtered.filter((faq) =>
        faq.question?.toLowerCase().includes(normalized) ||
        faq.answer?.toLowerCase().includes(normalized)
      );
    }
    
    return filtered.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
  }, [query, selectedCategory, faqs, categorizeFaq]);

  const mostClickedThisWeek = React.useMemo(() => {
    return [...faqs]
      .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
      .slice(0, 5);
  }, [faqs]);

  const displayedFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 12);

  return (
    <section className="py-16 bg-gradient-to-b from-[#060e23] to-[#0a1628]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-4">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-300">
              FAQ Library
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Find Your Answer
          </h2>
          <p className="text-blue-200/60 max-w-xl mx-auto text-sm">
            {faqs.length} questions answered across {FAQ_CATEGORIES.length - 1} categories
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-300/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className="h-14 w-full rounded-full bg-[#0f1f46] text-blue-50 text-lg border-2 border-indigo-500/30 pl-14 pr-14 placeholder:text-blue-300/40 focus:border-indigo-400/60 focus:ring-indigo-400/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count = cat.id === "all" ? faqs.length : (faqsByCategory[cat.id]?.length || 0);
            
            if (cat.id !== "all" && count === 0) return null;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  isActive ? "bg-white/20" : "bg-white/10"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {selectedCategory === "all" && !query && mostClickedThisWeek.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Most Clicked This Week</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mostClickedThisWeek.map((faq) => (
                <FaqCard key={faq.id} faq={faq} />
              ))}
              {/* Fill empty grid slots to prevent layout issues */}
              {mostClickedThisWeek.length < 6 && Array.from({ length: 6 - mostClickedThisWeek.length }).map((_, idx) => (
                <div key={`placeholder-${idx}`} className="hidden lg:block" />
              ))}
            </div>
          </div>
        )}

        {(query || selectedCategory !== "all") && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-blue-200/70">
              {filteredFaqs.length} question{filteredFaqs.length !== 1 ? "s" : ""} found
              {selectedCategory !== "all" && ` in ${FAQ_CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
              {query && ` matching "${query}"`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="text-indigo-300 hover:text-white"
            >
              Clear filters
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedFaqs.map((faq) => (
            <FaqCard key={faq.id} faq={faq} />
          ))}
        </div>

        {filteredFaqs.length > 12 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="rounded-full border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white hover:border-indigo-500/50"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show All {filteredFaqs.length} Questions
                </>
              )}
            </Button>
          </div>
        )}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">No questions found matching your search</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full border-white/20 text-white hover:bg-white/10"
            >
              Browse all questions
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
