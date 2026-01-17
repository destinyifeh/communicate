import { useState } from 'react';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Check, 
  Key,
  MessageSquare,
  RefreshCw,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const platforms = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', description: 'WhatsApp Business API integration' },
  { id: 'instagram', name: 'Instagram', icon: '📸', description: 'Instagram DM automation' },
  { id: 'facebook', name: 'Facebook', icon: '👤', description: 'Facebook Messenger bot' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', description: 'TikTok lead capture' },
];

export default function AutomationSettings() {
  const [apiKey] = useState('ak_live_Xk9j2mNp4Q7rT1wZ8vB3cD6fH0gI');
  const [copied, setCopied] = useState(false);
  const [notificationNumber, setNotificationNumber] = useState('+234 801 234 5678');
  const [enabledPlatforms, setEnabledPlatforms] = useState({
    whatsapp: true,
    instagram: true,
    facebook: false,
    tiktok: false,
  });

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlatform = (platformId: string) => {
    setEnabledPlatforms(prev => ({
      ...prev,
      [platformId]: !prev[platformId as keyof typeof prev],
    }));
    toast.success(`${platformId.charAt(0).toUpperCase() + platformId.slice(1)} ${!enabledPlatforms[platformId as keyof typeof enabledPlatforms] ? 'enabled' : 'disabled'}`);
  };

  const updateNotificationNumber = () => {
    toast.success('Notification number updated successfully');
  };

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold">Automation Settings</h2>
          <p className="text-muted-foreground">Manage your API keys and platform integrations</p>
        </div>

        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>API Key</CardTitle>
                  <CardDescription>Use this key to connect external services</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="font-mono text-sm pr-20 bg-secondary/30"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500/10 text-green-600 dark:text-green-400"
                  >
                    Live
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={copyApiKey}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Shield className="h-4 w-4 text-yellow-600 dark:text-yellow-400 shrink-0" />
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Keep your API key secure. Never share it publicly or commit it to version control.
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate Key
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Platform Integrations</CardTitle>
              <CardDescription>Enable or disable automation for each platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <h4 className="font-medium">{platform.name}</h4>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={enabledPlatforms[platform.id as keyof typeof enabledPlatforms]}
                    onCheckedChange={() => togglePlatform(platform.id)}
                  />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Receive instant alerts for new leads and sales</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">WhatsApp Notification Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="whatsapp-number"
                    type="tel"
                    value={notificationNumber}
                    onChange={(e) => setNotificationNumber(e.target.value)}
                    placeholder="+234 XXX XXX XXXX"
                    className="flex-1"
                  />
                  <Button onClick={updateNotificationNumber} className="gradient-accent text-accent-foreground">
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll receive WhatsApp messages for new leads and confirmed sales
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
