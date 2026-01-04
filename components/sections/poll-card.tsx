"use client";

import * as React from "react";
import { Loader2, Code, Check, Copy } from "lucide-react";
import { useInView } from "react-intersection-observer";
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

  /* -----------------------------------------
     Intersection Observer (fade logic)
  ----------------------------------------- */
  const { ref, entry } = useInView({
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  const visibility = entry?.intersectionRatio ?? 0;

  const opacity =
    visibility >= 0.75
      ? 1
      : visibility >= 0.5
        ? 0.7
        : visibility >= 0.25
          ? 0.4
          : 0.2;

  /* -----------------------------------------
     View counter (fires once naturally)
  ----------------------------------------- */
  const hasLoggedViewRef = React.useRef(false);

  React.useEffect(() => {
    if (visibility > 0.25 && !hasLoggedViewRef.current) {
      hasLoggedViewRef.current = true;

      const logView = async () => {
        const supabase = createClient();
        const { error } = await supabase.rpc("increment_poll_view", {
          p_poll_id: poll.id,
        });
        if (error) console.error("Error logging poll view:", error);
      };

      logView();
    }
  }, [visibility, poll.id]);

  /* -----------------------------------------
     Votes state
  ----------------------------------------- */
  const [votes, setVotes] = React.useState<Record<string, number>>(() =>
    options.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.id] = Number(opt.vote_count ?? 0);
      return acc;
    }, {}),
  );

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  /* -----------------------------------------
     Voting
  ----------------------------------------- */
  const advanceTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting || isAdvancing) return;

    setIsSubmitting(true);
    setHasVoted(true);

    setVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] ?? 0) + 1,
    }));

    setIsAdvancing(true);
    advanceTimeoutRef.current = window.setTimeout(() => {
      setIsAdvancing(false);
      onAdvance?.();
    }, advanceDelayMs);

    const supabase = createClient();
    const { error } = await supabase.rpc("increment_poll_vote1", {
      p_option_id: optionId,
    });

    if (error) console.error("Vote failed:", error);

    setIsSubmitting(false);
  };

  /* -----------------------------------------
     Embed
  ----------------------------------------- */
  const handleCopyEmbed = async () => {
    const embedCode = `<iframe src="${window.location.origin}/polls/embed/${poll.id}" width="100%" height="400" frameborder="0" style="border-radius:16px;max-width:400px;"></iframe>`;

    try {
      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    } catch {
      console.error("Failed to copy embed code");
    }
  };

  /* -----------------------------------------
     Render
  ----------------------------------------- */
  return (
    <Card
      ref={ref}
      style={{ opacity }}
      className={cn(
        "transition-opacity duration-300 ease-out",
        "h-full py-3 rounded-2xl border border-white/10 bg-[#273659] shadow-sm flex flex-col",
        compact && "rounded-xl",
        backgroundClassName,
      )}
    >
      <CardHeader className={cn("pb-3", compact && "pb-2 px-3 pt-3")}>
        <CardTitle
          className={cn("text-lg text-white", compact && "text-sm")}
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
        <div className="flex flex-col gap-3">
          {options.map((option) => {
            const count = votes[option.id] ?? 0;
            const percent =
              totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div key={option.id} className="space-y-1.5">
                {hasVoted ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">{option.label}</span>
                      <span className="text-blue-100">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <p className="text-xs text-blue-100 text-right">
                      {count} votes
                    </p>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => handleVote(option.id)}
                    className={cn(
                      "w-full justify-between py-3 px-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10",
                      isSubmitting && "opacity-50 pointer-events-none",
                    )}
                  >
                    <span className="text-white">{option.label}</span>
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
          <div className="mt-3 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}

        {showEmbed && !compact && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyEmbed}
              className="w-full text-xs text-white/50 hover:text-white hover:bg-white/10 gap-2"
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
