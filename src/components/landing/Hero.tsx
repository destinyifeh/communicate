"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const industries = [
  {
    id: "ecommerce",
    name: "E-commerce store",
    prefix: "",
    headline: "Turn product enquiries into paying customers",
    color: "text-orange-500",
    aiPrompt:
      "AI agent that handles order tracking, provides product recommendations, and manages common returns/exchange inquiries automatically",
    stats: [
      { value: "42%", label: "reduction in support tickets" },
      { value: "15%", label: "increase in average order value" },
      { value: "24/7", label: "instant customer service availability" },
    ],
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "real-estate",
    name: "Real estate",
    prefix: "",
    headline: "Capture and convert property enquiries",
    color: "text-blue-500",
    aiPrompt:
      "AI agent that qualifies buyers by asking about budget, location, and property type, then schedules viewing appointments for agents",
    stats: [
      { value: "45%", label: "faster lead qualification process" },
      { value: "30%", label: "increase in qualified viewing appointments" },
      {
        value: "20%",
        label: "higher client satisfaction with instant replies",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "logistics",
    name: "Logistics & Delivery",
    prefix: "",
    headline: "Automate delivery enquiries and shipment bookings",
    color: "text-blue-400",
    aiPrompt:
      "AI agent that provides real-time shipment updates, handles delivery rescheduling, and qualifies courier applications",
    stats: [
      { value: "50%", label: "faster response to delivery queries" },
      { value: "22%", label: "reduction in manual tracking requests" },
      { value: "98%", label: "accuracy in automated delivery updates" },
    ],
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "hospital",
    name: "Medical center",
    prefix: "",
    headline: "Turn patient enquiries into booked appointments",
    color: "text-teal-500",
    aiPrompt:
      "AI agent that manages patient inquiries, directs them to correct departments, and handles follow-up appointment scheduling",
    stats: [
      { value: "50%", label: "lower call volume to front desk" },
      { value: "12min", label: "saved per patient in registration" },
      { value: "95%", label: "positive patient feedback on AI interaction" },
    ],
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "beauty",
    name: "Beauty salon",
    prefix: "",
    headline: "Scale your beauty salon with automated bookings",
    color: "text-purple-500",
    aiPrompt:
      "AI agent that showcases portfolio, handles booking for specific stylists, and sends automated reminders",
    stats: [
      { value: "40%", label: "reduction in no-shows with smart reminders" },
      { value: "22%", label: "more bookings during after-hours" },
      { value: "18%", label: "boost in customer lifetime value" },
    ],
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "vendors",
    name: "Vendors",
    prefix: "",
    headline: "Convert product enquiries into orders automatically",
    color: "text-orange-400",
    aiPrompt:
      "AI agent that manages inventory inquiries, processes bulk orders, and provides real-time shipping updates for your distributors and retailers",
    stats: [
      { value: "55%", label: "faster order processing time" },
      { value: "34%", label: "increase in repeat vendor orders" },
      { value: "24/7", label: "inventory availability support" },
    ],
    image:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "appointments",
    name: "Appointment business",
    prefix: "",
    headline: "Automate bookings and scale your appointment business",
    color: "text-indigo-400",
    aiPrompt:
      "AI agent that handles complex scheduling, syncs with your staff calendars, and manages waitlists and cancellations automatically",
    stats: [
      { value: "65%", label: "automation of scheduling tasks" },
      { value: "28%", label: "higher slot utilization rate" },
      { value: "10min", label: "saved per booking interaction" },
    ],
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "customer-care",
    name: "Customer care",
    prefix: "",
    headline: "Respond to customers across every channel in one place",
    color: "text-amber-400",
    aiPrompt:
      "AI agent that handles multi-tier support, resolves common issues instantly, and escalates complex cases to the right human agent",
    stats: [
      { value: "80%", label: "first-response resolution rate" },
      { value: "4.9/5", label: "average customer satisfaction score" },
      { value: "70%", label: "reduction in support ticket backlog" },
    ],
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
  },
];

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = industries[activeIndex];

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % industries.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-12 md:pt-24 pb-8 md:pb-16 bg-[#0B1528]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#3B82F6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#06B6D4]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left order-2 lg:order-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tight mb-4 leading-[0.9] text-white"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="block"
                >
                  {active.prefix && (
                    <span className="text-white text-3xl md:text-5xl lg:text-6xl font-black block mb-4 opacity-50 uppercase tracking-tight">
                      {active.prefix}
                    </span>
                  )}
                  <span
                    className={`${active.color} block text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight`}
                  >
                    {active.headline}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-slate-400 mb-6 md:mb-10 font-medium max-w-xl"
            >
              Join over 18,000 businesses using AI to interact with their
              clients.
            </motion.p>

            {/* AI Agent Interface */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-2xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 md:p-6 mb-8 relative group"
            >
              <div className="min-h-[100px] text-slate-300 text-lg leading-relaxed mb-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {active.aiPrompt}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="absolute bottom-6 right-6">
                <Link href="/signup">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
                    <Send className="h-5 w-5 text-white" />
                  </div>
                </Link>
              </div>

              {/* Tag Selector */}
              <div className="flex flex-wrap gap-2 mt-4 pt-6 border-t border-slate-700/30">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-2 self-center">
                  Typical cases
                </span>
                {industries.map((ind, idx) => (
                  <button
                    key={ind.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      activeIndex === idx
                        ? `bg-slate-700/50 border-slate-500 text-white`
                        : "border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-400"
                    }`}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content - Visuals */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-[320px] sm:w-[400px]">
              {/* Main Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-0"
                >
                  <div className="relative aspect-square w-full">
                    <img
                      src={active.image}
                      alt={active.name}
                      className="w-full h-full object-cover rounded-3xl"
                    />
                    {/* Shadow overlay to blend with background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent opacity-40" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Stats */}
              <div className="absolute top-0 -left-12 lg:-left-24 z-10 flex flex-col gap-4">
                {active.stats.map((stat, idx) => (
                  <motion.div
                    key={`${active.id}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="glass-dark border border-white/5 shadow-2xl p-4 rounded-xl max-w-[200px] backdrop-blur-xl bg-slate-900/40"
                  >
                    <div className="text-xl font-black text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium leading-tight">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
