import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AutomationConfig,
    businessCategories,
    BusinessCategoryType,
    BusinessKindType,
    ChannelConnection,
    ChannelType,
    getAutomationsForBusinessKind,
    getDefaultConfig,
    planDetails,
    PlanType
} from '@/lib/businessTypes';
import {
    channelAutomationDescriptions
} from '@/lib/channelAutomationMap';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Facebook,
    Instagram,
    Lock,
    Mail,
    MessageSquare,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AppointmentSetup } from './AppointmentSetup';
import { EnquirySupportSetup } from './EnquirySupportSetup';
import { LeadCaptureSetup } from './LeadCaptureSetup';
import { SalesOrderSetup } from './SalesOrderSetup';

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const channelInfo: Record<ChannelType, { icon: React.ReactNode; name: string; color: string }> = {
  instagram: { icon: <Instagram className="h-5 w-5" />, name: 'Instagram', color: 'from-purple-500 to-pink-500' },
  facebook: { icon: <Facebook className="h-5 w-5" />, name: 'Facebook', color: 'from-blue-600 to-blue-500' },
  whatsapp: { icon: <MessageSquare className="h-5 w-5" />, name: 'WhatsApp', color: 'from-green-500 to-green-400' },
  tiktok: { icon: <TikTokIcon />, name: 'TikTok', color: 'from-gray-900 to-gray-700 dark:from-white dark:to-gray-200' },
  email: { icon: <Mail className="h-5 w-5" />, name: 'Email', color: 'from-red-500 to-rose-500' },
};

interface ChannelAutomation {
  channel: ChannelType;
  category: BusinessCategoryType;
  config: AutomationConfig;
  configured: boolean;
}

interface ChannelAutomationSetupProps {
  currentPlan: PlanType;
  connectedChannels: ChannelConnection[];
  businessKind?: BusinessKindType | null;
  existingAutomations?: ChannelAutomation[];
  onComplete: (automations: {
    channel: ChannelType;
    category: BusinessCategoryType;
    config: AutomationConfig;
  }[]) => void;
  onBack: () => void;
}

export function ChannelAutomationSetup({
  currentPlan,
  connectedChannels,
  businessKind,
  existingAutomations = [],
  onComplete,
  onBack
}: ChannelAutomationSetupProps) {
  // Convert ChannelConnection[] to ChannelType[]
  const channelTypes = connectedChannels.map(c => c.type);
  
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [channelAutomations, setChannelAutomations] = useState<ChannelAutomation[]>(
    existingAutomations.length > 0 ? existingAutomations : []
  );
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategoryType | null>(null);
  const [currentConfig, setCurrentConfig] = useState<AutomationConfig | null>(null);

  const currentChannel = channelTypes[currentChannelIndex];
  const plan = planDetails[currentPlan];
  const maxAutomations = plan.maxAutomations === 'unlimited' ? 999 : plan.maxAutomations;
  const currentAutomationCount = channelAutomations.filter(a => a.configured).length;
  const canAddMore = currentAutomationCount < maxAutomations;

  // Get available automations for current channel based on business kind
  const availableAutomations = businessKind 
    ? getAutomationsForBusinessKind(businessKind, currentChannel)
    : [];
  const channelDescriptions = channelAutomationDescriptions[currentChannel];

  // Check if category is already configured for this channel
  const isConfiguredForChannel = (category: BusinessCategoryType) => {
    return channelAutomations.some(
      a => a.channel === currentChannel && a.category === category && a.configured
    );
  };

  const handleCategorySelect = (category: BusinessCategoryType) => {
    if (isConfiguredForChannel(category)) {
      toast.info('This automation is already configured for this channel');
      return;
    }
    if (!canAddMore) {
      toast.error(`You've reached your automation limit (${maxAutomations}). Please upgrade to add more.`);
      return;
    }
    setSelectedCategory(category);
    setCurrentConfig(getDefaultConfig(category));
    setStep('configure');
  };

  const handleSaveAutomation = () => {
    if (!selectedCategory || !currentConfig) return;

    const newAutomation: ChannelAutomation = {
      channel: currentChannel,
      category: selectedCategory,
      config: currentConfig,
      configured: true,
    };

    setChannelAutomations(prev => [...prev, newAutomation]);
    setStep('select');
    setSelectedCategory(null);
    setCurrentConfig(null);
    
    toast.success(`${businessCategories.find(c => c.id === selectedCategory)?.name} automation saved for ${channelInfo[currentChannel].name}`);
  };

  const handleNextChannel = () => {
    if (currentChannelIndex < channelTypes.length - 1) {
      setCurrentChannelIndex(prev => prev + 1);
      setStep('select');
      setSelectedCategory(null);
      setCurrentConfig(null);
    }
  };

  const handlePrevChannel = () => {
    if (currentChannelIndex > 0) {
      setCurrentChannelIndex(prev => prev - 1);
      setStep('select');
      setSelectedCategory(null);
      setCurrentConfig(null);
    }
  };

  const handleComplete = () => {
    const configuredAutomations = channelAutomations.filter(a => a.configured);
    if (configuredAutomations.length === 0) {
      toast.error('Please configure at least one automation');
      return;
    }
    onComplete(configuredAutomations.map(a => ({
      channel: a.channel,
      category: a.category,
      config: a.config,
    })));
  };

  const channelConfiguredCount = channelAutomations.filter(
    a => a.channel === currentChannel && a.configured
  ).length;

  // Only count available automations for progress tracking
  const totalAvailableAutomations = channelTypes.reduce((total, channel) => {
    const available = businessKind 
      ? getAutomationsForBusinessKind(businessKind, channel)
      : [];
    return total + available.length;
  }, 0);

  const categoryInfo = selectedCategory 
    ? businessCategories.find(c => c.id === selectedCategory) 
    : null;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${channelInfo[currentChannel].color} flex items-center justify-center text-white`}>
            {channelInfo[currentChannel].icon}
          </div>
          <div>
            <h2 className="text-xl font-bold">{channelInfo[currentChannel].name} Automation</h2>
            <p className="text-sm text-muted-foreground">
              Channel {currentChannelIndex + 1} of {channelTypes.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {currentAutomationCount} / {totalAvailableAutomations} automations
          </Badge>
        </div>
      </div>

      {/* Channel Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {channelTypes.map((channel, index) => {
          const configCount = channelAutomations.filter(
            a => a.channel === channel && a.configured
          ).length;
          return (
            <button
              key={channel}
              onClick={() => {
                setCurrentChannelIndex(index);
                setStep('select');
                setSelectedCategory(null);
                setCurrentConfig(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all shrink-0 ${
                index === currentChannelIndex
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${channelInfo[channel].color} flex items-center justify-center text-white`}>
                {channelInfo[channel].icon}
              </div>
              <span className="font-medium">{channelInfo[channel].name}</span>
              {configCount > 0 && (
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  {configCount}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Automation Type Selection */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Available Automations for {channelInfo[currentChannel].name}</CardTitle>
                <CardDescription>
                  Select the automation type you want to set up for this channel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessCategories.map((category) => {
                  const isAvailable = availableAutomations.includes(category.id);
                  const isConfigured = isConfiguredForChannel(category.id);
                  const automationDesc = channelDescriptions.automations.find(
                    a => a.type === category.id
                  );
                  
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => isAvailable && !isConfigured && handleCategorySelect(category.id)}
                      disabled={!isAvailable || isConfigured}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                        isConfigured
                          ? 'border-accent bg-accent/5 cursor-default'
                          : isAvailable
                          ? 'border-border hover:border-primary/50 hover:bg-secondary/30'
                          : 'border-border/50 bg-muted/30 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shrink-0`}>
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{category.name}</span>
                          {isConfigured && (
                            <Badge className="bg-accent text-accent-foreground">
                              <Check className="h-3 w-3 mr-1" /> Configured
                            </Badge>
                          )}
                          {!isAvailable && (
                            <Badge variant="secondary" className="gap-1">
                              <Lock className="h-3 w-3" /> Not available
                            </Badge>
                          )}
                        </div>
                        {automationDesc ? (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Trigger:</span> {automationDesc.trigger}
                            <br />
                            <span className="font-medium">Action:</span> {automationDesc.action}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                      {isAvailable && !isConfigured && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Configured Automations for this Channel */}
            {channelConfiguredCount > 0 && (
              <Card className="border-accent/30 bg-accent/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Configured for {channelInfo[currentChannel].name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {channelAutomations
                      .filter(a => a.channel === currentChannel && a.configured)
                      .map((automation, idx) => {
                        const cat = businessCategories.find(c => c.id === automation.category);
                        return (
                          <Badge key={idx} variant="secondary" className="gap-1 py-1">
                            {cat?.icon} {cat?.name}
                          </Badge>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <div className="flex gap-2">
                {currentChannelIndex > 0 ? (
                  <Button variant="outline" onClick={handlePrevChannel}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous Channel
                  </Button>
                ) : (
                  <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {currentChannelIndex < channelTypes.length - 1 ? (
                  <Button onClick={handleNextChannel}>
                    Next Channel <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleComplete}
                    disabled={currentAutomationCount === 0}
                    className="gradient-primary text-primary-foreground"
                  >
                    Complete Setup <Check className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Configuration Step */}
        {step === 'configure' && currentConfig && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${categoryInfo?.color} flex items-center justify-center text-xl`}>
                    {categoryInfo?.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{categoryInfo?.name}</CardTitle>
                    <CardDescription>
                      Configure for {channelInfo[currentChannel].name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {currentConfig.type === 'appointments_bookings' && (
                  <AppointmentSetup
                    config={currentConfig.config}
                    onChange={(newConfig) => setCurrentConfig({ type: 'appointments_bookings', config: newConfig })}
                    onComplete={handleSaveAutomation}
                  />
                )}

                {currentConfig.type === 'sales_orders' && (
                  <SalesOrderSetup
                    config={currentConfig.config}
                    onChange={(newConfig) => setCurrentConfig({ type: 'sales_orders', config: newConfig })}
                    onComplete={handleSaveAutomation}
                  />
                )}

                {currentConfig.type === 'enquiries_support' && (
                  <EnquirySupportSetup
                    config={currentConfig.config}
                    onChange={(newConfig) => setCurrentConfig({ type: 'enquiries_support', config: newConfig })}
                    onComplete={handleSaveAutomation}
                  />
                )}

                {currentConfig.type === 'lead_capture' && (
                  <LeadCaptureSetup
                    config={currentConfig.config}
                    onChange={(newConfig) => setCurrentConfig({ type: 'lead_capture', config: newConfig })}
                    onComplete={handleSaveAutomation}
                  />
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setStep('select');
                  setSelectedCategory(null);
                  setCurrentConfig(null);
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={handleSaveAutomation}
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
