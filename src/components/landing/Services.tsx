import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Instagram, 
  Facebook,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const channels = [
  {
    icon: Instagram,
    name: 'Instagram',
    color: 'from-purple-500 via-pink-500 to-orange-400',
    features: [
      'Comment → DM automation',
      'Story mention replies',
      'Reel engagement capture',
      'Bio link funnels',
      'Auto-response to keywords'
    ],
  },
  {
    icon: Facebook,
    name: 'Facebook',
    color: 'from-blue-600 to-blue-400',
    features: [
      'Messenger automation',
      'Page comment replies',
      'Lead form integration',
      'Customer support bots',
      'Retargeting sequences'
    ],
  },
  {
    icon: MessageSquare,
    name: 'WhatsApp',
    color: 'from-green-500 to-green-400',
    features: [
      'Business API integration',
      'Broadcast messaging',
      'Order notifications',
      'Catalog sharing',
      '24/7 auto-replies'
    ],
  },
  {
    icon: MessageSquare,
    name: 'TikTok',
    color: 'from-gray-900 to-gray-700',
    features: [
      'Comment automation',
      'Bio link tracking',
      'Lead magnet delivery',
      'Creator collaborations',
      'Viral content capture'
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Channels
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            One platform,
            <br />
            <span className="text-gradient">all your channels</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect all your social media accounts and manage everything from a single, 
            powerful dashboard. No more switching between apps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((channel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {channel.name === 'TikTok' ? (
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  ) : (
                    <channel.icon className="h-8 w-8" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-4">{channel.name}</h3>
                <ul className="space-y-3">
                  {channel.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link to="/signup">
            <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 gap-2 px-8 h-14 font-semibold shadow-lg">
              Connect Your Accounts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
