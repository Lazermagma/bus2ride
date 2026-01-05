import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { unstable_cache } from "next/cache";

// export const mockPolls: PollData[] = [
//   {
//     id: "1",
//     created_at: new Date().toISOString(),
//     question: "What is your favorite color?",
//     category: "general",
//     options: [
//       { id: "1-1", label: "Red" },
//       { id: "1-2", label: "Blue" },
//       { id: "1-3", label: "Green" },
//     ],
//     votes: { "1-1": 5, "1-2": 3, "1-3": 2 },
//   },
//   {
//     id: "2",
//     created_at: new Date().toISOString(),
//     question: "What is your favorite animal?",
//     category: "general",
//     options: [
//       { id: "2-1", label: "Dog" },
//       { id: "2-2", label: "Cat" },
//       { id: "2-3", label: "Bird" },
//     ],
//     votes: { "2-1": 4, "2-2": 6, "2-3": 1 },
//   },
//   {
//     id: "3",
//     created_at: new Date().toISOString(),
//     question: "What is your favorite sport?",
//     category: "sports",
//     options: [
//       { id: "3-1", label: "Football" },
//       { id: "3-2", label: "Basketball" },
//       { id: "3-3", label: "Tennis" },
//     ],
//     votes: { "3-1": 7, "3-2": 2, "3-3": 5 },
//   },
//   {
//     id: "4",
//     created_at: new Date().toISOString(),
//     question: "What is your favorite book?",
//     category: "literature",
//     options: [
//       { id: "4-1", label: "To Kill a Mockingbird" },
//       { id: "4-2", label: "1984" },
//       { id: "4-3", label: "Pride and Prejudice" },
//     ],
//     votes: { "4-1": 3, "4-2": 5, "4-3": 4 },
//   },
//   {
//     id: "5",
//     created_at: new Date().toISOString(),
//     question: "What is your favorite movie?",
//     category: "entertainment",
//     options: [
//       { id: "5-1", label: "The Shawshank Redemption" },
//       { id: "5-2", label: "The Godfather" },
//       { id: "5-3", label: "The Dark Knight" },
//     ],
//     votes: { "5-1": 6, "5-2": 4, "5-3": 7 },
//   },
//   {
//     id: "6",
//     created_at: new Date().toISOString(),
//     question: "What is your favourite city?",
//     category: "home",
//     options: [
//       { id: "6-1", label: "New York" },
//       { id: "6-2", label: "Los Angeles" },
//       { id: "6-3", label: "Chicago" },
//     ],
//     votes: { "6-1": 6, "6-2": 4, "6-3": 7 },
//   },
// ];

export const getPolls = cache(async (limit = 20, category = "") => {
  const supabase = await createClient();

  // We format the pattern here so it works with ILIKE in the SQL function
  const categoryPattern = `%${category}%`;

  const { data: polls, error } = await supabase
    .rpc("get_random_polls", {
      category_pattern: categoryPattern,
      limit_count: limit,
    })
    .select(
      `
        id,
        question,
        category_slug,
        category_data:poll_categories1 (
        name
        ),
        options:poll_options1 (
          id,
          label,
          vote_count,
          ord
        )
      `,
    )
    .order("ord", { referencedTable: "poll_options1", ascending: true })
    .limit(limit);

  if (error) {
    console.error("getPolls:", error);
    return null;
  }

  if (!polls) {
    console.warn("getPolls:", "No data found");
    return null;
  }

  return polls;
});

export const getPollsBySearch = cache(async (query: string, limit = 30) => {
  const q = (query ?? "").trim();
  if (!q) return getPolls(limit);

  const supabase = await createClient();
  const escaped = q.replace(/%/g, "\\%").replace(/_/g, "\\_");

  const { data: polls, error } = await supabase
    .from("polls1")
    .select(
      `
        id,
        question,
        category_slug,
        category_data:poll_categories1 (
          name
        ),
        options:poll_options1 (
          id,
          label,
          vote_count,
          ord
        )
      `,
    )
    .filter("question", "not.ilike", "Your opinion on%")
    .or(`question.ilike.%${escaped}%,category_slug.ilike.%${escaped}%`)
    .order("ord", { referencedTable: "poll_options1", ascending: true })
    .limit(limit);

  if (error) {
    console.error("getPollsBySearch:", error);
    return null;
  }

  if (!polls) {
    return [];
  }

  return polls;
});

const fetchPollsByCategory = async (category: string, limit: number) => {
  const supabase = await createClient();

  const { data: polls, error } = await supabase
    .from("polls1")
    .select(
      `
      id,
      question,
      category_slug,
      category_data:poll_categories1 (
        name
      ),
      options:poll_options1 (
        id,
        label,
        vote_count,
        ord
      )
    `,
    )
    .filter("question", "not.ilike", "Your opinion on%")
    .ilike("category_slug", `%${category}%`)
    .order("ord", { referencedTable: "poll_options1", ascending: true })
    .limit(limit);

  if (error) {
    console.error("getPollsByCategory:", error);
    return null;
  }

  if (!polls) {
    console.warn("getPollsByCategory:", "No data found");
    return null;
  }

  return polls;
};

export const getPollsByCategory = async (category: string = "", limit = 20) => {
  if (!category || category.trim() === "") {
    console.warn(
      "getPollsByCategory: No category provided, returning all polls",
    );
    return fetchPollsByCategory("", limit);
  }

  const getCachedPolls = unstable_cache(
    async () => fetchPollsByCategory(category, limit),
    [`polls-category-${category}-${limit}`],
    { revalidate: 60, tags: ["polls"] }
  );

  return getCachedPolls();
};
// POLLS RESULTS

// TODO: make both function take random polls
export const getPollResults = cache(async (limit = 90) => {
  const supabase = await createClient();

  // 1. Fetch data with the Relation
  const { data: polls, error } = await supabase
    .from("polls1")
    .select(
      `
      id,
      question,
      options:poll_options1 (
        id,
        label,
        vote_count
      )
    `,
    )
    .filter("question", "not.ilike", "Your opinion on%") // Ask to remove these later
    .limit(limit);

  if (error || !polls) {
    console.error("Error fetching poll results:", error);
    return [];
  }

  // 2. Map and Calculate Totals/Percentages
  const results = polls.map((poll) => {
    // A. Handle potential missing array
    // (TypeScript might warn if you don't cast, but Supabase returns an array here)
    const options = poll.options || [];

    // B. Calculate Total Votes dynamically
    const totalVotes = options.reduce(
      (sum, opt) => sum + (opt.vote_count || 0),
      0,
    );

    // C. Format Options with Percentage
    const optionsWithPercent = options.map((opt) => ({
      label: opt.label,
      percentage:
        totalVotes > 0
          ? Math.round(((opt.vote_count || 0) / totalVotes) * 100)
          : 0,
    }));

    return {
      id: poll.id,
      question: poll.question,
      total_votes: totalVotes,
      options: optionsWithPercent,
    } satisfies PollResultsData;
  });

  return results.sort(
    (a, b) =>
      b.total_votes - a.total_votes || a.question.localeCompare(b.question),
  );
});

export const getPollResultsByCategory = cache(
  async (category: string = "", limit = 90) => {
    // 1. Fetch data with the Relation
    const polls = await getPollsByCategory(category, limit);

    if (!polls) {
      return [];
    }

    // 2. Map and Calculate Totals/Percentages
    const results = polls.map((poll) => {
      // A. Handle potential missing array
      // (TypeScript might warn if you don't cast, but Supabase returns an array here)
      const options = poll.options || [];

      // B. Calculate Total Votes dynamically
      const totalVotes = options.reduce(
        (sum, opt) => sum + (opt.vote_count || 0),
        0,
      );

      // C. Format Options with Percentage
      const optionsWithPercent = options.map((opt) => ({
        label: opt.label,
        percentage:
          totalVotes > 0
            ? Math.round(((opt.vote_count || 0) / totalVotes) * 100)
            : 0,
      }));

      return {
        id: poll.id,
        question: poll.question,
        total_votes: totalVotes,
        options: optionsWithPercent,
      } satisfies PollResultsData;
    });

    return results.sort(
      (a, b) =>
        b.total_votes - a.total_votes || a.question.localeCompare(b.question),
    );
  },
);

export const getPollResultsHeaderData = cache(async () => {
  const supabase = await createClient();

  const { data: pollHeaderStats } = await supabase
    .from("poll_header_stats")
    .select("*")
    .single();

  return pollHeaderStats;
});

export const getPollsByLocation = cache(
  async (cityName: string, limit = 30) => {
    if (!cityName || cityName.trim() === "") {
      return null;
    }

    const supabase = await createClient();
    const escaped = cityName.trim().replace(/%/g, "\\%").replace(/_/g, "\\_");

    const { data: polls, error } = await supabase
      .from("polls1")
      .select(
        `
        id,
        question,
        category_slug,
        category_data:poll_categories1 (
          name
        ),
        options:poll_options1 (
          id,
          label,
          vote_count,
          ord
        )
      `,
      )
      .filter("question", "not.ilike", "Your opinion on%")
      .ilike("question", `%${escaped}%`)
      .order("ord", { referencedTable: "poll_options1", ascending: true })
      .limit(limit);

    if (error) {
      console.error("getPollsByLocation:", error);
      return null;
    }

    return polls ?? [];
  },
);

export type PollWithOptions = NonNullable<
  Awaited<ReturnType<typeof getPolls>>
>[number];

export type PollResultsData = {
  id: string;
  question: string;
  total_votes: number;
  options: { label: string; percentage: number }[];
};

export interface PollCategoryStats {
  totalVotes: number;
  totalQuestions: number;
}

export const getPollStatsByCategories = async (
  categories: string[]
): Promise<PollCategoryStats> => {
  const supabase = await createClient();

  // Build filter for categories
  const categoryFilters = categories
    .filter((c) => c && c.trim() !== "")
    .map((c) => `category_slug.ilike.%${c.trim()}%`);

  // If no valid categories, get all polls
  let pollsQuery = supabase
    .from("polls1")
    .select(
      `
      id,
      options:poll_options1 (
        vote_count
      )
    `
    )
    .filter("question", "not.ilike", "Your opinion on%");

  if (categoryFilters.length > 0) {
    pollsQuery = pollsQuery.or(categoryFilters.join(","));
  }

  const { data: polls, error } = await pollsQuery;

  if (error) {
    console.error("getPollStatsByCategories:", error);
    return { totalVotes: 0, totalQuestions: 0 };
  }

  if (!polls) {
    return { totalVotes: 0, totalQuestions: 0 };
  }

  // Calculate total votes from all options
  const totalVotes = polls.reduce((sum, poll) => {
    const pollVotes = (poll.options || []).reduce(
      (pollSum, opt) => pollSum + (opt.vote_count || 0),
      0
    );
    return sum + pollVotes;
  }, 0);

  const totalQuestions = polls.length;

  return { totalVotes, totalQuestions };
};