import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  Webhook,
  Globe,
  Mail,
  Smartphone,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@automateflow.com',
    phone: '+234 800 000 0000',
    company: 'AutomateFlow',
    timezone: 'Africa/Lagos',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    newClientNotifications: true,
    paymentNotifications: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    ipWhitelist: '',
  });

  // Integration settings
  const [integrations, setIntegrations] = useState({
    manychatApiKey: 'mc_live_xxxxxxxxxxxxxxxxxxxxxxxxx',
    webhookUrl: 'https://api.automateflow.com/webhooks/incoming',
    webhookSecret: 'whsec_xxxxxxxxxxxxxxxxxxxxxxxxx',
  });

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(integrations.manychatApiKey);
    setCopied(true);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success('Settings saved successfully');
  };

  const handleRegenerateWebhookSecret = () => {
    const newSecret = 'whsec_' + Math.random().toString(36).substring(2, 30);
    setIntegrations({ ...integrations, webhookSecret: newSecret });
    toast.success('Webhook secret regenerated');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-muted-foreground">Manage your admin preferences and integrations</p>
          </div>
          <Button 
            onClick={handleSave} 
            className="gradient-primary text-primary-foreground gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Webhook className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input 
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input 
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="admin@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input 
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input 
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        placeholder="Your company"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Timezone
                    </Label>
                    <select 
                      className="w-full p-2 border rounded-md bg-background"
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    >
                      <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                      <option value="Africa/Accra">Africa/Accra (GMT)</option>
                      <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Alert Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        SMS Alerts
                        <Badge variant="secondary" className="text-xs">Premium</Badge>
                      </Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch 
                      checked={notifications.smsAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsAlerts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <Label>New Client Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new clients sign up</p>
                    </div>
                    <Switch 
                      checked={notifications.newClientNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, newClientNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <Label>Payment Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified about payments and subscriptions</p>
                    </div>
                    <Switch 
                      checked={notifications.paymentNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, paymentNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label>System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Important system and security alerts</p>
                    </div>
                    <Switch 
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Configure automated report delivery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly performance summary</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label>Monthly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive monthly business insights</p>
                    </div>
                    <Switch 
                      checked={notifications.monthlyReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReports: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {security.twoFactorEnabled && (
                        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Enabled</Badge>
                      )}
                      <Switch 
                        checked={security.twoFactorEnabled}
                        onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <select 
                      className="w-full p-2 border rounded-md bg-background"
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="240">4 hours</option>
                    </select>
                    <p className="text-xs text-muted-foreground">Automatically log out after inactivity</p>
                  </div>

                  <div className="space-y-2">
                    <Label>IP Whitelist</Label>
                    <Textarea 
                      value={security.ipWhitelist}
                      onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value })}
                      placeholder="Enter IP addresses, one per line"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">Restrict admin access to specific IP addresses</p>
                  </div>

                  <Button variant="outline" className="gap-2">
                    <Key className="h-4 w-4" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Configuration
                  </CardTitle>
                  <CardDescription>
                    Manage API keys and webhook settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>ManyChat API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input 
                          type={showApiKey ? 'text' : 'password'}
                          value={integrations.manychatApiKey}
                          onChange={(e) => setIntegrations({ ...integrations, manychatApiKey: e.target.value })}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button variant="outline" size="icon" onClick={handleCopyApiKey}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input 
                      value={integrations.webhookUrl}
                      onChange={(e) => setIntegrations({ ...integrations, webhookUrl: e.target.value })}
                      placeholder="https://your-domain.com/webhooks"
                    />
                    <p className="text-xs text-muted-foreground">URL where webhook events will be sent</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Webhook Secret</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="password"
                        value={integrations.webhookSecret}
                        readOnly
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleRegenerateWebhookSecret} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Used to verify webhook payloads</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>External services integrated with your platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'ManyChat', status: 'connected', icon: '💬' },
                      { name: 'TikTok Business', status: 'connected', icon: '🎵' },
                      { name: 'WhatsApp Business API', status: 'connected', icon: '📱' },
                      { name: 'Paystack', status: 'pending', icon: '💳' },
                    ].map((service) => (
                      <div key={service.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{service.icon}</span>
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={service.status === 'connected' 
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                            : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                          }
                        >
                          {service.status === 'connected' ? 'Connected' : 'Setup Required'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
