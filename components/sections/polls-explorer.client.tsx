"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Music, Heart, PartyPopper, Briefcase, GraduationCap, Crown, Car, 
  TrendingUp, MapPin, Search, Users, Flame, ChevronRight,
  BarChart3, Sparkles, CheckCircle2, Globe, Building2, X, Loader2, Eye, Code
} from "lucide-react";
import type { PollWithOptions } from "@/lib/data/polls";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LocationsData from "@/lib/data/local/locations.json";
import { PollEmbedModal } from "./poll-embed-modal";

const ICON_MAP: Record<string, LucideIcon> = {
  Music, Heart, PartyPopper, Briefcase, GraduationCap, Crown, Car, TrendingUp, MapPin, Sparkles,
};

interface CategoryConfigInput {
  slug: string;
  title: string;
  gradient: string;
  textColor: string;
  hoverColor: string;
  iconName: string;
  polls?: PollWithOptions[];
}

interface LocationConfig {
  name: string;
  slug: string;
  type: "state" | "city";
}

interface PollsExplorerProps {
  categories: CategoryConfigInput[];
  locations: LocationConfig[];
}

// Using the shared PollEmbedModal component instead

function PollCard({ 
  poll,
  onEmbedLive,
  onEmbedResults,
}: { 
  poll: PollWithOptions;
  onEmbedLive?: (poll: PollWithOptions) => void;
  onEmbedResults?: (poll: PollWithOptions) => void;
}) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    return (poll.options || []).reduce<Record<string, number>>((acc, opt) => {
      acc[opt.id] = Number(opt.vote_count ?? 0);
      return acc;
    }, {});
  });

  const options = poll.options || [];
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    setVotes(prev => ({ ...prev, [optionId]: (prev[optionId] ?? 0) + 1 }));
    setHasVoted(true);
    
    const supabase = createClient();
    await supabase.rpc("increment_poll_vote1", { p_option_id: optionId });
    setIsVoting(false);
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
      <h4 className="text-white font-medium text-sm mb-3">{poll.question}</h4>
      
      <div className="space-y-1.5">
        {options.map((option) => {
          const count = votes[option.id] ?? 0;
          const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

          return hasVoted ? (
            <div key={option.id} className="space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/80">{option.label}</span>
                <span className="text-white/50">{percent}%</span>
              </div>
              <Progress value={percent} className="h-1.5" />
            </div>
          ) : (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={isVoting}
              className="w-full text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/80 text-xs transition-all disabled:opacity-50"
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
        {hasVoted ? (
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Voted!
          </p>
        ) : (
          <p className="text-white/30 text-xs">{totalVotes.toLocaleString()} votes</p>
        )}
        <div className="flex items-center gap-2">
          {onEmbedLive && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEmbedLive(poll); }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors text-xs"
            >
              <Code className="w-3 h-3" />
              Embed Poll
            </button>
          )}
          {onEmbedResults && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEmbedResults(poll); }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors text-xs"
            >
              <Eye className="w-3 h-3" />
              Results
            </button>
          )}
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
  category: CategoryConfigInput; 
  onClick: () => void;
}) {
  const Icon = ICON_MAP[category.iconName] || Car;

  return (
    <button
      onClick={onClick}
      className={`group p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/30 transition-all text-left`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold">{category.title}</h3>
          <p className="text-white/50 text-sm">Click to browse</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
      </div>
      <p className={`text-sm ${category.textColor}`}>View all polls</p>
    </button>
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
              <p className="text-white/50 text-sm">{cities.length} cities with polls</p>
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

function CityPollsModal({ 
  city, 
  state, 
  isOpen, 
  onClose,
  onEmbedLive,
  onEmbedResults,
  allCategories,
  onSwitchCategory,
}: { 
  city: string; 
  state: string; 
  isOpen: boolean; 
  onClose: () => void;
  onEmbedLive: (poll: PollWithOptions) => void;
  onEmbedResults: (poll: PollWithOptions) => void;
  allCategories: CategoryConfigInput[];
  onSwitchCategory?: (cat: CategoryConfigInput) => void;
}) {
  const [polls, setPolls] = useState<PollWithOptions[]>([]);
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
        setPolls(data as PollWithOptions[]);
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
      setPolls(prev => [...prev, ...(data as PollWithOptions[])]);
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
              <DialogTitle className="text-xl text-white">{city}, {state} Polls</DialogTitle>
              <p className="text-white/50 text-sm">
                {polls.length} of {totalCount.toLocaleString()} polls loaded
              </p>
            </div>
          </div>
        </DialogHeader>
        
        {/* Category navigation */}
        {onSwitchCategory && allCategories.length > 0 && (
          <div className="py-3 border-b border-white/10">
            <p className="text-white/50 text-xs mb-2">Or browse by category:</p>
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {allCategories.slice(0, 8).map(cat => {
                const CatIcon = ICON_MAP[cat.iconName] || Car;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => { onClose(); onSwitchCategory(cat); }}
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
                  <PollCard key={poll.id} poll={poll} onEmbedLive={onEmbedLive} onEmbedResults={onEmbedResults} />
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
              <p className="text-white/50">No polls found for {city}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryPollsModal({ 
  category, 
  allCategories,
  isOpen, 
  onClose,
  onSwitchCategory,
  onEmbedLive,
  onEmbedResults,
}: { 
  category: CategoryConfigInput | null; 
  allCategories: CategoryConfigInput[];
  isOpen: boolean; 
  onClose: () => void;
  onSwitchCategory: (cat: CategoryConfigInput) => void;
  onEmbedLive: (poll: PollWithOptions) => void;
  onEmbedResults: (poll: PollWithOptions) => void;
}) {
  const [polls, setPolls] = useState<PollWithOptions[]>([]);
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
        setPolls(data as PollWithOptions[]);
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
      setPolls(prev => [...prev, ...(data as PollWithOptions[])]);
      setOffset(prev => prev + POLLS_PER_FETCH);
      setHasMore(data.length === POLLS_PER_FETCH);
    }
    setLoadingMore(false);
  };
  
  if (!category) return null;
  
  const Icon = ICON_MAP[category.iconName] || Car;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-[#0d1d3a] border-white/10">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl text-white">{category.title} Polls</DialogTitle>
              <p className="text-white/50 text-sm">
                {polls.length} of {totalCount.toLocaleString()} polls loaded
              </p>
            </div>
          </div>
        </DialogHeader>
        
        {/* Quick navigation to other categories */}
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
        
        <div className="overflow-y-auto max-h-[60vh] py-4 pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {polls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} onEmbedLive={onEmbedLive} onEmbedResults={onEmbedResults} />
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

export function PollsExplorer({ categories, locations }: PollsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [embedPoll, setEmbedPoll] = useState<PollWithOptions | null>(null);
  const [embedType, setEmbedType] = useState<"live" | "results">("live");
  
  const [selectedState, setSelectedState] = useState<{ state: string; cities: string[] } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ city: string; state: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfigInput | null>(null);
  
  const [searchedPolls, setSearchedPolls] = useState<PollWithOptions[]>([]);
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
        setSearchedPolls(data as PollWithOptions[]);
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
    ? categories.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
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

  const handleEmbedLive = (poll: PollWithOptions) => {
    setEmbedPoll(poll);
    setEmbedType("live");
  };

  const handleEmbedResults = (poll: PollWithOptions) => {
    setEmbedPoll(poll);
    setEmbedType("results");
  };

  return (
    <section className="py-10 bg-gradient-to-b from-[#0a1628] to-[#060e23]">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-bold">51,000+ Polls</span>
            <span className="text-white/30">•</span>
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">2.4M+ Votes</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Browse All Polls</h2>
          <p className="text-white/60 mb-8">
            Click any state to see cities, or click any category to see all polls
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search polls (e.g., dress, limousine, pricing)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:outline-none text-lg"
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
              <Search className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Polls matching "{searchQuery}"</h3>
              {searchTotal > 0 && (
                <span className="text-white/50 text-sm ml-2">({searchTotal.toLocaleString()} found)</span>
              )}
            </div>
            
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : searchedPolls.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {searchedPolls.map(poll => (
                  <PollCard 
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
                <p className="text-white/50">No polls found matching "{searchQuery}"</p>
              </div>
            )}
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
        <CityPollsModal
          city={selectedCity.city}
          state={selectedCity.state}
          isOpen={true}
          onClose={() => setSelectedCity(null)}
          onEmbedLive={handleEmbedLive}
          onEmbedResults={handleEmbedResults}
          allCategories={categories}
          onSwitchCategory={(cat) => { setSelectedCity(null); setSelectedCategory(cat); }}
        />
      )}

      <CategoryPollsModal
        category={selectedCategory}
        allCategories={categories}
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSwitchCategory={(cat) => setSelectedCategory(cat)}
        onEmbedLive={handleEmbedLive}
        onEmbedResults={handleEmbedResults}
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
