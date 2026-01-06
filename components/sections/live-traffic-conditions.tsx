import { fetchTomTomTraffic } from "@/lib/api/traffic";
import { cn } from "@/lib/utils";
import { Car, CheckCircle2, AlertTriangle, Navigation } from "lucide-react";

export function TrafficConditions({
  data,
  stateName,
  stateSlug,
}: {
  data: Awaited<ReturnType<typeof fetchTomTomTraffic>>;
  stateName?: string;
  stateSlug?: string;
}) {
  // 1. Handle Missing Data / No API Key - Show fallback road conditions
  if (!data || !data.currentSpeed || !data.freeFlowSpeed) {
    return (
      <TrafficCardContainer>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Road Conditions
              </h3>
              <p className="text-sm text-white/60">
                {stateName ? `${stateName} highways and major routes` : "Local roads and highways"}
              </p>
            </div>
            {stateSlug && (
              <a
                href={`https://511.${stateSlug}.gov`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full
                  bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20 transition"
              >
                {stateName} DOT 511
              </a>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">Major Highways</span>
                <span className="text-xs uppercase tracking-[0.2em] text-amber-200">
                  Check 511
                </span>
              </div>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                For real-time road conditions, construction updates, and traffic alerts, check your state&apos;s 511 system.
              </p>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">Planning Tips</span>
                <span className="text-xs uppercase tracking-[0.2em] text-blue-200">
                  General
                </span>
              </div>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Allow extra time during peak hours (7-9 AM, 4-6 PM) and check weather forecasts before your event.
              </p>
            </div>
          </div>
          
          {stateSlug && (
            <a
              href={`https://511.${stateSlug}.gov`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center
                rounded-full border border-white/20 px-4 py-2 text-xs
                font-semibold text-white hover:border-white/40 transition w-full"
            >
              Check live {stateName} 511 →
            </a>
          )}
        </div>
      </TrafficCardContainer>
    );
  }

  const { label, currentSpeed, freeFlowSpeed } = data;

  // 2. Calculate Efficiency (0 to 100%)
  // If current is 60 and free is 60 -> 100% (Green)
  // If current is 10 and free is 60 -> 16% (Red)
  const efficiency = Math.min(
    Math.round((currentSpeed / freeFlowSpeed) * 100),
    100,
  );

  // 3. Determine Styles based on Label
  let statusColor = "text-emerald-400";
  let StatusIcon = CheckCircle2;
  let progressColor = "bg-emerald-500";

  if (label === "Moderate") {
    statusColor = "text-amber-400";
    StatusIcon = AlertTriangle;
    progressColor = "bg-amber-500";
  } else if (label === "Heavy") {
    statusColor = "text-rose-500";
    StatusIcon = AlertTriangle;
    progressColor = "bg-rose-600";
  }

  return (
    <TrafficCardContainer>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full
              bg-white/10 text-white
              shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)]"
          >
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/60">Live Traffic</h3>
            <div
              className={cn(
                "flex items-center gap-2 text-xl font-bold",
                statusColor,
              )}
            >
              {label || "Unknown"}
              <StatusIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Speed Visualizer */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-white">Current Flow</span>
          <span className="text-white/60">
            {Math.round(currentSpeed)}{" "}
            <span className="text-[10px] uppercase">mph</span>
          </span>
        </div>

        {/* Custom Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              progressColor,
            )}
            style={{ width: `${efficiency}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-white/40">
          <span>0</span>
          <span>
            Avg Free Flow:{" "}
            <span className="text-white/70">
              {Math.round(freeFlowSpeed)} mph
            </span>
          </span>
        </div>
      </div>

      {/* Footer / Context */}
      <div
        className="mt-6 flex items-center gap-2 rounded-lg bg-white/5 p-3
          text-xs text-white/60"
      >
        <Navigation className="h-3 w-3 text-primary" />
        <span>
          {efficiency >= 90
            ? "Roads are clear. Great time to drive."
            : efficiency >= 60
              ? "Expect minor delays on major routes."
              : "Significant congestion detected."}
        </span>
      </div>
    </TrafficCardContainer>
  );
}

// Wrapper for consistent styling
function TrafficCardContainer({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl border border-blue-600/40 bg-gradient-to-br
        from-[#0f274f] to-[#091533] p-5 shadow-[0_30px_90px_rgba(4,11,32,0.45)]"
    >
      <div className="container px-4 md:px-6">
        <p className="text-xs uppercase tracking-[0.4em] text-blue-200/70">
          Road conditions
        </p>

        <div className="py-4">{children}</div>
      </div>
    </section>
  );
}
