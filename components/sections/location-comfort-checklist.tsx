import { LocationsWithContentData, StateData } from "@/lib/data/locations";
import { VehicleData } from "@/lib/data/vehicles";
import { LiveWeatherConditions } from "./live-weather-conditions";
import {
  fetchOpenWeatherData,
  formatWeatherTime,
  getWindDirection,
} from "@/lib/api/weather";
import { fetchTomTomTraffic } from "@/lib/api/traffic";
import { TrafficConditions } from "./live-traffic-conditions";
import VehicleImageGallery from "./vehicle-image-gallery.client";
import { fetchStateGeocodeData } from "@/lib/api/geocode";
import { getPollsByLocation, getPolls, type PollWithOptions } from "@/lib/data/polls";
import { PollCard } from "./poll-card";

export default async function LocationComfortChecklist({
  location,
  state,
  vehicles_images,
}: {
  location?: LocationsWithContentData;
  state?: StateData;
  vehicles_images: VehicleData["images"];
}) {
  const imageUrls = vehicles_images ?? [];

  const gallery1 = imageUrls.slice(0, 6);
  const gallery2 = imageUrls.slice(6, 12);

  const stateGeoData = {
    coordinates: {
      lat: 0,
      lng: 0,
    },
  };

  if (state) {
    const geoData = await fetchStateGeocodeData(state.name);
    stateGeoData.coordinates.lat = geoData ? geoData[0]?.lat : 0;
    stateGeoData.coordinates.lng = geoData ? geoData[0]?.lon : 0;
  }

  const weather = await fetchOpenWeatherData(
    state ? stateGeoData.coordinates.lat : location?.coordinates.lat || 0,
    state ? stateGeoData.coordinates.lng : location?.coordinates.lng || 0,
  );

  const sunrise = formatWeatherTime(weather.current.sunrise, weather.timezone);
  const sunset = formatWeatherTime(weather.current.sunset, weather.timezone);

  // --- LOGIC: Determine the Dynamic Variable ---
  let dynamicItem;

  // 1. Is it Raining?
  if (weather.current.rain && weather.current.rain["1h"]) {
    dynamicItem = {
      label: "Rainfall (1h)",
      value: `${weather.current.rain["1h"]} mm`, // API usually sends mm. Change label if converting.
      description: "Total accumulation in the past hour.",
    };
  }
  // 2. Is it Snowing?
  else if (weather.current.snow && weather.current.snow["1h"]) {
    dynamicItem = {
      label: "Snowfall (1h)",
      value: `${weather.current.snow["1h"]} mm`,
      description: "Fresh snow depth from the last hour.",
    };
  }
  // 3. Fallback: Humidity
  else {
    dynamicItem = {
      label: "Humidity",
      value: `${weather.current.humidity}%`,
      description: "Current relative moisture in the air.",
    };
  }

  const windSpeed = Math.round(weather.current.wind_speed); // e.g., 3
  const windDir = getWindDirection(weather.current.wind_deg); // e.g., "SE"
  const windText = `${windSpeed} mph ${windDir}`; // "3 mph SE"

  // Traffic
  const traffic = await fetchTomTomTraffic(
    state ? stateGeoData.coordinates.lat : location?.coordinates.lat || 0,
    state ? stateGeoData.coordinates.lng : location?.coordinates.lng || 0,
  );

  // Get a poll for the lower right section
  const cityName = location?.city_name || "";
  let featuredPoll: PollWithOptions | null = null;
  if (cityName) {
    const locationPolls = await getPollsByLocation(cityName, 1);
    if (locationPolls && locationPolls.length > 0) {
      featuredPoll = locationPolls[0];
    }
  }
  if (!featuredPoll) {
    const fallbackPolls = await getPolls(5, "");
    if (fallbackPolls && fallbackPolls.length > 0) {
      featuredPoll = fallbackPolls[0];
    }
  }

  // Final variables

  const name = state ? state.name : location?.city_name;
  const stateName = state ? state.name : location?.state_name;
  const stateSlug = state ? state.slug : location?.state_slug;
  const comfortChecklist = state
    ? state.comfort_checklist
    : location?.comfort_checklist;

  if (!comfortChecklist) {
    return null;
  }

  return (
    <section
      className="relative py-16 px-6 max-w-7xl mx-auto bg-gradient-to-br
        rounded-3xl shadow-xl my-12 border border-blue-800/40 from-blue-900/90
        to-black"
    >
      <h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-6
          font-serif tracking-tight bg-gradient-to-r from-white via-blue-200
          to-blue-500 bg-clip-text text-transparent"
        id="aurora-winter-comfort-checklist-7"
      >
        {name} Comfort Checklist
      </h2>

      <p
        className="text-center text-blue-100/80 max-w-3xl mx-auto mb-8 text-sm
          md:text-base"
      >
        {comfortChecklist?.description}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div
          className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
            from-[#0e1f45] to-[#08132c] p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Sunrise
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{sunrise}</p>
          <p className="text-xs text-blue-100/80 mt-2">
            Plan daylight staging.
          </p>
        </div>
        <div
          className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
            from-[#0e1f45] to-[#08132c] p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Sunset
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{sunset}</p>
          <p className="text-xs text-blue-100/80 mt-2">
            Golden hour hits early.
          </p>
        </div>
        <div
          className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
            from-[#0e1f45] to-[#08132c] p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
            {dynamicItem.label}
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">
            {dynamicItem.value}
          </p>
          <p className="text-xs text-blue-100/80 mt-2">
            {dynamicItem.description}
          </p>
        </div>
        <div
          className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
            from-[#0e1f45] to-[#08132c] p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
            Wind
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{windText}</p>
          <p className="text-xs text-blue-100/80 mt-2">
            Feels colder on docks.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Col 1 */}
        <div className="space-y-4 flex flex-col">
          {comfortChecklist?.tips.map((tip) => (
            <div
              key={tip.toLowerCase().replace(/\s+/g, "-")}
              className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40
                text-blue-100/90 text-sm leading-relaxed"
            >
              {tip}
            </div>
          ))}

          {/* Gallery 1 */}
          <div className="mt-6">
            <VehicleImageGallery imageUrls={gallery1} />
          </div>

          <div
            className="mt-6 bg-[#132a55] p-5 rounded-2xl border
              border-blue-700/40 text-blue-100/90 text-[13px] leading-relaxed
              shadow"
          >
            <h4
              className="font-semibold text-blue-50 mb-2 text-sm tracking-wide"
            >
              {name} Fleet Readiness
            </h4>

            <div
              className="prose prose-lg prose-invert max-w-none text-justify
                prose-headings:font-bold prose-headings:tracking-tight
                prose-headings:text-white prose-p:text-slate-200
                prose-a:text-sky-300 prose-a:no-underline
                hover:prose-a:underline prose-strong:text-white
                prose-hr:border-white/10 prose-img:rounded-2xl
                prose-img:shadow-lg space-y-6"
              dangerouslySetInnerHTML={{
                __html: comfortChecklist?.fleet_readiness ?? "",
              }}
            />
          </div>

          <div className="mt-4">
            <a
              href="/contact"
              className="inline-block rounded-full bg-red-600 text-white
                font-bold px-5 py-3 shadow hover:opacity-95 transition"
            >
              Book an {stateName} Flex Window
            </a>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div
              className="rounded-2xl border border-blue-700/40 bg-[#0f2148] p-4
                shadow"
            >
              <p
                className="text-xs uppercase tracking-[0.35em] text-blue-200/70"
              >
                {name} Trivia
              </p>
              <h4 className="text-lg font-semibold text-white mt-2">
                {comfortChecklist?.trivia?.title}
              </h4>
              <p className="mt-3 space-y-2 text-sm text-blue-100/90">
                {comfortChecklist?.trivia?.description}
              </p>
            </div>
            <div
              className="rounded-2xl border border-blue-700/40 bg-[#10234c] p-4
                shadow"
            >
              <p
                className="text-xs uppercase tracking-[0.35em] text-blue-200/70"
              >
                {name} Fast Facts
              </p>
              <h4 className="text-lg font-semibold text-white mt-2">
                {comfortChecklist?.fast_facts?.title}
              </h4>
              <p className="mt-3 space-y-2 text-sm text-blue-100/90">
                {comfortChecklist?.fast_facts?.description}
              </p>
            </div>
            <div
              className="rounded-2xl border border-blue-700/40 bg-gradient-to-br
                from-[#132852] to-[#0b1938] p-4 shadow md:col-span-2"
            >
              <p
                className="text-xs uppercase tracking-[0.35em] text-blue-200/70"
              >
                Aurora Playbook
              </p>
              <h4 className="text-lg font-semibold text-white mt-2">
                {comfortChecklist?.playbook?.title}
              </h4>
              <div
                className="mt-3 grid gap-4 md:grid-cols-3 text-sm
                  text-blue-100/90"
              >
                <div>
                  <p
                    className="text-xs text-blue-200/70 uppercase
                      tracking-[0.2em]"
                  >
                    {comfortChecklist?.playbook?.box1?.label}
                  </p>
                  <p className="font-semibold text-white">
                    {comfortChecklist?.playbook?.box1?.title}
                  </p>
                  <p className="mt-1 text-[13px]">
                    {comfortChecklist?.playbook?.box1?.description}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-blue-200/70 uppercase
                      tracking-[0.2em]"
                  >
                    {comfortChecklist?.playbook?.box2?.label}
                  </p>
                  <p className="font-semibold text-white">
                    {comfortChecklist?.playbook?.box2?.title}
                  </p>
                  <p className="mt-1 text-[13px]">
                    {comfortChecklist?.playbook?.box2?.description}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs text-blue-200/70 uppercase
                      tracking-[0.2em]"
                  >
                    {comfortChecklist?.playbook?.box3?.label}
                  </p>
                  <p className="font-semibold text-white">
                    {comfortChecklist?.playbook?.box3?.title}
                  </p>
                  <p className="mt-1 text-[13px]">
                    {comfortChecklist?.playbook?.box3?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-6 rounded-3xl border border-blue-700/40
              bg-gradient-to-br from-[#0f2348] to-[#091532] p-5 shadow"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
              Dispatch case files
            </p>
            <h4 className="text-lg font-semibold text-white mt-2">
              Real {name} requests we staged this season
            </h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {comfortChecklist?.case_files?.box1 && (
                <div
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">
                      {comfortChecklist?.case_files.box1.title}
                    </span>
                    <span
                      className="text-xs uppercase tracking-[0.25em]
                        text-amber-200"
                    >
                      {comfortChecklist?.case_files.box1.label}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-blue-100/90">
                    {comfortChecklist?.case_files.box1.description}
                  </p>
                </div>
              )}

              {comfortChecklist?.case_files?.box2 && (
                <div
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">
                      {comfortChecklist?.case_files.box2.title}
                    </span>
                    <span
                      className="text-xs uppercase tracking-[0.25em]
                        text-amber-200"
                    >
                      {comfortChecklist?.case_files.box2.label}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-blue-100/90">
                    {comfortChecklist?.case_files.box2.description}
                  </p>
                </div>
              )}

              {comfortChecklist?.case_files?.box3 && (
                <div
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">
                      {comfortChecklist?.case_files.box3.title}
                    </span>
                    <span
                      className="text-xs uppercase tracking-[0.25em]
                        text-amber-200"
                    >
                      {comfortChecklist?.case_files.box3.label}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-blue-100/90">
                    {comfortChecklist?.case_files.box3.description}
                  </p>
                </div>
              )}

              {comfortChecklist?.case_files?.box4 && (
                <div
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">
                      {comfortChecklist?.case_files.box4.title}
                    </span>
                    <span
                      className="text-xs uppercase tracking-[0.25em]
                        text-amber-200"
                    >
                      {comfortChecklist?.case_files.box4.label}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-blue-100/90">
                    {comfortChecklist?.case_files.box4.description}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            className="mt-4 rounded-2xl border border-blue-700/40 bg-[#0d1f42]
              p-4 flex items-center gap-4 shadow"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                Flexible Scheduling & Last-Minute Changes
              </p>
              <p className="text-xs text-blue-100/80">
                {comfortChecklist?.hotfix_lane}
              </p>
            </div>
          </div>
          <div
            className="mt-3 rounded-2xl border border-blue-700/40 bg-[#0c1b38]
              p-4 shadow"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
              Limited Weekend Availability
            </p>
            <div className="mt-2 flex items-end gap-3">
              {/* <p className="text-3xl font-black text-white">
                {comfortChecklist?.slot_count?.number}
              </p> */}
              <p className="text-xs text-blue-100/80">
                {comfortChecklist?.slot_count?.text}
              </p>
            </div>
            <p className="text-[12px] text-blue-200/70 mt-2">
              {comfortChecklist?.slot_count?.label}
            </p>
          </div>

          <div
            className="mt-3 rounded-2xl border border-blue-700/40 bg-[#09142c]
              p-4 shadow"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
              Experienced, Event-Ready Drivers
            </p>
            <p className="text-sm text-blue-100/90 mt-2">
              {comfortChecklist?.driver_intel?.description}
            </p>
            <p className="text-[12px] text-blue-200/60 mt-2">
              {comfortChecklist?.driver_intel?.label}
            </p>
          </div>
        </div>

        {/* Col 2 */}
        <div
          className="bg-[#132a55] p-4 md:p-6 rounded-2xl border
            border-blue-700/40 flex flex-col gap-4"
        >
          <h3 className="text-2xl font-bold font-serif text-white">
            Live Weather &amp; Comfort
          </h3>
          <p className="text-blue-100/90 text-sm leading-relaxed">
            {comfortChecklist?.live_weather?.description}
          </p>
          <div
            className="rounded-2xl overflow-hidden border border-blue-600/40
              bg-gradient-to-br from-[#0b2049] via-[#081633] to-[#050b1d] p-2
              md:p-3 text-white text-sm shadow-[0_30px_90px_rgba(4,11,32,0.55)]"
          >
            <LiveWeatherConditions
              cityName={location ? location.city_name : undefined}
              stateName={stateName}
              weather={weather}
              tips={comfortChecklist?.packing_tips ?? []}
            />
          </div>

          {/* Old road conditions */}
          {/* <div
            className="rounded-2xl border border-blue-600/40 bg-gradient-to-br
              from-[#0f274f] to-[#091533] p-5
              shadow-[0_30px_90px_rgba(4,11,32,0.45)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.4em]
                    text-blue-200/70"
                >
                  Road conditions
                </p>
                <h4 className="text-lg font-semibold text-white">
                  {location.city_name} &amp; Southcentral
                </h4>
              </div>
              <span
                className="inline-flex items-center gap-1 rounded-full
                  bg-white/10 px-3 py-1 text-xs text-white/80"
              >
                AK DOT 511
              </span>
            </div>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div
                  className="flex items-center justify-between text-sm
                    text-blue-100/90"
                >
                  <span className="font-semibold text-white">
                    Seward Hwy (AK-1)
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.2em]
                      text-amber-200"
                  >
                    Patchy refreeze
                  </span>
                </div>
                <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">
                  Bird Point &amp; Turnagain curves ice over after 9 PM. Keep
                  5-8 min buffer.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div
                  className="flex items-center justify-between text-sm
                    text-blue-100/90"
                >
                  <span className="font-semibold text-white">Glenn Hwy</span>
                  <span
                    className="text-xs uppercase tracking-[0.2em]
                      text-amber-200"
                  >
                    Bare / wet
                  </span>
                </div>
                <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">
                  Mat-Su winds kick up drifting snow past Eagle River.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div
                  className="flex items-center justify-between text-sm
                    text-blue-100/90"
                >
                  <span className="font-semibold text-white">Alyeska Hwy</span>
                  <span
                    className="text-xs uppercase tracking-[0.2em]
                      text-amber-200"
                  >
                    Snow-packed
                  </span>
                </div>
                <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">
                  Slow at mile 2 switchback; gravel improves traction.
                </p>
              </div>
            </div>
            <a
              href={`https://511.${location.state_slug}.gov`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center
                rounded-full border border-white/20 px-4 py-2 text-xs
                font-semibold text-white hover:border-white/40"
            >
              Check live AK 511 →
            </a>
          </div> */}

          {/* Road conditions */}
          <TrafficConditions 
            data={traffic} 
            stateName={stateName}
            stateSlug={stateSlug}
          />

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-blue-200 mb-2">
              View Similar Vehicles
            </h4>

            {/* Gallery 2 */}
            <VehicleImageGallery
              imageUrls={gallery2.length ? gallery2 : gallery1}
            />
          </div>

          {/* Featured Poll or Trivia */}
          {featuredPoll && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-blue-200 mb-3">
                Community Question
              </h4>
              <div className="rounded-2xl border border-blue-700/40 bg-[#0f2148] p-4 overflow-hidden">
                <PollCard poll={featuredPoll} compact />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
