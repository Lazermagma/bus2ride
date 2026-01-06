import { createClient } from "@/lib/supabase/server";
import { toPublicStorageUrl } from "../helpers/storage";
import { cache } from "react";
import { unstable_cache } from "next/cache";

export const mockVehicles = [
  {
    id: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    name: "Party Bus",
    slug: "party-bus",
    images: [
      "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/10%20Passenger%20Executive%20Sprinter%20Van/10%20Passenger%20Executive%20Sprinter%20Exterior%20Lux.png",
      "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/10%20Passenger%20Executive%20Sprinter%20Van/10%20Passenger%20Executive%20Sprinter%20Interior%20Lux.png",
    ],
    capacity: "50 passengers",
    price_hourly: "$100",
    type: "party-bus",
    description: "A comfortable and spacious bus for your next party or event.",
    amenities: ["Chauffer Included"],
    min_hours: 4,
  },
  {
    id: "2",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    name: "Luxury Limo",
    slug: "limo",
    images: [
      "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/14%20Passenger%20Limo%20Sprinter/14%20Passenger%20Limo%20Style%20Sprinter%20Exterior%20Lux.png",
      "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/14%20Passenger%20Limo%20Sprinter/14%20Passenger%20Limo%20Style%20Sprinter%20Interior%20Lux.png",
    ],
    capacity: "10 passengers",
    price_hourly: "$200",
    type: "limo",
    description: "A luxurious and comfortable limo for your special occasion.",
    amenities: ["Laser Lights"],
    min_hours: 3,
  },
  {
    id: "3",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    name: "Coach Bus",
    slug: "coach",
    images: [
      "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/48%20Passenger%20Coach%20Bus/48%20Passenger%20Coach%20Bus%20Exterior%20Lux.png",
      "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/48%20Passenger%20Coach%20Bus/48%20Passenger%20Coach%20Bus%20Interior%20Lux.png",
    ],
    capacity: "48 passengers",
    price_hourly: "$150",
    type: "coach",
    description: "A comfortable and spacious bus for your next party or event.",
    amenities: ["Chauffer Included"],
    min_hours: 5,
  },
];

const fetchVehicles = async (limit: number) => {
  const supabase = await createClient();

  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .limit(limit);

  if (error) {
    console.error("getVehicles:", error);
    return null;
  }

  if (!vehicles) {
    console.warn("getVehicles:", "No data found");
    return null;
  }

  return vehicles;
};

export const getVehicles = async (limit = 10) => {
  const getCachedVehicles = unstable_cache(
    async () => fetchVehicles(limit),
    [`vehicles-${limit}`],
    { revalidate: 300, tags: ["vehicles"] }
  );
  return getCachedVehicles();
};

export const getRandomVehicles = cache(async (limit = 10) => {
  const vehicles = (await getVehicles(100)) ?? [];

  if (!vehicles) {
    console.warn("getRandomVehicles:", "No data found");
    return null;
  }

  const shuffledVehicles = vehicles
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);

  return shuffledVehicles;
});

export const getVehiclebySlug = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getVehiclebySlug:", error);
  }

  if (!vehicle) {
    console.warn("getVehiclebySlug:", "No data found");
    return null;
  }

  return vehicle;
});

export const getVehiclesByType = cache(
  async (type: VehicleData["type"], order = "id", limit = 10) => {
    const supabase = await createClient();

    if (!type) {
      console.warn("getVehiclesByType", "No type provided");
      return null;
    }

    const { data: vehiclesByType, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("type", type)
      .limit(limit)
      .order(order, { ascending: true });

    if (error) {
      console.warn("getVehiclesByType", error);
      return null;
    }

    if (!vehiclesByType) {
      console.warn("getVehiclesByType", "No data found");
      return null;
    }

    return vehiclesByType;
  },
);

export const getSimilarVehiclesByType = cache(
  async (type: VehicleData["type"], id: string, limit = 10) => {
    const supabase = await createClient();

    if (!type) {
      console.warn("getVehiclesByType", "No type provided");
      return null;
    }

    const { data: similarVehiclesByType, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("type", type)
      .neq("id", id)
      .limit(limit);

    if (error) {
      console.error("getSimilarVehiclesByType:", error);
      return null;
    }

    if (!similarVehiclesByType) {
      console.warn("getSimilarVehiclesByType:", "No data found");
      return null;
    }

    return similarVehiclesByType;
  },
);

export const getRandomVehicleByType = cache(
  async (type: VehicleData["type"]) => {
    const vehiclesByType = (await getVehiclesByType(type)) ?? [];

    if (vehiclesByType.length === 0) {
      console.warn(
        "getRandomVehicleByType:",
        "No vehicles found for type",
        type,
      );
      return null;
    }

    const randomIndex = Math.floor(Math.random() * vehiclesByType.length);

    const randomVehicleByType = vehiclesByType[randomIndex];

    return randomVehicleByType;
  },
);

export const getVehiclesByCapacityRange = cache(
  async (minCapacity: number, maxCapacity: number, excludeId?: string, limit = 4) => {
    const supabase = await createClient();

    let query = supabase
      .from("vehicles")
      .select("*")
      .limit(100);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data: vehicles, error } = await query;

    if (error) {
      console.error("getVehiclesByCapacityRange:", error);
      return null;
    }

    if (!vehicles) {
      console.warn("getVehiclesByCapacityRange:", "No data found");
      return null;
    }

    const filtered = vehicles.filter((v) => {
      const match = v.capacity?.match(/\d+/);
      const cap = match ? parseInt(match[0], 10) : 0;
      return cap >= minCapacity && cap <= maxCapacity;
    });

    return filtered.slice(0, limit);
  },
);

// STORAGE FUNCTION

export const getRandomVehiclesImages = cache(
  async (limit = 10, type?: "party-buses" | "limousines" | "coach-buses") => {
    const supabase = await createClient();
    const bucket = "vehicles1";

    const { data: folders, error: foldersError } = await supabase.storage
      .from(bucket)
      .list("", { limit: 100 });

    if (foldersError) {
      console.error("getRandomVehiclesImages (folders):", foldersError);
      return [];
    }

    if (!folders) {
      console.warn("getRandomVehiclesImages:", "No folders found");
      return [];
    }

    let filteredFolders = folders;

    if (type) {
      const mapTypeToKeyWord = {
        "party-buses": "Party",
        limousines: "Limo",
        "coach-buses": "Coach",
      };

      filteredFolders = folders.filter((folder) =>
        folder.name.includes(mapTypeToKeyWord[type]),
      );
    }

    const shuffledFolders = [...filteredFolders]
      .filter((item) => item.name && !item.name.endsWith("/"))
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    // Final images array
    const randomVehiclesImagesUrls: string[] = [];

    for (const folder of shuffledFolders) {
      const { data: vehiclesImages, error: imagesError } =
        await supabase.storage.from(bucket).list(folder.name, { limit: limit });

      if (imagesError) {
        console.error("getRandomVehiclesImages (images):", imagesError);
        continue;
      }

      if (!vehiclesImages || vehiclesImages.length === 0) {
        console.warn(
          "getRandomVehiclesImages:",
          "No images found in folder",
          folder.name,
        );
        continue;
      }

      const randomIndex = Math.floor(Math.random() * vehiclesImages.length);
      const selectedImage = vehiclesImages[randomIndex];

      if (!selectedImage || !selectedImage.name) {
        console.warn(
          "getRandomVehiclesImages:",
          "Invalid image in folder",
          folder.name,
        );
        continue;
      }

      randomVehiclesImagesUrls.push(
        toPublicStorageUrl(
          bucket,
          `${folder.name}/${selectedImage.name}`,
        ),
      );
    }

    return randomVehiclesImagesUrls;
  },
);

export type VehicleData = NonNullable<
  Awaited<ReturnType<typeof getVehiclebySlug>>
>;
