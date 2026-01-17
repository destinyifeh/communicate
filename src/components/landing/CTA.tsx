import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl gradient-primary p-12 sm:p-16 text-center overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to transform your business?
            </h2>
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses already saving thousands of hours with intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="gap-2 h-12 px-8 text-base bg-white text-primary hover:bg-white/90"
                >
                  Start Your Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 text-base border-white/20 text-primary-foreground hover:bg-white/10"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
