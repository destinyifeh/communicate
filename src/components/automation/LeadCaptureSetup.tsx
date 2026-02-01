import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { LeadCaptureConfig, generateId } from '@/lib/businessTypes';
import { UserPlus, MessageSquare, Gift, Phone, Bell, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LeadCaptureSetupProps {
  config: LeadCaptureConfig;
  onChange: (config: LeadCaptureConfig) => void;
}

export function LeadCaptureSetup({ config, onChange }: LeadCaptureSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateConfig = (updates: Partial<LeadCaptureConfig>) => {
    onChange({ ...config, ...updates });
  };

  const addFollowUp = () => {
    updateConfig({
      followUpMessages: [
        ...config.followUpMessages,
        { message: '', delayMinutes: 60 }
      ]
    });
  };

  const updateFollowUp = (index: number, updates: Partial<typeof config.followUpMessages[0]>) => {
    const newMessages = config.followUpMessages.map((m, i) =>
      i === index ? { ...m, ...updates } : m
    );
    updateConfig({ followUpMessages: newMessages });
  };

  const removeFollowUp = (index: number) => {
    updateConfig({
      followUpMessages: config.followUpMessages.filter((_, i) => i !== index)
    });
  };

  const addQuestion = () => {
    updateConfig({
      qualifyingQuestions: [
        ...config.qualifyingQuestions,
        { id: generateId(), question: '', options: [] }
      ]
    });
  };

  const updateQuestion = (id: string, updates: Partial<typeof config.qualifyingQuestions[0]>) => {
    const newQuestions = config.qualifyingQuestions.map(q =>
      q.id === id ? { ...q, ...updates } : q
    );
    updateConfig({ qualifyingQuestions: newQuestions });
  };

  const removeQuestion = (id: string) => {
    updateConfig({
      qualifyingQuestions: config.qualifyingQuestions.filter(q => q.id !== id)
    });
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

      {/* Step 1: Capture Method */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Capture Method
            </CardTitle>
            <CardDescription>How do you want to capture leads?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['comment', 'dm', 'both'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => updateConfig({ captureMethod: method })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    config.captureMethod === method
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium capitalize mb-1">
                    {method === 'comment' ? 'Comments' : method === 'dm' ? 'Direct Messages' : 'Both'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {method === 'comment' && 'Capture from post comments'}
                    {method === 'dm' && 'Capture from DM conversations'}
                    {method === 'both' && 'Capture from comments and DMs'}
                  </div>
                </button>
              ))}
            </div>

            {(config.captureMethod === 'comment' || config.captureMethod === 'both') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateConfig({ commentTriggerType: 'keyword' })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    config.commentTriggerType === 'keyword'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium mb-1">Keyword Trigger</div>
                  <div className="text-xs text-muted-foreground">Only respond to specific keywords</div>
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig({ commentTriggerType: 'any' })}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    config.commentTriggerType === 'any'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium mb-1">Any Comment</div>
                  <div className="text-xs text-muted-foreground">Respond to all comments</div>
                </button>
              </div>
            )}

            <div className="space-y-2">
              <Label>Trigger Keywords</Label>
              <Input
                placeholder="info, interested, price, more"
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

      {/* Step 2: Lead Magnet */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Lead Magnet (Optional)
            </CardTitle>
            <CardDescription>Offer something valuable in exchange for contact info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <div className="font-medium">Enable Lead Magnet</div>
                <div className="text-sm text-muted-foreground">Offer a free resource</div>
              </div>
              <Switch
                checked={!!config.leadMagnet}
                onCheckedChange={(checked) => updateConfig({ 
                  leadMagnet: checked ? {
                    id: generateId(),
                    name: '',
                    type: 'pdf',
                    deliveryMessage: 'Here\'s your free resource! 🎁',
                  } : undefined
                })}
              />
            </div>

            {config.leadMagnet && (
              <>
                <div className="space-y-2">
                  <Label>Resource Name</Label>
                  <Input
                    placeholder="Free Price List, E-book, Discount Code"
                    value={config.leadMagnet.name}
                    onChange={(e) => updateConfig({ 
                      leadMagnet: { ...config.leadMagnet!, name: e.target.value }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {(['pdf', 'video', 'discount', 'ebook', 'webinar', 'other'] as const).map(type => (
                      <Badge
                        key={type}
                        variant={config.leadMagnet?.type === type ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => updateConfig({ 
                          leadMagnet: { ...config.leadMagnet!, type }
                        })}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Delivery Message</Label>
                  <Textarea
                    rows={2}
                    value={config.leadMagnet.deliveryMessage}
                    onChange={(e) => updateConfig({ 
                      leadMagnet: { ...config.leadMagnet!, deliveryMessage: e.target.value }
                    })}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Collect Information</Label>
              <div className="flex flex-wrap gap-2">
                {(['name', 'phone', 'email', 'company', 'interest'] as const).map(field => (
                  <Badge
                    key={field}
                    variant={config.collectInfo.includes(field) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      const newFields = config.collectInfo.includes(field)
                        ? config.collectInfo.filter(f => f !== field)
                        : [...config.collectInfo, field];
                      updateConfig({ collectInfo: newFields });
                    }}
                  >
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Follow-up */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Follow-up Messages
            </CardTitle>
            <CardDescription>Automatically follow up with leads</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.followUpMessages.length === 0 && (
              <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No follow-up messages</p>
                <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={addFollowUp}>
                  <Plus className="h-4 w-4" /> Add Follow-up
                </Button>
              </div>
            )}

            {config.followUpMessages.map((followUp, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Follow-up {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeFollowUp(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Message</Label>
                  <Textarea
                    rows={2}
                    placeholder="Just checking in! Did you have any questions?"
                    value={followUp.message}
                    onChange={(e) => updateFollowUp(index, { message: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Delay (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={followUp.delayMinutes}
                    onChange={(e) => updateFollowUp(index, { delayMinutes: Number(e.target.value) })}
                  />
                </div>
              </div>
            ))}

            {config.followUpMessages.length > 0 && (
              <Button variant="outline" className="w-full gap-2" onClick={addFollowUp}>
                <Plus className="h-4 w-4" /> Add Another Follow-up
              </Button>
            )}

            <div className="space-y-2">
              <Label>Thank You Message</Label>
              <Textarea
                rows={2}
                value={config.thankYouMessage}
                onChange={(e) => updateConfig({ thankYouMessage: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: WhatsApp & Notifications */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              WhatsApp & Notifications
            </CardTitle>
            <CardDescription>Redirect leads and get notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <div className="font-medium">Redirect to WhatsApp</div>
                <div className="text-sm text-muted-foreground">Send leads to WhatsApp for chat</div>
              </div>
              <Switch
                checked={config.redirectToWhatsApp}
                onCheckedChange={(checked) => updateConfig({ redirectToWhatsApp: checked })}
              />
            </div>

            {config.redirectToWhatsApp && (
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input
                  placeholder="+234 xxx xxx xxxx"
                  value={config.whatsAppNumber || ''}
                  onChange={(e) => updateConfig({ whatsAppNumber: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Lead Tags</Label>
              <Input
                placeholder="new, hot, instagram"
                value={config.tagLeads.join(', ')}
                onChange={(e) => updateConfig({ 
                  tagLeads: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
              <p className="text-xs text-muted-foreground">Tags help organize leads in your CRM</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <div className="font-medium">Notify Admin</div>
                <div className="text-sm text-muted-foreground">Get notified for new leads</div>
              </div>
              <Switch
                checked={config.notifyAdmin}
                onCheckedChange={(checked) => updateConfig({ notifyAdmin: checked })}
              />
            </div>
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
          <Button className="gradient-primary text-primary-foreground">
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
}
