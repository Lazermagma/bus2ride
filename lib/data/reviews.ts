import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { unstable_cache } from "next/cache";

export const mockReviews = [
  {
    id: "id-101",
    author_display: "John Doe", // author
    body: "Great service and friendly staff!", // body
    rating: 5,
    tags: ["wedding", "party"], // tags
    service_date: "2024-06-15", // service_date
    source: "customer", // source
    source_id: "source-id-101",
    source_url: "https://example.com/review-101",
    slug: "review-101",
    event_slug: "wedding",
    city_slug: "new-york",
    state_slug: "ny",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "id-102",
    author_display: "Sarah Miller",
    body: "Amazing experience for my bachelorette party! The driver was professional and courteous.",
    rating: 5,
    tags: ["bachelorette", "party-bus"],
    service_date: "2024-07-22",
    source: "google",
    source_id: "source-id-102",
    source_url: "https://example.com/review-102",
    slug: "review-102",
    event_slug: "bachelorette",
    city_slug: "los-angeles",
    state_slug: "ca",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "id-103",
    author_display: "Michael Chen",
    body: "Fantastic limo for our anniversary celebration. Clean, luxurious, and the staff exceeded expectations!",
    rating: 5,
    tags: ["anniversary", "limo"],
    service_date: "2024-05-10",
    source: "yelp",
    source_id: "source-id-103",
    source_url: "https://example.com/review-103",
    slug: "review-103",
    event_slug: "anniversary",
    city_slug: "miami",
    state_slug: "fl",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "id-104",
    author_display: "Emily Rodriguez",
    body: "Perfect for our Vegas trip! Comfortable rides, great music system, and the best driver ever.",
    rating: 5,
    tags: ["vegas", "party-bus"],
    service_date: "2024-08-03",
    source: "customer",
    source_id: "source-id-104",
    source_url: "https://example.com/review-104",
    slug: "review-104",
    event_slug: "birthday",
    city_slug: "las-vegas",
    state_slug: "nv",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "id-105",
    author_display: "James Wilson",
    body: "Used for our corporate event. Professional service, punctuality was excellent, and everyone loved it!",
    rating: 4,
    tags: ["corporate", "coach"],
    service_date: "2024-07-18",
    source: "google",
    source_id: "source-id-105",
    source_url: "https://example.com/review-105",
    slug: "review-105",
    event_slug: "corporate",
    city_slug: "chicago",
    state_slug: "il",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "id-106",
    author_display: "Jessica Taylor",
    body: "Wonderful service for our bachelorette weekend! Spacious, clean, and the bartender made amazing cocktails.",
    rating: 5,
    tags: ["bachelorette", "party-bus"],
    service_date: "2024-06-30",
    source: "facebook",
    source_id: "source-id-106",
    source_url: "https://example.com/review-106",
    slug: "review-106",
    event_slug: "bachelorette",
    city_slug: "austin",
    state_slug: "tx",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "id-107",
    author_display: "David Anderson",
    body: "Excellent transportation for our wedding. Punctual, elegant, and the driver was so accommodating with stops!",
    rating: 5,
    tags: ["wedding", "limo"],
    service_date: "2024-09-15",
    source: "wedding-site",
    source_id: "source-id-107",
    source_url: "https://example.com/review-107",
    slug: "review-107",
    event_slug: "wedding",
    city_slug: "denver",
    state_slug: "co",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "id-108",
    author_display: "Lisa Thompson",
    body: "Perfect bachelor party setup! The LED lights, sound system, and party atmosphere were incredible!",
    rating: 5,
    tags: ["bachelor", "party-bus"],
    service_date: "2024-08-12",
    source: "customer",
    source_id: "source-id-108",
    source_url: "https://example.com/review-108",
    slug: "review-108",
    event_slug: "bachelor",
    city_slug: "new-orleans",
    state_slug: "la",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: "id-109",
    author_display: "Robert Martinez",
    body: "Professional and reliable. Used them for airport shuttle service and they were on time every single time.",
    rating: 4,
    tags: ["punctuality", "driver"],
    service_date: "2024-08-05",
    source: "google",
    source_id: "source-id-109",
    source_url: "https://example.com/review-109",
    slug: "review-109",
    event_slug: "airport",
    city_slug: "boston",
    state_slug: "ma",
    created_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
];

const fetchReviews = async (limit: number) => {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .order("service_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getReviews:", error);
    return null;
  }

  if (!reviews) {
    console.warn("getReviews:", "No data found");
    return null;
  }

  return reviews;
};

export const getReviews = async (limit = 9) => {
  const getCachedReviews = unstable_cache(
    async () => fetchReviews(limit),
    [`reviews-${limit}`],
    { revalidate: 300, tags: ["reviews"] }
  );
  return getCachedReviews();
};

export const getReviewsCount = async () => {
  const getCachedCount = unstable_cache(
    async () => {
      const supabase = await createClient();
      
      const { count, error } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("getReviewsCount:", error);
        return null;
      }

      return count ?? 0;
    },
    ["reviews-count"],
    { revalidate: 300, tags: ["reviews"] }
  );
  return getCachedCount();
};

export type ReviewsData = NonNullable<
  Awaited<ReturnType<typeof getReviews>>
>[number];
