import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Mail, 
  Plus, 
  Trash2, 
  Clock,
  Send,
  Eye,
  MousePointer
} from 'lucide-react';
import { EmailMarketingConfig, EmailTemplate } from '@/lib/businessTypes';

interface EmailMarketingSetupProps {
  config: EmailMarketingConfig;
  onChange: (config: EmailMarketingConfig) => void;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{business_name}}!',
    body: 'Hi {{name}},\n\nThank you for joining us! We\'re excited to have you on board.\n\nBest regards,\n{{business_name}}',
    type: 'welcome',
  },
  {
    id: 'followup',
    name: 'Follow-up Email',
    subject: 'Following up on your inquiry',
    body: 'Hi {{name}},\n\nJust wanted to check in and see if you have any questions.\n\nLet us know how we can help!\n\nBest,\n{{business_name}}',
    type: 'followup',
  },
];

export function EmailMarketingSetup({ config, onChange }: EmailMarketingSetupProps) {
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const handleChange = <K extends keyof EmailMarketingConfig>(
    key: K,
    value: EmailMarketingConfig[K]
  ) => {
    onChange({ ...config, [key]: value });
  };

  const handleTriggerToggle = (event: EmailMarketingConfig['triggerEvents'][number]) => {
    const current = config.triggerEvents || [];
    if (current.includes(event)) {
      handleChange('triggerEvents', current.filter(e => e !== event));
    } else {
      handleChange('triggerEvents', [...current, event]);
    }
  };

  const addToSequence = () => {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: 'New Follow-up',
      subject: 'Following up',
      body: 'Hi {{name}},\n\nJust checking in...',
      type: 'followup',
    };
    
    handleChange('followUpSequence', [
      ...config.followUpSequence,
      { template: newTemplate, delayDays: 1 }
    ]);
  };

  const removeFromSequence = (index: number) => {
    handleChange(
      'followUpSequence',
      config.followUpSequence.filter((_, i) => i !== index)
    );
  };

  const updateSequenceItem = (index: number, delayDays: number) => {
    const updated = [...config.followUpSequence];
    updated[index] = { ...updated[index], delayDays };
    handleChange('followUpSequence', updated);
  };

  return (
    <div className="space-y-6">
      {/* Sender Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sender Information
          </CardTitle>
          <CardDescription>Configure your email sender details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sender Name</Label>
              <Input
                value={config.senderName}
                onChange={(e) => handleChange('senderName', e.target.value)}
                placeholder="Your Business Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Sender Email</Label>
              <Input
                type="email"
                value={config.senderEmail}
                onChange={(e) => handleChange('senderEmail', e.target.value)}
                placeholder="hello@yourbusiness.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reply-To Email</Label>
            <Input
              type="email"
              value={config.replyToEmail}
              onChange={(e) => handleChange('replyToEmail', e.target.value)}
              placeholder="support@yourbusiness.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Welcome Email */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Send className="h-5 w-5" />
                Welcome Email
              </CardTitle>
              <CardDescription>Automatically send when a new lead is captured</CardDescription>
            </div>
            <Switch
              checked={config.welcomeEmailEnabled}
              onCheckedChange={(checked) => handleChange('welcomeEmailEnabled', checked)}
            />
          </div>
        </CardHeader>
        {config.welcomeEmailEnabled && (
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label className="shrink-0">Send after</Label>
              <Select
                value={config.welcomeEmailDelay.toString()}
                onValueChange={(v) => handleChange('welcomeEmailDelay', parseInt(v))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Immediately</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Welcome Email Template</span>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p><strong>Subject:</strong> Welcome to {'{{business_name}}'}!</p>
                <p className="mt-1 line-clamp-2">Thank you for joining us! We're excited to have you...</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Trigger Events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Trigger Events</CardTitle>
          <CardDescription>When should emails be sent automatically?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: 'lead_capture', label: 'New Lead Captured', description: 'When a new lead is captured from any channel' },
            { id: 'order_placed', label: 'Order Placed', description: 'When a customer places an order' },
            { id: 'appointment_booked', label: 'Appointment Booked', description: 'When an appointment is scheduled' },
            { id: 'ticket_created', label: 'Support Ticket Created', description: 'When a support ticket is opened' },
          ].map((event) => (
            <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50">
              <Checkbox
                id={event.id}
                checked={config.triggerEvents?.includes(event.id as any) || false}
                onCheckedChange={() => handleTriggerToggle(event.id as any)}
              />
              <div className="flex-1">
                <label htmlFor={event.id} className="text-sm font-medium cursor-pointer">
                  {event.label}
                </label>
                <p className="text-xs text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Follow-up Sequence */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Follow-up Sequence
              </CardTitle>
              <CardDescription>Automated follow-up emails over time</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addToSequence}>
              <Plus className="h-4 w-4 mr-1" /> Add Email
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {config.followUpSequence.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No follow-up emails configured</p>
              <p className="text-sm">Add emails to create an automated sequence</p>
            </div>
          ) : (
            <div className="space-y-3">
              {config.followUpSequence.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.template.name}</p>
                    <p className="text-xs text-muted-foreground">{item.template.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={item.delayDays.toString()}
                      onValueChange={(v) => updateSequenceItem(index, parseInt(v))}
                    >
                      <SelectTrigger className="w-28 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">After 1 day</SelectItem>
                        <SelectItem value="2">After 2 days</SelectItem>
                        <SelectItem value="3">After 3 days</SelectItem>
                        <SelectItem value="5">After 5 days</SelectItem>
                        <SelectItem value="7">After 7 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeFromSequence(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tracking & Analytics</CardTitle>
          <CardDescription>Monitor email performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Track Opens</p>
                <p className="text-xs text-muted-foreground">See when recipients open your emails</p>
              </div>
            </div>
            <Switch
              checked={config.trackOpens}
              onCheckedChange={(checked) => handleChange('trackOpens', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <MousePointer className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Track Clicks</p>
                <p className="text-xs text-muted-foreground">See when recipients click links</p>
              </div>
            </div>
            <Switch
              checked={config.trackClicks}
              onCheckedChange={(checked) => handleChange('trackClicks', checked)}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Unsubscribe Link</p>
                <p className="text-xs text-muted-foreground">Include unsubscribe option in emails</p>
              </div>
            </div>
            <Switch
              checked={config.unsubscribeEnabled}
              onCheckedChange={(checked) => handleChange('unsubscribeEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
