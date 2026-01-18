import { motion } from 'framer-motion';
import { 
  MessageSquareText, 
  Bot, 
  BarChart3, 
  Users,
  Zap,
  Send,
  Target,
  Clock
} from 'lucide-react';

const features = [
  {
    icon: MessageSquareText,
    title: 'Comment → DM Automation',
    description: 'Automatically send a DM when someone comments on your posts. Convert engagement into conversations instantly.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Target,
    title: 'Lead Capture',
    description: 'Collect leads from every interaction. Store contact info, track conversations, and never lose a potential customer.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Send,
    title: 'Broadcast Messages',
    description: 'Send promotional messages to your entire audience at once. Perfect for launches, sales, and announcements.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Bot,
    title: 'AI-Powered Replies',
    description: 'Let AI handle common questions and qualify leads 24/7. Smart responses that sound just like you.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track leads, responses, conversions, and flow performance. Downloadable reports for deeper insights.',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Users,
    title: 'Multi-Channel Support',
    description: 'Manage Instagram, Facebook, WhatsApp, and TikTok from one dashboard. Unified inbox for all platforms.',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Template Library',
    description: 'Pre-built message templates for common scenarios. Customize and deploy in seconds.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: 'Instant Responses',
    description: 'Reply to inquiries within seconds, not hours. Never miss a sales opportunity again.',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything you need to
            <br />
            <span className="text-gradient">automate & grow</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From comment automation to AI-powered replies, we've got all the tools to transform 
            your social media into a lead-generating machine.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
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
