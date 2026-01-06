"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { 
  Trophy, TrendingUp, Zap, BarChart3, 
  Shuffle, Lightbulb, Flame
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FilterType = 
  | "all"
  | "popular" 
  | "trending" 
  | "rising" 
  | "today"
  | "hidden-gems"
  | "random";

interface FilterConfig {
  id: FilterType;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

const FILTERS: FilterConfig[] = [
  { 
    id: "all", 
    label: "All Polls", 
    shortLabel: "All",
    icon: BarChart3, 
    color: "from-indigo-500 to-violet-500",
    description: "Browse all community polls"
  },
  { 
    id: "popular", 
    label: "Popular", 
    shortLabel: "Popular",
    icon: Trophy, 
    color: "from-amber-500 to-orange-500",
    description: "Most votes all-time"
  },
  { 
    id: "trending", 
    label: "Trending", 
    shortLabel: "Trending",
    icon: TrendingUp, 
    color: "from-green-500 to-emerald-500",
    description: "Hot this week"
  },
  { 
    id: "rising", 
    label: "Rising Fast", 
    shortLabel: "Rising",
    icon: Flame, 
    color: "from-red-500 to-orange-500",
    description: "Fastest growing right now"
  },
  { 
    id: "today", 
    label: "Today's Hot", 
    shortLabel: "Today",
    icon: Zap, 
    color: "from-yellow-500 to-amber-500",
    description: "Most active today"
  },
  { 
    id: "hidden-gems", 
    label: "Hidden Gems", 
    shortLabel: "Gems",
    icon: Lightbulb, 
    color: "from-cyan-500 to-blue-500",
    description: "Undiscovered quality polls"
  },
  { 
    id: "random", 
    label: "Random", 
    shortLabel: "Random",
    icon: Shuffle, 
    color: "from-violet-500 to-purple-500",
    description: "Discover something new"
  },
];

interface PollFilterTabsProps {
  activeFilter?: FilterType;
  onFilterChange?: (filter: FilterType) => void;
  compact?: boolean;
  basePath?: string;
}

export function PollFilterTabs({ activeFilter, onFilterChange, compact = false, basePath = "/polls" }: PollFilterTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollPositionRef = useRef<number>(0);
  
  const urlFilter = searchParams.get("filter") as FilterType | null;
  const initialFilter = activeFilter ?? urlFilter ?? "all";
  const [selected, setSelected] = useState<FilterType>(initialFilter);

  useEffect(() => {
    const currentFilter = searchParams.get("filter") as FilterType | null;
    if (currentFilter && FILTERS.some(f => f.id === currentFilter)) {
      setSelected(currentFilter);
    } else if (!currentFilter) {
      setSelected("all");
    }
    
    // Restore scroll position after filter change
    if (scrollPositionRef.current > 0) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
        scrollPositionRef.current = 0;
      });
    }
  }, [searchParams]);

  const handleFilterClick = (filter: FilterType) => {
    setSelected(filter);
    
    if (onFilterChange) {
      onFilterChange(filter);
    } else {
      // Store current scroll position before navigation
      scrollPositionRef.current = window.scrollY;
      
      const params = new URLSearchParams(searchParams.toString());
      if (filter === "all") {
        params.delete("filter");
      } else {
        params.set("filter", filter);
      }
      
      // Update URL - this will trigger the useEffect above to restore scroll
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const Icon = filter.icon;
          const isActive = selected === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200
                ${isActive 
                  ? `bg-gradient-to-r ${filter.color} text-white shadow-lg` 
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10"
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{filter.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <div className="flex gap-2 p-1 min-w-max">
        {FILTERS.map((filter) => {
          const Icon = filter.icon;
          const isActive = selected === filter.id;
          
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              title={filter.description}
              className={`
                group relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                transition-all duration-200 whitespace-nowrap
                ${isActive 
                  ? `bg-gradient-to-r ${filter.color} text-white shadow-lg scale-105` 
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10 hover:border-white/20"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
              <span className="font-medium">{filter.label}</span>
              
              {!isActive && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-[#0d1d3a] border border-white/10 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {filter.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PollFilterPills({ activeFilter = "all", onFilterChange }: PollFilterTabsProps) {
  const [selected, setSelected] = useState<FilterType>(activeFilter);

  const handleFilterClick = (filter: FilterType) => {
    setSelected(filter);
    onFilterChange?.(filter);
  };

  const topFilters = FILTERS.slice(0, 6);

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {topFilters.map((filter) => {
        const Icon = filter.icon;
        const isActive = selected === filter.id;
        
        return (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${isActive 
                ? `bg-gradient-to-r ${filter.color} text-white shadow-lg` 
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export { FILTERS as POLL_FILTER_OPTIONS };
