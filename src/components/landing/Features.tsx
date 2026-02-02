import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Calendar, 
  MessageSquareText, 
  UserPlus,
  Bot,
  BarChart3,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';

const businessTypes = [
  {
    icon: ShoppingCart,
    title: 'Sales & Orders',
    description: 'Automate product inquiries, showcase catalogs, collect orders and process payments directly through DMs.',
    gradient: 'from-orange-500 to-amber-500',
    features: ['Product catalog sharing', 'Order collection', 'Payment links', 'Delivery tracking'],
  },
  {
    icon: Calendar,
    title: 'Appointments & Bookings',
    description: 'Let customers book appointments through chat. Manage availability, confirmations, and reminders automatically.',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Availability management', 'Automatic scheduling', 'Confirmation messages', 'Reminder notifications'],
  },
  {
    icon: MessageSquareText,
    title: 'Enquiries & Support',
    description: 'Handle customer questions with smart FAQ bots. Escalate complex issues to human agents seamlessly.',
    gradient: 'from-purple-500 to-pink-500',
    features: ['FAQ automation', 'Ticket creation', 'Smart escalation', 'Working hours'],
  },
  {
    icon: UserPlus,
    title: 'Lead Capture',
    description: 'Capture leads from comments and DMs. Collect contact info, qualify prospects, and grow your CRM.',
    gradient: 'from-green-500 to-emerald-500',
    features: ['Comment triggers', 'Lead magnets', 'Follow-up sequences', 'CRM integration'],
  },
];

const platformFeatures = [
  {
    icon: Bot,
    title: 'AI-Powered Responses',
    description: 'Smart replies that understand context and respond naturally 24/7.',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track leads, conversions, and performance across all channels.',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Instant Automation',
    description: 'Set up and deploy automations in minutes, not hours.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Never miss a lead—respond to customers around the clock.',
    gradient: 'from-fuchsia-500 to-pink-500',
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

export function Features() {
  return (
    <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Business Types
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Automation for
            <br />
            <span className="text-gradient">Every Business Need</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're selling products, booking appointments, handling support, or capturing leads—we've got you covered.
          </p>
        </motion.div>

        {/* Business Types Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
        >
          {businessTypes.map((type, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {type.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {type.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Powerful Tools to <span className="text-gradient">Scale Your Business</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {platformFeatures.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center">
                <div className={`h-12 w-12 mx-auto rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
