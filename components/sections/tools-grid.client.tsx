"use client";

import * as React from "react";
import { Search, X, Wrench, Calculator, CheckSquare, Shield, MapPin, Calendar, DollarSign, Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToolCard } from "@/components/sections/tool-card";
import { ToolData } from "@/lib/data/tools";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TOOL_CATEGORIES = [
  { id: "all", label: "All Tools", icon: Wrench, color: "from-orange-500 to-amber-500" },
  { id: "pricing", label: "Pricing", icon: DollarSign, color: "from-green-500 to-emerald-500", keywords: ["pricing", "cost", "budget", "calculator", "quote", "estimate"] },
  { id: "planning", label: "Planning", icon: Calendar, color: "from-blue-500 to-indigo-500", keywords: ["planning", "checklist", "organize", "schedule", "timeline"] },
  { id: "safety", label: "Safety", icon: Shield, color: "from-red-500 to-rose-500", keywords: ["safety", "guide", "tips", "secure", "protect"] },
  { id: "venues", label: "Venues", icon: MapPin, color: "from-purple-500 to-pink-500", keywords: ["venue", "location", "place", "destination"] },
  { id: "calculators", label: "Calculators", icon: Calculator, color: "from-cyan-500 to-teal-500", keywords: ["calculator", "compute", "estimate", "calculate"] },
  { id: "checklists", label: "Checklists", icon: CheckSquare, color: "from-amber-500 to-yellow-500", keywords: ["checklist", "list", "check", "todo"] },
];

const CTA_BREAKS = [
  {
    id: "quote",
    title: "Ready to Get Started?",
    description: "Get an instant quote for your event with transparent, all-inclusive pricing.",
    href: "/pricing",
    cta: "Get a Quote",
  },
  {
    id: "fleet",
    title: "Browse Our Vehicles",
    description: "Explore party buses, limos, and coach buses to find the perfect fit for your group.",
    href: "/fleet",
    cta: "View Fleet",
  },
  {
    id: "contact",
    title: "Have Questions?",
    description: "Our team is available 24/7 to help you plan the perfect transportation experience.",
    href: "/contact",
    cta: "Contact Us",
  },
];

const TRIVIA_BREAKS = [
  {
    id: "trivia-1",
    question: "What's the #1 forgotten expense?",
    answer: "Gratuity! Always budget 15-20% for your driver.",
    category: "Pro Tip",
  },
  {
    id: "trivia-2",
    question: "Best day to save money?",
    answer: "Thursdays offer 20-30% lower rates than Saturdays!",
    category: "Money Saver",
  },
  {
    id: "trivia-3",
    question: "How early should you book?",
    answer: "6-8 weeks for peak dates, 2-3 weeks for regular weekends.",
    category: "Booking Tip",
  },
];

function CtaBreakCard({ cta }: { cta: typeof CTA_BREAKS[0] }) {
  return (
    <Card className="group rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-transparent p-6 text-white transition hover:border-orange-500/50">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Quick Action</span>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2 text-white">{cta.title}</h3>
      <p className="text-white/70 mb-4 text-sm">{cta.description}</p>
      <Button asChild className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600" size="sm">
        <Link href={cta.href}>{cta.cta}</Link>
      </Button>
    </Card>
  );
}

function TriviaBreakCard({ trivia }: { trivia: typeof TRIVIA_BREAKS[0] }) {
  return (
    <Card className="group rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent p-6 text-white transition hover:border-blue-500/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">{trivia.category}</span>
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-2 text-white">{trivia.question}</h3>
      <p className="text-blue-200/80 text-sm">{trivia.answer}</p>
    </Card>
  );
}

interface ToolsGridClientProps {
  tools: ToolData[];
}

export function ToolsGridClient({ tools }: ToolsGridClientProps) {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [showAll, setShowAll] = React.useState(false);

  const categorizeItem = React.useCallback((tool: ToolData) => {
    if (tool.category) return tool.category;
    
    const searchText = `${tool.title} ${tool.slug || ""} ${tool.description || ""}`.toLowerCase();
    
    for (const cat of TOOL_CATEGORIES) {
      if (cat.id === "all") continue;
      if (cat.keywords?.some(kw => searchText.includes(kw))) {
        return cat.id;
      }
    }
    return "planning";
  }, []);

  const toolsByCategory = React.useMemo(() => {
    const grouped: Record<string, ToolData[]> = {};
    
    tools.forEach((tool) => {
      const category = categorizeItem(tool);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(tool);
    });
    
    return grouped;
  }, [tools, categorizeItem]);

  const filteredTools = React.useMemo(() => {
    let filtered = tools;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((tool) => categorizeItem(tool) === selectedCategory);
    }
    
    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      filtered = filtered.filter((tool) =>
        tool.title?.toLowerCase().includes(normalized) ||
        (tool.slug || "")?.toLowerCase().includes(normalized) ||
        tool.description?.toLowerCase().includes(normalized) ||
        tool.category?.toLowerCase().includes(normalized)
      );
    }
    
    return filtered;
  }, [query, selectedCategory, tools, categorizeItem]);

  const displayedTools = showAll ? filteredTools : filteredTools.slice(0, 12);
  const hasMore = filteredTools.length > 12 && !showAll;

  const withBreaks = React.useMemo(() => {
    if (selectedCategory !== "all" || query.trim()) {
      return displayedTools.map((tool) => ({ kind: "tool" as const, tool }));
    }

    const out: Array<
      | { kind: "tool"; tool: ToolData }
      | { kind: "cta"; cta: typeof CTA_BREAKS[0] }
      | { kind: "trivia"; trivia: typeof TRIVIA_BREAKS[0] }
    > = [];

    displayedTools.forEach((tool, idx) => {
      out.push({ kind: "tool", tool });
      
      if (idx === 5 && CTA_BREAKS[0]) {
        out.push({ kind: "cta", cta: CTA_BREAKS[0] });
      }
      if (idx === 11 && TRIVIA_BREAKS[0]) {
        out.push({ kind: "trivia", trivia: TRIVIA_BREAKS[0] });
      }
      if (idx === 17 && CTA_BREAKS[1]) {
        out.push({ kind: "cta", cta: CTA_BREAKS[1] });
      }
      if (idx === 23 && TRIVIA_BREAKS[1]) {
        out.push({ kind: "trivia", trivia: TRIVIA_BREAKS[1] });
      }
      if (idx === 29 && CTA_BREAKS[2]) {
        out.push({ kind: "cta", cta: CTA_BREAKS[2] });
      }
      if (idx === 35 && TRIVIA_BREAKS[2]) {
        out.push({ kind: "trivia", trivia: TRIVIA_BREAKS[2] });
      }
    });

    return out;
  }, [displayedTools, selectedCategory, query]);

  return (
    <section className="py-16 bg-gradient-to-b from-[#060e23] to-[#0a1628]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange-300">
              Full Library
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            All Planning Tools
          </h2>
          <p className="text-blue-200/60 max-w-xl mx-auto text-sm">
            {tools.length} tools to help you plan, budget, and organize your perfect event
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-300/50" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowAll(false);
              }}
              placeholder="Search calculators, checklists, guides..."
              className="h-14 w-full rounded-full bg-[#0f1f46] text-blue-50 text-lg border-2 border-orange-500/30 pl-14 pr-14 placeholder:text-blue-300/40 focus:border-orange-400/60 focus:ring-orange-400/20"
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
          {TOOL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count = cat.id === "all" ? tools.length : (toolsByCategory[cat.id]?.length || 0);
            
            if (cat.id !== "all" && count === 0) return null;
            
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowAll(false);
                }}
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

        {(query || selectedCategory !== "all") && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-blue-200/70">
              {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} found
              {selectedCategory !== "all" && ` in ${TOOL_CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
              {query && ` matching "${query}"`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
                setShowAll(false);
              }}
              className="text-orange-300 hover:text-white"
            >
              Clear filters
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {withBreaks.map((item, idx) => {
            if (item.kind === "cta") {
              return <CtaBreakCard key={`cta-${item.cta.id}-${idx}`} cta={item.cta} />;
            }
            if (item.kind === "trivia") {
              return <TriviaBreakCard key={`trivia-${item.trivia.id}-${idx}`} trivia={item.trivia} />;
            }
            return <ToolCard key={item.tool.id} tool={item.tool} />;
          })}
        </div>

        {hasMore && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="rounded-full border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 hover:text-white hover:border-orange-500/50 px-8"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Show All {filteredTools.length} Tools
            </Button>
          </div>
        )}

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">No tools found matching your search</p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full border-white/20 text-white hover:bg-white/10"
            >
              Browse all tools
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
