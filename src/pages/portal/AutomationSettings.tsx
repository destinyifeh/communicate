"use client";

import { AutomationBuilder } from "@/components/automation/AutomationBuilder";
import { ClientLayout } from "@/components/layouts/ClientLayout";
import { UpgradeDialog } from "@/components/portal/UpgradeDialog";
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
import {
  AutomationConfig,
  BusinessCategoryType,
  BusinessKindType,
  ChannelType,
  ConfiguredBusinessAutomation,
  PlanType,
  businessCategories,
  businessKinds,
  getAutomationsForBusinessKind,
  planDetails,
} from "@/lib/businessTypes";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUp,
  Building2,
  Check,
  Copy,
  Crown,
  Facebook,
  Instagram,
  Key,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Trash2,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const channelIcons: Record<ChannelType, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  tiktok: <TikTokIcon />,
  email: <Mail className="h-4 w-4" />,
};

const channelColors: Record<ChannelType, string> = {
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  whatsapp: "bg-green-500",
  tiktok: "bg-foreground",
  email: "bg-red-500",
};

export default function AutomationSettings() {
  const router = useRouter();
  const [apiKey] = useState("ak_live_Xk9j2mNp4Q7rT1wZ8vB3cD6fH0gI");
  const [copied, setCopied] = useState(false);
  const [notificationNumber, setNotificationNumber] =
    useState("+234 801 234 5678");
  const [currentPlan, setCurrentPlan] = useState<PlanType>("professional");
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [upgradeMode, setUpgradeMode] = useState<
    "upgrade" | "downgrade" | "both"
  >("both");

  // Loaded from localStorage
  const [connectedChannels, setConnectedChannels] = useState<ChannelType[]>([]);
  const [connectedChannelData, setConnectedChannelData] = useState<any[]>([]);
  const [configuredAutomations, setConfiguredAutomations] = useState<
    ConfiguredBusinessAutomation[]
  >([]);
  const [businessKind, setBusinessKind] = useState<BusinessKindType | null>(
    null,
  );

  // Dialog state
  const [deleteAutomationId, setDeleteAutomationId] = useState<string | null>(
    null,
  );
  const [addAutomationDialogOpen, setAddAutomationDialogOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] =
    useState<ConfiguredBusinessAutomation | null>(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem("selected_plan") as PlanType;
    if (savedPlan) setCurrentPlan(savedPlan);

    const savedChannels = localStorage.getItem("connected_channels");
    if (savedChannels) {
      const channels = JSON.parse(savedChannels);
      setConnectedChannelData(channels);
      setConnectedChannels(channels.map((c: any) => c.type));
    }

    const savedAutomations = localStorage.getItem("configured_automations");
    if (savedAutomations) {
      setConfiguredAutomations(JSON.parse(savedAutomations));
    }

    const savedBusinessKind = localStorage.getItem(
      "business_kind",
    ) as BusinessKindType;
    if (savedBusinessKind) setBusinessKind(savedBusinessKind);
  }, []);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const updateNotificationNumber = () => {
    toast.success("Notification number updated successfully");
  };

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case "starter":
        return Zap;
      case "professional":
        return Crown;
      case "enterprise":
        return Building2;
    }
  };

  const PlanIcon = getPlanIcon(currentPlan);
  const planInfo = planDetails[currentPlan];
  const businessKindInfo = businessKind
    ? businessKinds.find((b) => b.id === businessKind)
    : null;

  // Calculate theoretical max automations based on connected channels and business type
  const theoreticalMax = connectedChannels.reduce((sum, channel) => {
    if (!businessKind) return sum;
    const supported = getAutomationsForBusinessKind(businessKind, channel);
    return sum + supported.length;
  }, 0);

  const planMaxAutomations =
    planInfo.maxAutomations === "unlimited" ? 999 : planInfo.maxAutomations;

  const displayMaxAutomations =
    businessKind && connectedChannels.length > 0
      ? Math.min(planMaxAutomations, theoreticalMax)
      : planMaxAutomations;

  const handleOpenUpgrade = () => {
    setUpgradeMode("upgrade");
    setUpgradeDialogOpen(true);
  };

  const handleOpenDowngrade = () => {
    setUpgradeMode("downgrade");
    setUpgradeDialogOpen(true);
  };

  const handlePlanChange = (newPlan: PlanType) => {
    setCurrentPlan(newPlan);
    localStorage.setItem("selected_plan", newPlan);
  };

  const handleDeleteAutomation = (automationId: string) => {
    const updated = configuredAutomations.filter((a) => a.id !== automationId);
    setConfiguredAutomations(updated);
    localStorage.setItem("configured_automations", JSON.stringify(updated));
    toast.success("Automation removed");
    setDeleteAutomationId(null);
  };

  const handleToggleAutomation = (automationId: string) => {
    const updated = configuredAutomations.map((a) =>
      a.id === automationId
        ? {
            ...a,
            status:
              a.status === "active"
                ? "paused"
                : ("active" as "active" | "paused"),
          }
        : a,
    );
    setConfiguredAutomations(updated);
    localStorage.setItem("configured_automations", JSON.stringify(updated));
    const automation = updated.find((a) => a.id === automationId);
    toast.success(
      `Automation ${automation?.status === "active" ? "activated" : "paused"}`,
    );
  };

  const handleAddAutomation = (automation: {
    category: BusinessCategoryType;
    channel: ChannelType;
    config: any;
  }) => {
    const maxAutomations =
      planInfo.maxAutomations === "unlimited" ? 999 : planInfo.maxAutomations;
    if (configuredAutomations.length >= maxAutomations) {
      toast.error("You have reached your automation limit");
      setUpgradeDialogOpen(true);
      return;
    }

    // Check for duplicates
    const isDuplicate = configuredAutomations.some(
      (a) =>
        a.businessCategory === automation.category &&
        a.channel === automation.channel,
    );
    if (isDuplicate) {
      toast.error("This automation already exists for this channel");
      return;
    }

    const categoryInfo = businessCategories.find(
      (c) => c.id === automation.category,
    );

    const newAutomation: ConfiguredBusinessAutomation = {
      id: Math.random().toString(36).substring(2, 9),
      businessCategory: automation.category,
      categoryName: categoryInfo?.name || "",
      channel: automation.channel,
      automation: automation.config,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...configuredAutomations, newAutomation];
    setConfiguredAutomations(updated);
    localStorage.setItem("configured_automations", JSON.stringify(updated));
    setAddAutomationDialogOpen(false);
    toast.success("Automation added successfully!");
  };

  const handleEditAutomation = (automation: {
    category: BusinessCategoryType;
    channel: ChannelType;
    config: AutomationConfig;
  }) => {
    if (!editingAutomation) return;
    const updated = configuredAutomations.map((a) =>
      a.id === editingAutomation.id
        ? {
            ...a,
            businessCategory: automation.category,
            channel: automation.channel,
            automation: automation.config,
            updatedAt: new Date().toISOString(),
          }
        : a,
    );
    setConfiguredAutomations(updated);
    localStorage.setItem("configured_automations", JSON.stringify(updated));
    setEditingAutomation(null);
    toast.success("Automation updated!");
  };

  // Group automations by channel
  const automationsByChannel = configuredAutomations.reduce(
    (acc, automation) => {
      const channel = automation.channel as ChannelType;
      if (!acc[channel]) acc[channel] = [];
      acc[channel].push(automation);
      return acc;
    },
    {} as Record<ChannelType, ConfiguredBusinessAutomation[]>,
  );

  // Check for orphaned automations (automations for disconnected channels)
  const orphanedAutomations = configuredAutomations.filter(
    (a) => !connectedChannels.includes(a.channel as ChannelType),
  );

  // Available automations to add per channel
  const getAvailableAutomationsForChannel = (channel: ChannelType) => {
    if (!businessKind) return [];
    const allAvailable = getAutomationsForBusinessKind(businessKind, channel);
    const configured =
      automationsByChannel[channel]?.map((a) => a.businessCategory) || [];
    return allAvailable.filter((a) => !configured.includes(a));
  };

  return (
    <ClientLayout>
      <div className="space-y-6 max-w-4xl min-w-0 overflow-hidden">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 md:px-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Settings className="h-5 w-5 md:h-6 md:w-6" />
              Settings
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              Manage your automation preferences and subscription
            </p>
          </div>
        </div>
        {/* Orphaned Automations Warning */}
        {orphanedAutomations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-600 dark:text-orange-400">
                    {orphanedAutomations.length} automation(s) have disconnected
                    channels
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    These automations won't run until you reconnect the channels
                    from your Dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Plan & Usage Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Subscription Card */}
          <Card className="border-border/50">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-base md:text-lg">
                Subscription Plan
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Manage your current billing plan and usage limits
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="p-4 md:p-6 rounded-xl gradient-primary text-primary-foreground relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-10 group-hover:scale-110 transition-transform">
                  <Zap className="h-32 w-32" />
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-none text-[10px] md:text-xs"
                    >
                      Current Plan
                    </Badge>
                    <span className="text-xl md:text-2xl font-bold">
                      Pro Plan
                    </span>
                  </div>

                  <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                    $49
                    <span className="text-base md:text-lg font-normal opacity-80">
                      /month
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleOpenUpgrade}
                      className="w-full bg-white text-primary hover:bg-white/90 text-xs md:text-sm h-9 md:h-10"
                    >
                      Upgrade Plan
                      <ArrowUp className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleOpenDowngrade}
                      variant="outline"
                      className="w-full border-white/30 hover:bg-white/10 text-white text-xs md:text-sm h-9 md:h-10"
                    >
                      View Billing
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Limits & Information */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <span className="text-muted-foreground block text-xs mb-1">
                  Channels:
                </span>
                <span className="font-semibold text-lg">
                  {connectedChannels.length} / {planInfo.maxChannels}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <span className="text-muted-foreground block text-xs mb-1">
                  Automations:
                </span>
                <span className="font-semibold text-lg">
                  {configuredAutomations.length} /{" "}
                  {displayMaxAutomations === 999
                    ? "Unlimited"
                    : displayMaxAutomations}
                </span>
              </div>
            </div>

            <Card className="border-border/50 flex-1">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base">Usage Statistics</CardTitle>
                <CardDescription className="text-xs">
                  Real-time automation consumption
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Monthly Words</span>
                    <span>45,230 / 100,000</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>AI Responses</span>
                    <span>2,140 / 5,000</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent"
                      style={{ width: "42%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border text-xs">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground">
                Plan expires on <strong>February 15, 2025</strong>. Pro-rated
                billing applies.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Active Automations by Channel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Automations</CardTitle>
                <CardDescription>
                  Manage automations for each connected channel
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setAddAutomationDialogOpen(true)}
                disabled={connectedChannels.length === 0}
              >
                <Plus className="h-4 w-4" />
                Add Automation
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {connectedChannels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="mb-4">No channels connected yet.</p>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/portal")}
                  >
                    Connect Channels
                  </Button>
                </div>
              ) : (
                connectedChannels.map((channel) => {
                  const channelData = connectedChannelData.find(
                    (c: any) => c.type === channel,
                  );
                  const automations = automationsByChannel[channel] || [];
                  const availableToAdd =
                    getAvailableAutomationsForChannel(channel);

                  return (
                    <div key={channel} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg ${channelColors[channel]} flex items-center justify-center text-white`}
                          >
                            {channelIcons[channel]}
                          </div>
                          <div>
                            <div className="font-medium capitalize">
                              {channel}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {channelData?.accountName || "Connected"}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {automations.length} automation
                          {automations.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>

                      {automations.length === 0 ? (
                        <div className="p-4 rounded-lg bg-secondary/30 border border-dashed border-border text-center">
                          <p className="text-sm text-muted-foreground mb-2">
                            No automations configured
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAddAutomationDialogOpen(true)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Automation
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {automations.map((automation) => {
                            const category = businessCategories.find(
                              (c) => c.id === automation.businessCategory,
                            );
                            return (
                              <div
                                key={automation.id}
                                className="p-3 rounded-lg bg-secondary/50 border border-border flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`h-9 w-9 rounded-lg bg-gradient-to-br ${category?.color} flex items-center justify-center text-lg`}
                                  >
                                    {category?.icon}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">
                                      {category?.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {automation.status === "active"
                                        ? "Running"
                                        : "Paused"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className={
                                      automation.status === "active"
                                        ? "bg-accent/10 text-accent"
                                        : "bg-muted text-muted-foreground"
                                    }
                                  >
                                    {automation.status === "active"
                                      ? "Active"
                                      : "Paused"}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    title="Edit automation"
                                    onClick={() =>
                                      setEditingAutomation(automation)
                                    }
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() =>
                                      setDeleteAutomationId(automation.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {availableToAdd.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {availableToAdd.length} more automation type
                          {availableToAdd.length !== 1 ? "s" : ""} available
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>API Key</CardTitle>
                  <CardDescription>
                    Use this key to connect external services
                  </CardDescription>
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent/10 text-accent"
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
                  {copied ? (
                    <Check className="h-4 w-4 text-accent" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <Shield className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">
                  Keep your API key secure. Never share it publicly or commit it
                  to version control.
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate Key
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Receive instant alerts for new leads and sales
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">
                  WhatsApp Notification Number
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="whatsapp-number"
                    type="tel"
                    value={notificationNumber}
                    onChange={(e) => setNotificationNumber(e.target.value)}
                    placeholder="+234 XXX XXX XXXX"
                    className="flex-1"
                  />
                  <Button
                    onClick={updateNotificationNumber}
                    className="gradient-accent text-accent-foreground"
                  >
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll receive WhatsApp messages for new leads and confirmed
                  sales
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upgrade/Downgrade Dialog */}
      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentPlan={currentPlan}
        onPlanChange={handlePlanChange}
        mode={upgradeMode}
      />

      {/* Delete Automation Confirmation */}
      <Dialog
        open={!!deleteAutomationId}
        onOpenChange={() => setDeleteAutomationId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Automation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this automation? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteAutomationId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteAutomationId && handleDeleteAutomation(deleteAutomationId)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Automation Dialog */}
      <Dialog
        open={addAutomationDialogOpen}
        onOpenChange={setAddAutomationDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Automation</DialogTitle>
            <DialogDescription>
              Choose what you want to automate and configure it.
            </DialogDescription>
          </DialogHeader>
          <AutomationBuilder
            currentPlan={currentPlan}
            connectedChannels={connectedChannels}
            businessKind={businessKind}
            onComplete={handleAddAutomation}
            onCancel={() => setAddAutomationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Automation Dialog */}
      <Dialog
        open={!!editingAutomation}
        onOpenChange={(open) => !open && setEditingAutomation(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Automation</DialogTitle>
            <DialogDescription>
              Update your automation configuration.
            </DialogDescription>
          </DialogHeader>
          {editingAutomation && (
            <AutomationBuilder
              currentPlan={currentPlan}
              connectedChannels={connectedChannels}
              businessKind={businessKind}
              onComplete={handleEditAutomation}
              onCancel={() => setEditingAutomation(null)}
              initialData={{
                category:
                  editingAutomation.businessCategory as BusinessCategoryType,
                channel: editingAutomation.channel as ChannelType,
                config: editingAutomation.automation as AutomationConfig,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}
