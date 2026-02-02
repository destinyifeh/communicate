import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, MessageCircle, Instagram, Facebook, ShoppingCart, Calendar, HeadphonesIcon, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        animate={{ 
          x: [0, -30, 0], 
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-24">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">Multi-Channel Business Automation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Automate Your Business
            <br />
            <span className="text-gradient">Across Every Channel.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-8"
          >
            From sales & orders to appointment bookings, customer support, and lead capture—automate 
            everything on Instagram, Facebook, WhatsApp & TikTok.
          </motion.p>

          {/* Business Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap justify-center items-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium">
              <ShoppingCart className="h-4 w-4" /> Sales & Orders
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <Calendar className="h-4 w-4" /> Appointments
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
              <HeadphonesIcon className="h-4 w-4" /> Support
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium">
              <UserPlus className="h-4 w-4" /> Lead Capture
            </div>
          </motion.div>

          {/* Platform icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Works with:</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Facebook className="h-5 w-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                <svg className="h-5 w-5 text-background" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 gap-2 px-8 h-14 text-base font-semibold shadow-lg">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="gap-2 h-14 text-base font-semibold border-2">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mt-20 pt-10 border-t border-border/50"
          >
            {[
              { value: '50K+', label: 'Leads Captured' },
              { value: '10M+', label: 'Messages Automated' },
              { value: '98%', label: 'Response Rate' },
              { value: '3x', label: 'More Conversions' },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
