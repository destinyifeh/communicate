import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: '₦75,000',
    period: '/month',
    description: 'Perfect for small businesses just getting started with automation.',
    features: [
      'Up to 500 leads/month',
      '1 Platform integration',
      'Basic chatbot flows',
      'Email support',
      'Lead CRM access',
      'Basic analytics',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    icon: Crown,
    price: '₦150,000',
    period: '/month',
    description: 'For growing businesses that need more power and flexibility.',
    features: [
      'Up to 2,000 leads/month',
      '3 Platform integrations',
      'Advanced chatbot flows',
      'Priority email & chat support',
      'Full CRM features',
      'Advanced analytics & reports',
      'Custom webhook integrations',
      'Team collaboration (3 users)',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom requirements.',
    features: [
      'Unlimited leads',
      'All platform integrations',
      'Custom AI bot development',
      'Dedicated account manager',
      'White-label options',
      'Custom analytics dashboards',
      'API access',
      'Unlimited team members',
      'SLA guarantee',
      'On-premise deployment option',
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
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core automation platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="gradient-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card 
                className={`h-full flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-primary shadow-elegant ring-1 ring-primary/20' 
                    : 'border-border/50 hover:shadow-medium'
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`h-14 w-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                    plan.popular ? 'gradient-primary' : 'bg-secondary'
                  }`}>
                    <plan.icon className={`h-7 w-7 ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-3">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className={`h-5 w-5 shrink-0 mt-0.5 ${plan.popular ? 'text-primary' : 'text-accent'}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className="w-full">
                    <Button 
                      className={`w-full ${plan.popular ? 'gradient-primary text-primary-foreground hover:opacity-90' : ''}`}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Need a custom solution? Have questions about our plans?
          </p>
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            Contact our sales team →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
