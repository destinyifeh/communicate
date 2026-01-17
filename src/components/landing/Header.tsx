import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">AutomateFlow</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Services
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
