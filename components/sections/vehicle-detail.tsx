"use client";

import { toPublicStorageUrl } from "@/lib/helpers/storage";
import * as React from "react";
// import { Check, Users, Clock, DollarSign } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { VehicleData } from "@/lib/data/vehicles";
import { openLiveChat } from "@/lib/livechat";

export function VehicleDetail({ vehicle }: { vehicle: VehicleData }) {
  // const [activeImage, setActiveImage] = React.useState(0);

  // const images = React.useMemo(() => {
  //   return (vehicle.images || []).map((key) =>
  //     toPublicStorageUrl("vehicles1", key),
  //   );
  // }, [vehicle.images]);

  // const currentImage = images[activeImage] || "/placeholder-vehicle.jpg";

  const linkToSameTypeFleetPage = React.useMemo(() => {
    switch (vehicle.type) {
      case "limo":
        return "limousines";
      case "party-bus":
        return "party-buses";
      case "coach":
        return "coach-buses";
      default:
        return "";
    }
  }, [vehicle.type]);

  const featuredName = React.useMemo(() => {
    switch (vehicle.type) {
      case "limo":
        return "Limo";
      case "party-bus":
        return "Party Bus";
      case "coach":
        return "Coach Bus";
      default:
        return "Vehicle";
    }
  }, [vehicle.type]);

  const peopleNumber = React.useMemo(() => {
    if (!vehicle.capacity) return "N/A";
    const pax = parseInt(vehicle.capacity.replace("pax", ""), 10);
    if (isNaN(pax)) return "N/A";
    if (pax <= 10) return "8-9";
    if (pax <= 20) return "15-18";
    if (pax <= 30) return "25-28";
    if (pax <= 40) return "35-38";
    return "40+";
  }, [vehicle.capacity]);

  const bottomInfoItems = React.useMemo(
    () => [
      {
        key: "chauffeur",
        box_title: "Chauffeur included",
        box_description: "Professional pickup + timing",

        title: "Who drives?",
        description:
          "A vetted chauffeur — not a gig driver — who coordinates arrivals, communicates ETA updates, and helps with doors + photos.",
        bullets: [
          "Chauffeurs know hotel + venue load-ins",
          "Early arrival + route checks",
          "Dress code matched to your event",
        ],
      },
      {
        key: "best-fit",
        box_title: `Best fit: ${peopleNumber}`,
        box_description: "Comfort + formalwear space",
        title: "What size should we book?",
        description: `Seats are one thing — comfort is another. For photos, bags, and elbow room, ${peopleNumber} typically rides best.`,
        bullets: [
          "If you’re close to max capacity, size up",
          "Formalwear + bags reduce usable space",
          "Tell us headcount + stops for a quick recommendation",
        ],
      },
      {
        key: "photo-friendly",
        box_title: "Photo-friendly white",
        box_description: "Clean days + night shots",

        title: "Is white better for photos?",
        description:
          "White exteriors + interior lighting read better in photos and video — especially for weddings and prom.",
        bullets: [
          "Cleaner shots in daylight and at night",
          "LED interiors help group photos",
          "Share your photo stops + timing window",
        ],
      },
    ],
    [peopleNumber],
  );

  const commonBookingItems = React.useMemo(
    () => [
      {
        key: "wedding-flow",
        box_title: "Wedding flow",
        box_description: "Ceremony → photos → reception",

        title: "Wedding: ceremony → photos → reception",
        description:
          "We coordinate timing so you’re not waiting around in formalwear — and you still get the shots you want.",
        bullets: [
          "Early arrival + venue load-in awareness",
          "Photo stops + buffer time baked in",
          "Clear pickup windows for every leg",
        ],
        triggerClassName:
          "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-300/50",
        titleClassName: "text-emerald-200/90",
      },
      {
        key: "prom-homecoming",
        box_title: "Prom / homecoming",
        box_description: "Photos + dinner + drop-off",
        title: "Prom: photos + safe pickup plan",
        description:
          "Parents love this option. We coordinate the timing so the group stays together.",
        bullets: [
          "Photo meetup location + pickup window",
          "Clear drop-off + return timing",
          "Professional chauffeur (no chaos)",
        ],
        triggerClassName:
          "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-sky-300/50",
        titleClassName: "text-sky-200/90",
      },
      {
        key: "airport-vip",
        box_title: "Airport VIP",
        box_description: "Pickup + luggage notes + smooth exit",
        title: "Airport VIP: smooth pickup + luggage notes",
        description:
          "We'll confirm terminal details, timing, and baggage needs so the exit is clean and stress-free.",
        bullets: [
          "Terminal + flight timing confirmed",
          "Luggage capacity notes upfront",
          "Direct pickup communication",
        ],
        triggerClassName:
          "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-white/30",
        titleClassName: "text-white/70",
      },
    ],
    [],
  );

  const vehicleTypeDescription = {
    limo: "A clean white stretch for weddings, date nights, airport VIP runs, and small-group celebrations. Big presence — without paying for a 30-40 passenger bus you won&apos;t fill.",
    "party-bus":
      "spacious party buses designed for lively celebrations and group outings.",
    coach:
      "comfortable coach buses ideal for large groups and long-distance travel.",
    default: "A premium vehicle for your special occasion.",
  };

  const imagesInfo = React.useMemo(() => {
    const exteriorImg = vehicle.images?.find((img) =>
      /exterior/i.test(img.toLowerCase()),
    );
    const interiorImg = vehicle.images?.find((img) =>
      /interior/i.test(img.toLowerCase()),
    );

    const imagesInfo = {
      exterior_img: {
        alt: "Vehicle exterior view",
        url: exteriorImg
          ? toPublicStorageUrl("vehicles1", exteriorImg)
          : undefined,
      },
      interior_img: {
        alt: "Vehicle interior view",
        url: interiorImg
          ? toPublicStorageUrl("vehicles1", interiorImg)
          : undefined,
      },
    };

    switch (vehicle.type) {
      case "limo":
        return {
          labels: {
            exterior: "White stretch, clean photos",
            interior: "LED ceiling + perimeter seating",
          },
          images: imagesInfo,
        };
      case "party-bus":
        return {
          labels: {
            exterior: "White stretch, clean photos",
            interior: "LED ceiling + perimeter seating",
          },
          images: imagesInfo,
        };
      case "coach":
        return {
          labels: {
            exterior: "White stretch, clean photos",
            interior: "LED ceiling + perimeter seating",
          },
          images: imagesInfo,
        };
      default:
        return {
          labels: {
            exterior: "White stretch, clean photos",
            interior: "LED ceiling + perimeter seating",
          },
          images: null,
        };
    }
  }, [vehicle]);

  const galleryImages = React.useMemo(() => {
    const keys = (vehicle.images ?? []).filter(Boolean);
    return keys.map((key) => ({
      key,
      url: toPublicStorageUrl("vehicles1", key),
    }));
  }, [vehicle.images]);

  const exteriorIndex = React.useMemo(() => {
    if (!vehicle.images || vehicle.images.length === 0) return 0;
    const exteriorKey = vehicle.images.find((img) => /exterior/i.test(img));
    if (!exteriorKey) return 0;
    const idx = vehicle.images.indexOf(exteriorKey);
    return idx >= 0 ? idx : 0;
  }, [vehicle.images]);

  const interiorIndex = React.useMemo(() => {
    if (!vehicle.images || vehicle.images.length === 0) return 0;
    const interiorKey = vehicle.images.find((img) => /interior/i.test(img));
    if (!interiorKey) return 0;
    const idx = vehicle.images.indexOf(interiorKey);
    return idx >= 0 ? idx : 0;
  }, [vehicle.images]);

  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [galleryIndex, setGalleryIndex] = React.useState(0);

  const openGalleryAt = React.useCallback(
    (index: number) => {
      if (!galleryImages.length) return;
      const safeIndex = Math.min(
        Math.max(index, 0),
        Math.max(galleryImages.length - 1, 0),
      );
      setGalleryIndex(safeIndex);
      setIsGalleryOpen(true);
    },
    [galleryImages.length],
  );

  const showPrev = React.useCallback(() => {
    setGalleryIndex((prev) => {
      if (!galleryImages.length) return 0;
      return (prev - 1 + galleryImages.length) % galleryImages.length;
    });
  }, [galleryImages.length]);

  const showNext = React.useCallback(() => {
    setGalleryIndex((prev) => {
      if (!galleryImages.length) return 0;
      return (prev + 1) % galleryImages.length;
    });
  }, [galleryImages.length]);

  React.useEffect(() => {
    if (!isGalleryOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGalleryOpen, showNext, showPrev]);

  return (
    <section
      className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-24 pt-8 md:pt-10
        lg:px-6"
    >
      <div
        className="rounded-3xl border border-white/10 bg-gradient-to-br
          from-slate-900/80 via-slate-950 to-slate-900/70 p-6
          shadow-[0_30px_80px_rgba(2,6,23,0.55)]"
      >
        <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr] lg:items-start">
          {/* 1. Vehicle info Area */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-2 rounded-full border
                  border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-xs
                  font-semibold uppercase tracking-[0.22em] text-emerald-200"
              >
                Featured {featuredName} • 24/7 booking
              </span>
              <span
                className="inline-flex items-center gap-2 rounded-full border
                  border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold
                  uppercase tracking-[0.22em] text-white/70"
              >
                Seats {vehicle.capacity?.replace("pax", "")} • Sweet spot{" "}
                {peopleNumber}
              </span>
            </div>
            <h1
              className="text-4xl font-extrabold tracking-tight sm:text-5xl
                text-white"
            >
              {vehicle.name}
            </h1>
            <p className="max-w-3xl text-slate-200">
              {vehicle.description ??
                vehicleTypeDescription[vehicle.type ?? "default"]}
            </p>
            {/* Vehicle Image Container */}
            <div
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-4"
            >
              {/* Main Image */}
              <button
                type="button"
                onClick={() => openGalleryAt(exteriorIndex)}
                className="group relative block w-full overflow-hidden
                  rounded-3xl border border-white/10 bg-black/30
                  focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <div className="relative aspect-[16/9] w-full">
                  {imagesInfo.images?.exterior_img.url && (
                    <Image
                      alt={imagesInfo.images?.exterior_img.alt}
                      src={imagesInfo.images?.exterior_img.url}
                      fill
                      priority
                      className="object-cover transition duration-500
                        group-hover:scale-[1.02]"
                    />
                  )}
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60
                    via-black/20 to-transparent"
                />
                <div
                  className="absolute inset-x-0 bottom-0 flex items-center
                    justify-between px-4 pb-3 text-xs text-white/85"
                >
                  <span
                    className="rounded-full border border-emerald-300/40
                      bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase
                      tracking-[0.22em] text-emerald-100"
                  >
                    Tap to zoom + swipe →
                  </span>
                  <span className="text-white/70">Exterior • 4K</span>
                </div>
              </button>

              {/* 2 Images Gallery */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => openGalleryAt(exteriorIndex)}
                  className="group relative overflow-hidden rounded-2xl border
                    border-white/10 bg-white/5 p-2 text-left transition
                    hover:border-emerald-300/50 focus:outline-none focus:ring-2
                    focus:ring-emerald-400"
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    {imagesInfo.images?.exterior_img.url && (
                      <Image
                        alt={imagesInfo.images?.exterior_img.alt}
                        src={imagesInfo.images?.exterior_img.url}
                        fill
                        priority
                        className="object-cover transition duration-500
                          group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                  <p
                    className="mt-2 text-xs font-semibold uppercase
                      tracking-[0.22em] text-white/70"
                  >
                    Exterior
                  </p>
                  <p className="text-sm text-white/85">
                    {imagesInfo.labels.exterior}
                  </p>
                  <p className="mt-1 text-xs text-emerald-200/90">
                    Tap for details →
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => openGalleryAt(interiorIndex)}
                  className="group relative overflow-hidden rounded-2xl border
                    border-white/10 bg-white/5 p-2 text-left transition
                    hover:border-sky-300/50 focus:outline-none focus:ring-2
                    focus:ring-sky-400"
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    {imagesInfo.images?.interior_img.url && (
                      <Image
                        alt={imagesInfo.images?.interior_img.alt}
                        src={imagesInfo.images?.interior_img.url}
                        fill
                        priority
                        className="object-cover transition duration-500
                          group-hover:scale-[1.02]"
                      />
                    )}
                  </div>

                  <p
                    className="mt-2 text-xs font-semibold uppercase
                      tracking-[0.22em] text-white/70"
                  >
                    Interior
                  </p>
                  <p className="text-sm text-white/85">
                    {imagesInfo.labels.interior}
                  </p>
                  <p className="mt-1 text-xs text-sky-200/90">
                    Tap for details →
                  </p>
                </button>
              </div>
            </div>

            {/* Gallery Modal */}
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
              <DialogContent
                showCloseButton={false}
                className="md:max-w-5xl max-w-2xl border-0 bg-transparent p-0
                  shadow-none"
              >
                <VisuallyHidden.Root>
                  <DialogTitle>
                    {vehicle.name} - Photo Gallery
                  </DialogTitle>
                </VisuallyHidden.Root>
                <div
                  className="relative overflow-hidden rounded-3xl border
                    border-white/10 bg-slate-950/90 shadow-2xl"
                >
                  <div className="relative aspect-[16/9] w-full">
                    {galleryImages[galleryIndex]?.url && (
                      <Image
                        src={galleryImages[galleryIndex].url}
                        alt={`${vehicle.name} photo ${galleryIndex + 1}`}
                        fill
                        priority
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Prev/Next */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={showPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 flex
                          h-12 w-12 items-center justify-center rounded-full
                          border border-white/20 bg-black/40 text-white/90
                          hover:border-white/40"
                        aria-label="Previous image"
                      >
                        <span aria-hidden="true">←</span>
                      </button>
                      <button
                        type="button"
                        onClick={showNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2
                          flex h-12 w-12 items-center justify-center
                          rounded-full border border-white/20 bg-black/40
                          text-white/90 hover:border-white/40"
                        aria-label="Next image"
                      >
                        <span aria-hidden="true">→</span>
                      </button>
                    </>
                  )}

                  {/* Close */}
                  <div className="absolute bottom-4 right-4">
                    <DialogClose asChild>
                      <button
                        type="button"
                        className="rounded-full border border-white/20
                          bg-black/30 px-5 py-2 text-sm font-semibold
                          text-white/90 hover:border-white/40"
                      >
                        Close ×
                      </button>
                    </DialogClose>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Vehicle Details in buttons and tags */}
            <div className="grid gap-4 pt-1 lg:items-start">
              {/* Buttons and tags */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openLiveChat(`Vehicle Detail - ${vehicle.name}`, `/vehicles/${vehicle.slug}`)}
                  className="group relative overflow-hidden rounded-full px-7
                    py-3 text-sm font-semibold uppercase tracking-[0.22em]
                    text-slate-950 shadow-lg transition hover:-translate-y-0.5 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(52,211,153,1) 0%, rgba(34,197,94,1) 50%, rgba(16,185,129,1) 100%)",
                  }}
                >
                  <span className="relative z-10">Start my quote</span>
                  <span className="relative z-10 ml-2">→</span>
                  <span
                    className="absolute inset-0 opacity-0 transition
                      group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.25), transparent 55%)",
                    }}
                  ></span>
                </button>
                <button
                  className="rounded-full border border-sky-300/30 bg-sky-500/10
                    px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em]
                    text-sky-100 transition hover:border-sky-300/60"
                >
                  See the process
                </button>
                <div
                  className="flex flex-wrap gap-2 text-[11px] font-semibold
                    uppercase tracking-[0.18em] text-white/70"
                >
                  <span
                    className="rounded-full border border-white/15 bg-white/5
                      px-3 py-1"
                  >
                    Best comfort: {peopleNumber}
                  </span>
                  <span
                    className="rounded-full border border-white/15 bg-white/5
                      px-3 py-1"
                  >
                    Events: Wedding / Prom
                  </span>
                  <span
                    className="rounded-full border border-white/15 bg-white/5
                      px-3 py-1"
                  >
                    Call: (888) 535-2566
                  </span>
                </div>
              </div>

              {/* Compare */}
              <div
                className="rounded-3xl border border-white/10 bg-white/5 p-4
                  text-sm text-white/80"
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.28em]
                    text-white/60"
                >
                  Quick compare
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex justify-between">
                    <span>Max headcount</span>{" "}
                    <span className="text-white">18-20 (H2)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Best comfort</span>{" "}
                    <span className="text-white">8-12 (300s)</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Roof height</span>{" "}
                    <span className="text-white">Standard sedan</span>
                  </li>
                </ul>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/${linkToSameTypeFleetPage}`}
                    className="rounded-full border border-white/20 px-4 py-2
                      text-xs font-semibold text-white/80 hover:border-white/50"
                  >
                    Compare fleet{" "}
                  </Link>

                  <button
                    onClick={() => openLiveChat(`Vehicle Detail - Ask Sizing - ${vehicle.name}`, `/vehicles/${vehicle.slug}`)}
                    className="rounded-full bg-emerald-400 px-4 py-2 text-xs
                      font-semibold uppercase tracking-[0.18em] text-slate-950
                      hover:-translate-y-0.5 cursor-pointer"
                  >
                    Ask sizing →
                  </button>
                </div>
              </div>
            </div>

            {/* Bullet points */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Col 1 */}
              <div
                className="rounded-3xl border border-white/10 bg-slate-900/60
                  p-4"
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.28em]
                    text-white/60"
                >
                  What&apos;s included
                </p>

                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  <li className="flex gap-2">
                    <span aria-hidden="true">*</span>
                    <span>Chauffeur + arrival coordination</span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden="true">*</span>
                    <span>Multi-stop routing (bars / photos / venues)</span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden="true">*</span>
                    <span>Clean itinerary + timing buffers</span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden="true">*</span>
                    <span>Door assist + staging for photos</span>
                  </li>
                </ul>

                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="mt-4 w-full rounded-2xl border
                        border-emerald-300/30 bg-emerald-400/10 px-4 py-3
                        text-sm font-semibold text-emerald-100
                        hover:border-emerald-300/60"
                    >
                      See what&apos;s included →
                    </button>
                  </DialogTrigger>

                  <DialogContent
                    showCloseButton={false}
                    className="w-full max-w-xl rounded-3xl border
                      border-white/10 bg-slate-950/90 p-6 text-white shadow-2xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className="text-xs uppercase tracking-[0.35em]
                            text-white/60"
                        >
                          More info
                        </p>
                        <DialogTitle
                          className="mt-2 text-2xl font-semibold text-white"
                        >
                          What&apos;s included (quick)
                        </DialogTitle>
                        <DialogDescription
                          className="mt-2 text-sm text-white/80"
                        >
                          This is the right-size luxury package: a vetted
                          chauffeur, timing buffers, and coordination so you
                          don&apos;t babysit the ride.
                        </DialogDescription>

                        <ul className="mt-4 space-y-2 text-sm text-white/85">
                          <li className="flex gap-2">
                            <span aria-hidden="true">•</span>
                            <span>Chauffeur + route checks</span>
                          </li>
                          <li className="flex gap-2">
                            <span aria-hidden="true">•</span>
                            <span>Stops + buffer planning</span>
                          </li>
                          <li className="flex gap-2">
                            <span aria-hidden="true">•</span>
                            <span>Arrival notes for venues/hotels</span>
                          </li>
                          <li className="flex gap-2">
                            <span aria-hidden="true">•</span>
                            <span>Door assist for photos &amp; formalwear</span>
                          </li>
                        </ul>

                        <div className="mt-8">
                          <Button
                            onClick={() => openLiveChat(`Vehicle Detail - What's Included - ${vehicle.name}`, `/vehicles/${vehicle.slug}`)}
                            className="rounded-full bg-emerald-400 px-7 py-6
                              text-base font-semibold text-slate-950
                              hover:bg-emerald-300 cursor-pointer"
                          >
                            Start my quote
                          </Button>
                        </div>
                      </div>

                      <DialogClose asChild>
                        <button
                          type="button"
                          className="shrink-0 rounded-full border
                            border-white/20 px-5 py-2 text-sm text-white/80
                            hover:border-white/50"
                        >
                          Close
                        </button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Col 2 */}
              <div
                className="rounded-3xl border border-white/10 bg-slate-900/60
                  p-4"
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.28em]
                    text-white/60"
                >
                  Perfect if you...
                </p>

                <div className="mt-3 space-y-3">
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5
                      p-3"
                  >
                    <p className="text-sm font-semibold text-white">
                      Have {peopleNumber} people
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      You want luxury without paying for unused seats.
                    </p>
                  </div>
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5
                      p-3"
                  >
                    <p className="text-sm font-semibold text-white">
                      Care about photos
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      White exterior + LEDs = cleaner shots day/night.
                    </p>
                  </div>
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5
                      p-3"
                  >
                    <p className="text-sm font-semibold text-white">
                      Need timing to just work
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      We build buffers so the schedule doesn&apos;t fall apart.
                    </p>
                  </div>
                </div>
              </div>

              {/* Col 3 */}
              <div
                className="rounded-3xl border border-white/10 bg-slate-900/60
                  p-4"
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.28em]
                    text-white/60"
                >
                  Quick reality check
                </p>
                <div className="mt-3 space-y-3 text-sm text-white/80">
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5
                      p-3"
                  >
                    <p className="font-semibold text-white">
                      Comfort sweet spot
                    </p>
                    <p className="mt-1 text-white/70">
                      {peopleNumber} guests (gowns, bags, elbow room)
                    </p>
                  </div>
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5
                      p-3"
                  >
                    <p className="font-semibold text-white">Best ride types</p>
                    <p className="mt-1 text-white/70">
                      Weddings, prom, airport VIP, dinners
                    </p>
                  </div>
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5
                      p-3"
                  >
                    <p className="font-semibold text-white">Fastest quote</p>
                    <p className="mt-1 text-white/70">
                      Date + pickup window + stops + headcount
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => openLiveChat(`Vehicle Detail - Quick Reality Check - ${vehicle.name}`, `/vehicles/${vehicle.slug}`)}
                    className="rounded-full bg-emerald-400 px-4 py-2 text-xs
                      font-semibold uppercase tracking-[0.2em] text-slate-950
                      hover:-translate-y-0.5 cursor-pointer"
                  >
                    Start my quote →
                  </button>
                  <a
                    className="rounded-full border border-white/20 bg-white/5
                      px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]
                      text-white/85 hover:border-white/40"
                    href="tel:+18885352566"
                  >
                    Call now
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom boxes */}
            <div className="grid gap-3 sm:grid-cols-3">
              {bottomInfoItems.map((item) => (
                <BottomInfoModalCard key={item.key} item={item} />
              ))}
            </div>
          </div>

          {/* 2. Booking details Area */}
          <aside
            className="rounded-3xl border border-white/10 bg-white/5 p-5
              shadow-xl"
          >
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-semibold uppercase tracking-[0.28em]
                  text-white/60"
              >
                Fast booking
              </p>
              <span
                className="rounded-full bg-emerald-400/20 px-3 py-1 text-[11px]
                  font-semibold text-emerald-200"
              >
                ~2 minutes
              </span>
            </div>
            <div
              className="mt-3 rounded-2xl border border-white/10 bg-slate-900/60
                p-4"
            >
              <p className="text-sm font-semibold text-white">
                Call us (instant help)
              </p>
              <a
                className="mt-1 inline-flex items-center gap-2 text-2xl
                  font-extrabold tracking-tight text-emerald-200
                  hover:text-emerald-100"
                href="tel:+18885352566"
              >
                (888) 535-2566{" "}
                <span className="text-sm font-semibold text-white/60">→</span>
              </a>
              <p className="mt-2 text-sm text-white/70">
                Tell us date + pickup window + stops. We handle the details.
              </p>
            </div>
            <ol className="mt-4 space-y-3 text-sm">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p
                  className="text-[11px] font-semibold uppercase
                    tracking-[0.28em] text-white/60"
                >
                  Step 1
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  Pick date + pickup window
                </p>
                <p className="mt-1 text-sm text-white/70">
                  We soft-hold the limo slot.
                </p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p
                  className="text-[11px] font-semibold uppercase
                    tracking-[0.28em] text-white/60"
                >
                  Step 2
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  Share headcount + stops
                </p>
                <p className="mt-1 text-sm text-white/70">
                  We map buffers so you stay on time.
                </p>
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p
                  className="text-[11px] font-semibold uppercase
                    tracking-[0.28em] text-white/60"
                >
                  Step 3
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  Approve quote + pay
                </p>
                <p className="mt-1 text-sm text-white/70">
                  You get itinerary + arrival notes.
                </p>
              </li>
            </ol>
            <div className="mt-5 grid gap-3">
              <button
                onClick={() => openLiveChat(`Vehicle Detail - Fast Booking - ${vehicle.name}`, `/vehicles/${vehicle.slug}`)}
                className="rounded-2xl bg-emerald-400 px-5 py-3 text-center
                  text-sm font-semibold uppercase tracking-[0.22em]
                  text-slate-950 shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                Start my quote
              </button>
              <a
                className="rounded-2xl border border-white/15 bg-white/5 px-5
                  py-3 text-center text-sm font-semibold uppercase
                  tracking-[0.22em] text-white/85 hover:border-white/35"
                href="/faq"
              >
                Booking FAQs
              </a>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div
                className="rounded-2xl border border-white/10 bg-slate-900/60
                  p-4 text-sm text-white/80"
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.26em]
                    text-white/60"
                >
                  Most common bookings
                </p>
                <div className="mt-3 grid gap-3">
                  {commonBookingItems.map((item) => (
                    <CommonBookingModalCard key={item.key} item={item} />
                  ))}
                </div>
              </div>
              <div
                className="rounded-2xl border border-white/10 bg-slate-900/50
                  p-4 text-sm text-white/75"
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.26em]
                    text-white/60"
                >
                  Have ready
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>Date + pickup window</span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>Guest count + luggage notes</span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>Stops + photo ops you want</span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>Card ready for the deposit</span>
                  </li>
                </ul>
                <div
                  className="mt-3 rounded-2xl border border-white/10 bg-white/5
                    p-3 text-xs text-white/75"
                >
                  <p className="font-semibold text-white">Quick tip</p>
                  <p className="mt-1">
                    For photos + comfort,{" "}
                    <span className="text-white font-semibold">
                      {peopleNumber}
                    </span>{" "}
                    usually rides best.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function BottomInfoModalCard({
  item,
}: {
  item: {
    key: string;
    box_title: string;
    box_description: string;
    title: string;
    description: string;
    bullets?: string[];
  };
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4
            py-3 text-left transition hover:border-emerald-300/50
            focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <p className="text-sm font-semibold text-white">{item.box_title}</p>
          <p className="text-xs text-white/70 line-clamp-2">
            {item.box_description}
          </p>
          <p
            className="mt-1 text-[11px] font-semibold uppercase
              tracking-[0.22em] text-emerald-100"
          >
            Tap for details →
          </p>
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-full max-w-xl rounded-3xl border border-white/10
          bg-slate-950/90 p-6 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              More info
            </p>
            <DialogTitle className="mt-2 text-2xl font-semibold text-white">
              {item.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-white/80">
              {item.description}
            </DialogDescription>

            {item.bullets && item.bullets.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-white/85">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="shrink-0 rounded-full border border-white/20 px-3 py-1
                text-sm text-white/80 hover:border-white/50"
            >
              Close
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommonBookingModalCard({
  item,
}: {
  item: {
    key: string;
    box_title?: string;
    box_description?: string;
    title: string;
    description: string;
    bullets?: string[];
    triggerClassName: string;
    titleClassName?: string;
  };
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={item.triggerClassName}>
          <p className="text-sm font-semibold text-white">{item.box_title}</p>
          <p className="mt-1 text-xs text-white/70">{item.box_description}</p>
          <p
            className={
              "mt-2 text-xs " + (item.titleClassName ?? "text-white/70")
            }
          >
            Tap for details →
          </p>
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-full max-w-xl rounded-3xl border border-white/10
          bg-slate-950/90 p-6 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              More info
            </p>
            <DialogTitle className="mt-2 text-2xl font-semibold text-white">
              {item.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-white/80">
              {item.description}
            </DialogDescription>

            {item.bullets && item.bullets.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <Button
                onClick={() => openLiveChat(`Vehicle Detail - Common Booking - ${vehicle.name}`, `/vehicles/${vehicle.slug}`)}
                className="rounded-full bg-emerald-400 px-7 py-6 text-base
                  font-semibold text-slate-950 hover:bg-emerald-300 cursor-pointer"
              >
                Start my quote
              </Button>
            </div>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="shrink-0 rounded-full border border-white/20 px-5 py-2
                text-sm text-white/80 hover:border-white/50"
            >
              Close
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
