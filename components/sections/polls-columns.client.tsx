"use client";

import * as React from "react";
import { PollCard } from "./poll-card";
import type { PollWithOptions } from "@/lib/data/polls";

export function PollsColumnsClient({
  columns,
  columnTitles,
}: {
  columns: PollWithOptions[][];
  columnTitles?: string[];
}) {
  const columnRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [scrollMeta, setScrollMeta] = React.useState<
    Record<
      number,
      { scrollTop: number; scrollHeight: number; clientHeight: number }
    >
  >({});

  const dragRef = React.useRef<{
    colIdx: number;
    trackTop: number;
    trackHeight: number;
    thumbHeight: number;
    maxScroll: number;
    pointerOffsetInThumb: number;
  } | null>(null);

  const scrollToNext = React.useCallback(
    (columnIndex: number, pollIndex: number) => {
      const container = columnRefs.current[columnIndex];
      if (!container) return;

      const current = container.querySelector<HTMLElement>(
        `[data-poll-index="${pollIndex}"]`,
      );
      const next = current?.nextElementSibling as HTMLElement | null;
      if (!next) return;

      // Scroll ONLY the column container (avoid scrolling the whole page).
      // Use bounding rect math so we scroll to the *next poll* accurately.
      const containerRect = container.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const delta = nextRect.top - containerRect.top;
      const targetTop = container.scrollTop + delta;
      container.scrollTo({ top: targetTop, behavior: "smooth" });
    },
    [],
  );

  const updateScrollMeta = React.useCallback((colIdx: number) => {
    const el = columnRefs.current[colIdx];
    if (!el) return;
    setScrollMeta((prev) => ({
      ...prev,
      [colIdx]: {
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      },
    }));
  }, []);

  React.useEffect(() => {
    // Prime sizes after mount; also keep thumb correct on resize.
    const onResize = () => {
      columns.forEach((_, colIdx) => updateScrollMeta(colIdx));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [columns, updateScrollMeta]);

  React.useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const container = columnRefs.current[drag.colIdx];
      if (!container) return;

      const relativeY = e.clientY - drag.trackTop;
      const desiredThumbTop = relativeY - drag.pointerOffsetInThumb;
      const maxThumbTop = Math.max(0, drag.trackHeight - drag.thumbHeight);
      const clampedThumbTop = Math.max(
        0,
        Math.min(desiredThumbTop, maxThumbTop),
      );
      const fraction = maxThumbTop > 0 ? clampedThumbTop / maxThumbTop : 0;
      container.scrollTop = fraction * drag.maxScroll;
      updateScrollMeta(drag.colIdx);
    };

    const onPointerUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [updateScrollMeta]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
      {columns.map((col, colIdx) => (
        <div key={colIdx}>
          {!!columnTitles?.[colIdx] && (
            <div className="mb-3">
              <p
                className="text-lg md:text-2xl animate-pulse font-semibold  tracking-normal md:tracking-normal
                  text-white"
              >
                {columnTitles[colIdx]}
              </p>
            </div>
          )}
          <div className="relative">
            <div
              id={`polls-column-${colIdx}`}
              ref={(el) => {
                columnRefs.current[colIdx] = el;
              }}
              onScroll={() => updateScrollMeta(colIdx)}
              className="h-[500px] md:h-[675px] overflow-y-scroll snap-y snap-mandatory
                rounded-3xl
                polls-column-scroll"
            >
              {col.map((poll, idx) => (
                <div
                  key={`${poll.id}-${idx}`}
                  data-poll-index={idx}
                  className="h-[400px] md:h-[450px] snap-start snap-always py-3"
                >

                  <PollCard
                    poll={poll}

                  />
                </div>
              ))}
            </div>

            {/* Custom scrollbar (native scrollbar hidden via CSS) */}
            {(() => {
              const meta = scrollMeta[colIdx];
              if (!meta) return null;

              const trackPadding = 10;
              const trackHeight = Math.max(
                0,
                meta.clientHeight - trackPadding * 2,
              );
              const maxScroll = Math.max(
                1,
                meta.scrollHeight - meta.clientHeight,
              );
              const thumbHeight = Math.max(
                28,
                Math.round(
                  (meta.clientHeight / meta.scrollHeight) * trackHeight,
                ),
              );
              const thumbTop =
                trackPadding +
                Math.round(
                  (meta.scrollTop / maxScroll) * (trackHeight - thumbHeight),
                );

              const onTrackPointerDown = (
                e: React.PointerEvent<HTMLDivElement>,
              ) => {
                const container = columnRefs.current[colIdx];
                if (!container) return;

                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const innerY = Math.max(
                  0,
                  Math.min(clickY - trackPadding, trackHeight),
                );
                const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
                const desiredThumbTop = Math.max(
                  0,
                  Math.min(innerY - thumbHeight / 2, maxThumbTop),
                );
                const fraction =
                  maxThumbTop > 0 ? desiredThumbTop / maxThumbTop : 0;
                container.scrollTo({
                  top: fraction * maxScroll,
                  behavior: "smooth",
                });
              };

              const onThumbPointerDown = (
                e: React.PointerEvent<HTMLDivElement>,
              ) => {
                const container = columnRefs.current[colIdx];
                if (!container) return;

                // Prevent selecting text while dragging.
                e.preventDefault();

                const trackEl = e.currentTarget.parentElement;
                if (!trackEl) return;

                const trackRect = trackEl.getBoundingClientRect();
                const pointerOffsetInThumb =
                  e.clientY - trackRect.top - thumbTop;

                dragRef.current = {
                  colIdx,
                  trackTop: trackRect.top + trackPadding,
                  trackHeight,
                  thumbHeight,
                  maxScroll,
                  pointerOffsetInThumb,
                };

                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                  // no-op
                }
              };

              return (
                <div
                  className="absolute right-3 top-3 bottom-3 w-2 rounded-full bg-white/10 cursor-pointer"
                  role="scrollbar"
                  aria-controls={`polls-column-${colIdx}`}
                  aria-orientation="vertical"
                  aria-valuemin={0}
                  aria-valuemax={maxScroll}
                  aria-valuenow={meta.scrollTop}
                  onPointerDown={onTrackPointerDown}
                >
                  <div
                    className="absolute left-0 right-0 rounded-full bg-white/40 cursor-grab active:cursor-grabbing"
                    style={{ height: `${thumbHeight}px`, top: `${thumbTop}px` }}
                    onPointerDown={onThumbPointerDown}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}
