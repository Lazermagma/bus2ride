import { LocationsWithContentData, StateData } from "@/lib/data/locations";
import { InstantQuoteButton } from "@/components/InstantQuoteButton";

export default function LocationHeader({
  location,
  state,
}: {
  location?: LocationsWithContentData;
  state?: StateData;
}) {
  const header = state ? state.header : location?.header;

  if (!header) {
    return null;
  }

  const cityName = location?.city_name;
  const stateName = state ? state.name : location?.state_name;

  return (
    <section className="relative px-4 pt-4 mb-12">
      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-[40px] border
          border-blue-500/30 bg-gradient-to-br from-[#081b3d] via-[#041029]
          to-black shadow-[0_40px_120px_rgba(3,9,23,0.6)]"
      >
        <div
          className="absolute inset-0 pointer-events-none
            bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]"
          aria-hidden="true"
        ></div>
        <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
          <div
            className="flex flex-wrap items-center justify-between gap-3
              text-[13px] text-blue-100/80"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full border border-blue-400/50 px-3 py-1
                  text-xs font-semibold uppercase tracking-[0.35em]
                  text-blue-200"
              >
                {cityName && `${cityName} • `}
                {stateName}
              </span>
              <span className="text-blue-300/80">Bus2Ride Local Dispatch</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-white/80">
              <a
                href="tel:8885352566"
                className="font-semibold underline decoration-dotted
                  underline-offset-4"
              >
                (888) 535-2566
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="mailto:info@bus2ride.com"
                className="font-semibold underline decoration-dotted
                  underline-offset-4 hidden sm:inline"
              >
                info@bus2ride.com
              </a>
            </div>
          </div>
          <div className="mt-8 text-center space-y-6">
            <p className="text-xs uppercase tracking-[0.45em] text-blue-200/80">
              Party Bus &amp; Charter Service
            </p>
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight
                text-white"
            >
              {header?.title}
            </h1>
            <p
              className="mx-auto max-w-3xl text-base md:text-lg
                text-blue-100/90"
            >
              {header?.description}
            </p>
          </div>
          <div
            className="mt-10 flex flex-row flex-wrap gap-4 justify-center items-center"
          >
             <InstantQuoteButton 
               source={`Location - ${stateName || cityName}`}
               size="lg"
               className="!px-10 !py-5 !text-xl !h-[60px] rounded-full shadow-[0_20px_40px_rgba(4,7,16,0.45)] min-w-[200px] flex-shrink-0"
             />
            <a
              href="/fleet"
              className="inline-flex items-center justify-center rounded-full
                border border-white/30 bg-slate-900/80 px-10 py-5 text-xl font-semibold
                text-white shadow-[0_20px_40px_rgba(3,9,23,0.5)]
                hover:-translate-y-0.5 hover:bg-white/5 transition min-w-[200px] flex-shrink-0"
            >
              🚌 View Fleet
            </a>
            <a
              href="tel:8885352566"
              className="inline-flex items-center justify-center rounded-full
                border border-white/30 bg-slate-900/80 px-10 py-5 text-xl font-semibold
                text-white shadow-[0_20px_40px_rgba(3,9,23,0.5)]
                hover:-translate-y-0.5 hover:bg-white/5 transition min-w-[200px] flex-shrink-0"
            >
              📞 Call (888) 535-2566
            </a>
            <a
              href="mailto:info@bus2ride.com"
              className="inline-flex items-center justify-center rounded-full
                border border-white/30 bg-slate-900/80 px-10 py-5 text-xl font-semibold
                text-white shadow-[0_20px_40px_rgba(3,9,23,0.5)]
                hover:-translate-y-0.5 hover:bg-white/5 transition min-w-[200px] flex-shrink-0"
            >
              ✉️ Email Us
            </a>
          </div>
          <p className="mt-6 text-center text-sm text-yellow-200/90">
            {header?.bottom_label}
          </p>
        </div>
      </div>
    </section>
  );
}
