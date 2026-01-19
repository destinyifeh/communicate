import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, Loader2, Eye, EyeOff, Crown, Building2, Check, 
  Instagram, Facebook, MessageSquare, Mail, CreditCard,
  ArrowRight, CheckCircle2, Globe, Phone, Building, Sparkles,
  Target, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  PlanType, 
  planDetails, 
  ChannelType, 
  ChannelConnection, 
  BusinessDetails,
  countries,
  mockManyChatOAuth,
  mockTikTokOAuth,
  automationGoals,
  AutomationGoalType,
  ConfiguredAutomation
} from '@/lib/onboardingTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TOTAL_STEPS = 7;

const stepTitles = {
  1: 'Create Account',
  2: 'Verify Email',
  3: 'Business Details',
  4: 'Select Plan',
  5: 'Payment',
  6: 'Connect Channels',
  7: 'Setup Automations',
};

const TikTokIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const channelInfo: Record<ChannelType, { icon: React.ReactNode; name: string; color: string }> = {
  instagram: { icon: <Instagram className="h-5 w-5" />, name: 'Instagram', color: 'from-purple-500 to-pink-500' },
  facebook: { icon: <Facebook className="h-5 w-5" />, name: 'Facebook', color: 'from-blue-600 to-blue-500' },
  whatsapp: { icon: <MessageSquare className="h-5 w-5" />, name: 'WhatsApp', color: 'from-green-500 to-green-400' },
  tiktok: { icon: <TikTokIcon />, name: 'TikTok', color: 'from-gray-900 to-gray-700 dark:from-white dark:to-gray-200' },
};

export default function Signup() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState<ChannelType | null>(null);
  
  // Step 1: Account
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2: Email Verification
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  
  // Step 3: Business Details
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    name: '',
    email: '',
    whatsappNumber: '',
    phoneNumber: '',
    country: '',
  });
  
  // Step 4: Plan Selection
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('starter');
  
  // Step 5: Payment
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // Step 6: Channel Connections
  const [channels, setChannels] = useState<ChannelConnection[]>([
    { type: 'instagram', connected: false },
    { type: 'facebook', connected: false },
    { type: 'whatsapp', connected: false },
    { type: 'tiktok', connected: false },
  ]);

  // Step 7: Automation Setup
  const [selectedGoal, setSelectedGoal] = useState<AutomationGoalType | null>(null);
  const [goalConfig, setGoalConfig] = useState('');
  const [configuredAutomations, setConfiguredAutomations] = useState<ConfiguredAutomation[]>([]);
  const [selectedChannelForAutomation, setSelectedChannelForAutomation] = useState<ChannelType | null>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const currentPlan = planDetails[selectedPlan];

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && ['starter', 'professional', 'enterprise'].includes(planParam)) {
      setSelectedPlan(planParam as PlanType);
    }
  }, [searchParams]);

  const connectedChannelsCount = channels.filter(c => c.connected).length;
  const maxChannels = currentPlan.maxChannels;
  const connectedChannelsList = channels.filter(c => c.connected);
  const maxAutomations = currentPlan.maxAutomations === 'unlimited' ? 999 : currentPlan.maxAutomations;

  const handleNextStep = async () => {
    if (step === 1) {
      if (!email || !password) {
        toast.error('Please fill in all fields');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      toast.success('Verification code sent to your email');
      setStep(2);
    } else if (step === 2) {
      if (verificationCode !== '123456') {
        toast.error('Invalid verification code. Use 123456 for demo.');
        return;
      }
      setEmailVerified(true);
      toast.success('Email verified!');
      setStep(3);
    } else if (step === 3) {
      if (!businessDetails.name || !businessDetails.email || !businessDetails.whatsappNumber || !businessDetails.country) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentCompleted(true);
      setIsLoading(false);
      toast.success('Payment successful!');
      setStep(6);
    } else if (step === 6) {
      if (connectedChannelsCount === 0) {
        toast.error('Please connect at least one channel');
        return;
      }
      // Set default channel for automation
      if (connectedChannelsList.length > 0) {
        setSelectedChannelForAutomation(connectedChannelsList[0].type);
      }
      setStep(7);
    }
  };

  const handleConnectChannel = async (channelType: ChannelType) => {
    if (connectedChannelsCount >= maxChannels) {
      toast.error(`Your ${currentPlan.name} plan allows only ${maxChannels} channel(s)`);
      return;
    }
    
    setConnectingChannel(channelType);
    
    try {
      const response = channelType === 'tiktok' 
        ? await mockTikTokOAuth() 
        : await mockManyChatOAuth(channelType);
      
      if (response.success) {
        setChannels(prev => prev.map(ch => 
          ch.type === channelType 
            ? { 
                ...ch, 
                connected: true, 
                workspaceId: response.workspaceId,
                accessToken: response.accessToken,
                accountName: response.accountName,
                connectedAt: new Date().toISOString(),
              } 
            : ch
        ));
        toast.success(`${channelInfo[channelType].name} connected successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to connect ${channelInfo[channelType].name}`);
    } finally {
      setConnectingChannel(null);
    }
  };

  const handleAddAutomation = () => {
    if (!selectedGoal || !goalConfig || !selectedChannelForAutomation) {
      toast.error('Please select a goal, channel, and provide configuration');
      return;
    }

    if (configuredAutomations.length >= maxAutomations) {
      toast.error(`You've reached the maximum automations for your ${currentPlan.name} plan`);
      return;
    }

    const goal = automationGoals.find(g => g.id === selectedGoal);
    if (!goal) return;

    const newAutomation: ConfiguredAutomation = {
      goalId: selectedGoal,
      goalName: goal.name,
      config: goalConfig,
      channel: selectedChannelForAutomation,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setConfiguredAutomations(prev => [...prev, newAutomation]);
    setSelectedGoal(null);
    setGoalConfig('');
    toast.success('Automation configured successfully!');
  };

  const handleCompleteOnboarding = async () => {
    if (configuredAutomations.length === 0) {
      toast.error('Please set up at least one automation');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup(email, password, businessDetails.name, 'client');
      // In a real app, save automations to backend here
      localStorage.setItem('configured_automations', JSON.stringify(configuredAutomations));
      localStorage.setItem('connected_channels', JSON.stringify(channels.filter(c => c.connected)));
      localStorage.setItem('selected_plan', selectedPlan);
      toast.success('Welcome to AutomateFlow!');
      navigate('/portal');
    } catch (error) {
      toast.error('Failed to complete setup');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'starter': return Zap;
      case 'professional': return Crown;
      case 'enterprise': return Building2;
    }
  };

  const currentGoal = automationGoals.find(g => g.id === selectedGoal);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">AutomateFlow</span>
          </Link>

          <div className="max-w-md">
            <motion.h1 
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4"
            >
              {stepTitles[step as keyof typeof stepTitles]}
            </motion.h1>
            <motion.p 
              key={`desc-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-lg"
            >
              {step === 1 && 'Create your account to get started with automation.'}
              {step === 2 && 'We sent a verification code to your email.'}
              {step === 3 && 'Tell us about your business.'}
              {step === 4 && 'Choose the plan that fits your needs.'}
              {step === 5 && 'Complete your subscription to unlock features.'}
              {step === 6 && 'Connect your social channels to start automating.'}
              {step === 7 && 'Set up your first automation to start capturing leads.'}
            </motion.p>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-white/60 text-sm">Active businesses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">5M+</div>
              <div className="text-white/60 text-sm">Leads captured</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-white/60 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-6">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">AutomateFlow</span>
          </Link>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? 'w-6 bg-primary' : s < step ? 'w-2 bg-primary' : 'w-2 bg-muted'
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
                className="w-full max-w-sm"
              >
                <Card className="border-border/50 shadow-large">
                  <CardHeader className="space-y-1 text-center">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                      Enter your email and password to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
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
                    </div>

                    <Button 
                      onClick={handleNextStep}
                      disabled={isLoading}
                      className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Verify Email */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-sm"
              >
                <Card className="border-border/50 shadow-large">
                  <CardHeader className="space-y-1 text-center">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
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
                        onClick={() => setStep(1)}
                        className="flex-1 h-11"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleNextStep}
                        className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90"
                      >
                        Verify
                      </Button>
                    </div>

                    <Button variant="ghost" className="w-full text-sm">
                      Resend code
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Business Details */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md"
              >
                <Card className="border-border/50 shadow-large">
                  <CardHeader className="space-y-1 text-center">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Business Details</CardTitle>
                    <CardDescription>
                      Tell us about your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          placeholder="Your Business Name"
                          value={businessDetails.name}
                          onChange={(e) => setBusinessDetails(prev => ({ ...prev, name: e.target.value }))}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="businessEmail">Business Email *</Label>
                        <Input
                          id="businessEmail"
                          type="email"
                          placeholder="contact@business.com"
                          value={businessDetails.email}
                          onChange={(e) => setBusinessDetails(prev => ({ ...prev, email: e.target.value }))}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="+234 xxx xxx xxxx"
                          value={businessDetails.whatsappNumber}
                          onChange={(e) => setBusinessDetails(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+234 xxx xxx xxxx"
                          value={businessDetails.phoneNumber}
                          onChange={(e) => setBusinessDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select 
                          value={businessDetails.country} 
                          onValueChange={(value) => setBusinessDetails(prev => ({ ...prev, country: value }))}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
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
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Select Plan */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-3xl"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
                  <p className="text-muted-foreground">Select the plan that works for your business</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {(Object.entries(planDetails) as [PlanType, typeof planDetails.starter][]).map(([key, plan]) => {
                    const PlanIcon = getPlanIcon(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedPlan(key)}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          selectedPlan === key
                            ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`h-11 w-11 rounded-lg flex items-center justify-center mb-3 ${
                          selectedPlan === key ? 'gradient-primary' : 'bg-secondary'
                        }`}>
                          <PlanIcon className={`h-5 w-5 ${selectedPlan === key ? 'text-primary-foreground' : 'text-foreground'}`} />
                        </div>
                        <div className="font-semibold text-lg mb-1">{plan.name}</div>
                        <div className="text-2xl font-bold text-primary mb-1">
                          {plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-4">{plan.description}</div>
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            {plan.maxChannels} channel{plan.maxChannels > 1 ? 's' : ''} • {plan.maxAutomations === 'unlimited' ? 'Unlimited' : `${plan.maxAutomations}`} automations
                          </div>
                          {plan.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-accent shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3 max-w-md mx-auto">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="flex-1 h-12"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    className="flex-1 h-12 gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    Continue with {currentPlan.name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Payment */}
            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md"
              >
                <Card className="border-border/50 shadow-large">
                  <CardHeader className="space-y-1 text-center">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                      <CreditCard className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Complete Payment</CardTitle>
                    <CardDescription>
                      Subscribe to the {currentPlan.name} plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const PlanIcon = getPlanIcon(selectedPlan);
                            return (
                              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                                <PlanIcon className="h-5 w-5 text-primary-foreground" />
                              </div>
                            );
                          })()}
                          <div>
                            <div className="font-semibold">{currentPlan.name} Plan</div>
                            <div className="text-sm text-muted-foreground">Monthly subscription</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{currentPlan.price}</div>
                          <div className="text-xs text-muted-foreground">/month</div>
                        </div>
                      </div>
                      <div className="border-t border-border pt-3 mt-3">
                        <div className="flex justify-between text-sm">
                          <span>Channels included</span>
                          <span className="font-medium">{currentPlan.maxChannels}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Automations</span>
                          <span className="font-medium">{currentPlan.maxAutomations === 'unlimited' ? 'Unlimited' : currentPlan.maxAutomations}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input placeholder="4242 4242 4242 4242" className="h-11" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry</Label>
                          <Input placeholder="MM/YY" className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVC</Label>
                          <Input placeholder="123" className="h-11" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setStep(4)}
                        className="flex-1 h-11"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleNextStep}
                        disabled={isLoading}
                        className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Pay {currentPlan.price}</>
                        )}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      Your payment is secured with 256-bit SSL encryption
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 6: Connect Channels */}
            {step === 6 && (
              <motion.div 
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-lg"
              >
                <Card className="border-border/50 shadow-large">
                  <CardHeader className="space-y-1 text-center">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Connect Your Channels</CardTitle>
                    <CardDescription>
                      Connect up to {maxChannels} channel{maxChannels > 1 ? 's' : ''} with your {currentPlan.name} plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Channels connected</span>
                      <span className="font-semibold">{connectedChannelsCount} / {maxChannels}</span>
                    </div>

                    <div className="space-y-3">
                      {channels.map((channel) => {
                        const info = channelInfo[channel.type];
                        const isConnecting = connectingChannel === channel.type;
                        const canConnect = connectedChannelsCount < maxChannels || channel.connected;
                        
                        return (
                          <div 
                            key={channel.type}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              channel.connected 
                                ? 'border-accent/50 bg-accent/5' 
                                : canConnect 
                                  ? 'border-border hover:border-primary/50' 
                                  : 'border-border opacity-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center text-white`}>
                                  {info.icon}
                                </div>
                                <div>
                                  <div className="font-medium">{info.name}</div>
                                  {channel.connected && channel.accountName && (
                                    <div className="text-sm text-muted-foreground">{channel.accountName}</div>
                                  )}
                                </div>
                              </div>
                              {channel.connected ? (
                                <div className="flex items-center gap-2 text-accent">
                                  <CheckCircle2 className="h-5 w-5" />
                                  <span className="text-sm font-medium">Connected</span>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleConnectChannel(channel.type)}
                                  disabled={isConnecting || !canConnect}
                                  className="gap-2"
                                >
                                  {isConnecting ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Connecting...
                                    </>
                                  ) : (
                                    'Connect'
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      Channels are connected via ManyChat/TikTok OAuth for secure access
                    </p>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setStep(5)}
                        className="flex-1 h-11"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleNextStep}
                        disabled={connectedChannelsCount === 0}
                        className="flex-1 h-12 gradient-primary text-primary-foreground hover:opacity-90"
                      >
                        Continue to Automations <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 7: Setup Automations */}
            {step === 7 && (
              <motion.div 
                key="step7"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-2xl"
              >
                <Card className="border-border/50 shadow-large">
                  <CardHeader className="space-y-1 text-center">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-2">
                      <Target className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Setup Your Automations</CardTitle>
                    <CardDescription>
                      What do you want to automate first? Configure up to {maxAutomations === 999 ? 'unlimited' : maxAutomations} automations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Configured Automations */}
                    {configuredAutomations.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm text-muted-foreground">Configured Automations ({configuredAutomations.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {configuredAutomations.map((automation, index) => (
                            <div 
                              key={index}
                              className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-lg">
                                  {automationGoals.find(g => g.id === automation.goalId)?.icon}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{automation.goalName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {channelInfo[automation.channel].name} • {automation.config.substring(0, 30)}...
                                  </div>
                                </div>
                              </div>
                              <CheckCircle2 className="h-5 w-5 text-accent" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add New Automation */}
                    {configuredAutomations.length < maxAutomations && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add Automation
                        </h3>

                        {/* Channel Selection */}
                        <div className="space-y-2">
                          <Label>Select Channel</Label>
                          <div className="flex gap-2 flex-wrap">
                            {connectedChannelsList.map((channel) => {
                              const info = channelInfo[channel.type];
                              return (
                                <button
                                  key={channel.type}
                                  type="button"
                                  onClick={() => setSelectedChannelForAutomation(channel.type)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                                    selectedChannelForAutomation === channel.type
                                      ? 'border-primary bg-primary/5'
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <div className={`h-6 w-6 rounded bg-gradient-to-br ${info.color} flex items-center justify-center text-white`}>
                                    {info.icon}
                                  </div>
                                  <span className="text-sm font-medium">{info.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Automation Goals */}
                        <div className="space-y-2">
                          <Label>What do you want to automate?</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {automationGoals.map((goal) => (
                              <button
                                key={goal.id}
                                type="button"
                                onClick={() => {
                                  setSelectedGoal(goal.id);
                                  setGoalConfig('');
                                }}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                  selectedGoal === goal.id
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl">{goal.icon}</span>
                                  <div>
                                    <div className="font-medium text-sm">{goal.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{goal.description}</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Follow-up Question */}
                        {selectedGoal && currentGoal && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-3"
                          >
                            <Label>{currentGoal.followUpQuestion}</Label>
                            {currentGoal.followUpType === 'textarea' ? (
                              <Textarea
                                placeholder={currentGoal.followUpPlaceholder}
                                value={goalConfig}
                                onChange={(e) => setGoalConfig(e.target.value)}
                                rows={3}
                                className="resize-none"
                              />
                            ) : (
                              <Input
                                type={currentGoal.followUpType === 'phone' ? 'tel' : 'text'}
                                placeholder={currentGoal.followUpPlaceholder}
                                value={goalConfig}
                                onChange={(e) => setGoalConfig(e.target.value)}
                                className="h-11"
                              />
                            )}
                            <Button
                              onClick={handleAddAutomation}
                              disabled={!goalConfig || !selectedChannelForAutomation}
                              className="w-full h-10 bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add This Automation
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Complete Setup */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => setStep(6)}
                          className="flex-1 h-11"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={handleCompleteOnboarding}
                          disabled={isLoading || configuredAutomations.length === 0}
                          className="flex-1 h-12 gradient-primary text-primary-foreground hover:opacity-90"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Finishing Setup...
                            </>
                          ) : (
                            <>
                              Complete Setup <CheckCircle2 className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                      {configuredAutomations.length === 0 && (
                        <p className="text-xs text-center text-muted-foreground">
                          Add at least one automation to complete setup
                        </p>
                      )}
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