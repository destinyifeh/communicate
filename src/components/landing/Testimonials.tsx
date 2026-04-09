"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Quote, Sparkles, Star } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Elena Rodriguez",
    role: "Founder, Global Design Studio",
    avatar: "",
    content:
      "PartnerPeak transformed our international client interactions. We now handle inquiries across four time zones automatically. The ROI has been incredible!",
    rating: 5,
    platform: "Instagram",
    metric: "12x more global leads",
  },
  {
    id: 2,
    name: "Marcus Thorne",
    role: "CEO, OmniSystems UK",
    avatar: "",
    content:
      "Our expansion into new markets was seamless thanks to the automation. Response times are consistent globally, and our efficiency has peaked.",
    rating: 5,
    platform: "WhatsApp",
    metric: "98% global coverage",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Marketing Director, LuxeTrade",
    avatar: "",
    content:
      "The best global scaling tool we've used. PartnerPeak handles traffic from every continent without any lag or downtime.",
    rating: 5,
    platform: "Facebook",
    metric: "5,000+ hourly chats",
  },
  {
    id: 4,
    name: "David Chen",
    role: "Owner, AeroLogistics",
    avatar: "",
    content:
      "Managing global delivery queries used to be a nightmare. Now, it's 100% automated. Our customers worldwide are more satisfied than ever!",
    rating: 5,
    platform: "WhatsApp",
    metric: "Worldwide support 24/7",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 relative overflow-hidden bg-[#0B1528]"
    >
      {/* Background Decor */}
      <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 tracking-widest uppercase border border-primary/20 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" />
            <span>Success Stories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight text-white leading-[1.1]"
          >
            Trusted by{" "}
            <span className="text-primary italic">500+ Businesses.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 font-medium leading-relaxed"
          >
            Discover how businesses worldwide are scaling their operations with
            PartnerPeak's automation engine.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { value: "500+", label: "Businesses" },
            { value: "2M+", label: "Automations" },
            { value: "98%", label: "Satisfaction" },
            { value: "50%", label: "Conversions" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] text-center hover:border-primary/20 transition-all duration-500"
            >
              <div className="text-3xl md:text-4xl font-black text-white italic mb-2">
                {stat.value}
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Card className="rounded-[3rem] bg-slate-900/40 backdrop-blur-xl border-white/5 overflow-hidden group-hover:border-primary/20 transition-all duration-500 shadow-xl group-hover:shadow-[0_0_50px_rgba(59,130,246,0.05)]">
                <CardContent className="p-12 relative">
                  <Quote className="absolute top-12 right-12 h-16 w-16 text-primary/5 group-hover:text-primary/10 transition-colors" />

                  <div className="flex gap-1.5 mb-8">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  <p className="text-2xl font-black text-white mb-10 leading-snug italic tracking-tight">
                    "{testimonial.content}"
                  </p>

                  <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 text-primary text-[10px] font-black mb-10 border border-primary/20 uppercase tracking-widest">
                    <MessageSquare className="h-4 w-4" />
                    {testimonial.metric}
                  </div>

                  <div className="flex items-center gap-5 pt-10 border-t border-white/5">
                    <Avatar className="h-16 w-16 ring-4 ring-primary/10 grayscale group-hover:grayscale-0 transition-all duration-500">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-primary text-white font-black text-xl">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-xl font-black text-white italic tracking-tight">
                        {testimonial.name}
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {testimonial.role}
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {testimonial.platform}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-24 text-center"
        >
          <p className="text-slate-400 font-bold mb-8 text-lg">
            Ready to become our next success story?
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-primary text-white h-16 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 group uppercase tracking-widest"
            >
              Start Your Growth Journey
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
