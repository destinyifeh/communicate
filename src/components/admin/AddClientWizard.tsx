import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  CheckCircle,
  Zap,
  Crown,
  Sparkles,
  Instagram,
  Facebook,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Client } from '@/lib/mockData';
import { PlanType, planDetails, ChannelType } from '@/lib/onboardingTypes';

interface AddClientWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: (client: Client) => void;
}

const TikTokIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Select Plan', icon: CreditCard },
  { id: 3, title: 'Channels', icon: MessageSquare },
  { id: 4, title: 'Complete', icon: CheckCircle },
];

const channelOptions: { type: ChannelType; name: string; icon: React.ReactNode; color: string }[] = [
  { type: 'instagram', name: 'Instagram', icon: <Instagram className="h-5 w-5" />, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { type: 'facebook', name: 'Facebook', icon: <Facebook className="h-5 w-5" />, color: 'bg-blue-600' },
  { type: 'whatsapp', name: 'WhatsApp', icon: <MessageSquare className="h-5 w-5" />, color: 'bg-green-500' },
  { type: 'tiktok', name: 'TikTok', icon: <TikTokIcon />, color: 'bg-foreground' },
];

export function AddClientWizard({ open, onOpenChange, onClientAdded }: AddClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    whatsappNumber: '',
    plan: 'starter' as PlanType,
    channels: [] as ChannelType[],
  });

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.company) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    if (currentStep === 3) {
      if (formData.channels.length === 0) {
        toast.error('Please select at least one channel');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleChannelToggle = (channel: ChannelType) => {
    const maxChannels = planDetails[formData.plan].maxChannels;
    
    if (formData.channels.includes(channel)) {
      setFormData({
        ...formData,
        channels: formData.channels.filter(c => c !== channel)
      });
    } else {
      if (formData.channels.length >= maxChannels) {
        toast.error(`${planDetails[formData.plan].name} plan allows only ${maxChannels} channel(s)`);
        return;
      }
      setFormData({
        ...formData,
        channels: [...formData.channels, channel]
      });
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newClient: Client = {
      id: `client_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      company: formData.company,
      phone: formData.phone || '+234 000 000 0000',
      plan: planDetails[formData.plan].name as 'Starter' | 'Professional' | 'Enterprise',
      status: 'active',
      leadsUsed: 0,
      leadLimit: formData.plan === 'starter' ? 500 : formData.plan === 'professional' ? 2500 : 10000,
      revenue: 0,
      apiKey: 'ak_live_' + Math.random().toString(36).substring(2, 30),
      joinedDate: new Date().toISOString().split('T')[0],
      platforms: {
        whatsapp: formData.channels.includes('whatsapp'),
        instagram: formData.channels.includes('instagram'),
        facebook: formData.channels.includes('facebook'),
        tiktok: formData.channels.includes('tiktok'),
      },
      notificationNumber: formData.whatsappNumber || formData.phone,
      automations: [],
      planExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    onClientAdded(newClient);
    setIsLoading(false);
    toast.success('Client created successfully!');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      whatsappNumber: '',
      plan: 'starter',
      channels: [],
    });
    setCurrentStep(1);
    onOpenChange(false);
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'starter': return Zap;
      case 'professional': return Crown;
      case 'enterprise': return Sparkles;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Complete the onboarding process for a new client
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="relative py-4">
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted 
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-muted bg-background text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="absolute top-9 left-0 right-0 h-0.5 bg-border -z-0">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 py-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company Ltd"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Plan */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 py-4"
            >
              {(Object.entries(planDetails) as [PlanType, typeof planDetails.starter][]).map(([key, plan]) => {
                const PlanIcon = getPlanIcon(key);
                const isSelected = formData.plan === key;

                return (
                  <button
                    key={key}
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        plan: key,
                        channels: formData.channels.slice(0, plan.maxChannels)
                      });
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                          isSelected ? 'gradient-primary' : 'bg-secondary'
                        }`}>
                          <PlanIcon className={`h-6 w-6 ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{plan.name}</span>
                            {key === 'professional' && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Popular</Badge>
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
                    <div className="mt-3 text-xs text-muted-foreground">
                      {plan.maxChannels} channels • {plan.maxAutomations === 'unlimited' ? 'Unlimited' : plan.maxAutomations} automations
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Step 3: Channels */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 py-4"
            >
              <div className="text-center mb-4">
                <p className="text-muted-foreground">
                  Select up to {planDetails[formData.plan].maxChannels} channel(s) for {planDetails[formData.plan].name} plan
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {channelOptions.map((channel) => {
                  const isSelected = formData.channels.includes(channel.type);
                  const isDisabled = !isSelected && formData.channels.length >= planDetails[formData.plan].maxChannels;

                  return (
                    <button
                      key={channel.type}
                      onClick={() => handleChannelToggle(channel.type)}
                      disabled={isDisabled}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : isDisabled
                            ? 'border-border opacity-50 cursor-not-allowed'
                            : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`h-12 w-12 rounded-lg ${channel.color} flex items-center justify-center text-white`}>
                          {channel.icon}
                        </div>
                        <span className="font-medium">{channel.name}</span>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {formData.channels.length} of {planDetails[formData.plan].maxChannels} channels selected
              </div>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-8 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Create Client</h3>
              <p className="text-muted-foreground mb-6">
                Review the details and click complete to add the client
              </p>

              <div className="text-left p-4 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium">{formData.company}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan:</span>
                  <Badge variant="secondary">{planDetails[formData.plan].name}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Channels:</span>
                  <span className="font-medium capitalize">{formData.channels.join(', ')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? () => onOpenChange(false) : handleBack}
          >
            {currentStep === 1 ? 'Cancel' : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </>
            )}
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext} className="gradient-primary text-primary-foreground">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={isLoading}
              className="gradient-primary text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
