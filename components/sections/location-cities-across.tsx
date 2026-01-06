import {
  getLocationsByState,
  LocationsData,
  StateData,
  type LocationsWithContentData,
} from "@/lib/data/locations";
import { LocationCitiesAcrossClient } from "./location-cities-across.client";

export default async function LocationCitiesAcross({
  location,
  state,
}: {
  location?: LocationsWithContentData;
  state?: StateData;
}) {
  const cities =
    (await getLocationsByState(state?.slug || location?.state_slug || "")) ??
    [];
  if (!cities) return null;

  const stateName = state ? state.name : location?.state_name;
  const stateSlug = state ? state.slug : location?.state_slug;
  const citiesServed = state ? state?.cities_served : location?.cities_served;

  if (!stateName || !stateSlug) return null;

  return (
    <LocationCitiesAcrossClient
      cities={cities}
      stateName={stateName}
      stateSlug={stateSlug}
      citiesServed={citiesServed}
    />
  );
}
