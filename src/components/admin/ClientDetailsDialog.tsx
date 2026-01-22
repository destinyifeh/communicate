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
  Building2,
  Calendar,
  Key,
  Instagram,
  Facebook,
  MessageSquare,
  CheckCircle,
  XCircle,
  Copy,
  Bot,
  Users,
  CreditCard,
} from 'lucide-react';
import { Client } from '@/lib/mockData';
import { toast } from 'sonner';

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const platformIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  tiktok: <TikTokIcon />,
};

const platformColors: Record<string, string> = {
  instagram: 'bg-gradient-to-br from-purple-500 to-pink-500',
  facebook: 'bg-blue-600',
  whatsapp: 'bg-green-500',
  tiktok: 'bg-foreground',
};

export function ClientDetailsDialog({ open, onOpenChange, client }: ClientDetailsDialogProps) {
  if (!client) return null;

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(client.apiKey);
    toast.success('API key copied to clipboard');
  };

  const connectedPlatforms = Object.entries(client.platforms)
    .filter(([_, connected]) => connected)
    .map(([platform]) => platform);

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
            <TabsTrigger value="automations">Automations</TabsTrigger>
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
                    <span className="text-muted-foreground">Lead Usage</span>
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
                {connectedPlatforms.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No channels connected</p>
                ) : (
                  <div className="grid gap-3">
                    {connectedPlatforms.map((platform) => (
                      <div 
                        key={platform}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg ${platformColors[platform]} flex items-center justify-center text-white`}>
                            {platformIcons[platform]}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{platform}</p>
                            <p className="text-xs text-muted-foreground">@{client.company.toLowerCase().replace(/\s/g, '')}_{platform}</p>
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
                  Active Automations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!client.automations || client.automations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No automations configured</p>
                ) : (
                  <div className="space-y-3">
                    {client.automations.map((automation, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                            {automation.goalId === 'lead_capture' ? '📥' :
                             automation.goalId === 'auto_reply' ? '💬' :
                             automation.goalId === 'whatsapp_redirect' ? '📱' : '🤖'}
                          </div>
                          <div>
                            <p className="font-medium">{automation.goalName}</p>
                            <p className="text-xs text-muted-foreground capitalize">{automation.channel}</p>
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
                    ))}
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
