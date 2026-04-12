import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Phone,
  PhoneCall,
  Building2,
  Calendar,
  Key,
  MessageSquare,
  CheckCircle,
  XCircle,
  Copy,
  Bot,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import { Client } from '@/lib/mockData';
import { toast } from 'sonner';

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

// Channel icons for Twilio-based communication channels
const channelIcons: Record<string, React.ReactNode> = {
  sms: <Smartphone className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  voice: <PhoneCall className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
};

const channelColors: Record<string, string> = {
  sms: 'bg-blue-500',
  whatsapp: 'bg-green-500',
  voice: 'bg-orange-500',
  email: 'bg-cyan-500',
};

const channelNames: Record<string, string> = {
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  voice: 'Voice Calls',
  email: 'Email',
};

export function ClientDetailsDialog({ open, onOpenChange, client }: ClientDetailsDialogProps) {
  if (!client) return null;

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(client.apiKey);
    toast.success('API key copied to clipboard');
  };

  // Map old platform names to new channel names for display
  // The client data still uses platforms object, but we display as communication channels
  const channelMapping: Record<string, string> = {
    whatsapp: 'whatsapp',
    instagram: 'sms', // Map legacy instagram to SMS
    facebook: 'voice', // Map legacy facebook to Voice
    tiktok: 'email', // Map legacy tiktok to Email
  };

  const connectedChannels = Object.entries(client.platforms)
    .filter(([_, connected]) => connected)
    .map(([platform]) => channelMapping[platform] || platform)
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {client.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span>{client.name}</span>
              <p className="text-sm text-muted-foreground font-normal">{client.company}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Complete client profile and activity information
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="automations">AI Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="text-sm">{client.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm">{new Date(client.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Plan:</span>
                    <Badge variant="secondary">{client.plan}</Badge>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={client.status === 'active' 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'bg-red-500/10 text-red-600'
                    }
                  >
                    {client.status === 'active' ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Suspended</>
                    )}
                  </Badge>
                </div>
                
                {client.planExpiryDate && (
                  <div className="text-sm text-muted-foreground">
                    Expires: {new Date(client.planExpiryDate).toLocaleDateString()}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Message Usage</span>
                    <span>{client.leadsUsed.toLocaleString()} / {client.leadLimit.toLocaleString()}</span>
                  </div>
                  <Progress value={(client.leadsUsed / client.leadLimit) * 100} className="h-2" />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Revenue</span>
                  <span className="font-semibold">₦{(client.revenue / 1000000).toFixed(2)}M</span>
                </div>
              </CardContent>
            </Card>

            {/* API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  API Key
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 rounded bg-secondary text-xs font-mono truncate">
                    {client.apiKey}
                  </code>
                  <Button variant="outline" size="icon" onClick={handleCopyApiKey}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Connected Channels
                </CardTitle>
              </CardHeader>
              <CardContent>
                {connectedChannels.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No channels connected</p>
                ) : (
                  <div className="grid gap-3">
                    {connectedChannels.map((channel) => (
                      <div
                        key={channel}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg ${channelColors[channel]} flex items-center justify-center text-white`}>
                            {channelIcons[channel]}
                          </div>
                          <div>
                            <p className="font-medium">{channelNames[channel]}</p>
                            <p className="text-xs text-muted-foreground">
                              {channel === 'voice' ? 'Twilio Voice' : channel === 'sms' ? 'Twilio SMS' : channel === 'whatsapp' ? 'Twilio WhatsApp' : 'SendGrid'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" /> Connected
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!client.automations || client.automations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No AI workflows configured</p>
                ) : (
                  <div className="space-y-3">
                    {client.automations.map((automation, index) => {
                      // Map old goal names to new workflow names
                      const workflowNames: Record<string, string> = {
                        'lead_capture': 'Inbound Message Handler',
                        'auto_reply': 'AI Auto-Response',
                        'whatsapp_redirect': 'WhatsApp Routing',
                        'faq_bot': 'FAQ Assistant',
                      };
                      const workflowIcons: Record<string, string> = {
                        'lead_capture': '📨',
                        'auto_reply': '🤖',
                        'whatsapp_redirect': '📱',
                        'faq_bot': '💬',
                      };
                      // Map old channel names to new ones
                      const channelDisplayNames: Record<string, string> = {
                        'instagram': 'SMS',
                        'facebook': 'Voice',
                        'tiktok': 'Email',
                        'whatsapp': 'WhatsApp',
                      };
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                              {workflowIcons[automation.goalId] || '🤖'}
                            </div>
                            <div>
                              <p className="font-medium">{workflowNames[automation.goalId] || automation.goalName}</p>
                              <p className="text-xs text-muted-foreground">
                                {channelDisplayNames[automation.channel] || automation.channel}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={automation.status === 'active'
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-yellow-500/10 text-yellow-600'
                            }
                          >
                            {automation.status === 'active' ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
