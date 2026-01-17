import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Zap, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('client');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signup(email, password, name, role);
      toast.success('Account created successfully!');
      navigate(role === 'admin' ? '/admin' : '/portal');
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">AutomateFlow</span>
          </Link>

          <div className="max-w-md">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Start automating today.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-lg"
            >
              Create your account and join hundreds of businesses transforming their operations.
            </motion.p>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="text-2xl font-bold text-white">14-day</div>
              <div className="text-white/60 text-sm">Free trial</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">No CC</div>
              <div className="text-white/60 text-sm">Required</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-white/60 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-6">
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">AutomateFlow</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            <Card className="border-border/50 shadow-large">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>
                  Get started with your free trial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Role selection */}
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('client')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          role === 'client'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        Business Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          role === 'admin'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        Agency Admin
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 gradient-primary text-primary-foreground hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </form>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
