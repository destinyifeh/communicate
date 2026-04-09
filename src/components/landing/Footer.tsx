"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

const TikTokIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Integrations", href: "#" },
    { name: "API Documentation", href: "#" },
    { name: "Changelog", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press Kit", href: "#" },
    { name: "Contact", href: "#" },
  ],
  resources: [
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Templates", href: "#" },
    { name: "Webinars", href: "#" },
    { name: "Case Studies", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Security", href: "#" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: <Instagram className="h-5 w-5" />, href: "#" },
  { name: "Facebook", icon: <Facebook className="h-5 w-5" />, href: "#" },
  { name: "Twitter", icon: <MessageSquare className="h-5 w-5" />, href: "#" },
  { name: "TikTok", icon: <TikTokIcon />, href: "#" },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0B1528] border-t border-white/5 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Newsletter Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0F1C36] rounded-[4rem] p-10 md:p-16 relative overflow-hidden shadow-2xl border border-white/5"
          >
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black mb-6 uppercase tracking-widest"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Stay Updated</span>
                </motion.div>
                <h3 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white leading-[1.1]">
                  Scale your <span className="text-primary">business</span>{" "}
                  faster.
                </h3>
                <p className="text-slate-400 font-semibold text-lg">
                  Get the latest automation strategies and product updates
                  delivered straight to your inbox.
                </p>
              </div>

              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white/5 rounded-[2.5rem] border border-white/10">
                  <Input
                    type="email"
                    placeholder="Enter your business email"
                    className="h-14 border-none bg-transparent px-6 font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-slate-500 flex-1"
                  />
                  <Button className="h-14 px-10 rounded-[1.8rem] bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/25 transition-all group shrink-0">
                    Subscribe
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg group-hover:rotate-12 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                PartnerPeak
              </span>
            </Link>
            <p className="text-slate-400 font-semibold mb-8 max-w-xs leading-relaxed">
              Empowering businesses worldwide with intelligent multi-channel
              automation. Built for performance, designed for growth.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:hello@partnerpeak.com"
                className="flex items-center gap-3 text-slate-400 hover:text-primary font-bold transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                hello@partnerpeak.com
              </a>
              <div className="flex items-center gap-3 text-slate-400 font-bold">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                Global Services
              </div>
            </div>
          </div>

          {[
            { title: "Product", links: footerLinks.product },
            { title: "Company", links: footerLinks.company },
            { title: "Resources", links: footerLinks.resources },
            { title: "Legal", links: footerLinks.legal },
          ].map((column) => (
            <div key={column.title}>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-8">
                {column.title}
              </h4>
              <ul className="space-y-4 font-semibold">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-bold text-slate-500">
              © {new Date().getFullYear()} PartnerPeak. Made with ❤️ in Nigeria.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
