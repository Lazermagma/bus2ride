import { Suspense } from "react";
import { WhySection } from "./content-features";
import { FleetPreviewServer } from "./fleet-preview.server";
import Link from "next/link";
import { FaChevronCircleLeft ,FaChevronCircleRight} from "react-icons/fa";
import { cn } from "@/lib/utils";
interface FleetSectionProps {
  showPartyBuses?: boolean;
  showLimousines?: boolean;
  showCoachBuses?: boolean;
  location?: {
    stateSlug: string;
    citySlug: string;
  };
  compact?: boolean;
  hideButtons?: boolean;
}

export default async function FleetSection({
  showPartyBuses = true,
  showLimousines = true,
  showCoachBuses = true,
  location,
  compact = false,
  hideButtons = false,
}: FleetSectionProps) {
  const linkFor = (fleet: "party-bus" | "limo" | "coach") => {
    if (!location) {
      if (fleet === "party-bus") return "/party-buses";
      if (fleet === "limo") return "/limousines";
      return "/coach-buses";
    }

    const fleetSlug =
      fleet === "party-bus"
        ? "party-buses"
        : fleet === "limo"
          ? "limousines"
          : "coach-buses";
    return `/locations/${location.stateSlug}/$${fleetSlug}-${location.citySlug}`;
  };

  return (
    <>
      {/* Party Buses */}
      {showPartyBuses && (
        <>
          <Suspense
            fallback={<div className="h-[400px] bg-muted animate-pulse" />}
          >
            <div className="flex flex-row items-center w-full justify-between ">

              {/* Left Icon */}
              <div className="flex w-16 items-center justify-center">
                <Link 
                  href="/party-buses"
                  className={cn(
                    "group relative flex items-center justify-center w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20",
                    "border-2 border-white/20 backdrop-blur-sm",
                    "hover:border-pink-400/50 hover:from-pink-500/30 hover:via-purple-500/30 hover:to-blue-500/30",
                    "hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30",
                    "transition-all duration-300"
                  )}
                >
                  <FaChevronCircleLeft
                    size={28}
                    className="text-white group-hover:text-pink-300 transition-colors duration-300"
                  />
                </Link>
              </div>




              {/* Center Component */}
              <div className="flex-1 mx-4">
                <FleetPreviewServer
                  title="Party Buses"
                  viewAllLink={linkFor("party-bus")}
                  type="party-bus"
                  compact={compact}
                  hideButtons={hideButtons}
                />
              </div>

              {/* Right Icon */}
              <div className="flex w-16 items-center justify-center">
                <Link 
                  href="/party-buses"
                  className={cn(
                    "group relative flex items-center justify-center w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20",
                    "border-2 border-white/20 backdrop-blur-sm",
                    "hover:border-pink-400/50 hover:from-pink-500/30 hover:via-purple-500/30 hover:to-blue-500/30",
                    "hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30",
                    "transition-all duration-300"
                  )}
                >
                  <FaChevronCircleRight
                    size={28}
                    className="text-white group-hover:text-pink-300 transition-colors duration-300"
                  />
                </Link>
              </div>
            </div>
          </Suspense>

          {!compact && <WhySection slug="party-buses" />}
        </>
      )}

      {/* Limousines */}
      {showLimousines && (
        <>
          <Suspense
            fallback={<div className="h-[400px] bg-muted animate-pulse" />}
          >
            <div className="flex flex-row items-center w-full justify-between">
              {/* Left Icon */}
              <div className="flex w-16 items-center justify-center">
                <Link 
                  href="/limousines"
                  className={cn(
                    "group relative flex items-center justify-center w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-500/20",
                    "border-2 border-white/20 backdrop-blur-sm",
                    "hover:border-amber-400/50 hover:from-amber-500/30 hover:via-yellow-500/30 hover:to-amber-500/30",
                    "hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30",
                    "transition-all duration-300"
                  )}
                >
                  <FaChevronCircleLeft
                    size={28}
                    className="text-white group-hover:text-amber-300 transition-colors duration-300"
                  />
                </Link>
              </div>

              {/* Center Component */}
              <div className="flex-1 mx-4">
                <FleetPreviewServer
                  title="Luxury Limousines"
                  viewAllLink={linkFor("limo")}
                  type="limo"
                  compact={compact}
                  hideButtons={hideButtons}
                />
              </div>

              {/* Right Icon */}
              <div className="flex w-16 items-center justify-center">
                <Link 
                  href="/limousines"
                  className={cn(
                    "group relative flex items-center justify-center w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-500/20",
                    "border-2 border-white/20 backdrop-blur-sm",
                    "hover:border-amber-400/50 hover:from-amber-500/30 hover:via-yellow-500/30 hover:to-amber-500/30",
                    "hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30",
                    "transition-all duration-300"
                  )}
                >
                  <FaChevronCircleRight
                    size={28}
                    className="text-white group-hover:text-amber-300 transition-colors duration-300"
                  />
                </Link>
              </div>
            </div>

          </Suspense>

          {!compact && <WhySection slug="limousines" />}
        </>
      )}

      {/* Coach Buses */}
      {showCoachBuses && (
        <>
          <Suspense
            fallback={<div className="h-[400px] bg-muted animate-pulse" />}
          >
            <div className="flex flex-row items-center w-full justify-between">
              {/* Left Icon */}
              <div className="flex w-16 items-center justify-center">
                <Link 
                  href="/coach-buses"
                  className={cn(
                    "group relative flex items-center justify-center w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-emerald-500/20",
                    "border-2 border-white/20 backdrop-blur-sm",
                    "hover:border-emerald-400/50 hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-emerald-500/30",
                    "hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/30",
                    "transition-all duration-300"
                  )}
                >
                  <FaChevronCircleLeft
                    size={28}
                    className="text-white group-hover:text-emerald-300 transition-colors duration-300"
                  />
                </Link>
              </div>

              {/* Center Component */}
              <div className="flex-1 mx-4">
                <FleetPreviewServer
                  title="Coach Buses"
                  viewAllLink={linkFor("coach")}
                  type="coach"
                  compact={compact}
                  hideButtons={hideButtons}
                />
              </div>

              {/* Right Icon */}
              <div className="flex w-16 items-center justify-center">
                <Link 
                  href="/coach-buses"
                  className={cn(
                    "group relative flex items-center justify-center w-14 h-14 rounded-full",
                    "bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-emerald-500/20",
                    "border-2 border-white/20 backdrop-blur-sm",
                    "hover:border-emerald-400/50 hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-emerald-500/30",
                    "hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/30",
                    "transition-all duration-300"
                  )}
                >
                  <FaChevronCircleRight
                    size={28}
                    className="text-white group-hover:text-emerald-300 transition-colors duration-300"
                  />
                </Link>
              </div>
            </div>

          </Suspense>

          {!compact && <WhySection slug="coach-buses" />}
        </>
      )}
    </>
  );
}
