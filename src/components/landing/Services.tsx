"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Facebook,
  HeadphonesIcon,
  Instagram,
  LucideIcon,
  MessageSquare,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

const TikTokIconSvg = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

interface ChannelData {
  icon: LucideIcon | (() => React.ReactNode);
  name: string;
  color: string;
  automations: {
    type: string;
    icon: LucideIcon;
    name: string;
    trigger: string;
  }[];
}

const channels: ChannelData[] = [
  {
    icon: Instagram,
    name: "Instagram",
    color: "from-purple-500 via-pink-500 to-orange-400",
    automations: [
      {
        type: "sales_orders",
        icon: ShoppingCart,
        name: "Sales / Orders",
        trigger: 'Comment "price/order/buy"',
      },
      {
        type: "lead_capture",
        icon: UserPlus,
        name: "Lead Capture",
        trigger: 'Comment/DM "interested"',
      },
    ],
  },
  {
    icon: Facebook,
    name: "Facebook",
    color: "from-blue-600 to-blue-400",
    automations: [
      {
        type: "sales_orders",
        icon: ShoppingCart,
        name: "Sales / Orders",
        trigger: "Message keywords",
      },
      {
        type: "lead_capture",
        icon: UserPlus,
        name: "Lead Capture",
        trigger: "Incoming messages",
      },
      {
        type: "enquiries_support",
        icon: HeadphonesIcon,
        name: "Support",
        trigger: "Support keywords",
      },
    ],
  },
  {
    icon: MessageSquare,
    name: "WhatsApp",
    color: "from-green-500 to-green-400",
    automations: [
      {
        type: "sales_orders",
        icon: ShoppingCart,
        name: "Sales / Orders",
        trigger: '"price/order/buy"',
      },
      {
        type: "appointments_bookings",
        icon: Calendar,
        name: "Appointments",
        trigger: '"book/schedule"',
      },
      {
        type: "lead_capture",
        icon: UserPlus,
        name: "Lead Capture",
        trigger: '"interested/info"',
      },
      {
        type: "enquiries_support",
        icon: HeadphonesIcon,
        name: "Support",
        trigger: "FAQ keywords",
      },
    ],
  },
  {
    icon: TikTokIconSvg,
    name: "TikTok",
    color: "from-foreground to-foreground/80",
    automations: [
      {
        type: "lead_capture",
        icon: UserPlus,
        name: "Lead Capture",
        trigger: "Lead form / comments",
      },
    ],
  },
];

export function Services() {
  return (
    <section
      id="services-details"
      className="py-24 relative overflow-hidden bg-[#0F1C36]"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px] transform-gpu pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 backdrop-blur-md mb-4">
            Channel Automations
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight text-white leading-[1.1]">
            Each Channel,
            <br />
            <span className="text-primary italic">Custom Automations</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Different channels support different automation types. See what's
            possible on each platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {channels.map((channel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group h-full"
            >
              <div className="h-full p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-primary/20 transition-all duration-500 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-6 mb-8">
                    <div
                      className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                    >
                      {channel.name === "TikTok" ? (
                        <TikTokIconSvg />
                      ) : (
                        <channel.icon className="h-10 w-10" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white italic tracking-tight">
                        {channel.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {channel.automations.length} available
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {channel.automations.map((automation, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 group/item hover:bg-white/[0.08] transition-colors"
                      >
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${
                            automation.type === "sales_orders"
                              ? "bg-orange-500/10 text-orange-400"
                              : automation.type === "appointments_bookings"
                                ? "bg-blue-400/10 text-blue-400"
                                : automation.type === "enquiries_support"
                                  ? "bg-purple-400/10 text-purple-400"
                                  : "bg-emerald-400/10 text-emerald-400"
                          }`}
                        >
                          <automation.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-white text-sm uppercase tracking-tight">
                            {automation.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                            Trigger: {automation.trigger}
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>API Connected</span>
                    <span className="text-primary italic">Live Sync</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-20"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 gap-3 px-10 h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 uppercase tracking-widest transition-all active:scale-95"
            >
              Start Automating Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
