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
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/utils";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Loader2, Mail, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPassword() {
  return (
    <AuthGuard redirectIfAuthenticated>
      <ForgotPasswordContent />
    </AuthGuard>
  );
}

function ForgotPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("Password reset code sent to your email!");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(getErrorMessage(error, "Failed to send reset email"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnother = () => {
    setIsSubmitted(false);
    setSubmittedEmail("");
    reset();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background border-r border-border">
        <div className="absolute inset-0 gradient-primary opacity-[0.05]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-lg group-hover:rotate-12 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground">
              Partner<span className="text-primary">Peak</span>
            </span>
          </Link>

          <div className="max-w-md">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-foreground mb-4"
            >
              Reset your password
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg"
            >
              We'll send you a secure link to reset your password and get you
              back into your account.
            </motion.p>
          </div>

          <p className="text-muted-foreground text-sm">
            Trusted by 500+ businesses worldwide
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex justify-between items-center p-6 bg-background/80 backdrop-blur-sm">
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tighter text-foreground">
              Partner<span className="text-primary">Peak</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 bg-background relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#06B6D4]/5 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm relative z-10"
          >
            <Card className="glass rounded-[2.5rem] shadow-2xl overflow-hidden group">
              <CardHeader className="space-y-1 text-center">
                {isSubmitted ? (
                  <>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Check your email
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      We've sent a 6-digit reset code to{" "}
                      <span className="font-medium text-foreground">
                        {submittedEmail}
                      </span>
                    </CardDescription>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Forgot password?
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      No worries, we'll send you reset instructions.
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Didn't receive the email? Check your spam folder or try
                      again.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full h-11 hover:bg-primary/10"
                      onClick={handleTryAnother}
                    >
                      Try another email
                    </Button>
                    <Link href={`/reset-password?email=${encodeURIComponent(submittedEmail)}`} className="block">
                      <Button className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90">
                        Enter Reset Code
                      </Button>
                    </Link>
                    <Link href="/login" className="block">
                      <Button variant="outline" className="w-full h-11 hover:bg-primary/10">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        className={`h-11 ${errors.email ? "border-destructive" : ""}`}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Reset password"
                      )}
                    </Button>
                    <Link href="/login" className="block">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-11 hover:bg-primary/10"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                      </Button>
                    </Link>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
