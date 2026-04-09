"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  Crown,
  Facebook,
  Instagram,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const TikTokIcon = () => (
  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "₦25,000",
    period: "/month",
    description: "Perfect for small businesses just getting started.",
    channelCount: 1,
    channelText: "1 channel of your choice",
    automations: "2 automations",
    contacts: "500 contacts",
    features: [
      "Lead capture automation",
      "Basic FAQ bot",
      "Dashboard analytics",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    name: "Professional",
    icon: Crown,
    price: "₦50,000",
    period: "/month",
    description: "For growing businesses that need more power.",
    channelCount: 2,
    channelText: "2 channels of your choice",
    automations: "8 automations",
    contacts: "2,500 contacts",
    features: [
      "Everything in Starter",
      "Appointment booking",
      "Sales & order automation",
      "Transactional emails",
      "Priority support",
    ],
    cta: "Get Started",
    popular: true,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "₦120,000",
    period: "/month",
    description: "For established businesses ready to scale.",
    channelCount: 4,
    channelText: "All 4 channels included",
    automations: "Unlimited automations",
    contacts: "10,000+ contacts",
    features: [
      "Everything in Professional",
      "AI-powered responses",
      "Custom integrations",
      "Advanced analytics",
      "Dedicated account manager",
    ],
    cta: "Get Started",
    popular: false,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 relative overflow-hidden bg-[#0B1528]"
    >
      {/* Background Decor */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 tracking-widest uppercase border border-primary/20 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Pricing Plans</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight text-white leading-[1.1]"
          >
            Simple, <span className="text-primary italic">Transparent.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 font-medium leading-relaxed"
          >
            Choose the plan that fits your business needs. Scale up anytime as
            you grow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group h-full"
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <Badge className="bg-primary text-white border-0 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ring-4 ring-[#0F1C36]">
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full flex flex-col rounded-[2.5rem] border-white/5 overflow-hidden transition-all duration-500 bg-slate-900/40 backdrop-blur-xl group-hover:border-primary/20 ${
                  plan.popular
                    ? "ring-2 ring-primary/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]"
                    : "hover:bg-slate-900/60"
                }`}
              >
                <CardHeader className="p-10 pb-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                      plan.popular
                        ? "bg-primary text-white border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        : "bg-slate-800/50 border-white/5 text-slate-400"
                    }`}
                  >
                    <plan.icon className="h-8 w-8" />
                  </div>

                  <CardTitle className="text-3xl font-black mb-2 text-white italic tracking-tight">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-semibold leading-relaxed">
                    {plan.description}
                  </CardDescription>

                  <div className="mt-8 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black tracking-tighter text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 font-bold">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-10 pt-0 flex-1 flex flex-col">
                  {/* Highlights Card */}
                  <div className="mb-8 p-6 rounded-3xl bg-slate-800/30 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[Instagram, Facebook, MessageSquare, TikTokIcon]
                          .slice(0, plan.channelCount)
                          .map((Icon, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center"
                            >
                              {Icon === TikTokIcon ? (
                                <TikTokIcon />
                              ) : (
                                <Icon className="h-4 w-4 text-slate-300" />
                              )}
                            </div>
                          ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {plan.channelText}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>{plan.automations}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{plan.contacts}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm font-semibold"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-slate-400 leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/signup?plan=${plan.name.toLowerCase()}`}
                    className="w-full"
                  >
                    <Button
                      className={`w-full h-14 rounded-2xl text-base font-black transition-all active:scale-95 uppercase tracking-widest shadow-xl ${
                        plan.popular
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 px-8 py-4 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-slate-400 font-bold">Need more?</span>
            <Link
              href="/demo"
              className="text-primary font-black hover:text-primary/80 transition-colors flex items-center gap-1 group"
            >
              Contact Sales{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
