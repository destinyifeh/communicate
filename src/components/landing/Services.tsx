import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Instagram, 
  Facebook,
  Video,
  Webhook,
  Database,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: MessageSquare,
    title: 'WhatsApp Automation',
    description: 'Automate customer conversations, lead capture, and order management on WhatsApp Business.',
    features: ['Auto-replies & FAQs', 'Lead qualification bots', 'Order notifications', 'Broadcast messaging'],
  },
  {
    icon: Instagram,
    title: 'Instagram DM Automation',
    description: 'Convert DM inquiries into sales with intelligent conversation flows and auto-responses.',
    features: ['Story mention replies', 'Comment-to-DM flows', 'Product catalogs', 'Appointment booking'],
  },
  {
    icon: Facebook,
    title: 'Facebook Messenger Bots',
    description: 'Build powerful Messenger experiences that guide customers through your sales funnel.',
    features: ['Lead generation', 'Customer support', 'E-commerce integration', 'Retargeting sequences'],
  },
  {
    icon: Video,
    title: 'TikTok Integration',
    description: 'Capture leads from TikTok comments and bio links with automated follow-ups.',
    features: ['Comment automation', 'Bio link funnels', 'Lead magnets', 'Creator campaigns'],
  },
  {
    icon: Webhook,
    title: 'Custom API Integrations',
    description: 'Connect your existing tools and platforms with custom webhook integrations.',
    features: ['CRM syncing', 'Payment gateways', 'Inventory systems', 'Custom workflows'],
  },
  {
    icon: Database,
    title: 'Lead Management CRM',
    description: 'Centralized dashboard to track, manage, and convert all your leads in one place.',
    features: ['Multi-platform leads', 'Sales pipeline', 'Team assignments', 'Analytics & reports'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Services() {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Automation solutions for every platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We specialize in building intelligent automation systems that help you capture leads, 
            convert customers, and scale your business across all major platforms.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-border/50 bg-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {service.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/signup">
            <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 gap-2">
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
