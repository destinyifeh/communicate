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
  Headphones,
  MessageSquare,
  Phone,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const WhatsAppIcon = () => (
  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "$29",
    period: "/month",
    description: "Perfect for businesses starting with automation.",
    channelCount: 1,
    channelText: "1 phone number",
    automations: "Booking + Inquiries",
    contacts: "100 messages/mo",
    features: [
      "Appointment booking via SMS/WhatsApp",
      "AI-powered inquiry responses",
      "FAQ auto-responder",
      "Unified inbox",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    name: "Growth",
    icon: Crown,
    price: "$79",
    period: "/month",
    description: "For growing businesses that need support features.",
    channelCount: 2,
    channelText: "2 phone numbers",
    automations: "Booking + Inquiries + Support",
    contacts: "500 messages/mo",
    features: [
      "Everything in Starter",
      "Voice call center (IVR)",
      "Live agent support via Flex",
      "Agent takeover from bot",
      "Priority support",
    ],
    cta: "Get Started",
    popular: true,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    name: "Pro",
    icon: Building2,
    price: "$149",
    period: "/month",
    description: "Full communication suite for established businesses.",
    channelCount: 5,
    channelText: "5 phone numbers",
    automations: "All features included",
    contacts: "2,000 messages/mo",
    features: [
      "Everything in Growth",
      "Mass marketing campaigns",
      "Bulk SMS/WhatsApp",
      "CSV contact import",
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
                        {[Phone, MessageSquare, Headphones, WhatsAppIcon]
                          .slice(0, Math.min(plan.channelCount, 4))
                          .map((Icon, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center"
                            >
                              {Icon === WhatsAppIcon ? (
                                <WhatsAppIcon />
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
