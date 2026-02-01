import { useState } from 'react';
import { 
  BusinessCategoryType, 
  businessCategories,
  AutomationConfig,
  getDefaultConfig,
  PlanType,
  ChannelType,
  defaultAppointmentConfig,
  defaultSalesConfig,
  defaultEnquiryConfig,
  defaultLeadCaptureConfig
} from '@/lib/businessTypes';
import { BusinessCategorySelector } from './BusinessCategorySelector';
import { AppointmentSetup } from './AppointmentSetup';
import { SalesOrderSetup } from './SalesOrderSetup';
import { EnquirySupportSetup } from './EnquirySupportSetup';
import { LeadCaptureSetup } from './LeadCaptureSetup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, Instagram, Facebook, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const channelInfo: Record<ChannelType, { icon: React.ReactNode; name: string; color: string }> = {
  instagram: { icon: <Instagram className="h-4 w-4" />, name: 'Instagram', color: 'from-purple-500 to-pink-500' },
  facebook: { icon: <Facebook className="h-4 w-4" />, name: 'Facebook', color: 'from-blue-600 to-blue-500' },
  whatsapp: { icon: <MessageSquare className="h-4 w-4" />, name: 'WhatsApp', color: 'from-green-500 to-green-400' },
  tiktok: { icon: <TikTokIcon />, name: 'TikTok', color: 'from-gray-900 to-gray-700' },
};

interface AutomationBuilderProps {
  currentPlan: PlanType;
  connectedChannels: ChannelType[];
  onComplete: (automation: {
    category: BusinessCategoryType;
    channel: ChannelType;
    config: AutomationConfig;
  }) => void;
  onCancel: () => void;
}

export function AutomationBuilder({
  currentPlan,
  connectedChannels,
  onComplete,
  onCancel
}: AutomationBuilderProps) {
  const [step, setStep] = useState<'category' | 'channel' | 'configure'>('category');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategoryType | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | null>(null);
  const [config, setConfig] = useState<AutomationConfig | null>(null);

  const handleCategorySelect = (category: BusinessCategoryType) => {
    setSelectedCategory(category);
    setConfig(getDefaultConfig(category));
  };

  const handleChannelSelect = (channel: ChannelType) => {
    setSelectedChannel(channel);
  };

  const handleComplete = () => {
    if (!selectedCategory || !selectedChannel || !config) {
      toast.error('Please complete all steps');
      return;
    }

    onComplete({
      category: selectedCategory,
      channel: selectedChannel,
      config,
    });
  };

  const categoryInfo = selectedCategory 
    ? businessCategories.find(c => c.id === selectedCategory) 
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {step === 'category' && 'Select Business Type'}
            {step === 'channel' && 'Select Channel'}
            {step === 'configure' && `Configure ${categoryInfo?.name}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {step === 'category' && 'What type of automation do you need?'}
            {step === 'channel' && 'Which channel should this automation run on?'}
            {step === 'configure' && 'Set up your automation flow'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categoryInfo?.icon} {categoryInfo?.name}
            </Badge>
          )}
          {selectedChannel && (
            <Badge variant="secondary" className={`gap-1 bg-gradient-to-r ${channelInfo[selectedChannel].color} text-white`}>
              {channelInfo[selectedChannel].icon} {channelInfo[selectedChannel].name}
            </Badge>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Category Selection */}
        {step === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <BusinessCategorySelector
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
              currentPlan={currentPlan}
            />

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep('channel')}
                disabled={!selectedCategory}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Channel Selection */}
        {step === 'channel' && (
          <motion.div
            key="channel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {connectedChannels.map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => handleChannelSelect(channel)}
                  className={`relative p-6 rounded-xl border-2 text-center transition-all ${
                    selectedChannel === channel
                      ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`h-14 w-14 mx-auto rounded-full bg-gradient-to-br ${channelInfo[channel].color} flex items-center justify-center mb-3 text-white`}>
                    {channelInfo[channel].icon}
                  </div>
                  <div className="font-medium">{channelInfo[channel].name}</div>
                  
                  {selectedChannel === channel && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            {connectedChannels.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No channels connected yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Connect a channel first to set up automations.</p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep('category')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep('configure')}
                disabled={!selectedChannel}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Configuration */}
        {step === 'configure' && config && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {config.type === 'appointments_bookings' && (
              <AppointmentSetup
                config={config.config}
                onChange={(newConfig) => setConfig({ type: 'appointments_bookings', config: newConfig })}
              />
            )}

            {config.type === 'sales_orders' && (
              <SalesOrderSetup
                config={config.config}
                onChange={(newConfig) => setConfig({ type: 'sales_orders', config: newConfig })}
              />
            )}

            {config.type === 'enquiries_support' && (
              <EnquirySupportSetup
                config={config.config}
                onChange={(newConfig) => setConfig({ type: 'enquiries_support', config: newConfig })}
              />
            )}

            {config.type === 'lead_capture' && (
              <LeadCaptureSetup
                config={config.config}
                onChange={(newConfig) => setConfig({ type: 'lead_capture', config: newConfig })}
              />
            )}

            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('channel')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Channel
              </Button>
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={handleComplete}
              >
                Save Automation <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
