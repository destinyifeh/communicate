'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  MessageSquare,
  DollarSign,
  Users,
  Settings,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
  CheckCheck,
  Server,
  Shield,
  Webhook,
  Mail,
  Phone,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminNotification {
  id: string;
  type: 'client' | 'system' | 'security' | 'webhook' | 'revenue' | 'channel' | 'ai';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
}

const mockAdminNotifications: AdminNotification[] = [
  {
    id: '1',
    type: 'client',
    title: 'New Client Registration',
    message: 'TechCorp Nigeria has registered for the Business plan with WhatsApp, SMS, and Email channels.',
    time: '5 min ago',
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    type: 'channel',
    title: 'Resend Email Integration Active',
    message: 'Email integration via Resend is now live for Fashion Hub. Webhook configured successfully.',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'revenue',
    title: 'Payment Received',
    message: 'Monthly subscription payment of ₦150,000 from Elegant Fashion.',
    time: '30 min ago',
    read: false,
  },
  {
    id: '4',
    type: 'webhook',
    title: 'Twilio Webhook Failure',
    message: '3 consecutive webhook failures detected for Voice/SMS integration on GreenLeaf Farms.',
    time: '1 hour ago',
    read: false,
    priority: 'high',
  },
  {
    id: '5',
    type: 'ai',
    title: 'AI Performance Alert',
    message: 'AI resolution rate dropped to 72% for BeautyPro Salon. Review escalated conversations.',
    time: '2 hours ago',
    read: false,
    priority: 'medium',
  },
  {
    id: '6',
    type: 'security',
    title: 'Suspicious Activity',
    message: 'Multiple failed login attempts detected for admin@communicate.com.',
    time: '3 hours ago',
    read: true,
    priority: 'high',
  },
  {
    id: '7',
    type: 'channel',
    title: 'New Phone Number Provisioned',
    message: 'Twilio phone number +1 (555) 123-4567 assigned to TechCorp Nigeria.',
    time: '4 hours ago',
    read: true,
  },
  {
    id: '8',
    type: 'system',
    title: 'Server Maintenance',
    message: 'Scheduled maintenance completed. All channels (WhatsApp, SMS, Email, Voice) operational.',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '9',
    type: 'ai',
    title: 'AI Training Complete',
    message: 'Custom AI responses updated for 12 clients. New conversation patterns deployed.',
    time: '6 hours ago',
    read: true,
  },
  {
    id: '10',
    type: 'client',
    title: 'Client Plan Upgrade',
    message: 'GreenLeaf Farms upgraded from Starter to Business plan. Voice channel now enabled.',
    time: '1 day ago',
    read: true,
  },
];

const notificationIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  client: { icon: <Users className="h-5 w-5" />, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  revenue: { icon: <DollarSign className="h-5 w-5" />, color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  system: { icon: <Server className="h-5 w-5" />, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  security: { icon: <Shield className="h-5 w-5" />, color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  webhook: { icon: <Webhook className="h-5 w-5" />, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  channel: { icon: <Phone className="h-5 w-5" />, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  ai: { icon: <Bot className="h-5 w-5" />, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockAdminNotifications);
  const [filter, setFilter] = useState<string>('all');
  const [notificationSettings, setNotificationSettings] = useState({
    clients: true,
    revenue: true,
    system: true,
    security: true,
    webhooks: true,
    channels: true,
    ai: true,
    email: true,
    slack: false,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Admin Notifications
            </h2>
            <p className="text-sm text-muted-foreground">
              System alerts, client updates, and platform monitoring
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary px-3 py-1.5 w-fit">
              {unreadCount} Unread
            </Badge>
          )}
        </div>

        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="notifications" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Filters and Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                        className="text-xs md:text-sm"
                      >
                        All
                      </Button>
                      <Button
                        variant={filter === 'unread' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('unread')}
                        className="text-xs md:text-sm"
                      >
                        Unread
                      </Button>
                      <Button
                        variant={filter === 'security' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('security')}
                        className="text-xs md:text-sm"
                      >
                        Security
                      </Button>
                      <Button
                        variant={filter === 'client' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('client')}
                        className="text-xs md:text-sm"
                      >
                        Clients
                      </Button>
                      <Button
                        variant={filter === 'channel' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('channel')}
                        className="text-xs md:text-sm"
                      >
                        Channels
                      </Button>
                      <Button
                        variant={filter === 'ai' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('ai')}
                        className="text-xs md:text-sm"
                      >
                        AI
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                        className="gap-1 text-xs md:text-sm"
                        disabled={unreadCount === 0}
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Mark all read</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                        className="gap-1 text-xs md:text-sm text-destructive hover:text-destructive"
                        disabled={notifications.length === 0}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Clear all</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className={`border-border/50 transition-colors ${
                        !notification.read ? 'bg-primary/5 border-primary/20' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 p-2.5 rounded-full ${notificationIcons[notification.type].color}`}>
                            {notificationIcons[notification.type].icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h4 className="font-semibold text-sm md:text-base">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                  )}
                                  {notification.priority === 'high' && (
                                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                      High
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  {notification.time}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredNotifications.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="font-semibold mb-1">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {filter === 'all' 
                      ? "You're all caught up!" 
                      : `No ${filter} notifications found`}
                  </p>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Notification Types</CardTitle>
                  <CardDescription>
                    Choose which notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Client Updates</p>
                        <p className="text-sm text-muted-foreground">
                          New registrations, plan changes, and activity
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.clients}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, clients: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Revenue</p>
                        <p className="text-sm text-muted-foreground">
                          Payment confirmations and billing updates
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.revenue}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, revenue: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Login attempts, suspicious activity
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.security}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, security: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                        <Webhook className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Webhook Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Integration failures and errors
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.webhooks}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, webhooks: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <Server className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">System Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Maintenance, deployments, and status
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.system}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, system: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Channel Integrations</p>
                        <p className="text-sm text-muted-foreground">
                          Email, SMS, Voice, and social channel updates
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.channels}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, channels: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">AI Performance</p>
                        <p className="text-sm text-muted-foreground">
                          AI resolution rates, training, and escalations
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.ai}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, ai: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Channels</CardTitle>
                  <CardDescription>
                    How do you want to receive notifications?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive important alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, email: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Slack Integration</p>
                      <p className="text-sm text-muted-foreground">
                        Get alerts in your Slack workspace
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.slack}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, slack: checked })
                      }
                    />
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
