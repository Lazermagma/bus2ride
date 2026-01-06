import { createClient } from "@/lib/supabase/server";
import { PollCard } from "@/components/sections/poll-card";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "edge";

async function getPollById(id: string) {
  const supabase = await createClient();
  const { data: poll, error } = await supabase
    .from("polls1")
    .select(`
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
    `)
    .eq("id", id)
    .order("ord", { referencedTable: "poll_options1", ascending: true })
    .single();

  if (error || !poll) {
    return null;
  }

  return poll;
}

export default async function EmbedPollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const poll = await getPollById(id);

  if (!poll) {
    notFound();
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{poll.question} | Bus2Ride Poll</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: system-ui, -apple-system, sans-serif;
            background: transparent;
            margin: 0;
            padding: 8px;
            min-height: auto;
            display: block;
            overflow: hidden;
          }
          .card {
            background: linear-gradient(135deg, rgba(39, 54, 89, 0.9), rgba(15, 23, 42, 0.95));
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            max-width: 500px;
            width: 100%;
            color: white;
            margin: 0 auto;
            box-sizing: border-box;
          }
          .question { font-size: 18px; font-weight: 600; margin-bottom: 16px; line-height: 1.4; }
          .option {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .option:hover { background: rgba(255, 255, 255, 0.1); }
        `}</style>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function sendHeight() {
                if (window.parent !== window) {
                  const height = document.documentElement.scrollHeight;
                  window.parent.postMessage({ type: 'poll-embed-height', height: height }, '*');
                }
              }
              sendHeight();
              window.addEventListener('resize', sendHeight);
              if (window.MutationObserver) {
                new MutationObserver(sendHeight).observe(document.body, { childList: true, subtree: true });
              }
            })();
          `
        }} />
      </head>
      <body>
        <div className="card">
          <PollCard poll={poll} noLoadSpinner showEmbed={false} />
        </div>
      </body>
    </html>
  );
}

