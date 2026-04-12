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
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/utils";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const email = searchParams?.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams?.get("token") || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      toast.error("Email is missing. Please go back and request a new reset code.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, data.token, data.password);
      setIsSubmitted(true);
      toast.success("Password has been reset successfully!");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Invalid or expired reset code"));
    } finally {
      setIsLoading(false);
    }
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
              Secure your account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg"
            >
              Create a strong password to protect your account and your
              automation workflows.
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
                      Password Reset
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your password has been successfully reset. You can now log
                      in with your new password.
                    </CardDescription>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Set New Password
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Please enter your new password below.
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="space-y-4">
                    <Link href="/login" className="block">
                      <Button className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90">
                        Proceed to Login
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
                        value={email}
                        disabled
                        className="h-11 bg-muted"
                      />
                      {!email && (
                        <p className="text-sm text-destructive">
                          Email is missing. <Link href="/forgot-password" className="underline">Request a new reset code</Link>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="token">Reset Code</Label>
                      <Input
                        id="token"
                        type="text"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className={`h-11 text-center text-xl tracking-[0.5em] font-mono ${errors.token ? "border-destructive" : ""}`}
                        {...register("token")}
                      />
                      {errors.token && (
                        <p className="text-sm text-destructive">{errors.token.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`h-11 pr-10 ${errors.password ? "border-destructive" : ""}`}
                          {...register("password")}
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
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`h-11 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                          {...register("confirmPassword")}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90"
                      disabled={isLoading || !email}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        "Update Password"
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
