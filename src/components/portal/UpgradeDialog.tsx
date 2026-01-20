import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building2, Loader2, ArrowDown, ArrowUp } from 'lucide-react';
import { PlanType, planDetails } from '@/lib/onboardingTypes';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanType;
  onPlanChange: (newPlan: PlanType) => void;
  mode?: 'upgrade' | 'downgrade' | 'both';
}

const planOrder: PlanType[] = ['starter', 'professional', 'enterprise'];

export function UpgradeDialog({ 
  open, 
  onOpenChange, 
  currentPlan, 
  onPlanChange,
  mode = 'both'
}: UpgradeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'starter': return Zap;
      case 'professional': return Crown;
      case 'enterprise': return Building2;
    }
  };

  const currentPlanIndex = planOrder.indexOf(currentPlan);

  const getAvailablePlans = () => {
    return (Object.entries(planDetails) as [PlanType, typeof planDetails.starter][]).filter(([key]) => {
      const planIndex = planOrder.indexOf(key);
      if (mode === 'upgrade') return planIndex > currentPlanIndex;
      if (mode === 'downgrade') return planIndex < currentPlanIndex;
      return key !== currentPlan;
    });
  };

  const isUpgrade = (plan: PlanType) => {
    return planOrder.indexOf(plan) > currentPlanIndex;
  };

  const handleChangePlan = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onPlanChange(selectedPlan);
    localStorage.setItem('selected_plan', selectedPlan);
    
    const action = isUpgrade(selectedPlan) ? 'upgraded' : 'downgraded';
    toast.success(`Successfully ${action} to ${planDetails[selectedPlan].name} plan!`);
    
    setIsProcessing(false);
    setSelectedPlan(null);
    onOpenChange(false);
  };

  const availablePlans = getAvailablePlans();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'upgrade' ? 'Upgrade Your Plan' : mode === 'downgrade' ? 'Downgrade Your Plan' : 'Change Your Plan'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'upgrade' 
              ? 'Unlock more features and capabilities'
              : mode === 'downgrade'
                ? 'Switch to a more affordable option'
                : 'Choose the plan that best fits your needs'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Current Plan */}
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
                  <div className="font-semibold">{planDetails[currentPlan].name}</div>
                  <div className="text-sm text-muted-foreground">Current plan</div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">Active</Badge>
            </div>
          </div>

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
                  onClick={() => setSelectedPlan(key)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${
                        isSelected ? 'gradient-primary' : 'bg-secondary'
                      }`}>
                        <PlanIcon className={`h-5 w-5 ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{plan.name}</span>
                          {upgrading ? (
                            <Badge variant="secondary" className="bg-accent/10 text-accent text-xs gap-1">
                              <ArrowUp className="h-3 w-3" />
                              Upgrade
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs gap-1">
                              <ArrowDown className="h-3 w-3" />
                              Downgrade
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{plan.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{plan.price}</div>
                      <div className="text-xs text-muted-foreground">/month</div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Channels:</span>{' '}
                          <span className="font-medium">{plan.maxChannels}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Automations:</span>{' '}
                          <span className="font-medium">{plan.maxAutomations === 'unlimited' ? 'Unlimited' : plan.maxAutomations}</span>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-accent shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
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
              {mode === 'upgrade' && currentPlan === 'enterprise' 
                ? "You're already on the highest plan!" 
                : mode === 'downgrade' && currentPlan === 'starter'
                  ? "You're already on the basic plan."
                  : 'No other plans available.'}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleChangePlan}
            disabled={!selectedPlan || isProcessing}
            className="flex-1 gradient-primary text-primary-foreground"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : selectedPlan ? (
              `${isUpgrade(selectedPlan) ? 'Upgrade' : 'Downgrade'} to ${planDetails[selectedPlan].name}`
            ) : (
              'Select a Plan'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}