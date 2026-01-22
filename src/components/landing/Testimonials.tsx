import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: 'Adaeze Okonkwo',
    role: 'Founder, StyleHub Lagos',
    avatar: '',
    content: 'AutomateFlow transformed our Instagram DMs. We now capture 10x more leads without lifting a finger. The ROI has been incredible!',
    rating: 5,
    platform: 'Instagram',
    metric: '10x more leads',
  },
  {
    id: 2,
    name: 'Chidi Emenike',
    role: 'CEO, TechVentures Nigeria',
    avatar: '',
    content: 'Our response time went from hours to seconds. Customers love it, and our sales team can focus on closing deals instead of answering FAQs.',
    rating: 5,
    platform: 'WhatsApp',
    metric: '95% faster response',
  },
  {
    id: 3,
    name: 'Funke Adeyemi',
    role: 'Marketing Director, BeautyBox',
    avatar: '',
    content: 'The best investment we made this year. AutomateFlow handles thousands of inquiries daily and never misses a beat.',
    rating: 5,
    platform: 'Facebook',
    metric: '3,000+ daily chats',
  },
  {
    id: 4,
    name: 'Tunde Bakare',
    role: 'Owner, FoodieExpress',
    avatar: '',
    content: 'From struggling with customer queries to having a 24/7 automated assistant. Our customers are happier and so are we!',
    rating: 5,
    platform: 'WhatsApp',
    metric: '24/7 availability',
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

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-r from-accent/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Trusted by <span className="text-gradient">500+ businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how businesses across Nigeria are transforming their customer engagement with AutomateFlow
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: '500+', label: 'Active Businesses' },
            { value: '2M+', label: 'Messages Automated' },
            { value: '98%', label: 'Customer Satisfaction' },
            { value: '50%', label: 'More Conversions' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-card border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="h-full border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                <CardContent className="p-6 relative">
                  {/* Quote Icon */}
                  <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Metric Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    {testimonial.metric}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                      {testimonial.platform}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA within Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Join hundreds of successful businesses
          </p>
          <a 
            href="/signup" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Start Your Success Story
            <span className="text-xl">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
