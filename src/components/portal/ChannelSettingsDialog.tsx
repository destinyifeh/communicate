import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Instagram, 
  Facebook, 
  MessageSquare, 
  Settings, 
  Bell, 
  Shield,
  RefreshCw,
  Unlink
} from 'lucide-react';
import { ChannelType } from '@/lib/onboardingTypes';
import { toast } from 'sonner';
import { useState } from 'react';

const TikTokIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const channelInfo: Record<ChannelType, { icon: React.ReactNode; name: string; color: string }> = {
  instagram: { icon: <Instagram className="h-5 w-5" />, name: 'Instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  facebook: { icon: <Facebook className="h-5 w-5" />, name: 'Facebook', color: 'bg-blue-500' },
  whatsapp: { icon: <MessageSquare className="h-5 w-5" />, name: 'WhatsApp', color: 'bg-green-500' },
  tiktok: { icon: <TikTokIcon />, name: 'TikTok', color: 'bg-gray-900 dark:bg-white dark:text-black' },
};

interface ChannelSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: {
    type: ChannelType;
    accountName: string;
    leads: number;
    automationsActive: number;
  };
  onDisconnect: () => void;
}

export function ChannelSettingsDialog({ 
  open, 
  onOpenChange, 
  channel,
  onDisconnect
}: ChannelSettingsDialogProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  
  const info = channelInfo[channel.type];

  const handleDisconnect = () => {
    onDisconnect();
    onOpenChange(false);
  };

  const handleReconnect = () => {
    toast.success(`Reconnecting ${info.name}...`);
    setTimeout(() => {
      toast.success(`${info.name} reconnected successfully!`);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg ${info.color} flex items-center justify-center text-white`}>
              {info.icon}
            </div>
            {info.name} Settings
          </DialogTitle>
          <DialogDescription>
            Configure settings for your {info.name} integration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Account Info */}
          <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Account</span>
              <span className="font-medium">{channel.accountName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Leads</span>
              <span className="font-medium">{channel.leads.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Automations</span>
              <span className="font-medium">{channel.automationsActive}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                Connected
              </Badge>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive alerts for new leads</p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={(checked) => {
                  setNotificationsEnabled(checked);
                  toast.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Auto-Reply</Label>
                  <p className="text-xs text-muted-foreground">Enable automatic responses</p>
                </div>
              </div>
              <Switch
                checked={autoReplyEnabled}
                onCheckedChange={(checked) => {
                  setAutoReplyEnabled(checked);
                  toast.success(`Auto-reply ${checked ? 'enabled' : 'disabled'}`);
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full gap-2 justify-start"
              onClick={handleReconnect}
            >
              <RefreshCw className="h-4 w-4" />
              Reconnect Account
            </Button>
            <Button 
              variant="outline" 
              className="w-full gap-2 justify-start text-destructive hover:text-destructive"
              onClick={handleDisconnect}
            >
              <Unlink className="h-4 w-4" />
              Disconnect {info.name}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}