'use client';

import { useState } from 'react';
import { ClientLayout } from '@/components/layouts/ClientLayout';
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
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'lead' | 'sale' | 'system' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  platform?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New Lead Captured',
    message: 'Adebayo Johnson from WhatsApp is interested in your premium package.',
    time: '5 min ago',
    read: false,
    platform: 'whatsapp',
  },
  {
    id: '2',
    type: 'sale',
    title: 'Sale Confirmed!',
    message: 'Payment of ₦25,000 received from Chioma Okafor.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'system',
    title: 'Bot Response Updated',
    message: 'Your WhatsApp bot responses have been successfully updated.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'alert',
    title: 'Lead Limit Warning',
    message: 'You have used 80% of your monthly lead limit.',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'lead',
    title: 'New Lead Captured',
    message: 'Emeka Nwosu from Instagram is asking about pricing.',
    time: '1 day ago',
    read: true,
    platform: 'instagram',
  },
  {
    id: '6',
    type: 'sale',
    title: 'Sale Confirmed!',
    message: 'Payment of ₦15,000 received from Fatima Ibrahim.',
    time: '2 days ago',
    read: true,
  },
];

const notificationIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  lead: { icon: <Users className="h-5 w-5" />, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  sale: { icon: <DollarSign className="h-5 w-5" />, color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  system: { icon: <Info className="h-5 w-5" />, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  alert: { icon: <AlertCircle className="h-5 w-5" />, color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<string>('all');
  const [notificationSettings, setNotificationSettings] = useState({
    leads: true,
    sales: true,
    system: true,
    alerts: true,
    email: false,
    push: true,
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
    <ClientLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
            </h2>
            <p className="text-sm text-muted-foreground">
              Stay updated with your leads, sales, and system alerts
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
                        variant={filter === 'lead' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('lead')}
                        className="text-xs md:text-sm"
                      >
                        Leads
                      </Button>
                      <Button
                        variant={filter === 'sale' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('sale')}
                        className="text-xs md:text-sm"
                      >
                        Sales
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
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm md:text-base">
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
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
                        <p className="font-medium">New Leads</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when a new lead is captured
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.leads}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, leads: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Sales</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when a sale is confirmed
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.sales}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, sales: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <Info className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">System Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Bot updates, feature changes, and more
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
                      <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Important warnings and limit notifications
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.alerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, alerts: checked })
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
                  <CardTitle className="text-lg">Delivery Method</CardTitle>
                  <CardDescription>
                    How do you want to receive notifications?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, push: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive a daily digest via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, email: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
