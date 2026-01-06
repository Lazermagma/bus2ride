import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPollById(id: string) {
  const supabase = await createClient();
  const { data: poll, error } = await supabase
    .from("polls1")
    .select(`
      id,
      question,
      category_slug,
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

export default async function EmbedResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const poll = await getPollById(id);

  if (!poll) {
    notFound();
  }

  const options = poll.options || [];
  const totalVotes = options.reduce((sum: number, o: { vote_count?: number }) => sum + (o.vote_count || 0), 0);
  const sortedOptions = [...options].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  const topOption = sortedOptions[0];

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{poll.question} - Results | Bus2Ride Poll</title>
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
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, #f59e0b, #f97316);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          .question { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px; 
            line-height: 1.4; 
          }
          .option {
            margin-bottom: 12px;
          }
          .option-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            font-size: 14px;
          }
          .option-label {
            color: rgba(255, 255, 255, 0.8);
          }
          .option-label.winner {
            color: #10b981;
            font-weight: 600;
          }
          .option-percent {
            color: rgba(255, 255, 255, 0.5);
          }
          .option-percent.winner {
            color: #10b981;
          }
          .progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 4px;
            transition: width 0.3s ease;
          }
          .progress-fill.winner {
            background: linear-gradient(90deg, #10b981, #059669);
          }
          .total-votes {
            text-align: center;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
            margin-top: 16px;
          }
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
          <div className="badge">
            📊 Poll Results
          </div>
          <h1 className="question">{poll.question}</h1>
          
          <div>
            {sortedOptions.map((option: { id: string; label: string; vote_count?: number }) => {
              const percent = totalVotes > 0 ? Math.round(((option.vote_count || 0) / totalVotes) * 100) : 0;
              const isWinner = option.id === topOption?.id && totalVotes > 0;
              
              return (
                <div key={option.id} className="option">
                  <div className="option-header">
                    <span className={`option-label ${isWinner ? 'winner' : ''}`}>
                      {isWinner && '🏆 '}{option.label}
                    </span>
                    <span className={`option-percent ${isWinner ? 'winner' : ''}`}>{percent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${isWinner ? 'winner' : ''}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="total-votes">{totalVotes.toLocaleString()} total votes</p>
        </div>
      </body>
    </html>
  );
}

