"use client";

import { AuthGuard } from "@/components/AuthGuard";
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
import { useAuth } from "@/hooks";
import { authService } from "@/services/auth.service";
import {
  FeatureType,
  PlanType,
  getMinimumPlanForFeatures,
  planDetails,
} from "@/lib/businessTypes";
import { generateSlug, validateSubdomain } from "@/lib/subdomain";
import { getErrorMessage } from "@/lib/utils";
import {
  signupStep1Schema,
  signupStep2Schema,
  signupStep3Schema,
  signupStep4Schema,
  type SignupStep1FormData,
  type SignupStep2FormData,
  type SignupStep3FormData,
  type SignupStep4FormData,
} from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Crown,
  Eye,
  EyeOff,
  Globe,
  HeadphonesIcon,
  Loader2,
  Mail,
  Megaphone,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const TOTAL_STEPS = 4;

const featureOptions: {
  id: FeatureType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "booking",
    name: "Appointment Booking",
    description: "Let customers book appointments via SMS/WhatsApp",
    icon: <Calendar className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "inquiries",
    name: "AI Inquiries",
    description: "Auto-respond to FAQs and pricing questions",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "support",
    name: "Live Support",
    description: "Voice IVR and agent escalation via Twilio Flex",
    icon: <HeadphonesIcon className="h-5 w-5" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "marketing",
    name: "Mass Marketing",
    description: "Bulk SMS/WhatsApp campaigns and contact management",
    icon: <Megaphone className="h-5 w-5" />,
    color: "from-orange-500 to-amber-500",
  },
];

export default function Signup() {
  return (
    <AuthGuard redirectIfAuthenticated>
      <SignupContent />
    </AuthGuard>
  );
}

function SignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signup } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupCompleted, setSignupCompleted] = useState(false);

  // Step 1 Form
  const step1Form = useForm<SignupStep1FormData>({
    resolver: zodResolver(signupStep1Schema),
    defaultValues: {
      email: "",
      password: "",
      businessName: "",
      businessSlug: "",
      phone: "",
    },
  });

  // Step 2 Form
  const step2Form = useForm<SignupStep2FormData>({
    resolver: zodResolver(signupStep2Schema),
    defaultValues: {
      features: ["booking", "inquiries"],
    },
  });

  // Step 3 Form
  const step3Form = useForm<SignupStep3FormData>({
    resolver: zodResolver(signupStep3Schema),
    defaultValues: {
      plan: "starter",
    },
  });

  // Step 4 Form
  const step4Form = useForm<SignupStep4FormData>({
    resolver: zodResolver(signupStep4Schema),
    defaultValues: {
      verificationCode: "",
    },
  });

  // Watch values for dynamic updates
  const selectedFeatures = step2Form.watch("features");
  const selectedPlan = step3Form.watch("plan");
  const businessName = step1Form.watch("businessName");
  const email = step1Form.watch("email");

  // Calculate minimum plan based on features
  const minimumPlan = getMinimumPlanForFeatures(selectedFeatures as FeatureType[]);

  // Auto-select minimum plan when features change
  useEffect(() => {
    const planOrder: PlanType[] = ["starter", "growth", "pro"];
    const minimumIndex = planOrder.indexOf(minimumPlan);
    const selectedIndex = planOrder.indexOf(selectedPlan);

    if (selectedIndex < minimumIndex) {
      step3Form.setValue("plan", minimumPlan);
    }
  }, [selectedFeatures, minimumPlan, selectedPlan, step3Form]);

  // Pre-select plan from URL
  useEffect(() => {
    const planParam = searchParams?.get("plan");
    if (planParam && ["starter", "growth", "pro"].includes(planParam)) {
      step3Form.setValue("plan", planParam as PlanType);
    }
  }, [searchParams, step3Form]);

  // Auto-generate slug from business name
  useEffect(() => {
    if (businessName && !step1Form.formState.dirtyFields.businessSlug) {
      const slug = generateSlug(businessName);
      step1Form.setValue("businessSlug", slug, { shouldValidate: true });
    }
  }, [businessName, step1Form]);

  const toggleFeature = (feature: FeatureType) => {
    const current = step2Form.getValues("features");
    if (current.includes(feature)) {
      if (current.length === 1) return; // Don't allow removing last feature
      step2Form.setValue(
        "features",
        current.filter((f) => f !== feature),
        { shouldValidate: true }
      );
    } else {
      step2Form.setValue("features", [...current, feature], { shouldValidate: true });
    }
  };

  const handleStep1Submit = async (data: SignupStep1FormData) => {
    // Additional slug validation
    const slugError = validateSubdomain(data.businessSlug);
    if (slugError) {
      step1Form.setError("businessSlug", { message: slugError });
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = async () => {
    const isValid = await step2Form.trigger();
    if (isValid) {
      setStep(3);
    }
  };

  const handleStep3Submit = async () => {
    const isValid = await step3Form.trigger();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const step1Data = step1Form.getValues();
      const step2Data = step2Form.getValues();

      // Call signup - this will send verification email from backend
      await signup({
        email: step1Data.email,
        password: step1Data.password,
        name: step1Data.businessName,
        role: "client",
        businessName: step1Data.businessName,
        businessSlug: step1Data.businessSlug,
        features: step2Data.features,
      });

      setSignupCompleted(true);
      toast.success("Verification code sent to your email");
      setStep(4);
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const errorMessage = getErrorMessage(error, "Failed to create account");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep4Submit = async (data: SignupStep4FormData) => {
    setIsLoading(true);
    try {
      await authService.verifyEmail(email, data.verificationCode);
      toast.success("Email verified!");
      handleCompleteOnboarding();
    } catch (error: unknown) {
      console.error("Verification error:", error);
      const errorMessage = getErrorMessage(error, "Invalid verification code");
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = () => {
    const step1Data = step1Form.getValues();
    const step2Data = step2Form.getValues();
    const step3Data = step3Form.getValues();

    // Store setup data
    localStorage.setItem("selected_features", JSON.stringify(step2Data.features));
    localStorage.setItem("selected_plan", step3Data.plan);
    localStorage.setItem("business_details", JSON.stringify({
      name: step1Data.businessName,
      slug: step1Data.businessSlug,
      email: step1Data.email,
      phone: step1Data.phone,
    }));
    localStorage.setItem("plan_confirmed", "true");

    toast.success("Welcome to Communicate!");
    router.push("/portal");
  };

  const handleResendCode = async () => {
    try {
      await authService.resendVerification(email);
      toast.success("Verification code resent!");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to resend code"));
    }
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case "starter": return Zap;
      case "growth": return Crown;
      case "pro": return Building2;
    }
  };

  const isPlanDisabled = (plan: PlanType): boolean => {
    const planOrder: PlanType[] = ["starter", "growth", "pro"];
    return planOrder.indexOf(plan) < planOrder.indexOf(minimumPlan);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background border-r border-border">
        <div className="absolute inset-0 gradient-primary opacity-[0.03]" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary shadow-lg group-hover:rotate-12 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground">
              Communicate
            </span>
          </Link>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black mb-8 uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              Twilio-Powered
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
                  {step === 1 && <>Build your <span className="text-primary italic">Communication Suite.</span></>}
                  {step === 2 && <>Choose your <span className="text-gradient">Features.</span></>}
                  {step === 3 && <>Select your <span className="text-gradient">Plan.</span></>}
                  {step === 4 && <>Secure your <span className="text-gradient">Account.</span></>}
                </h1>

                <p className="text-xl text-muted-foreground font-semibold leading-relaxed max-w-lg">
                  {step === 1 && "Join businesses using intelligent SMS, WhatsApp, and voice automation powered by Twilio."}
                  {step === 2 && "Select the features you need. We'll set up your isolated Twilio environment automatically."}
                  {step === 3 && "Choose a plan that fits your needs. Upgrade anytime as you grow."}
                  {step === 4 && "We've sent a verification code to your email. It'll take just a moment."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-12">
            {[
              { label: "ACTIVE BUSINESSES", value: "500+" },
              { label: "MESSAGES SENT", value: "10M+" },
              { label: "RESPONSE TIME", value: "< 1s" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-foreground mb-1">{stat.value}</div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</div>
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
              Communicate
            </span>
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? "w-6 bg-primary" : s < step ? "w-2 bg-primary/50" : "w-2 bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Step {step}/{TOTAL_STEPS}</span>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Create Account */}
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
                    <CardTitle className="text-2xl font-bold text-foreground">Create Your Account</CardTitle>
                    <CardDescription>Start building your communication suite</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@company.com"
                          {...step1Form.register("email")}
                          className="h-11"
                        />
                        {step1Form.formState.errors.email && (
                          <p className="text-xs text-destructive">{step1Form.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Min 8 characters"
                            {...step1Form.register("password")}
                            className="h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {step1Form.formState.errors.password && (
                          <p className="text-xs text-destructive">{step1Form.formState.errors.password.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Your Business Name"
                          {...step1Form.register("businessName")}
                          className="h-11"
                        />
                        {step1Form.formState.errors.businessName && (
                          <p className="text-xs text-destructive">{step1Form.formState.errors.businessName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessSlug">
                          <span className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5" />
                            Business URL
                          </span>
                        </Label>
                        <div className="flex items-center gap-0">
                          <Input
                            id="businessSlug"
                            placeholder="your-business"
                            {...step1Form.register("businessSlug")}
                            className={`h-11 rounded-r-none border-r-0 ${step1Form.formState.errors.businessSlug ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                          />
                          <div className="h-11 px-3 flex items-center bg-muted border border-input rounded-r-md text-sm text-muted-foreground">
                            .yoursaas.com
                          </div>
                        </div>
                        {step1Form.formState.errors.businessSlug && (
                          <p className="text-xs text-destructive">{step1Form.formState.errors.businessSlug.message}</p>
                        )}
                        {!step1Form.formState.errors.businessSlug && step1Form.watch("businessSlug") && (
                          <p className="text-xs text-muted-foreground">
                            Your portal: <span className="text-primary font-medium">{step1Form.watch("businessSlug")}.yoursaas.com/portal</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...step1Form.register("phone")}
                          className="h-11"
                        />
                      </div>

                      <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90 mt-2">
                        Select Features <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Feature Selection */}
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
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">What Features Do You Need?</CardTitle>
                    <CardDescription>Select all that apply. You can always add more later.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {featureOptions.map((feature) => {
                        const isSelected = selectedFeatures.includes(feature.id);
                        return (
                          <motion.button
                            key={feature.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleFeature(feature.id)}
                            className={`p-5 rounded-2xl border-2 text-left transition-all ${
                              isSelected ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.color} text-white`}>
                                {feature.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold">{feature.name}</h3>
                                  {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {step2Form.formState.errors.features && (
                      <p className="text-sm text-destructive text-center">{step2Form.formState.errors.features.message}</p>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">Back</Button>
                      <Button onClick={handleStep2Submit} className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90">
                        Choose Plan <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Plan Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-3xl"
              >
                <Card className="glass rounded-[2.5rem] shadow-2xl overflow-hidden group">
                  <CardHeader className="text-center">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Choose Your Plan</CardTitle>
                    <CardDescription>
                      Based on your selected features, we recommend the{" "}
                      <span className="text-primary font-semibold">{planDetails[minimumPlan].name}</span> plan or higher.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(Object.keys(planDetails) as PlanType[]).map((plan) => {
                        const details = planDetails[plan];
                        const PlanIcon = getPlanIcon(plan);
                        const isSelected = selectedPlan === plan;
                        const isDisabled = isPlanDisabled(plan);

                        return (
                          <motion.button
                            key={plan}
                            type="button"
                            whileHover={!isDisabled ? { scale: 1.02 } : {}}
                            whileTap={!isDisabled ? { scale: 0.98 } : {}}
                            onClick={() => !isDisabled && step3Form.setValue("plan", plan)}
                            disabled={isDisabled}
                            className={`p-5 rounded-2xl border-2 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-lg"
                                : isDisabled
                                  ? "border-border/50 opacity-50 cursor-not-allowed"
                                  : "border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isSelected ? "gradient-primary" : "bg-secondary"}`}>
                                <PlanIcon className={`h-5 w-5 ${isSelected ? "text-white" : "text-foreground"}`} />
                              </div>
                              {plan === minimumPlan && (
                                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-lg">{details.name}</h3>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-2xl font-black">{details.price}</span>
                              <span className="text-muted-foreground text-sm">/month</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{details.description}</p>
                            <div className="mt-3 text-xs text-muted-foreground">
                              <div>{details.maxPhoneNumbers} phone number{details.maxPhoneNumbers > 1 ? 's' : ''}</div>
                              <div>{details.maxMessages} messages/mo</div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11">Back</Button>
                      <Button
                        onClick={handleStep3Submit}
                        disabled={isLoading}
                        className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Verify Email */}
            {step === 4 && (
              <motion.div
                key="step4"
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
                    <CardTitle className="text-2xl font-bold text-foreground">Verify Email</CardTitle>
                    <CardDescription>
                      Enter the 6-digit code sent to <strong>{email}</strong>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={step4Form.handleSubmit(handleStep4Submit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Verification Code</Label>
                        <Input
                          id="code"
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter 6-digit code"
                          {...step4Form.register("verificationCode")}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            step4Form.setValue("verificationCode", value);
                          }}
                          maxLength={6}
                          className="h-11 text-center text-lg tracking-widest font-mono"
                        />
                        {step4Form.formState.errors.verificationCode && (
                          <p className="text-xs text-destructive text-center">{step4Form.formState.errors.verificationCode.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground text-center">
                          Check your email for the verification code
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-sm text-muted-foreground hover:text-primary"
                        onClick={handleResendCode}
                      >
                        Didn't receive the code? Resend
                      </Button>

                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-11">Back</Button>
                        <Button type="submit" disabled={isLoading} className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90">
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Complete"}
                        </Button>
                      </div>
                    </form>
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
