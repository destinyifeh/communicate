import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { EnquirySupportConfig, FAQItem, generateId } from '@/lib/businessTypes';
import { Bell, Clock, Edit2, HelpCircle, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface EnquirySupportSetupProps {
  config: EnquirySupportConfig;
  onChange: (config: EnquirySupportConfig) => void;
  onComplete: () => void;
}

export function EnquirySupportSetup({ config, onChange, onComplete }: EnquirySupportSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const totalSteps = 4;

  const updateConfig = (updates: Partial<EnquirySupportConfig>) => {
    onChange({ ...config, ...updates });
  };

  const addFaq = () => {
    const newFaq: FAQItem = {
      id: generateId(),
      question: '',
      answer: '',
      keywords: [],
    };
    updateConfig({ faqs: [...config.faqs, newFaq] });
    setEditingFaq(newFaq.id);
  };

  const updateFaq = (id: string, updates: Partial<FAQItem>) => {
    const newFaqs = config.faqs.map(f =>
      f.id === id ? { ...f, ...updates } : f
    );
    updateConfig({ faqs: newFaqs });
  };

  const removeFaq = (id: string) => {
    updateConfig({ faqs: config.faqs.filter(f => f.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i + 1 === currentStep
                ? 'bg-primary text-primary-foreground'
                : i + 1 < currentStep
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`h-1 w-8 sm:w-16 mx-1 transition-colors ${
                i + 1 < currentStep ? 'bg-primary/20' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Support Type */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Support Type
            </CardTitle>
            <CardDescription>How do you want to handle customer enquiries?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['faq', 'ticket', 'hybrid'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateConfig({ supportType: type })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    config.supportType === type
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium capitalize mb-1">
                    {type === 'faq' ? 'FAQ Bot' : type === 'ticket' ? 'Support Tickets' : 'Hybrid'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {type === 'faq' && 'Auto-answer common questions'}
                    {type === 'ticket' && 'Create tickets for all enquiries'}
                    {type === 'hybrid' && 'FAQ first, then tickets'}
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Trigger Keywords</Label>
              <Input
                placeholder="help, support, question, issue, problem"
                value={config.triggerKeywords.join(', ')}
                onChange={(e) => updateConfig({ 
                  triggerKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Textarea
                rows={3}
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: FAQ Setup */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              FAQ Questions & Answers
            </CardTitle>
            <CardDescription>Set up automatic responses to common questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.faqs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No FAQs added yet</p>
                <Button variant="outline" className="mt-3 gap-2" onClick={addFaq}>
                  <Plus className="h-4 w-4" /> Add FAQ
                </Button>
              </div>
            )}

            {config.faqs.map((faq, index) => (
              <div key={faq.id} className="p-4 rounded-lg border bg-card">
                {editingFaq === faq.id ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Question {index + 1}</Label>
                      <Input
                        placeholder="What are your opening hours?"
                        value={faq.question}
                        onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Answer</Label>
                      <Textarea
                        rows={3}
                        placeholder="We're open Monday to Friday, 9am - 5pm..."
                        value={faq.answer}
                        onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Keywords (optional)</Label>
                      <Input
                        placeholder="hours, open, time"
                        value={faq.keywords.join(', ')}
                        onChange={(e) => updateFaq(faq.id, { 
                          keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        })}
                      />
                    </div>
                    <Button size="sm" onClick={() => setEditingFaq(null)}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium mb-1">
                        {index + 1}. {faq.question || 'Untitled question'}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {faq.answer || 'No answer provided'}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingFaq(faq.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFaq(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {config.faqs.length > 0 && (
              <Button variant="outline" className="w-full gap-2" onClick={addFaq}>
                <Plus className="h-4 w-4" /> Add More Questions
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Ticket Categories */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Escalation Settings
            </CardTitle>
            <CardDescription>What happens when the bot can't answer?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>FAQ Not Found Message</Label>
              <Textarea
                rows={3}
                value={config.faqNotFoundMessage}
                onChange={(e) => updateConfig({ faqNotFoundMessage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Ticket Categories</Label>
              <Input
                placeholder="General Inquiry, Technical Issue, Billing, Feedback"
                value={config.ticketCategories.join(', ')}
                onChange={(e) => updateConfig({ 
                  ticketCategories: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <div className="font-medium">Auto-escalate Unresolved</div>
                <div className="text-sm text-muted-foreground">Automatically escalate after timeout</div>
              </div>
              <Switch
                checked={config.autoEscalateUnresolved}
                onCheckedChange={(checked) => updateConfig({ autoEscalateUnresolved: checked })}
              />
            </div>

            {config.autoEscalateUnresolved && (
              <div className="space-y-2">
                <Label>Escalation Timeout (minutes)</Label>
                <Input
                  type="number"
                  min="1"
                  value={config.escalationTimeout}
                  onChange={(e) => updateConfig({ escalationTimeout: Number(e.target.value) })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Escalation Message</Label>
              <Textarea
                rows={2}
                value={config.escalationMessage}
                onChange={(e) => updateConfig({ escalationMessage: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Notifications */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications & Hours
            </CardTitle>
            <CardDescription>Configure when and how you get notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Collect Customer Information</Label>
              <div className="flex flex-wrap gap-2">
                {(['name', 'phone', 'email'] as const).map(field => (
                  <Badge
                    key={field}
                    variant={config.collectCustomerInfo.includes(field) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      const newFields = config.collectCustomerInfo.includes(field)
                        ? config.collectCustomerInfo.filter(f => f !== field)
                        : [...config.collectCustomerInfo, field];
                      updateConfig({ collectCustomerInfo: newFields });
                    }}
                  >
                    {field}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <div className="font-medium">Notify Admin</div>
                <div className="text-sm text-muted-foreground">Get notified for new tickets</div>
              </div>
              <Switch
                checked={config.notifyAdmin}
                onCheckedChange={(checked) => updateConfig({ notifyAdmin: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <div className="font-medium">Working Hours Only</div>
                <div className="text-sm text-muted-foreground">Only respond during business hours</div>
              </div>
              <Switch
                checked={config.workingHoursOnly}
                onCheckedChange={(checked) => updateConfig({ workingHoursOnly: checked })}
              />
            </div>

            {config.workingHoursOnly && (
              <div className="space-y-2">
                <Label>Outside Hours Message</Label>
                <Textarea
                  rows={3}
                  placeholder="Thanks for your message! We're currently closed but will respond during business hours."
                  value={config.outsideHoursMessage || ''}
                  onChange={(e) => updateConfig({ outsideHoursMessage: e.target.value })}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        {currentStep < totalSteps ? (
          <Button
            onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
          >
            Next Step
          </Button>
        ) : (
          <Button 
            className="gradient-primary text-primary-foreground"
            onClick={onComplete}
          >
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
}
