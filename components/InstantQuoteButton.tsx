"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { openLiveChatModal } from "@/lib/livechat";

interface InstantQuoteButtonProps {
  source?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "pulse";
}

export function InstantQuoteButton({ 
  source = "Website", 
  className,
  size = "default",
  variant = "default"
}: InstantQuoteButtonProps) {
  const handleClick = () => {
    openLiveChatModal(source, typeof window !== "undefined" ? window.location.pathname : "/");
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "rounded-full font-bold relative overflow-hidden",
        "bg-gradient-to-r from-pink-500 via-red-500 to-orange-500",
        "text-white border-0 hover:brightness-110 transition-all",
        variant === "pulse" && "animate-pulse",
        sizeClasses[size],
        className
      )}
    >
      <span className="absolute inset-0 bg-white/20 animate-shimmer" />
      <Sparkles className="w-4 h-4 mr-2 relative z-10" />
      <span className="relative z-10">Instant Quote</span>
    </Button>
  );
}
