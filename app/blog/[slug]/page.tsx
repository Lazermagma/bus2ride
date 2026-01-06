import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews, getReviewsCount } from "@/lib/data/reviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareArticleButton } from "@/components/ui/share-article-button";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/data/blog";
import FleetSection from "@/components/sections/fleet-section";
import Image from "next/image";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return pageMetadata({
      title: "Blog Post Not Found",
      description: "This article doesn’t exist or may have moved.",
      noIndex: true,
    });
  }

  const description = (post.excerpt ?? "").trim() || undefined;
  const thumbnailSrc =
    post.thumbnail_url && post.thumbnail_url.trim().length > 0
      ? toPublicStorageUrl("Blog", post.thumbnail_url)
      : null;

  return pageMetadata({
    title: post.title ?? "Blog",
    description,
    path: `/blog/${post.slug}`,
    openGraphImages: thumbnailSrc ? [thumbnailSrc] : undefined,
  });
}

const buildTopicTags = (slug: string) => {
  return slug
    .split("-")
    .filter(
      (segment) =>
        segment.length > 2 &&
        !["the", "and", "for", "with", "your", "you", "how"].includes(segment),
    )
    .slice(0, 3)
    .map((segment) => segment.replace(/[^a-z0-9]/gi, ""))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);

  if (!post) return notFound();

  const reviews = (await getReviews()) ?? [];
  const totalReviewsCount = (await getReviewsCount()) ?? 0;

  const tags = post.tags ?? buildTopicTags(post.slug);
  const date = new Date(post.published_at ?? "").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const thumbnailSrc =
    post.thumbnail_url && post.thumbnail_url.trim().length > 0
      ? toPublicStorageUrl("Blog", post.thumbnail_url)
      : null;

  return (
    <main>
      {/* Custom Hero for Blog Post */}
      <div
        className="relative overflow-hidden bg-[#0E1F46] py-20 text-white
          md:py-28"
      >
        <div className="absolute inset-0">
          {thumbnailSrc && (
            <Image
              src={thumbnailSrc}
              alt={post.title ?? "Blog post"}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-80"
            />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-b from-slate-950/75
              via-slate-950/55 to-[#0E1F46]"
          />
        </div>

        <div
          className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6
            lg:px-10"
        >
          <div
            className="mx-auto max-w-4xl rounded-[32px] border border-white/10
              bg-gradient-to-b from-slate-950/70 to-slate-900/70 p-8 text-center
              shadow-[0_25px_80px_rgba(2,8,23,0.55)] backdrop-blur-sm md:p-12"
          >
            <Badge
              variant="secondary"
              className="mb-6 rounded-full border border-white/15 bg-white/5
                px-4 py-1 text-sm font-semibold tracking-wide text-slate-100"
            >
              {tags[0] ?? "Post"}
            </Badge>

            <h1
              className="text-4xl font-bold tracking-tight text-white
                md:text-6xl"
            >
              {post.title}
            </h1>

            <div
              className="mt-6 flex items-center justify-center gap-6 text-sm
                text-white/70 md:text-base"
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-white/60" />
                {date}
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-white/60" />
                {post.author ?? "Author"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <article className="py-16 md:py-24 bg-[#0E1F46]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Back Link */}
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="pl-0 hover:pl-2 transition-all gap-2 text-white/70
                hover:text-white hover:bg-white/5"
            >
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4" /> Back to Blog
              </Link>
            </Button>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg prose-invert max-w-none text-justify
              prose-headings:font-bold prose-headings:tracking-tight
              prose-headings:text-white prose-p:text-slate-200
              prose-a:text-sky-300 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-hr:border-white/10
              prose-img:rounded-2xl prose-img:shadow-lg space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />

          {/* Tags & Share */}
          <div
            className="mt-12 pt-8 border-t border-white/10 flex flex-col
              sm:flex-row justify-between items-center gap-6"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full border border-white/15 bg-white/5 px-3
                    py-1 text-xs font-semibold tracking-wide text-slate-100"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <ShareArticleButton className="gap-2 rounded-full" />
          </div>
        </div>
      </article>

      <FleetSection />
      {/* <FleetList title="Related Vehicles" vehicles={fleet} /> */}

      <ReviewsSection reviews={reviews} totalCount={totalReviewsCount} />
      <PollsGrid
        columnCategories={["wine-tours", "brewery-tours", "entertainment-tours"]}
        hideCities
        title="Related Polls"
      />
      <ToolsGrid category="blog" />
      <FaqSection category="blog" title="Related FAQs" />
      <EventsGrid />
    </main>
  );
}
