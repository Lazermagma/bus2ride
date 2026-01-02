import { Suspense } from "react";
import { WhySection } from "./content-features";
import { FleetPreviewServer } from "./fleet-preview.server";
import Link from "next/link";
import { FaChevronCircleLeft ,FaChevronCircleRight} from "react-icons/fa";
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
              <div className="flex w-16 items-center justify-center group">
                <Link href="/party-buses">
                  <FaChevronCircleLeft
                    size={32}
                    className="
        text-white
        transition-all duration-300
        group-hover:text-blue-400
        group-hover:scale-110
      "
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
              <div className="flex w-16 items-center justify-center group">
                <Link href="/party-buses">
                  <FaChevronCircleRight
                    size={32}
                    className="text-white transition-all duration-300
        group-hover:text-blue-400
        group-hover:scale-110"
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
              <div className="flex w-16 items-center justify-center group">
                <Link href="/limousines">
                  <FaChevronCircleLeft
                    size={32}
                    className="
          text-white
          transition-all duration-300
          group-hover:text-blue-400
          group-hover:scale-110
        "
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
              <div className="flex w-16 items-center justify-center group">
                <Link href="/limousines">
                  <FaChevronCircleRight
                    size={32}
                    className="
          text-white
          transition-all duration-300
          group-hover:text-blue-400
          group-hover:scale-110
        "
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
              <div className="flex w-16 items-center justify-center group">
                <Link href="/coach-buses">
                  <FaChevronCircleLeft
                    size={32}
                    className="
          text-white
          transition-all duration-300
          group-hover:text-blue-400
          group-hover:scale-110
        "
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
              <div className="flex w-16 items-center justify-center group">
                <Link href="/coach-buses">
                  <FaChevronCircleRight
                    size={32}
                    className="
          text-white
          transition-all duration-300
          group-hover:text-blue-400
          group-hover:scale-110
        "
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
