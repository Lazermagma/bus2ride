"use client";

import * as React from "react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { Sparkles, X, ArrowRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhyFeature } from "@/lib/data/content_section";

function SafeIcon({ name, className }: { name: string; className?: string }) {
  const iconKey = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const IconComponent = icons[iconKey];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <Sparkles className={className} />;
}

interface WhyFeaturesGridClientProps {
  features: WhyFeature[];
  className?: string;
  defaultCta?: {
    label: string;
    link: string;
  };
}

export function WhyFeaturesGridClient({
                                        features,
                                        className,
                                        defaultCta,
                                      }: WhyFeaturesGridClientProps) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<WhyFeature | null>(null);

  const pricingCtaLabel = defaultCta?.label ?? "Get a quote";
  const learnMoreCtaLink = active?.cta_link ?? "/contact";

  return (
    <>
      {/* Feature Buttons */}
      <div className={cn(className)}>
        {features.map((feature) => (
          <button
            key={`${feature.title}-${feature.id}`}
            type="button"
            onClick={() => {
              setActive(feature);
              setOpen(true);
            }}
            className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10
              p-3 text-left transition-all duration-300
              hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={`Open details for ${feature.title}`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center">
                {feature.icon && feature.icon?.length === 2 ? (
                  <span className="text-sm">{feature.icon}</span>
                ) : (
                  <SafeIcon
                    name={feature.icon || "sparkles"}
                    className="h-4 w-4 text-blue-300"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm truncate mb-0.5">
                  {feature.title}
                </div>
                <div className="text-white/50 text-xs line-clamp-2">
                  {feature.description}
                </div>
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-blue-400 group-hover:text-blue-300 transition-colors">
                  Details
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Single Dialog Modal */}
      <Dialog open={open} onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setActive(null);
      }}>
        <DialogContent className="w-full max-w-lg rounded-2xl p-0 shadow-2xl border-0
          bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)] " />

          <DialogHeader className="relative flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                {active?.icon && active.icon.length === 2 ? (
                  <span className="text-lg">{active.icon}</span>
                ) : (
                  <SafeIcon
                    name={active?.icon || "sparkles"}
                    className="h-5 w-5 text-white"
                  />
                )}
              </div>
              <DialogTitle className="text-xl font-bold text-white">
                {active?.modal_title ?? active?.title ?? ""}
              </DialogTitle>
            </div>



          </DialogHeader>


          <div className="relative px-6 pb-6">
            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <p className="text-white/80 text-sm leading-relaxed">
                {active?.modal_content || (
                  <>
                    {active?.description}
                    <br /><br />
                    Contact us to learn more about how we can help make your event special.
                  </>
                )}
              </p>
            </div>

            <DialogFooter className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-900 transition-all"
                asChild
              >
                <a href="tel:8885352566">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </a>
              </Button>
              <Button
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:brightness-110 transition-all"
                asChild
              >
                <Link href="/pricing">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {pricingCtaLabel}
                </Link>
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
