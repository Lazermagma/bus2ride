import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { toPublicStorageUrl } from "@/lib/helpers/storage"; // Assuming you have this helper
import { LocationsData } from "@/lib/data/locations";

// Define the 3 main categories
const CATEGORIES = [
  {
    id: "party-bus",
    title: "Party Buses",
    description:
      "Turn the journey into the destination with premium sound and lights.",
    link: "party-buses",
  },
  {
    id: "limo",
    title: "Limousines",
    description:
      "Classic stretch limos for elegant arrivals and smaller groups.",
    link: "limousines",
  },
  {
    id: "coach",
    title: "Coach Buses",
    description:
      "Comfortable, reliable seating for large group transportation.",
    link: "coach-buses",
  },
] as const;

type FleetType = (typeof CATEGORIES)[number]["id"];

interface OtherFleetsProps {
  currentType: FleetType; // The type of the page we are currently on
  location?: LocationsData; // Optional location to customize links
  className?: string;
}

export async function OtherFleets({
  currentType,
  location,
  className,
}: OtherFleetsProps) {
  const supabase = await createClient();

  // 1. Identify which categories to show (exclude the current one)
  const categoriesToShow = CATEGORIES.filter((cat) => cat.id !== currentType);

  // 2. Fetch a random vehicle image for each category to use as a preview
  // We use Promise.all to fetch both in parallel for speed
  const cardsWithImages = await Promise.all(
    categoriesToShow.map(async (category) => {
      const { data } = await supabase
        .from("vehicles") // Using your 'vehicles' table
        .select("images")
        .eq("type", category.id)
        .limit(1)
        // Ordering by random() is tricky in Supabase JS directly without RPC,
        // but for a small dataset, just grabbing the first one or using a view is fine.
        // If you have the RPC we discussed: .rpc('get_random_rows', { limit_count: 1 })
        // For now, we'll just grab one.
        .maybeSingle();

      // Get the first image from the array, or a fallback
      const imageKey = data?.images?.[0] || null;
      const imageUrl = imageKey
        ? toPublicStorageUrl("vehicles1", imageKey)
        : "/placeholder-vehicle.jpg";

      return {
        ...category,
        imageUrl,
      };
    }),
  );

  return (
    <section
      className={cn(
        `max-w-5xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148]
        rounded-2xl shadow-xl my-8 py-8 px-6 border border-blue-800/30`,
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mx-auto mb-8 space-y-2">
          <h2
            className="text-2xl md:text-3xl font-bold text-center
              text-white tracking-tight"
          >
            {cardsWithImages.length >= 2 ? (
              <>Also Available: {cardsWithImages[0]?.title || 'Other Options'} & {cardsWithImages[1]?.title || 'More Vehicles'}</>
            ) : (
              <>Explore Our Other Vehicle Options</>
            )}
          </h2>
          <p className="text-blue-100/80 text-sm text-center max-w-2xl mx-auto">
            Need something different? Click to view other vehicle options for {location?.city_name || 'this location'}.
          </p>
        </div>

        {/* 2-Column Grid - More Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cardsWithImages.map((card) => (
            <Link
              key={card.id}
              href={`${location ? `/locations/${location.state_slug}/${card.link}-${location.city_slug}` : `/${card.link}`}`}
              className="group relative h-full flex"
            >
              <div
                className="rounded-xl border-2 border-blue-800/40 bg-[#12244e]
                  overflow-hidden shadow-lg transition-all duration-300
                  hover:border-blue-500/60 hover:shadow-xl hover:scale-[1.02] flex flex-col w-full"
              >
                {/* Image Area - Smaller */}
                <div className="relative h-48 w-full bg-[#173264] flex-shrink-0">
                  <Image
                    src={card.imageUrl || "/placeholder-vehicle.jpg"}
                    alt={card.title || "Vehicle"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="h-full w-full object-cover
                      group-hover:scale-[1.05] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Labels - More Compact */}
                <div className="px-4 py-4 bg-gradient-to-b from-[#12244e] to-[#0f1f3d] flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white text-center mb-1 group-hover:text-blue-300 transition-colors">
                    {card.title || "Vehicle Option"}
                  </h3>
                  <p className="text-blue-200/80 text-sm text-center mb-3">
                    {card.description || "Explore our vehicle options for your transportation needs."}
                  </p>
                  <div className="mt-auto flex items-center justify-center gap-2 text-xs text-blue-300/60 group-hover:text-blue-300 transition-colors">
                    <span>View {card.title}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

type CardsWithImages = {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}[];

export function BackupOld2ColumnGrid(cardsWithImages: CardsWithImages) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
      {cardsWithImages.map((card) => (
        <Link
          key={card.id}
          href={card.link}
          className="group relative flex flex-col rounded-3xl isolate
            overflow-hidden bg-primary-foreground/5 border border-white/10
            shadow-2xl transition-transform duration-500 hover:-translate-y-2
            hover:shadow-3xl"
        >
          {/* Image Area */}
          <div className="relative aspect-[4/3] w-full overflow-hidden
            rounded-3xl">
            <Image
              src={card.imageUrl}
              alt={card.title}
              fill
              className="object-cover transition-transform duration-700
                group-hover:scale-105"
            />

            {/* Overlay gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/90
                via-black/20 to-transparent opacity-80"
            />

            {/* Top Label (Optional, matches 'Coach Bus' label in image) */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div
                className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full
                  text-sm font-bold tracking-wide uppercase text-white border
                  border-white/20"
              >
                {card.title}
              </div>
            </div>
          </div>

          {/* Text Content Area - Positioned at bottom or separate block? 
                  The image shows the text visually inside the blue block below the image. 
                  We'll create that structure. */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10
            text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              {card.title}
            </h3>
            <p className="text-primary-foreground/70 font-medium">
              {card.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
