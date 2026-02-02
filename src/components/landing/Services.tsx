import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Instagram, 
  Facebook,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Calendar,
  HeadphonesIcon,
  LucideIcon,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const TikTokIconSvg = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

interface ChannelData {
  icon: LucideIcon | (() => JSX.Element);
  name: string;
  color: string;
  automations: { type: string; icon: LucideIcon; name: string; trigger: string }[];
}

const channels: ChannelData[] = [
  {
    icon: Instagram,
    name: 'Instagram',
    color: 'from-purple-500 via-pink-500 to-orange-400',
    automations: [
      { type: 'sales_orders', icon: ShoppingCart, name: 'Sales / Orders', trigger: 'Comment "price/order/buy"' },
      { type: 'lead_capture', icon: UserPlus, name: 'Lead Capture', trigger: 'Comment/DM "interested"' },
    ],
  },
  {
    icon: Facebook,
    name: 'Facebook',
    color: 'from-blue-600 to-blue-400',
    automations: [
      { type: 'sales_orders', icon: ShoppingCart, name: 'Sales / Orders', trigger: 'Message keywords' },
      { type: 'lead_capture', icon: UserPlus, name: 'Lead Capture', trigger: 'Incoming messages' },
      { type: 'enquiries_support', icon: HeadphonesIcon, name: 'Support', trigger: 'Support keywords' },
    ],
  },
  {
    icon: MessageSquare,
    name: 'WhatsApp',
    color: 'from-green-500 to-green-400',
    automations: [
      { type: 'sales_orders', icon: ShoppingCart, name: 'Sales / Orders', trigger: '"price/order/buy"' },
      { type: 'appointments_bookings', icon: Calendar, name: 'Appointments', trigger: '"book/schedule"' },
      { type: 'lead_capture', icon: UserPlus, name: 'Lead Capture', trigger: '"interested/info"' },
      { type: 'enquiries_support', icon: HeadphonesIcon, name: 'Support', trigger: 'FAQ keywords' },
    ],
  },
  {
    icon: TikTokIconSvg,
    name: 'TikTok',
    color: 'from-foreground to-foreground/80',
    automations: [
      { type: 'lead_capture', icon: UserPlus, name: 'Lead Capture', trigger: 'Lead form / comments' },
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
            Channel Automations
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Each Channel,
            <br />
            <span className="text-gradient">Custom Automations</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Different channels support different automation types. See what's possible on each platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((channel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {channel.name === 'TikTok' ? <TikTokIconSvg /> : <channel.icon className="h-8 w-8" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{channel.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {channel.automations.length} automation{channel.automations.length > 1 ? 's' : ''} available
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {channel.automations.map((automation, i) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-lg bg-secondary/50 flex items-center gap-3"
                    >
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        automation.type === 'sales_orders' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                        automation.type === 'appointments_bookings' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        automation.type === 'enquiries_support' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        'bg-green-500/10 text-green-600 dark:text-green-400'
                      }`}>
                        <automation.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{automation.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          Trigger: {automation.trigger}
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    </div>
                  ))}
                </div>
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
              Start Automating Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
