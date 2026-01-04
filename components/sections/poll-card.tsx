"use client";

import * as React from "react";
import { Loader2, Code, Check, Copy, BarChart2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import type { PollWithOptions } from "@/lib/data/polls";
import { cn } from "@/lib/utils";

interface PollCardProps {
  poll: PollWithOptions;
  backgroundClassName?: string;
  noLoadSpinner?: boolean;
  showEmbed?: boolean;
  compact?: boolean;
}

const COLORS = ["#4300FF", "#FF0087", "#BC7AF9"];

export function PollCard({
                           poll,
                           backgroundClassName,
                           noLoadSpinner = false,
                           showEmbed = true,
                           compact = false,
                         }: PollCardProps) {
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [copiedType, setCopiedType] = React.useState<"live" | "results" | null>(null);

  const options = poll.options ?? [];

  /* -----------------------------------------
     Stable background color
  ----------------------------------------- */
  const bgColor = React.useMemo(() => {
    const index =
      poll.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      COLORS.length;
    return COLORS[index];
  }, [poll.id]);

  /* -----------------------------------------
     Intersection Observer
  ----------------------------------------- */
  const { ref, entry } = useInView({
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  const visibility = entry?.intersectionRatio ?? 0;
  const opacity =
    visibility >= 0.75 ? 1 : visibility >= 0.5 ? 0.7 : visibility >= 0.25 ? 0.4 : 0.2;

  /* -----------------------------------------
     View counter
  ----------------------------------------- */
  const hasLoggedViewRef = React.useRef(false);

  React.useEffect(() => {
    if (visibility > 0.25 && !hasLoggedViewRef.current) {
      hasLoggedViewRef.current = true;
      createClient().rpc("increment_poll_view", { p_poll_id: poll.id });
    }
  }, [visibility, poll.id]);

  /* -----------------------------------------
     Votes
  ----------------------------------------- */
  const [votes, setVotes] = React.useState<Record<string, number>>(() =>
    options.reduce((acc, opt) => {
      acc[opt.id] = Number(opt.vote_count ?? 0);
      return acc;
    }, {} as Record<string, number>)
  );

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  /* -----------------------------------------
     Voting
  ----------------------------------------- */
  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting) return;

    setHasVoted(true);
    setIsSubmitting(true);

    setVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] ?? 0) + 1,
    }));

    const { error } = await createClient().rpc("increment_poll_vote1", {
      p_option_id: optionId,
    });

    if (error) console.error("Vote failed:", error);
    setIsSubmitting(false);
  };

  /* -----------------------------------------
     Embed handlers
  ----------------------------------------- */
  const copyEmbed = async (type: "live" | "results") => {
    const src =
      type === "live"
        ? `/polls/embed/${poll.id}`
        : `/polls/results/embed/${poll.id}`;

    const iframe = `<iframe src="${window.location.origin}${src}" width="100%" height="400" frameborder="0" style="border-radius:16px;max-width:400px;"></iframe>`;

    await navigator.clipboard.writeText(iframe);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  /* -----------------------------------------
     Render
  ----------------------------------------- */
  return (
    <Card
      ref={ref}
      style={{ opacity, backgroundColor: bgColor }}
      className={cn(
        "transition-opacity duration-300 ease-out",
        "h-full py-3 rounded-2xl border border-white/20 shadow-sm flex flex-col",
        compact && "rounded-xl",
        backgroundClassName
      )}
    >
      <CardHeader className={cn("pb-3", compact && "pb-2 px-3 pt-3")}>
        <CardTitle className={cn("text-lg text-white font-bold", compact && "text-sm")}>
          {poll.question}
        </CardTitle>
      </CardHeader>

      <CardContent className={cn("flex-1 flex flex-col justify-between", compact && "px-3 pb-3")}>
        <div className="flex flex-col gap-3">
          {options.map((option) => {
            const count = votes[option.id] ?? 0;
            const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div key={option.id}>
                {hasVoted ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">{option.label}</span>
                      <span className="text-blue-100">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </>
                ) : (
                  <Button
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => handleVote(option.id)}
                    className="w-full py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10"
                  >
                    <span className="text-white">{option.label}</span>
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin ml-auto" />}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* EMBED BUTTONS */}
        {showEmbed && !compact && (
          <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyEmbed("live")}
              className="w-full text-xs text-white/60 hover:text-white hover:bg-white/10 gap-2"
            >
              <Code className="h-3 w-3" />
              {copiedType === "live" ? "Live poll copied!" : "Embed live poll"}
              <Copy className="h-3 w-3 ml-auto" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyEmbed("results")}
              className="w-full text-xs text-white/60 hover:text-white hover:bg-white/10 gap-2"
            >
              <BarChart2 className="h-3 w-3" />
              {copiedType === "results" ? "Results copied!" : "Embed poll results"}
              <Copy className="h-3 w-3 ml-auto" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
