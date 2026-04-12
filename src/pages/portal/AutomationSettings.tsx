"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks";
import { motion } from "framer-motion";
import {
  Bell,
  Building2,
  Check,
  Copy,
  CreditCard,
  Globe,
  Key,
  Lock,
  Mail,
  Moon,
  Palette,
  Phone,
  RefreshCw,
  Shield,
  Smartphone,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Settings() {
  const { user } = useAuth();
  const [apiKey] = useState("ak_live_Xk9j2mNp4Q7rT1wZ8vB3cD6fH0gI");
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newMessages: true,
    appointments: true,
    marketing: false,
  });

  // Appearance
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    toast.success("API Key regenerated successfully");
    setRegenerateDialogOpen(false);
  };

  return (
    <ClientLayout>
      <motion.div
        className="space-y-6 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user?.name || "User"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {user?.businessName || "Business Account"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" defaultValue={user?.businessName || ""} />
                </div>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive push notifications on your device
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">SMS Notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive important alerts via SMS
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sms: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">New Messages</p>
                      <p className="text-xs text-muted-foreground">
                        When you receive a new conversation message
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newMessages}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, newMessages: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Appointments</p>
                      <p className="text-xs text-muted-foreground">
                        Reminders for upcoming appointments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.appointments}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, appointments: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Marketing Updates</p>
                      <p className="text-xs text-muted-foreground">
                        News, tips, and feature announcements
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, marketing: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Key Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key
              </CardTitle>
              <CardDescription>
                Use this key to integrate with external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="font-mono text-sm pr-24 bg-secondary/30"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-600"
                    >
                      Live
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Key className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="icon" onClick={copyApiKey}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Shield className="h-4 w-4 text-yellow-600 shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Keep your API key secure. Never share it publicly or commit it
                  to version control.
                </p>
              </div>

              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setRegenerateDialogOpen(true)}
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate Key
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Pro Plan</h3>
                      <Badge className="bg-primary text-primary-foreground">
                        Current
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      $49/month | Renews on April 15, 2026
                    </p>
                  </div>
                  <Button variant="outline">Manage Plan</Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-sm text-muted-foreground">Monthly Messages</p>
                  <p className="text-2xl font-bold mt-1">45,230</p>
                  <p className="text-xs text-muted-foreground">of 100,000</p>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-primary" style={{ width: "45%" }} />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-sm text-muted-foreground">AI Responses</p>
                  <p className="text-2xl font-bold mt-1">2,140</p>
                  <p className="text-xs text-muted-foreground">of 5,000</p>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-blue-500" style={{ width: "42%" }} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">View Billing History</Button>
                <Button variant="outline">Update Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Theme</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Sun className="h-5 w-5 mx-auto mb-2" />
                    <p className="text-sm font-medium">Light</p>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Moon className="h-5 w-5 mx-auto mb-2" />
                    <p className="text-sm font-medium">Dark</p>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === "system"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Globe className="h-5 w-5 mx-auto mb-2" />
                    <p className="text-sm font-medium">System</p>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-xs text-muted-foreground">
                      Last changed 30 days ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Sessions</p>
                    <p className="text-xs text-muted-foreground">
                      2 devices currently logged in
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Regenerate API Key Dialog */}
      <Dialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to regenerate your API key? The current key
              will be invalidated immediately and any integrations using it will
              stop working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRegenerateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRegenerateKey}>
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
