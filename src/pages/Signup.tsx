import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Zap, Loader2, Eye, EyeOff, Crown, Building2, Check, Instagram, Facebook, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type PlanType = 'starter' | 'professional' | 'enterprise';

const planDetails = {
  starter: {
    name: 'Starter',
    icon: Zap,
    price: '₦49,000',
    channels: '1 channel',
    automations: '1–3 automations',
    features: ['Comment → DM automation', 'Lead capture', 'Basic analytics'],
  },
  professional: {
    name: 'Professional',
    icon: Crown,
    price: '₦99,000',
    channels: '2 channels',
    automations: '5–10 automations',
    features: ['Broadcast messages', 'Message templates', 'Full analytics', 'Priority support'],
  },
  enterprise: {
    name: 'Enterprise',
    icon: Building2,
    price: '₦199,000',
    channels: '4 channels',
    automations: 'Unlimited',
    features: ['AI-powered replies', 'Custom reporting', 'Dedicated account manager'],
  },
};

export default function Signup() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('client');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('starter');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && ['starter', 'professional', 'enterprise'].includes(planParam)) {
      setSelectedPlan(planParam as PlanType);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    if (step === 2) {
      setStep(3);
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, name, role);
      toast.success('Account created successfully!');
      navigate(role === 'admin' ? '/admin' : '/portal');
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = planDetails[selectedPlan];

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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4"
            >
              {step === 1 && 'Choose your plan'}
              {step === 2 && 'Create your account'}
              {step === 3 && 'Setup your business'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-lg"
            >
              {step === 1 && 'Select the plan that best fits your business needs.'}
              {step === 2 && 'Enter your details to get started with AutomateFlow.'}
              {step === 3 && 'Tell us about your business to personalize your experience.'}
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
          <div className="flex items-center gap-4">
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? 'w-8 bg-primary' : s < step ? 'w-2 bg-primary' : 'w-2 bg-muted'
                  }`}
                />
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Plan Selection */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-2xl"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
                  <p className="text-muted-foreground">Select the plan that works for your business</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {(Object.entries(planDetails) as [PlanType, typeof planDetails.starter][]).map(([key, plan]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlan(key)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPlan === key
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${
                        selectedPlan === key ? 'gradient-primary' : 'bg-secondary'
                      }`}>
                        <plan.icon className={`h-5 w-5 ${selectedPlan === key ? 'text-primary-foreground' : 'text-foreground'}`} />
                      </div>
                      <div className="font-semibold mb-1">{plan.name}</div>
                      <div className="text-lg font-bold text-primary mb-2">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                      <div className="text-xs text-muted-foreground mb-3">{plan.channels} • {plan.automations}</div>
                      <div className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Check className="h-3 w-3 text-accent" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={() => setStep(2)}
                  className="w-full h-12 gradient-primary text-primary-foreground hover:opacity-90"
                >
                  Continue with {currentPlan.name}
                </Button>
              </motion.div>
            )}

            {/* Step 2: Account Details */}
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
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <currentPlan.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium text-primary">{currentPlan.name} Plan</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
                    <CardDescription>
                      Enter your details to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
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

                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex-1 h-11"
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90"
                        >
                          Continue
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Business Setup */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-sm"
              >
                <Card className="border-border/50 shadow-large">
                  <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Setup your business</CardTitle>
                    <CardDescription>
                      Tell us about your business
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          type="text"
                          placeholder="My Awesome Business"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Account Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setRole('client')}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                              role === 'client'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            Business Owner
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                              role === 'admin'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            Agency Admin
                          </button>
                        </div>
                      </div>

                      {/* Plan Summary */}
                      <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Plan</span>
                          <span className="text-sm text-primary font-semibold">{currentPlan.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Monthly</span>
                          <span className="text-sm font-bold">{currentPlan.price}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="flex-1 h-11"
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 h-11 gradient-primary text-primary-foreground hover:opacity-90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            'Get Started'
                          )}
                        </Button>
                      </div>
                    </form>

                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      By signing up, you agree to our{' '}
                      <a href="#" className="text-primary hover:underline">Terms</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
