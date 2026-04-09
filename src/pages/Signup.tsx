"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  BusinessKindType,
  ChannelType,
  PlanType,
  businessKinds,
} from "@/lib/businessTypes";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Crown,
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// 3 steps for quick onboarding
const TOTAL_STEPS = 3;

const stepTitles = {
  1: "Create Account",
  2: "Business Type",
  3: "Verify Email",
};

const TikTokIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const channelInfo: Record<
  ChannelType,
  { icon: React.ReactNode; name: string; color: string }
> = {
  instagram: {
    icon: <Instagram className="h-5 w-5" />,
    name: "Instagram",
    color: "from-purple-500 to-pink-500",
  },
  facebook: {
    icon: <Facebook className="h-5 w-5" />,
    name: "Facebook",
    color: "from-blue-600 to-blue-500",
  },
  whatsapp: {
    icon: <MessageSquare className="h-5 w-5" />,
    name: "WhatsApp",
    color: "from-green-500 to-green-400",
  },
  tiktok: {
    icon: <TikTokIcon />,
    name: "TikTok",
    color: "from-gray-900 to-gray-700 dark:from-white dark:to-gray-200",
  },
  email: {
    icon: <Mail className="h-5 w-5" />,
    name: "Email",
    color: "from-red-500 to-rose-500",
  },
};

interface BusinessDetails {
  name: string;
  email: string;
  whatsappNumber: string;
  phoneNumber?: string;
  country: string;
}

export default function Signup() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [connectingChannel, setConnectingChannel] =
    useState<ChannelType | null>(null);

  // Step 1: Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Email Verification
  const [verificationCode, setVerificationCode] = useState("");

  // Step 3: Business Details (Combined with Step 1)
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    name: "",
    email: "",
    whatsappNumber: "",
    phoneNumber: "",
    country: "",
  });

  // Step 2: Business Kind
  const [selectedBusinessKind, setSelectedBusinessKind] =
    useState<BusinessKindType | null>(null);

  const { signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const planParam = searchParams?.get("plan");
    if (
      planParam &&
      ["starter", "professional", "enterprise"].includes(planParam)
    ) {
      localStorage.setItem("selected_plan", planParam);
    }
  }, [searchParams]);

  const handleNextStep = async () => {
    if (step === 1) {
      if (!email || !password || !businessDetails.name) {
        toast.error("Please fill in required fields");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedBusinessKind) {
        toast.error("Please select your business type");
        return;
      }
      setIsLoading(true);
      // Simulate sending verification code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      toast.success("Verification code sent to your email");
      setStep(3);
    } else if (step === 3) {
      if (verificationCode !== "123456") {
        toast.error("Invalid verification code. Use 123456 for demo.");
        return;
      }
      toast.success("Email verified!");
      handleCompleteOnboarding();
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      await signup(email, password, businessDetails.name, "client");

      // Store basic setup
      localStorage.setItem("business_kind", selectedBusinessKind || "");
      localStorage.setItem("business_details", JSON.stringify(businessDetails));

      // Initialize with fresh state for new user
      localStorage.removeItem("selected_plan"); // Clear any stale session plan
      localStorage.setItem("plan_confirmed", "false");
      localStorage.setItem("connected_channels", "[]");
      localStorage.setItem("configured_automations", "[]");
      // Optional: if a plan was pre-selected during signup (e.g. from landing page),
      // it's already in localStorage.selected_plan from the useEffect, which is fine.

      toast.success("Welcome to PartnerPeak!");
      router.push("/portal");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to complete setup");
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case "starter":
        return Zap;
      case "professional":
        return Crown;
      case "enterprise":
        return Building2;
    }
  };

  // Get enabled automations for the selected business kind
  const enabledAutomations = selectedBusinessKind
    ? businessKinds.find((b) => b.id === selectedBusinessKind)
        ?.enabledAutomations || []
    : [];
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Left side - Branding (Static background but animated content) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background border-r border-border">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary shadow-lg group-hover:rotate-12 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground">
              Partner<span className="text-primary">Peak</span>
            </span>
          </Link>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black mb-8 uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: "circOut" }}
              >
                <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight leading-[1.1]">
                  {step === 1 ? (
                    <>
                      Let's get your business{" "}
                      <span className="text-primary italic">Automated.</span>
                    </>
                  ) : step === 2 ? (
                    <>
                      Tell us what you{" "}
                      <span className="text-gradient">Do.</span>
                    </>
                  ) : (
                    <>
                      Secure your{" "}
                      <span className="text-gradient">Account.</span>
                    </>
                  )}
                </h1>

                <p className="text-xl text-muted-foreground font-semibold leading-relaxed max-w-lg">
                  {step === 1 &&
                    "Join 500+ businesses using intelligent multi-channel automation to scale faster and respond smarter."}
                  {step === 2 &&
                    "Different businesses have different needs. Tell us what you do so we can enable the right tools."}
                  {step === 3 &&
                    "We've sent a high-security verification code to your email address. It'll take just a moment."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-12">
            {[
              { label: "ACTIVE TEAMS", value: "500+" },
              { label: "LEADS CAPTURED", value: "10M+" },
              { label: "RESPONSE TIME", value: "< 1s" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-6">
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground">
              PartnerPeak
            </span>
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step
                      ? "w-6 bg-primary"
                      : s < step
                        ? "w-2 bg-primary/50"
                        : "w-2 bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Step {step}/{TOTAL_STEPS}
            </span>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Create Account & Business Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md"
              >
                <Card className="glass rounded-[2.5rem] shadow-2xl overflow-hidden group">
                  <CardHeader className="space-y-1 text-center">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Create Your Account
                    </CardTitle>
                    <CardDescription>
                      Join PartnerPeak and start automating
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Enter your business name"
                          value={businessDetails.name}
                          onChange={(e) =>
                            setBusinessDetails((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+234 xxx xxx xxxx"
                          value={businessDetails.phoneNumber}
                          onChange={(e) =>
                            setBusinessDetails((prev) => ({
                              ...prev,
                              phoneNumber: e.target.value,
                            }))
                          }
                          className="h-11"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleNextStep}
                      disabled={isLoading}
                      className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90 mt-2"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Continue to Business Type{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-primary hover:underline font-medium"
                      >
                        Sign in
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Business Type selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-2xl"
              >
                <Card className="glass rounded-[2.5rem] shadow-2xl overflow-hidden group">
                  <CardHeader className="text-center">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      What Type of Business Do You Run?
                    </CardTitle>
                    <CardDescription>
                      We'll tailor your dashboard based on your selection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {businessKinds.map((kind) => {
                        const isSelected = selectedBusinessKind === kind.id;
                        return (
                          <motion.button
                            key={kind.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedBusinessKind(kind.id)}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-lg"
                                : "border-border hover:border-primary/30"
                            }`}
                          >
                            <div
                              className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                                isSelected ? "gradient-primary" : "bg-secondary"
                              }`}
                            >
                              <div
                                className={
                                  isSelected
                                    ? "text-primary-foreground"
                                    : "text-foreground"
                                }
                              >
                                {kind.icon}
                              </div>
                            </div>
                            <h3 className="font-bold text-lg mb-1">
                              {kind.name}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {kind.description}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 h-11"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90"
                      >
                        Continue to Verification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Verify Email */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-sm"
              >
                <Card className="glass rounded-[2.5rem] shadow-2xl overflow-hidden group">
                  <CardHeader className="space-y-1 text-center">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Verify Email
                    </CardTitle>
                    <CardDescription>
                      Enter the 6-digit code sent to <strong>{email}</strong>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Verification Code</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="h-11 text-center text-lg tracking-widest"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        Use <strong>123456</strong> for demo
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="flex-1 h-11"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
