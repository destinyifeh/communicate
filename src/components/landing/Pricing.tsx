import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2, Instagram, Facebook, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: '₦49,000',
    period: '/month',
    description: 'Perfect for beginners getting started with social media automation.',
    channels: '1 channel (Instagram or Facebook)',
    automations: '1–3 automations',
    features: [
      'Comment → DM automation',
      'Lead capture & storage',
      'Dashboard view',
      'Basic analytics (leads, responses, conversion)',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    icon: Crown,
    price: '₦99,000',
    period: '/month',
    description: 'For growing businesses that need more power and flexibility.',
    channels: '2 channels (IG + FB or WhatsApp)',
    automations: '5–10 automations',
    features: [
      'Everything in Starter',
      'Broadcast messages',
      'Message templates',
      'Full analytics (leads, responses, redirect to WhatsApp, flow stats)',
      'Advanced reporting',
      'Priority support',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: '₦199,000',
    period: '/month',
    description: 'For large organizations with custom requirements.',
    channels: '4 channels (IG + FB + WhatsApp + TikTok)',
    automations: 'Unlimited automations',
    features: [
      'Everything in Professional',
      'Multi-channel management',
      'AI-powered replies',
      'Custom reporting',
      'Advanced analytics + downloadable reports',
      'Priority support',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Simple, transparent
            <br />
            <span className="text-gradient">pricing plans</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core automation platform 
            with lead capture and analytics.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="gradient-primary text-primary-foreground px-4 py-1.5 text-sm font-semibold shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card 
                className={`h-full flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-primary shadow-xl ring-2 ring-primary/20 scale-105' 
                    : 'border-border/50 hover:shadow-lg hover:border-primary/20'
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`h-14 w-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                    plan.popular ? 'gradient-primary' : 'bg-secondary'
                  }`}>
                    <plan.icon className={`h-7 w-7 ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-3 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Channels & Automations */}
                  <div className="mb-6 space-y-3 p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-card">
                          <Instagram className="h-3 w-3 text-white" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center border-2 border-card">
                          <Facebook className="h-3 w-3 text-white" />
                        </div>
                        {(plan.name === 'Professional' || plan.name === 'Enterprise') && (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-card">
                            <MessageSquare className="h-3 w-3 text-white" />
                          </div>
                        )}
                        {plan.name === 'Enterprise' && (
                          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center border-2 border-card">
                            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-muted-foreground">{plan.channels}</span>
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {plan.automations}
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className={`h-5 w-5 shrink-0 mt-0.5 ${plan.popular ? 'text-primary' : 'text-accent'}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.cta === 'Contact Sales' ? '/demo' : '/signup'} className="w-full">
                    <Button 
                      className={`w-full h-12 text-base font-semibold ${plan.popular ? 'gradient-primary text-primary-foreground hover:opacity-90 shadow-lg' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border/50">
            <span className="text-muted-foreground">Need a custom solution?</span>
            <Link to="/demo" className="text-primary font-medium hover:underline">
              Contact our sales team →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
