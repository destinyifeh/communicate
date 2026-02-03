import { motion } from 'framer-motion';
import { 
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Calendar,
  HeadphonesIcon,
  UserPlus,
  Briefcase,
  Store,
  GraduationCap,
  Scissors
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const businessTypes = [
  {
    icon: Store,
    name: 'Vendor / Online Seller',
    description: 'Sells physical or digital products',
    color: 'from-orange-500 to-amber-500',
    automations: [
      { icon: ShoppingCart, name: 'Sales / Orders', enabled: true },
      { icon: UserPlus, name: 'Lead Capture', enabled: true },
      { icon: Calendar, name: 'Appointments', enabled: false },
      { icon: HeadphonesIcon, name: 'Support', enabled: false },
    ],
  },
  {
    icon: Briefcase,
    name: 'Service Provider',
    description: 'Freelancers, agencies, consultants',
    color: 'from-purple-500 to-indigo-500',
    automations: [
      { icon: UserPlus, name: 'Lead Capture', enabled: true },
      { icon: HeadphonesIcon, name: 'Enquiries / Support', enabled: true },
      { icon: ShoppingCart, name: 'Orders', enabled: false },
      { icon: Calendar, name: 'Appointments', enabled: false },
    ],
  },
  {
    icon: Scissors,
    name: 'Appointment-Based',
    description: 'Clinics, salons, coaches, tutors',
    color: 'from-blue-500 to-cyan-500',
    automations: [
      { icon: Calendar, name: 'Appointments / Bookings', enabled: true },
      { icon: HeadphonesIcon, name: 'Enquiries', enabled: true },
      { icon: ShoppingCart, name: 'Sales / Orders', enabled: false },
      { icon: UserPlus, name: 'Lead Capture', enabled: false },
    ],
  },
  {
    icon: GraduationCap,
    name: 'Lead-Driven Business',
    description: 'Realtors, marketers, schools, SaaS',
    color: 'from-green-500 to-emerald-500',
    automations: [
      { icon: UserPlus, name: 'Lead Capture', enabled: true },
      { icon: ShoppingCart, name: 'Sales / Orders', enabled: false },
      { icon: Calendar, name: 'Appointments', enabled: false },
      { icon: HeadphonesIcon, name: 'Support', enabled: false },
    ],
  },
];

export function BusinessTypes() {
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
            Tailored For Your Business
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            What Type of Business
            <br />
            <span className="text-gradient">Do You Run?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We automatically enable the right automations based on your business type. No complexity, just results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businessTypes.map((business, index) => (
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
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    <business.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{business.name}</h3>
                    <p className="text-sm text-muted-foreground">{business.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {business.automations.map((automation, i) => (
                    <div 
                      key={i} 
                      className={`p-3 rounded-lg flex items-center gap-2 ${
                        automation.enabled 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-muted/50 text-muted-foreground opacity-50'
                      }`}
                    >
                      <automation.icon className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium truncate">{automation.name}</span>
                      {automation.enabled && (
                        <CheckCircle2 className="h-4 w-4 ml-auto shrink-0" />
                      )}
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
              Get Started Today
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
