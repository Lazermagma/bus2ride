"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Music, Heart, PartyPopper, Briefcase, GraduationCap, Crown, Car, 
  TrendingUp, MapPin, Search, Users, Flame, ChevronRight,
  BarChart3, Sparkles, Globe, Building2, X, Loader2, Trophy, Eye
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LocationsData from "@/lib/data/local/locations.json";
import { PollEmbedModal } from "./poll-embed-modal";

const ICON_MAP: Record<string, LucideIcon> = {
  Music, Heart, PartyPopper, Briefcase, GraduationCap, Crown, Car, TrendingUp, MapPin, Sparkles,
};

interface PollResult {
  id: string;
  question: string;
  category_slug?: string;
  options: { id: string; label: string; vote_count: number; ord?: number }[];
}

interface CategoryConfig {
  slug: string;
  title: string;
  gradient: string;
  textColor: string;
  iconName: string;
}

interface PollResultsExplorerProps {
  categories: CategoryConfig[];
  hotPolls: PollResult[];
}

// Using the shared PollEmbedModal component instead

function PollResultCard({ 
  poll,
  onEmbedLive,
  onEmbedResults,
}: { 
  poll: PollResult;
  onEmbedLive?: (poll: PollResult) => void;
  onEmbedResults?: (poll: PollResult) => void;
}) {
  const options = poll.options || [];
  const totalVotes = options.reduce((sum, o) => sum + (o.vote_count || 0), 0);
  const topOption = options.reduce((max, o) => (o.vote_count || 0) > (max.vote_count || 0) ? o : max, options[0]);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
      <h4 className="text-white font-medium text-sm mb-3">{poll.question}</h4>
      
      <div className="space-y-1.5">
        {options.map((option) => {
          const percent = totalVotes > 0 ? Math.round(((option.vote_count || 0) / totalVotes) * 100) : 0;
          const isTop = option.id === topOption?.id && totalVotes > 0;

          return (
            <div key={option.id} className="space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className={`${isTop ? "text-emerald-400 font-medium" : "text-white/80"}`}>
                  {isTop && <Trophy className="w-3 h-3 inline mr-1" />}
                  {option.label}
                </span>
                <span className={`${isTop ? "text-emerald-400" : "text-white/50"}`}>{percent}%</span>
              </div>
              <Progress value={percent} className={`h-1.5 ${isTop ? "[&>div]:bg-emerald-500" : ""}`} />
            </div>
          );
        })}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t border-white/10">
        <p className="text-white/30 text-xs">{totalVotes.toLocaleString()} votes</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {onEmbedLive && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEmbedLive(poll); }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors text-[10px] sm:text-xs whitespace-nowrap"
            >
              <Code className="w-3 h-3 flex-shrink-0" />
              Embed Poll
            </button>
          )}
          {onEmbedResults && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEmbedResults(poll); }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors text-[10px] sm:text-xs whitespace-nowrap"
            >
              <Eye className="w-3 h-3 flex-shrink-0" />
              Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HotPollCard({ poll, rank, onEmbedLive, onEmbedResults }: { 
  poll: PollResult; 
  rank: number;
  onEmbedLive: (poll: PollResult) => void;
  onEmbedResults: (poll: PollResult) => void;
}) {
  const options = poll.options || [];
  const totalVotes = options.reduce((sum, o) => sum + (o.vote_count || 0), 0);
  const topOption = options.reduce((max, o) => (o.vote_count || 0) > (max.vote_count || 0) ? o : max, options[0]);
  const topPercent = totalVotes > 0 ? Math.round(((topOption?.vote_count || 0) / totalVotes) * 100) : 0;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
          {rank}
        </div>
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-orange-400 text-xs font-medium">Hot Topic</span>
      </div>
      
      <h4 className="text-white font-semibold mb-3 text-sm leading-snug">{poll.question}</h4>
      
      <div className="mb-4">
        <p className="text-orange-300 text-sm font-medium leading-relaxed">
          <span className="text-orange-400 font-bold">{topPercent}%</span> of customers say <span className="text-white font-semibold">{topOption?.label}</span>
        </p>
        {options.length > 1 && options.slice(1, 3).length > 0 && (
          <p className="text-white/50 text-xs mt-1">
            {options.slice(1, 3).map((opt, idx) => {
              const percent = totalVotes > 0 ? Math.round(((opt.vote_count || 0) / totalVotes) * 100) : 0;
              return (
                <span key={opt.id}>
                  {idx > 0 && ", "}
                  {percent}% prefer {opt.label}
                </span>
              );
            })}
          </p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-white/10">
        <p className="text-white/40 text-xs">{totalVotes.toLocaleString()} votes</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={() => onEmbedLive(poll)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors text-[10px] sm:text-xs whitespace-nowrap"
          >
            <Code className="w-3 h-3 flex-shrink-0" />
            Poll
          </button>
          <button 
            onClick={() => onEmbedResults(poll)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors text-[10px] sm:text-xs whitespace-nowrap"
          >
            <Eye className="w-3 h-3 flex-shrink-0" />
            Results
          </button>
        </div>
      </div>
    </div>
  );
}

function StateBox({ 
  state, 
  cities, 
  onClick 
}: { 
  state: string; 
  cities: string[]; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all text-left"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">{state}</h3>
          <p className="text-white/50 text-sm">{cities.length} cities</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-emerald-400 transition-colors" />
      </div>
      <div className="flex flex-wrap gap-1 mt-3">
        {cities.slice(0, 4).map(city => (
          <span key={city} className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-xs">
            {city}
          </span>
        ))}
        {cities.length > 4 && (
          <span className="px-2 py-0.5 text-emerald-400 text-xs">+{cities.length - 4} more</span>
        )}
      </div>
    </button>
  );
}

function CategoryBox({ 
  category, 
  onClick 
}: { 
  category: CategoryConfig; 
  onClick: () => void;
}) {
  const Icon = ICON_MAP[category.iconName] || Car;

  return (
    <button
      onClick={onClick}
      className="group p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/30 transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold">{category.title}</h3>
          <p className="text-white/50 text-sm">View results</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
      </div>
    </button>
  );
}

function LocationsSection({ 
  locations, 
  onStateClick 
}: { 
  locations: { state: string; cities: string[] }[];
  onStateClick: (loc: { state: string; cities: string[] }) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 12;
  
  const visibleLocations = showAll ? locations : locations.slice(0, INITIAL_COUNT);
  const remainingCount = locations.length - INITIAL_COUNT;
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-6 h-6 text-emerald-400" />
        <h3 className="text-xl font-bold text-white">Browse by State</h3>
        <span className="text-white/50 text-sm ml-2">({locations.length} states)</span>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {visibleLocations.map(loc => (
          <StateBox
            key={loc.state}
            state={loc.state}
            cities={loc.cities}
            onClick={() => onStateClick(loc)}
          />
        ))}
      </div>
      
      {!showAll && remainingCount > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium hover:bg-emerald-500/30 transition-all"
          >
            See All States ({remainingCount} more)
          </button>
        </div>
      )}
    </div>
  );
}

function CitiesModal({ 
  state, 
  cities, 
  isOpen, 
  onClose, 
  onCityClick 
}: { 
  state: string; 
  cities: string[]; 
  isOpen: boolean; 
  onClose: () => void;
  onCityClick: (city: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCities = searchQuery
    ? cities.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    : cities;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden bg-[#0d1d3a] border-white/10">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl text-white">{state}</DialogTitle>
              <p className="text-white/50 text-sm">{cities.length} cities with poll results</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto pr-2">
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {filteredCities.map(city => (
                <button
                  key={city}
                  onClick={() => onCityClick(city)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-white text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-white/40 group-hover:text-emerald-400" />
                    <span className="font-medium">{city}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {filteredCities.length === 0 && (
              <p className="text-center text-white/50 py-8">No cities found matching "{searchQuery}"</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CityResultsModal({ 
  city, 
  state, 
  isOpen, 
  onClose,
  onEmbedLive,
  onEmbedResults,
}: { 
  city: string; 
  state: string; 
  isOpen: boolean; 
  onClose: () => void;
  onEmbedLive: (poll: PollResult) => void;
  onEmbedResults: (poll: PollResult) => void;
}) {
  const [polls, setPolls] = useState<PollResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const POLLS_PER_FETCH = 50;
  
  useEffect(() => {
    if (!isOpen || !city) return;
    
    const fetchPolls = async () => {
      setLoading(true);
      setPolls([]);
      setOffset(0);
      setHasMore(true);
      
      const supabase = createClient();
      
      const { count } = await supabase
        .from("polls1")
        .select("*", { count: "exact", head: true })
        .ilike("question", `%${city}%`);
      
      setTotalCount(count || 0);
      
      const { data, error } = await supabase
        .from("polls1")
        .select(`
          id,
          question,
          category_slug,
          options:poll_options1 (
            id,
            label,
            vote_count,
            ord
          )
        `)
        .ilike("question", `%${city}%`)
        .order("ord", { referencedTable: "poll_options1", ascending: true })
        .range(0, POLLS_PER_FETCH - 1);
      
      if (data && !error) {
        setPolls(data as PollResult[]);
        setOffset(POLLS_PER_FETCH);
        setHasMore(data.length === POLLS_PER_FETCH);
      }
      setLoading(false);
    };
    
    fetchPolls();
  }, [isOpen, city]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from("polls1")
      .select(`
        id,
        question,
        category_slug,
        options:poll_options1 (
          id,
          label,
          vote_count,
          ord
        )
      `)
      .ilike("question", `%${city}%`)
      .order("ord", { referencedTable: "poll_options1", ascending: true })
      .range(offset, offset + POLLS_PER_FETCH - 1);
    
    if (data && !error) {
      setPolls(prev => [...prev, ...(data as PollResult[])]);
      setOffset(prev => prev + POLLS_PER_FETCH);
      setHasMore(data.length === POLLS_PER_FETCH);
    }
    setLoadingMore(false);
  };

  const allLocations = LocationsData as { state: string; cities: string[] }[];
  const stateData = allLocations.find(l => l.state === state);
  const nearbyCities = stateData?.cities.filter(c => c !== city).slice(0, 6) || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-[#0d1d3a] border-white/10">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl text-white">{city}, {state} Results</DialogTitle>
              <p className="text-white/50 text-sm">
                {polls.length} of {totalCount.toLocaleString()} results loaded
              </p>
            </div>
          </div>
        </DialogHeader>
        
        {nearbyCities.length > 0 && (
          <div className="py-3 border-b border-white/10">
            <p className="text-white/50 text-xs mb-2">Nearby cities:</p>
            <div className="flex flex-wrap gap-2">
              {nearbyCities.map(c => (
                <span key={c} className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs">{c}</span>
              ))}
            </div>
          </div>
        )}
        
        <div className="overflow-y-auto max-h-[60vh] py-4 pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            </div>
          ) : polls.length > 0 ? (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {polls.map((poll) => (
                  <PollResultCard key={poll.id} poll={poll} onEmbedLive={onEmbedLive} onEmbedResults={onEmbedResults} />
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Load More ({(totalCount - polls.length).toLocaleString()} remaining)</>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No results found for {city}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryResultsModal({ 
  category, 
  allCategories,
  isOpen, 
  onClose,
  onEmbedLive,
  onEmbedResults,
  onSwitchCategory,
}: { 
  category: CategoryConfig | null;
  allCategories: CategoryConfig[];
  isOpen: boolean; 
  onClose: () => void;
  onEmbedLive: (poll: PollResult) => void;
  onEmbedResults: (poll: PollResult) => void;
  onSwitchCategory?: (cat: CategoryConfig) => void;
}) {
  const [polls, setPolls] = useState<PollResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const POLLS_PER_FETCH = 50;
  
  useEffect(() => {
    if (!isOpen || !category) return;
    
    const fetchPolls = async () => {
      setLoading(true);
      setPolls([]);
      setOffset(0);
      setHasMore(true);
      
      const supabase = createClient();
      
      const { count } = await supabase
        .from("polls1")
        .select("*", { count: "exact", head: true })
        .ilike("category_slug", `%${category.slug}%`);
      
      setTotalCount(count || 0);
      
      const { data, error } = await supabase
        .from("polls1")
        .select(`
          id,
          question,
          category_slug,
          options:poll_options1 (
            id,
            label,
            vote_count,
            ord
          )
        `)
        .ilike("category_slug", `%${category.slug}%`)
        .order("ord", { referencedTable: "poll_options1", ascending: true })
        .range(0, POLLS_PER_FETCH - 1);
      
      if (data && !error) {
        setPolls(data as PollResult[]);
        setOffset(POLLS_PER_FETCH);
        setHasMore(data.length === POLLS_PER_FETCH);
      }
      setLoading(false);
    };
    
    fetchPolls();
  }, [isOpen, category]);

  const loadMore = async () => {
    if (!category || loadingMore) return;
    setLoadingMore(true);
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from("polls1")
      .select(`
        id,
        question,
        category_slug,
        options:poll_options1 (
          id,
          label,
          vote_count,
          ord
        )
      `)
      .ilike("category_slug", `%${category.slug}%`)
      .order("ord", { referencedTable: "poll_options1", ascending: true })
      .range(offset, offset + POLLS_PER_FETCH - 1);
    
    if (data && !error) {
      setPolls(prev => [...prev, ...(data as PollResult[])]);
      setOffset(prev => prev + POLLS_PER_FETCH);
      setHasMore(data.length === POLLS_PER_FETCH);
    }
    setLoadingMore(false);
  };
  
  if (!category) return null;
  
  const Icon = ICON_MAP[category.iconName] || Car;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-[#0d1d3a] border-white/10">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl text-white">{category.title} Results</DialogTitle>
              <p className="text-white/50 text-sm">
                {polls.length} of {totalCount.toLocaleString()} results loaded
              </p>
            </div>
          </div>
        </DialogHeader>
        
        {onSwitchCategory && allCategories.length > 0 && (
          <div className="py-3 border-b border-white/10">
            <p className="text-white/50 text-xs mb-2">Switch category:</p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {allCategories.filter(c => c.slug !== category.slug).slice(0, 12).map(cat => {
                const CatIcon = ICON_MAP[cat.iconName] || Car;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => onSwitchCategory(cat)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-br ${cat.gradient} text-white text-xs font-medium hover:opacity-90 transition-all`}
                  >
                    <CatIcon className="w-3 h-3" />
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="overflow-y-auto max-h-[60vh] py-4 pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {polls.map((poll) => (
                  <PollResultCard key={poll.id} poll={poll} onEmbedLive={onEmbedLive} onEmbedResults={onEmbedResults} />
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Load More ({(totalCount - polls.length).toLocaleString()} remaining)</>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PollResultsExplorer({ categories, hotPolls }: PollResultsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [embedPoll, setEmbedPoll] = useState<PollResult | null>(null);
  const [embedType, setEmbedType] = useState<"live" | "results">("results");
  
  const [selectedState, setSelectedState] = useState<{ state: string; cities: string[] } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ city: string; state: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);
  
  const [searchedPolls, setSearchedPolls] = useState<PollResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTotal, setSearchTotal] = useState(0);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchedPolls([]);
      setSearchTotal(0);
      return;
    }

    let cancelled = false;
    const currentQuery = searchQuery.trim();

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      const supabase = createClient();
      
      const { count } = await supabase
        .from("polls1")
        .select("*", { count: "exact", head: true })
        .ilike("question", `%${currentQuery}%`);
      
      if (cancelled) return;
      setSearchTotal(count || 0);
      
      const { data, error } = await supabase
        .from("polls1")
        .select(`
          id,
          question,
          category_slug,
          options:poll_options1 (
            id,
            label,
            vote_count,
            ord
          )
        `)
        .ilike("question", `%${currentQuery}%`)
        .order("ord", { referencedTable: "poll_options1", ascending: true })
        .limit(12);
      
      if (cancelled) return;
      if (data && !error) {
        setSearchedPolls(data as PollResult[]);
      }
      setIsSearching(false);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const allLocations = LocationsData as { state: string; cities: string[] }[];

  const filteredLocations = searchQuery
    ? allLocations.filter(loc => 
        loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.cities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allLocations;

  const filteredCategories = searchQuery
    ? categories.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : categories;

  const matchedCities = searchQuery
    ? allLocations.flatMap(loc => 
        loc.cities
          .filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(c => ({ city: c, state: loc.state }))
      ).slice(0, 12)
    : [];

  const handleCityClick = (city: string, state: string) => {
    setSelectedState(null);
    setSelectedCity({ city, state });
  };

  const handleEmbedLive = (poll: PollResult) => {
    setEmbedPoll(poll);
    setEmbedType("live");
  };

  const handleEmbedResults = (poll: PollResult) => {
    setEmbedPoll(poll);
    setEmbedType("results");
  };

  return (
    <section className="py-10 bg-gradient-to-b from-[#0a1628] to-[#060e23]">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold">Poll Results</span>
            <span className="text-white/30">•</span>
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">See What Won</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Community Poll Results</h2>
          <p className="text-white/60 mb-8">
            See how the community voted. Browse results by state, city, or category.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search results (e.g., dress, limousine, pricing)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {matchedCities.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
            <p className="text-teal-300 text-sm mb-3">Cities matching "{searchQuery}":</p>
            <div className="flex flex-wrap gap-2">
              {matchedCities.map(({ city, state }) => (
                <button
                  key={`${city}-${state}`}
                  onClick={() => handleCityClick(city, state)}
                  className="px-4 py-2 rounded-xl bg-teal-500/20 text-white hover:bg-teal-500/30 transition-all"
                >
                  {city}, {state}
                </button>
              ))}
            </div>
          </div>
        )}

        {searchQuery.trim().length >= 2 && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Search className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Results matching "{searchQuery}"</h3>
              {searchTotal > 0 && (
                <span className="text-white/50 text-sm ml-2">({searchTotal.toLocaleString()} found)</span>
              )}
            </div>
            
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              </div>
            ) : searchedPolls.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {searchedPolls.map(poll => (
                  <PollResultCard 
                    key={poll.id} 
                    poll={poll} 
                    onEmbedLive={handleEmbedLive} 
                    onEmbedResults={handleEmbedResults} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50">No results found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {hotPolls.length > 0 && !searchQuery && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-bold text-white">Hot Topics</h3>
              <span className="text-white/50 text-sm ml-2">Most voted polls</span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {hotPolls.slice(0, 8).map((poll, idx) => (
                <HotPollCard 
                  key={poll.id} 
                  poll={poll} 
                  rank={idx + 1}
                  onEmbedLive={handleEmbedLive}
                  onEmbedResults={handleEmbedResults}
                />
              ))}
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Browse by Category</h3>
            <span className="text-white/50 text-sm ml-2">({filteredCategories.length} categories)</span>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCategories.map(cat => (
              <CategoryBox
                key={cat.slug}
                category={cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </div>

        <LocationsSection 
          locations={filteredLocations}
          onStateClick={setSelectedState}
        />

      </div>

      {selectedState && (
        <CitiesModal
          state={selectedState.state}
          cities={selectedState.cities}
          isOpen={true}
          onClose={() => setSelectedState(null)}
          onCityClick={(city) => handleCityClick(city, selectedState.state)}
        />
      )}

      {selectedCity && (
        <CityResultsModal
          city={selectedCity.city}
          state={selectedCity.state}
          isOpen={true}
          onClose={() => setSelectedCity(null)}
          onEmbedLive={handleEmbedLive}
          onEmbedResults={handleEmbedResults}
        />
      )}

      <CategoryResultsModal
        category={selectedCategory}
        allCategories={categories}
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onEmbedLive={handleEmbedLive}
        onEmbedResults={handleEmbedResults}
        onSwitchCategory={(cat) => setSelectedCategory(cat)}
      />

      {embedPoll && (
        <PollEmbedModal 
          poll={embedPoll} 
          embedType={embedType}
          isOpen={!!embedPoll} 
          onClose={() => setEmbedPoll(null)} 
        />
      )}
    </section>
  );
}
