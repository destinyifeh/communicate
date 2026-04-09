import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    AppointmentConfig,
    AppointmentDuration,
    DayOfWeek
} from '@/lib/businessTypes';
import { Bell, Calendar, Clock, DollarSign, MessageSquare, Users } from 'lucide-react';
import { useState } from 'react';

interface AppointmentSetupProps {
  config: AppointmentConfig;
  onChange: (config: AppointmentConfig) => void;
  onComplete: () => void;
}

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DURATIONS: { value: AppointmentDuration; label: string }[] = [
  { value: '15', label: '15 mins' },
  { value: '30', label: '30 mins' },
  { value: '45', label: '45 mins' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
];

export function AppointmentSetup({ config, onChange, onComplete }: AppointmentSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const updateConfig = (updates: Partial<AppointmentConfig>) => {
    onChange({ ...config, ...updates });
  };

  const toggleDay = (day: DayOfWeek) => {
    const newAvailability = config.availability.map(a =>
      a.day === day ? { ...a, enabled: !a.enabled } : a
    );
    updateConfig({ availability: newAvailability });
  };

  const updateDaySlot = (day: DayOfWeek, field: 'startTime' | 'endTime', value: string) => {
    const newAvailability = config.availability.map(a =>
      a.day === day ? { ...a, slots: [{ ...a.slots[0], [field]: value }] } : a
    );
    updateConfig({ availability: newAvailability });
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

      {/* Step 1: Appointment Type */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Appointment Type
            </CardTitle>
            <CardDescription>What type of appointment are you offering?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Appointment Name</Label>
              <Input
                placeholder="e.g., Consultation, Haircut, Tutoring Session"
                value={config.appointmentName}
                onChange={(e) => updateConfig({ appointmentName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select 
                value={config.duration} 
                onValueChange={(v) => updateConfig({ duration: v as AppointmentDuration })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map(d => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Payment Required</div>
                  <div className="text-sm text-muted-foreground">Require payment before booking</div>
                </div>
              </div>
              <Switch
                checked={config.paymentRequired}
                onCheckedChange={(checked) => updateConfig({ paymentRequired: checked })}
              />
            </div>

            {config.paymentRequired && (
              <div className="space-y-2">
                <Label>Payment Amount (₦)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5000"
                  value={config.paymentAmount || ''}
                  onChange={(e) => updateConfig({ paymentAmount: Number(e.target.value) })}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Availability Setup */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Availability Setup
            </CardTitle>
            <CardDescription>When are you available for appointments?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Available Days</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => {
                  const dayConfig = config.availability.find(a => a.day === day);
                  return (
                    <Button
                      key={day}
                      type="button"
                      variant={dayConfig?.enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(day)}
                      className="w-12"
                    >
                      {day}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Time Slots per Day</Label>
              {config.availability.filter(a => a.enabled).map(dayConfig => (
                <div key={dayConfig.day} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <span className="w-10 font-medium">{dayConfig.day}</span>
                  <Input
                    type="time"
                    value={dayConfig.slots[0]?.startTime || '09:00'}
                    onChange={(e) => updateDaySlot(dayConfig.day, 'startTime', e.target.value)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={dayConfig.slots[0]?.endTime || '17:00'}
                    onChange={(e) => updateDaySlot(dayConfig.day, 'endTime', e.target.value)}
                    className="w-32"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max per Time Slot</Label>
                <Input
                  type="number"
                  min="1"
                  value={config.maxPerSlot}
                  onChange={(e) => updateConfig({ maxPerSlot: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Buffer Time (mins)</Label>
                <Input
                  type="number"
                  min="0"
                  value={config.bufferTime}
                  onChange={(e) => updateConfig({ bufferTime: Number(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Booking Trigger */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Booking Trigger
            </CardTitle>
            <CardDescription>How should customers start booking?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trigger Keywords</Label>
              <Input
                placeholder="book, appointment, schedule, reserve"
                value={config.triggerKeywords.join(', ')}
                onChange={(e) => updateConfig({ 
                  triggerKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
              <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
            </div>

            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Textarea
                rows={3}
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Request Message</Label>
              <Textarea
                rows={2}
                value={config.dateRequestMessage}
                onChange={(e) => updateConfig({ dateRequestMessage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Date Unavailable Message</Label>
              <Textarea
                rows={3}
                placeholder="Sorry, that date is fully booked..."
                value={config.dateUnavailableMessage}
                onChange={(e) => updateConfig({ dateUnavailableMessage: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Confirmation & Data
            </CardTitle>
            <CardDescription>What happens when the user confirms?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Confirmation Message</Label>
              <Textarea
                rows={3}
                value={config.confirmationMessage}
                onChange={(e) => updateConfig({ confirmationMessage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Collect Customer Information</Label>
              <div className="flex flex-wrap gap-2">
                {(['name', 'phone', 'email', 'notes'] as const).map(field => (
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
                <div className="text-sm text-muted-foreground">Get notified for new bookings</div>
              </div>
              <Switch
                checked={config.notifyAdmin}
                onCheckedChange={(checked) => updateConfig({ notifyAdmin: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Reminders */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Reminders
            </CardTitle>
            <CardDescription>Would you like to send appointment reminders?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <div className="font-medium">Send Reminders</div>
                <div className="text-sm text-muted-foreground">Remind customers before their appointment</div>
              </div>
              <Switch
                checked={config.sendReminder}
                onCheckedChange={(checked) => updateConfig({ sendReminder: checked })}
              />
            </div>

            {config.sendReminder && (
              <>
                <div className="space-y-2">
                  <Label>Reminder Timing</Label>
                  <div className="flex flex-wrap gap-2">
                    {(['24h', '1h', '30m'] as const).map(timing => (
                      <Badge
                        key={timing}
                        variant={config.reminderTiming.includes(timing) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newTiming = config.reminderTiming.includes(timing)
                            ? config.reminderTiming.filter(t => t !== timing)
                            : [...config.reminderTiming, timing];
                          updateConfig({ reminderTiming: newTiming });
                        }}
                      >
                        {timing === '24h' ? '24 hours before' : timing === '1h' ? '1 hour before' : '30 mins before'}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reminder Message</Label>
                  <Textarea
                    rows={3}
                    value={config.reminderMessage}
                    onChange={(e) => updateConfig({ reminderMessage: e.target.value })}
                    placeholder="Use {{time}} for appointment time"
                  />
                </div>
              </>
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
