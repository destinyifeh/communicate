"use client";

import { motion } from "framer-motion";
import { BarChart3, Bot, Calendar, Inbox, Layers, Mail, Phone, Zap } from "lucide-react";

export function Features() {
  return (
    <section
      id="features"
      className="py-12 md:py-24 relative overflow-hidden bg-[#0B1528]"
    >
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[80px] transform-gpu pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 tracking-widest uppercase border border-primary/20 backdrop-blur-md"
          >
            <Layers className="h-4 w-4" />
            <span>Powerhouse Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight text-white leading-[1.1]"
          >
            Everything you need to{" "}
            <span className="text-primary italic">Scale.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 font-medium leading-relaxed"
          >
            Powering modern businesses with advanced AI and seamless
            multi-channel automation. Built for performance, designed for
            growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-fr">
          {/* Main Feature: Unified Inbox */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-white/5 group relative p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] overflow-hidden flex flex-col justify-between hover:border-primary/20 transition-all duration-500"
          >
            <div className="relative z-10 max-w-lg">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 md:mb-8 border border-primary/20">
                <Inbox className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-4 text-white">
                Unified Inbox
              </h3>
              <p className="text-lg text-slate-400 font-semibold leading-relaxed">
                Every conversation in one place. WhatsApp, SMS, Email, Voice calls,
                and social media - all unified in a single threaded inbox per customer.
              </p>
            </div>

            <div className="mt-8 md:mt-12 flex flex-wrap gap-3 md:gap-4 relative z-10">
              {["WhatsApp", "SMS", "Email", "Voice", "Instagram", "Facebook"].map(
                (platform) => (
                  <div
                    key={platform}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300"
                  >
                    {platform}
                  </div>
                ),
              )}
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
              <Inbox className="w-full h-full scale-150 translate-x-1/4" />
            </div>
          </motion.div>

          {/* AI Assistant */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 group relative p-10 rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 md:mb-8 border border-accent/20">
              <Bot className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">AI Assistant</h3>
            <p className="text-slate-400 font-semibold leading-relaxed">
              AI handles 80%+ of conversations automatically. Smart escalation to humans when needed.
            </p>

            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 opacity-60">
              <div className="h-2 w-3/4 bg-accent/20 rounded-full" />
              <div className="h-2 w-1/2 bg-accent/10 rounded-full" />
            </div>
          </motion.div>

          {/* Email Integration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 group relative p-10 rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 md:mb-8 border border-cyan-500/20">
              <Mail className="h-8 w-8 text-cyan-500" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">
              Email
            </h3>
            <p className="text-slate-400 font-semibold leading-relaxed">
              Send and receive emails via Resend. All emails appear in conversations alongside other channels.
            </p>
          </motion.div>

          {/* Call Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 group relative p-10 rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 md:mb-8 border border-orange-500/20">
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">
              Call Center
            </h3>
            <p className="text-slate-400 font-semibold leading-relaxed">
              Virtual phone numbers with Twilio. Inbound/outbound calls, voicemail, and call history.
            </p>
          </motion.div>

          {/* Calendar & Appointments */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 group relative p-10 rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 md:mb-8 border border-blue-500/20">
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">
              Calendar
            </h3>
            <p className="text-slate-400 font-semibold leading-relaxed">
              Built-in scheduling with automated reminders. AI books appointments directly from conversations.
            </p>
          </motion.div>

          {/* Smart Automations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-6 lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-white/5 group relative p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row gap-10 h-full">
              <div className="flex-1">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 md:mb-8 border border-emerald-500/20">
                  <Zap className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-white">
                  Smart Automations
                </h3>
                <p className="text-slate-400 font-semibold leading-relaxed">
                  Trigger workflows across channels. Auto-respond, schedule follow-ups, send reminders, and escalate to agents - all automatically.
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full aspect-video rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      89% Auto-resolved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 group relative p-10 rounded-[2.5rem] overflow-hidden hover:border-primary/20 transition-all duration-500"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 md:mb-8 border border-purple-500/20">
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">
              Analytics
            </h3>
            <p className="text-slate-400 font-semibold leading-relaxed">
              Track conversations, response times, AI performance, and customer satisfaction across all channels.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
