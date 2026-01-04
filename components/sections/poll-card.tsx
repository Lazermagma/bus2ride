"use client";

import * as React from "react";
import { Loader2, Code, Check, Copy } from "lucide-react";
import { useInView } from "react-intersection-observer"; // 1. Import hook
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import type { PollWithOptions } from "@/lib/data/polls";
import { cn } from "@/lib/utils";

interface PollCardProps {
  poll: PollWithOptions;
  onAdvance?: () => void;
  advanceDelayMs?: number;
  backgroundClassName?: string;
  noLoadSpinner?: boolean;
  showEmbed?: boolean;
  compact?: boolean;
}

export function PollCard({
  poll,
  onAdvance,
  advanceDelayMs = 5000,
  backgroundClassName,
  noLoadSpinner = false,
  showEmbed = true,
  compact = false,
}: PollCardProps) {
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isAdvancing, setIsAdvancing] = React.useState(false);
  const [embedCopied, setEmbedCopied] = React.useState(false);
  const options = poll.options ?? [];

  // 2. Setup Intersection Observer
  const { ref, inView } = useInView({
    triggerOnce: true, // Only fire once per session
    threshold: 0.2, // Trigger when 20% of the card is visible
  });

  // 3. Trigger the View Counter
  React.useEffect(() => {
    if (inView) {
      const logView = async () => {
        const supabase = createClient();
        const { error } = await supabase.rpc("increment_poll_view", {
          p_poll_id: poll.id,
        });
        if (error) console.error("Error logging poll view:", error);
      };
      logView();
    }
  }, [inView, poll.id]);

  const handleCopyEmbed = async () => {
    const embedCode = `<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/polls/embed/${poll.id}" width="100%" height="400" frameborder="0" style="border-radius: 16px; max-width: 400px;"></iframe>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy embed code:", err);
    }
  };

  const advanceTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const [votes, setVotes] = React.useState<Record<string, number>>(() => {
    return options.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.id] = Number(opt.vote_count ?? 0);
      return acc;
    }, {});
  });

  // Calculate total votes for percentages
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting || isAdvancing) return;
    setIsSubmitting(true);

    // 1. Optimistic Update
    setVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] ?? 0) + 1,
    }));
    setHasVoted(true);

    // Auto-advance after a short delay so users can see results.
    setIsAdvancing(true);
    advanceTimeoutRef.current = window.setTimeout(() => {
      setIsAdvancing(false);
      onAdvance?.();
    }, advanceDelayMs);

    // 2. Submit to Supabase
    const supabase = createClient();
    const { error } = await supabase.rpc("increment_poll_vote1", {
      p_option_id: optionId,
    });

    if (error) {
      console.error("Vote failed:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <Card
      ref={ref} // 4. Attach the Ref here to track visibility
      className={cn(
        `h-full py-3 rounded-2xl border border-white/10 bg-white/5 gap-2 shadow-sm
        flex flex-col bg-[#273659]`,
        compact && "rounded-xl",
        backgroundClassName,
      )}
    >
      <CardHeader className={cn("pb-3", compact && "pb-2 px-3 pt-3")}>
        <CardTitle
          className={cn(
            "text-lg leading-tight text-white",
            compact && "text-sm",
          )}
        >
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          "flex-1 flex flex-col justify-between",
          compact && "px-3 pb-3",
        )}
      >
        <div className="flex flex-col gap-3 h-auto">
          {options.map((option) => {
            const count = votes[option.id] ?? Number(option.vote_count ?? 0);
            const percent =
              totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div key={option.id} className="space-y-1.5 group">
                {hasVoted ? (
                  // RESULT VIEW
                  <div className="animate-in fade-in duration-500">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-white">
                        {option.label}
                      </span>
                      <span className="text-blue-100">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <p className="text-xs text-blue-100 text-right mt-0.5">
                      {count} votes
                    </p>
                  </div>
                ) : (
                  // VOTING VIEW
                  <Button
                    variant="outline"
                    className={cn(
                      `w-full justify-between h-auto py-3 px-4 rounded-2xl
                        font-normal transition-all text-left whitespace-normal
                        border border-white/10 bg-white/5 hover:bg-white/10
                        focus:outline-none focus:ring-2 focus:ring-white/30`,
                      isSubmitting && "opacity-50 pointer-events-none",
                    )}
                    onClick={() => handleVote(option.id)}
                    disabled={isSubmitting}
                  >
                    <span className="mr-2 text-white">{option.label}</span>
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {!hasVoted && (
          <p className="text-xs text-center text-blue-100 mt-2">
            Click an option to vote and see results
          </p>
        )}

        {hasVoted && isAdvancing && !noLoadSpinner && (
          <div className="mt-3 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}

        {showEmbed && !compact && (
          <div className="mt-4 pt-3 border-t border-white/10 ">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyEmbed}
              className="w-full text-xs text-white/50 hover:text-white
                hover:bg-white/10 gap-2"
            >
              {embedCopied ? (
                <>
                  <Check className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Code className="h-3 w-3" />
                  <span>Embed this poll</span>
                  <Copy className="h-3 w-3 ml-auto" />
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
