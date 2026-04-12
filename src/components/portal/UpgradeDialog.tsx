import { PaymentModal } from "@/components/portal/PaymentModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanType, planDetails } from "@/lib/businessTypes";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Building2,
  Calendar,
  Check,
  CreditCard,
  Crown,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanType;
  onPlanChange: (newPlan: PlanType) => void;
  mode?: "upgrade" | "downgrade" | "both";
  planExpiryDate?: string;
}

const planOrder: PlanType[] = ["starter", "growth", "pro"];

export function UpgradeDialog({
  open,
  onOpenChange,
  currentPlan,
  onPlanChange,
  mode = "both",
  planExpiryDate = "2025-02-15",
}: UpgradeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDowngradeInfo, setShowDowngradeInfo] = useState(false);

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case "starter":
        return Zap;
      case "growth":
        return Crown;
      case "pro":
        return Building2;
    }
  };

  const currentPlanIndex = planOrder.indexOf(currentPlan);
  const planConfirmed = typeof window !== "undefined" && localStorage.getItem("plan_confirmed") === "true";

  const getAvailablePlans = () => {
    return (
      Object.entries(planDetails) as [PlanType, typeof planDetails.starter][]
    ).filter(([key]) => {
      const planIndex = planOrder.indexOf(key);
      if (mode === "upgrade") return planIndex > currentPlanIndex;
      if (mode === "downgrade") return planIndex < currentPlanIndex;
      // If plan is not confirmed, show everything (including current) so they can "pick" it
      if (!planConfirmed) return true;
      return key !== currentPlan;
    });
  };

  const isUpgrade = (plan: PlanType) => {
    return planOrder.indexOf(plan) > currentPlanIndex;
  };

  const handlePlanSelect = (plan: PlanType) => {
    setSelectedPlan(plan);
    if (isUpgrade(plan)) {
      setShowDowngradeInfo(false);
    } else {
      setShowDowngradeInfo(true);
    }
  };

  const handleChangePlan = async () => {
    if (!selectedPlan) return;

    const upgrading = isUpgrade(selectedPlan);

    if (selectedPlan === currentPlan) {
      // Confirming the current plan (e.g. Starter during onboarding)
      localStorage.setItem("plan_confirmed", "true");
      localStorage.setItem("selected_plan", selectedPlan);
      onPlanChange(selectedPlan);
      toast.success(`${planDetails[selectedPlan].name} plan confirmed!`);
      setSelectedPlan(null);
      onOpenChange(false);
      return;
    }

    if (!upgrading) {
      // Downgrade - schedule for expiry
      toast.success(
        `Plan downgrade to ${planDetails[selectedPlan].name} scheduled`,
        {
          description: `Your plan will change on ${new Date(planExpiryDate).toLocaleDateString()}. Downgrade is only allowed when your current plan expires.`,
        },
      );
      setSelectedPlan(null);
      setShowDowngradeInfo(false);
      onOpenChange(false);
      return;
    }

    // Upgrade - show payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (!selectedPlan) return;

    localStorage.setItem("selected_plan", selectedPlan);
    localStorage.setItem("plan_confirmed", "true");
    onPlanChange(selectedPlan);

    toast.success(
      `Successfully upgraded to ${planDetails[selectedPlan].name} plan!`,
      {
        description: "Your new features are now active",
      },
    );

    setSelectedPlan(null);
    setShowPaymentModal(false);
    onOpenChange(false);
  };

  const availablePlans = getAvailablePlans();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "upgrade"
                ? "Upgrade Your Plan"
                : mode === "downgrade"
                  ? "Downgrade Your Plan"
                  : "Change Your Plan"}
            </DialogTitle>
            <DialogDescription>
              {mode === "upgrade"
                ? "Unlock more features and capabilities"
                : mode === "downgrade"
                  ? "Switch to a more affordable option"
                  : "Choose the plan that best fits your needs"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Current Plan - Only show if confirmed */}
            {planConfirmed && (
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = getPlanIcon(currentPlan);
                      return (
                        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                      );
                    })()}
                    <div>
                      <div className="font-semibold">
                        {planDetails[currentPlan].name}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        Current plan
                        <span className="text-xs">
                          • Expires{" "}
                          {new Date(planExpiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            )}

            {/* Upgrade Info */}
            {selectedPlan && isUpgrade(selectedPlan) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-primary/5 border-2 border-primary"
              >
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">
                      Payment Required
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Upgrading to{" "}
                      <strong>{planDetails[selectedPlan].name}</strong> requires
                      payment of{" "}
                      <strong>{planDetails[selectedPlan].price}/month</strong>.
                      Your new features will be activated immediately after
                      payment.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-accent" />
                      <span>Instant activation</span>
                      <Check className="h-3 w-3 text-accent ml-2" />
                      <span>Pro-rated billing</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Downgrade Info */}
            {showDowngradeInfo && selectedPlan && !isUpgrade(selectedPlan) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-yellow-500/10 border-2 border-yellow-500/30"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
                      Downgrade Notice
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Downgrading to{" "}
                      <strong>{planDetails[selectedPlan].name}</strong> is only
                      allowed when your current plan expires on{" "}
                      <strong>
                        {new Date(planExpiryDate).toLocaleDateString()}
                      </strong>
                      . You'll continue to have access to all current features
                      until then.
                    </p>
                    <div className="flex items-center gap-2 p-2 rounded bg-yellow-500/10 text-xs">
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                      <span className="text-yellow-600 dark:text-yellow-400">
                        You may lose access to some channels and automations
                        with a lower plan
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Available Plans */}
            <div className="space-y-3">
              {availablePlans.map(([key, plan]) => {
                const PlanIcon = getPlanIcon(key);
                const isSelected = selectedPlan === key;
                const upgrading = isUpgrade(key);

                return (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => handlePlanSelect(key)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-11 w-11 rounded-lg flex items-center justify-center ${
                            isSelected ? "gradient-primary" : "bg-secondary"
                          }`}
                        >
                          <PlanIcon
                            className={`h-5 w-5 ${isSelected ? "text-primary-foreground" : "text-foreground"}`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{plan.name}</span>
                            {planConfirmed && (
                              <>
                                {key === currentPlan ? (
                                  <Badge
                                    variant="secondary"
                                    className="bg-primary/10 text-primary text-xs shrink-0"
                                  >
                                    Current
                                  </Badge>
                                ) : upgrading ? (
                                  <Badge
                                    variant="secondary"
                                    className="bg-accent/10 text-accent text-xs gap-1 shrink-0"
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                    Upgrade
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs gap-1 shrink-0"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                    Downgrade
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {plan.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{plan.price}</div>
                        <div className="text-xs text-muted-foreground">
                          /month
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Phone Numbers:
                            </span>{" "}
                            <span className="font-medium">
                              {plan.maxPhoneNumbers}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Messages/mo:
                            </span>{" "}
                            <span className="font-medium">
                              {plan.maxMessages.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          {plan.features.map((feature, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Check className="h-4 w-4 text-accent shrink-0" />
                              <span className="text-muted-foreground">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {availablePlans.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {mode === "upgrade" && currentPlan === "pro"
                  ? "You're already on the highest plan!"
                  : mode === "downgrade" && currentPlan === "starter"
                    ? "You're already on the basic plan."
                    : "No other plans available."}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedPlan(null);
                setShowDowngradeInfo(false);
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePlan}
              disabled={!selectedPlan}
              className="flex-1 gradient-primary text-primary-foreground"
            >
              {selectedPlan ? (
                isUpgrade(selectedPlan) ? (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay & Upgrade to {planDetails[selectedPlan].name}
                  </>
                ) : (
                  <>Schedule Downgrade to {planDetails[selectedPlan].name}</>
                )
              ) : (
                "Select a Plan"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
          planName={planDetails[selectedPlan].name}
          amount={planDetails[selectedPlan].price}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
