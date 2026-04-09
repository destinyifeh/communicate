"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { ArrowRight, Menu, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 bg-[#0B1528]/80 backdrop-blur-md shadow-sm border-white/10 border-b"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between transition-all duration-300">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg group-hover:rotate-12 transition-transform">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white transition-colors">
              Partner<span className="text-primary">Peak</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer relative group ${
                  scrolled
                    ? "text-slate-400 hover:text-primary"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className={`flex items-center gap-3 ${!scrolled ? "text-white/70 hover:text-white" : ""}`}
          >
            <ThemeToggle scrolled={scrolled} />

            <Link href="/login" className="hidden md:block">
              <Button
                variant="ghost"
                className={`hover:bg-primary/90 font-bold text-xs uppercase tracking-widest transition-colors ${
                  scrolled
                    ? "text-slate-400 hover:text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup" className="hidden md:block">
              <Button size="sm" className="gap-2">
                Get Started
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    scrolled
                      ? "md:hidden text-slate-400"
                      : "md:hidden text-white"
                  }
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-[#0B1528] border-l border-white/10"
              >
                <nav className="flex flex-col gap-6 mt-12">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="text-xl font-black text-white hover:text-primary transition-colors py-2 border-b border-white/5"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="flex flex-col gap-4 mt-4">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full font-bold h-12 text-white border-white/20 hover:bg-white/10 hover:text-white"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
