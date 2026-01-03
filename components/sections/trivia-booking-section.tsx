"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  LightbulbIcon,
  Award,
  MapPin,
  Users,
  Clock,
  CreditCard,
  Shield,
  Star,
  PartyPopper,
} from "lucide-react";

export type TriviaItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
  source?: string;
};

interface TriviaBookingSectionProps {
  triviaItems: TriviaItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  bookingTitle?: string;
}

const BOOKING_STEPS = [
  {
    step: 1,
    title: "Tell Us Your Event Details",
    shortDesc: "Share your date, pickup/dropoff locations, and group size.",
    icon: Calendar,
    modalContent: {
      title: "Step 1: Tell Us Your Event Details",
      description: "We make it easy to get started with your reservation.",
      details: [
        { icon: Calendar, label: "Event Date & Time", text: "Choose your preferred date and pickup time. We're available 24/7 for any occasion." },
        { icon: MapPin, label: "Pickup & Dropoff", text: "Tell us where to pick you up and your destination. Multi-stop routes are no problem." },
        { icon: Users, label: "Group Size", text: "Let us know how many guests. We'll match you with the perfect vehicle capacity." },
        { icon: PartyPopper, label: "Event Type", text: "Whether it's a wedding, bachelor party, prom, or corporate event—we've got you covered." },
      ],
    },
  },
  {
    step: 2,
    title: "Get Your Instant Quote",
    shortDesc: "Receive transparent pricing with no hidden fees.",
    icon: MessageSquare,
    modalContent: {
      title: "Step 2: Get Your Instant Quote",
      description: "Transparent pricing tailored to your needs.",
      details: [
        { icon: CreditCard, label: "Clear Pricing", text: "No hidden fees or surprise charges. Your quote includes everything upfront." },
        { icon: Clock, label: "Flexible Options", text: "Choose hourly rates or flat-rate packages depending on your needs." },
        { icon: Star, label: "Compare Vehicles", text: "Browse available vehicles, see photos, and compare amenities before deciding." },
        { icon: Shield, label: "Best Price Guarantee", text: "We match or beat competitor quotes for comparable service." },
      ],
    },
  },
  {
    step: 3,
    title: "Confirm & Celebrate",
    shortDesc: "Lock in your reservation and enjoy your ride.",
    icon: CheckCircle2,
    modalContent: {
      title: "Step 3: Confirm & Celebrate",
      description: "Your professional driver arrives on time, every time.",
      details: [
        { icon: CreditCard, label: "Easy Deposit", text: "Secure your reservation with a simple deposit. Multiple payment options available." },
        { icon: Shield, label: "Licensed & Insured", text: "All our vehicles are fully licensed, insured, and regularly inspected." },
        { icon: Users, label: "Professional Chauffeurs", text: "Background-checked, trained drivers who know the area and prioritize your safety." },
        { icon: PartyPopper, label: "Enjoy Your Event", text: "Sit back, relax, and let us handle the transportation while you celebrate." },
      ],
    },
  },
];

function TriviaCard({
  item,
  isActive,
}: {
  item: TriviaItem;
  isActive: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full h-[280px] cursor-pointer perspective-1000",
        "transition-all duration-500",
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute"
      )}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute w-full h-full rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40 backdrop-blur-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold tracking-wider uppercase text-purple-300">
              {item.category || "Trivia"}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white leading-relaxed mb-6">
            {item.question}
          </h3>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
            <span className="text-xs text-white/40">Tap to reveal answer</span>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <LightbulbIcon className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>

        <div
          className="absolute w-full h-full rounded-2xl p-6 border border-green-500/30 bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-cyan-900/40 backdrop-blur-sm"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
              Answer
            </span>
          </div>
          <p className="text-lg text-white/90 leading-relaxed mb-4">
            {item.answer}
          </p>
          {item.source && (
            <div className="absolute bottom-6 left-6">
              <span className="text-xs text-white/40">Source: {item.source}</span>
            </div>
          )}
          <div className="absolute bottom-6 right-6">
            <span className="text-xs text-white/40">Tap to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingStepModal({
  step,
  isOpen,
  onClose,
}: {
  step: typeof BOOKING_STEPS[0];
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-blue-500/30 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              {step.step}
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              {step.modalContent.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-blue-200/70">
            {step.modalContent.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {step.modalContent.details.map((detail, idx) => (
            <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <detail.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{detail.label}</h4>
                <p className="text-xs text-white/60 mt-0.5">{detail.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            asChild
            className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
          >
            <Link href="/contact">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full border-white/20 text-black hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TriviaBookingSection({
  triviaItems,
  title = "Transportation Trivia & How to Book",
  subtitle = "Fun facts about group travel and our simple 3-step booking process",
  className,
  bookingTitle = "How to Book with Bus2Ride",
}: TriviaBookingSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStep, setSelectedStep] = useState<typeof BOOKING_STEPS[0] | null>(null);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % triviaItems.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + triviaItems.length) % triviaItems.length);
  };

  return (
    <section
      className={cn(
        "relative py-20 overflow-hidden",
        "bg-gradient-to-b from-[#0a1628] via-[#0d1d3a] to-[#0a1628]",
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-300">
              Learn & Book
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            {title}
          </h2>
          <p className="text-blue-200/70 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-indigo-600" />
              <h3 className="text-xl font-bold text-white">Transportation Trivia</h3>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-500"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {triviaItems.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-full">
                    <TriviaCard item={item} isActive={true} />
                  </div>
                ))}
              </div>
            </div>


            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={goToPrev}
                className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 hover:text-white hover:border-purple-400 transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-2 px-4">
                {triviaItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "h-2.5 rounded-full transition-all",
                      idx === currentIndex 
                        ? "w-8 bg-gradient-to-r from-purple-400 to-indigo-400" 
                        : "w-2.5 bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 hover:text-white hover:border-purple-400 transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-center text-white/40 text-xs mt-3">
              {currentIndex + 1} of {triviaItems.length} trivia facts
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-cyan-600" />
              <h3 className="text-xl font-bold text-white">{bookingTitle}</h3>
            </div>

            <div className="space-y-4">
              {BOOKING_STEPS.map((step) => (
                <button
                  key={step.step}
                  onClick={() => setSelectedStep(step)}
                  className="w-full group relative flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-900/40 transition-all duration-300 text-left"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-4 h-4 text-blue-400" />
                      <h4 className="font-bold text-white">{step.title}</h4>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {step.shortDesc}
                    </p>
                  </div>
                  <div className="flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium mr-1">Learn more</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.4)] transition-all"
              >
                <Link href="/contact">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Your Free Quote
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-full border-white/20 text-black hover:bg-white/10 transition-all"
              >
                <a href="tel:8885352566">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedStep && (
        <BookingStepModal
          step={selectedStep}
          isOpen={!!selectedStep}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </section>
  );
}
