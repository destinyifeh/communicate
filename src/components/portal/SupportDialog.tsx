import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MessageSquare, 
  Mail, 
  Phone,
  Send,
  HeadphonesIcon,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!category || !subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Support ticket created!', {
      description: 'We\'ll get back to you within 24 hours.',
    });
    
    // Reset form
    setCategory('');
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" />
            Get Support
          </DialogTitle>
          <DialogDescription>
            Contact our support team for help with your account or automations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quick Contact Options */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href="mailto:support@botflow.ng"
              className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-center group"
            >
              <Mail className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-xs font-medium">Email</p>
              <p className="text-[10px] text-muted-foreground">support@botflow.ng</p>
            </a>
            <a
              href="https://wa.me/2348012345678"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-center group"
            >
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-green-500 transition-colors" />
              <p className="text-xs font-medium">WhatsApp</p>
              <p className="text-[10px] text-muted-foreground">Chat with us</p>
            </a>
            <a
              href="tel:+2348012345678"
              className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-center group"
            >
              <Phone className="h-6 w-6 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-xs font-medium">Phone</p>
              <p className="text-[10px] text-muted-foreground">Mon-Fri 9am-5pm</p>
            </a>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or submit a ticket
              </span>
            </div>
          </div>

          {/* Support Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="automation">Automation Help</SelectItem>
                  <SelectItem value="account">Account Management</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Describe your issue in detail..."
                className="min-h-[120px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Response Time */}
          <div className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
              Fast Response
            </Badge>
            <p className="text-xs text-muted-foreground">
              We typically respond within 2-4 hours during business hours
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="gradient-primary text-primary-foreground gap-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="h-4 w-4" /> Submit Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
