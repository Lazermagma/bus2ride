"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRandomImage } from "@/lib/helpers/storage";
import { EventData } from "@/lib/data/events";
import { cn } from "@/lib/utils";
import { useState } from "react";

const cardGradients = [
  "from-purple-500 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-blue-500 to-cyan-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
];

export function EventCard({
  event,
  index = 0,
}: {
  event: EventData;
  index?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const gradient = cardGradients[index % cardGradients.length];

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-0 blur-sm transition-opacity duration-500",
        gradient,
        isHovered && "opacity-60"
      )} />
      
      <Link 
        href={`/events/${event.slug}`}
        className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 cursor-pointer"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={getRandomImage(event.images, "Events1")}
            alt={event.title}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isHovered && "scale-110"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          
          <div className="absolute top-3 left-3">
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg bg-gradient-to-r",
              gradient
            )}>
              {event.category || "Event"}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white leading-tight drop-shadow-lg">
              {event.title}
            </h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 pt-2">
          <p className="text-sm text-white/60 line-clamp-2 mb-4">
            {event.description}
          </p>

          <div className="mt-auto flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              asChild
              size="sm"
              className={cn(
                "flex-1 rounded-lg text-xs font-bold bg-gradient-to-r text-white border-0 hover:brightness-110 transition-all",
                gradient
              )}
            >
              <span>
                <Sparkles className="w-3 h-3 mr-1.5" />
                Learn More
                <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg border-white/20 bg-white/5 text-white text-xs font-semibold hover:bg-white hover:text-slate-900 transition-all"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "tel:8885352566";
              }}
            >
              <Phone className="w-3 h-3 mr-1.5" />
              Call
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
