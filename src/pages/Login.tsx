"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      const storedUser = JSON.parse(
        localStorage.getItem("automationAgency_user") || "{}",
      );
      router.push(storedUser.role === "admin" ? "/admin" : "/portal");
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background font-geist">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border glass group-hover:bg-primary/5 transition-all">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors hidden sm:block">
            Back to Home
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative z-10 font-geist">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Brand Header */}
          <div className="text-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-8 group"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary shadow-xl group-hover:rotate-12 transition-transform">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-foreground">
                Partner<span className="text-primary">Peak</span>
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-foreground">
              Welcome <span className="text-primary italic">Back.</span>
            </h1>
            <p className="text-muted-foreground font-semibold">
              Enter your credentials to access your automation dashboard.
            </p>
          </div>

          <Card className="glass rounded-[2.5rem] shadow-2xl overflow-hidden group">
            <CardHeader className="p-10 pb-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black mb-4 uppercase tracking-widest mx-auto">
                <Sparkles className="h-3 w-3" />
                <span>Security First</span>
              </div>
              <CardTitle className="text-2xl font-black text-foreground">
                Account Login
              </CardTitle>
            </CardHeader>

            <CardContent className="p-10 pt-4 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-black text-xs uppercase tracking-widest ml-1 text-muted-foreground"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 rounded-2xl px-6 font-semibold"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <Label
                      htmlFor="password"
                      className="font-black text-xs uppercase tracking-widest text-muted-foreground"
                    >
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-black text-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-16 rounded-2xl px-6 font-semibold"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-16 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-6 border-t border-white/5 text-center">
                <p className="text-muted-foreground font-semibold">
                  New to PartnerPeak?{" "}
                  <Link
                    href="/signup"
                    className="text-primary hover:underline font-black"
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              {/* Demo credentials */}
              <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                  Demo Credentials:
                </p>
                <div className="space-y-2 text-xs font-bold text-muted-foreground">
                  <p>
                    <span className="text-primary font-black">Admin:</span>{" "}
                    admin@agency.com / admin123
                  </p>
                  <p>
                    <span className="text-primary font-black">Client:</span>{" "}
                    client@business.com / client123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-[10px] text-muted-foreground mt-8 font-bold uppercase tracking-[0.2em] leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
