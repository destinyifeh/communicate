"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  GraduationCap,
  HeadphonesIcon,
  Scissors,
  ShoppingCart,
  Store,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

const businessTypes = [
  {
    icon: Store,
    name: "Vendor / Online Seller",
    description: "Sells physical or digital products",
    color: "from-orange-500 to-amber-500",
    automations: [
      { icon: ShoppingCart, name: "Sales / Orders", enabled: true },
      { icon: UserPlus, name: "Lead Capture", enabled: true },
      { icon: Calendar, name: "Appointments", enabled: false },
      { icon: HeadphonesIcon, name: "Support", enabled: false },
    ],
  },
  {
    icon: Briefcase,
    name: "Service Provider",
    description: "Freelancers, agencies, consultants",
    color: "from-purple-500 to-indigo-500",
    automations: [
      { icon: UserPlus, name: "Lead Capture", enabled: true },
      { icon: HeadphonesIcon, name: "Enquiries / Support", enabled: true },
      { icon: ShoppingCart, name: "Orders", enabled: false },
      { icon: Calendar, name: "Appointments", enabled: false },
    ],
  },
  {
    icon: Scissors,
    name: "Appointment-Based",
    description: "Clinics, salons, coaches, tutors",
    color: "from-blue-500 to-cyan-500",
    automations: [
      { icon: Calendar, name: "Appointments / Bookings", enabled: true },
      { icon: HeadphonesIcon, name: "Enquiries", enabled: true },
      { icon: ShoppingCart, name: "Sales / Orders", enabled: false },
      { icon: UserPlus, name: "Lead Capture", enabled: false },
    ],
  },
  {
    icon: GraduationCap,
    name: "Lead-Driven Business",
    description: "Realtors, marketers, schools, SaaS",
    color: "from-green-500 to-emerald-500",
    automations: [
      { icon: UserPlus, name: "Lead Capture", enabled: true },
      { icon: ShoppingCart, name: "Sales / Orders", enabled: false },
      { icon: Calendar, name: "Appointments", enabled: false },
      { icon: HeadphonesIcon, name: "Support", enabled: false },
    ],
  },
];

export function BusinessTypes() {
  return (
    <section
      id="solutions"
      className="py-24 relative overflow-hidden bg-[#0A1121]"
    >
      {/* Background elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20 backdrop-blur-md mb-4">
            Tailored For Your Business
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight text-white leading-[1.1]">
            What Type of Business
            <br />
            <span className="text-primary italic">Do You Run?</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            We automatically enable the right automations based on your business
            type. No complexity, just results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {businessTypes.map((business, index) => (
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
                      className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                    >
                      <business.icon className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white italic tracking-tight">
                        {business.name}
                      </h3>
                      <p className="text-slate-400 font-semibold">
                        {business.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {business.automations.map((automation, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl flex items-center gap-3 transition-colors ${
                          automation.enabled
                            ? "bg-primary/10 text-primary border border-primary/10"
                            : "bg-white/5 text-slate-500 border border-white/5 opacity-50"
                        }`}
                      >
                        <automation.icon className="h-4 w-4 shrink-0" />
                        <span className="text-[11px] font-black uppercase tracking-widest truncate">
                          {automation.name}
                        </span>
                        {automation.enabled && (
                          <CheckCircle2 className="h-4 w-4 ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center text-xs font-black uppercase tracking-widest text-primary gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Automation Set Ready
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
              Get Started Today
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
