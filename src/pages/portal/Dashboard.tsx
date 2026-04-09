"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { AutomationManager } from "@/components/portal/AutomationManager";
import { ChannelSelectionDialog } from "@/components/portal/ChannelSelectionDialog";
import { ChannelSettingsDialog } from "@/components/portal/ChannelSettingsDialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  BusinessKindType,
  ChannelType,
  ConfiguredBusinessAutomation,
  PlanType,
  businessCategories,
  businessKinds,
  getAutomationsForBusinessKind,
  mockEmailConnect,
  mockManyChatOAuth,
  mockTikTokOAuth,
  planDetails,
} from "@/lib/businessTypes";
import { generateChartData, mockActivities } from "@/lib/mockData";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  Facebook,
  HeadphonesIcon,
  Instagram,
  Link2,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCw,
  Settings,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Unlink,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const channelIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  tiktok: <TikTokIcon />,
  email: <Mail className="h-4 w-4" />,
};

const channelColors: Record<string, string> = {
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  whatsapp: "bg-green-500",
  tiktok: "bg-foreground",
  email: "bg-red-500",
};

const categoryIcons: Record<string, React.ReactNode> = {
  sales_orders: <ShoppingCart className="h-4 w-4" />,
  appointments_bookings: <Calendar className="h-4 w-4" />,
  enquiries_support: <HeadphonesIcon className="h-4 w-4" />,
  lead_capture: <UserPlus className="h-4 w-4" />,
  email_marketing: <Mail className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  sales_orders: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  appointments_bookings: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  enquiries_support: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  lead_capture: "bg-green-500/10 text-green-600 dark:text-green-400",
  email_marketing: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const chartData = generateChartData();

export default function ClientDashboard() {
  const router = useRouter();

  const [currentPlan, setCurrentPlan] = useState<PlanType>("starter");
  const [planExpiryDate, setPlanExpiryDate] = useState("2026-03-15");
  const [connectedChannels, setConnectedChannels] = useState<ChannelType[]>([]);
  const [connectedChannelData, setConnectedChannelData] = useState<any[]>([]);
  const [configuredAutomations, setConfiguredAutomations] = useState<
    ConfiguredBusinessAutomation[]
  >([]);
  const [businessKind, setBusinessKind] = useState<BusinessKindType | null>(
    null,
  );
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedChannelForSettings, setSelectedChannelForSettings] =
    useState<any>(null);
  const [connectingChannel, setConnectingChannel] =
    useState<ChannelType | null>(null);
  const [manageAutomationsOpen, setManageAutomationsOpen] = useState(false);
  const [channelSelectionDialogOpen, setChannelSelectionDialogOpen] =
    useState(false);

  // Check if plan is expired
  const isExpired = new Date(planExpiryDate) < new Date();
  const daysUntilExpiry = Math.ceil(
    (new Date(planExpiryDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  useEffect(() => {
    // Load data from localStorage
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

  const plan = planDetails[currentPlan];
  const maxChannels = plan.maxChannels;
  const planMaxAutomations =
    plan.maxAutomations === "unlimited" ? 999 : plan.maxAutomations;

  // Calculate theoretical max automations based on connected channels and business type
  const theoreticalMax = connectedChannels.reduce((sum, channel) => {
    if (!businessKind) return sum;
    const supported = getAutomationsForBusinessKind(businessKind, channel);
    return sum + supported.length;
  }, 0);

  // If connected channels are 0, theoretical max is 0 (or should we show potential?)
  // Better to show what is currently possible with CONNECTED channels.

  // The display limit is the minimum of Plan Limit and Theoretical Limit
  // But if businessKind is not selected yet, use plan max?
  const displayMaxAutomations =
    businessKind && connectedChannels.length > 0
      ? Math.min(planMaxAutomations, theoreticalMax)
      : planMaxAutomations;

  const automationsCount = configuredAutomations.filter(
    (a) => a.status === "active",
  ).length;

  const planIcon =
    currentPlan === "starter"
      ? Zap
      : currentPlan === "professional"
        ? Crown
        : Sparkles;
  const PlanIcon = planIcon;

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

  // Group automations by category
  const automationsByCategory = configuredAutomations.reduce(
    (acc, automation) => {
      if (!acc[automation.businessCategory])
        acc[automation.businessCategory] = [];
      acc[automation.businessCategory].push(automation);
      return acc;
    },
    {} as Record<string, ConfiguredBusinessAutomation[]>,
  );

  // Get business-kind specific stats
  const businessKindInfo = businessKind
    ? businessKinds.find((b) => b.id === businessKind)
    : null;
  const enabledCategories = businessKindInfo?.enabledAutomations || [];

  // Mock stats based on business type
  const getStats = () => {
    if (businessKind === "vendor") {
      return [
        {
          label: "Total Leads",
          value: "847",
          change: "+23%",
          icon: UserPlus,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-500/10",
        },
        {
          label: "Orders",
          value: "156",
          change: "+18%",
          icon: ShoppingCart,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-500/10",
        },
        {
          label: "Revenue",
          value: "₦2.4M",
          change: "+15%",
          icon: TrendingUp,
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          label: "Active Customers",
          value: "312",
          change: "+8%",
          icon: Users,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-500/10",
        },
      ];
    } else if (businessKind === "appointment_based") {
      return [
        {
          label: "Appointments",
          value: "89",
          change: "+12%",
          icon: Calendar,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Completed",
          value: "72",
          change: "+10%",
          icon: CheckCircle2,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-500/10",
        },
        {
          label: "Support Tickets",
          value: "23",
          change: "-5%",
          icon: HeadphonesIcon,
          color: "text-purple-600 dark:text-purple-400",
          bgColor: "bg-purple-500/10",
        },
        {
          label: "Clients",
          value: "156",
          change: "+14%",
          icon: Users,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-500/10",
        },
      ];
    } else if (businessKind === "service_provider") {
      return [
        {
          label: "Total Leads",
          value: "523",
          change: "+28%",
          icon: UserPlus,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-500/10",
        },
        {
          label: "Support Tickets",
          value: "45",
          change: "+8%",
          icon: HeadphonesIcon,
          color: "text-purple-600 dark:text-purple-400",
          bgColor: "bg-purple-500/10",
        },
        {
          label: "Response Rate",
          value: "98%",
          change: "+2%",
          icon: MessageSquare,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Active Clients",
          value: "89",
          change: "+12%",
          icon: Users,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-500/10",
        },
      ];
    } else {
      // Lead-driven
      return [
        {
          label: "Total Leads",
          value: "1,247",
          change: "+35%",
          icon: UserPlus,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-500/10",
        },
        {
          label: "Qualified",
          value: "423",
          change: "+22%",
          icon: CheckCircle2,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-500/10",
        },
        {
          label: "Conversion Rate",
          value: "34%",
          change: "+5%",
          icon: TrendingUp,
          color: "text-primary",
          bgColor: "bg-primary/10",
        },
        {
          label: "Follow-ups Sent",
          value: "892",
          change: "+18%",
          icon: MessageSquare,
          color: "text-purple-600 dark:text-purple-400",
          bgColor: "bg-purple-500/10",
        },
      ];
    }
  };

  const stats = getStats();

  const handlePlanChange = (newPlan: PlanType) => {
    setCurrentPlan(newPlan);
    localStorage.setItem("selected_plan", newPlan);

    // After plan is confirmed, chain to Channel Selection
    if (localStorage.getItem("plan_confirmed") === "true") {
      setTimeout(() => {
        setChannelSelectionDialogOpen(true);
        toast.success("Plan confirmed! Now connect your first channel.");
      }, 600);
    }
  };

  const handleDisconnectChannel = (channel: ChannelType) => {
    const updatedChannels = connectedChannelData.filter(
      (c: any) => c.type !== channel,
    );
    setConnectedChannelData(updatedChannels);
    setConnectedChannels(updatedChannels.map((c: any) => c.type));
    localStorage.setItem("connected_channels", JSON.stringify(updatedChannels));

    // Remove automations for this channel
    const updatedAutomations = configuredAutomations.filter(
      (a) => a.channel !== channel,
    );
    setConfiguredAutomations(updatedAutomations);
    localStorage.setItem(
      "configured_automations",
      JSON.stringify(updatedAutomations),
    );

    toast.success(`${channel} disconnected successfully`);
    setSettingsDialogOpen(false);
  };

  const handleAutomationsUpdate = (
    newAutomations: ConfiguredBusinessAutomation[],
  ) => {
    setConfiguredAutomations(newAutomations);
    // Note: AutomationManager already updates localStorage
  };

  const handleConnectChannel = async (channelType: ChannelType) => {
    if (connectedChannels.length >= maxChannels) {
      toast.error(
        `Your ${plan.name} plan allows only ${maxChannels} channel(s). Upgrade to add more.`,
      );
      setUpgradeDialogOpen(true);
      return;
    }

    setConnectingChannel(channelType);

    try {
      const response =
        channelType === "tiktok"
          ? await mockTikTokOAuth()
          : channelType === "email"
            ? await mockEmailConnect()
            : await mockManyChatOAuth(channelType);

      if (response.success) {
        const newChannel = {
          type: channelType,
          connected: true,
          workspaceId: response.workspaceId,
          accessToken: response.accessToken,
          accountName: response.accountName,
          connectedAt: new Date().toISOString(),
        };

        const updatedChannels = [...connectedChannelData, newChannel];
        setConnectedChannelData(updatedChannels);
        setConnectedChannels(updatedChannels.map((c: any) => c.type));
        localStorage.setItem(
          "connected_channels",
          JSON.stringify(updatedChannels),
        );

        // If this was from the onboarding dialog, we just show a success toast
        // but let the user decide when to proceed to automations
        if (channelSelectionDialogOpen) {
          toast.success(
            `${channelType} connected! You can connect more or proceed below.`,
          );
        } else {
          // Check if there are orphaned automations for this channel that need reactivating
          const existingAutomations = configuredAutomations.filter(
            (a) => a.channel === channelType,
          );
          if (existingAutomations.length > 0) {
            toast.success(
              `${channelType} reconnected! ${existingAutomations.length} automation(s) restored.`,
            );
          } else {
            toast.success(
              `${channelType} connected! Go to Automation Settings to configure automations.`,
            );
          }
        }
      }
    } catch {
      toast.error(`Failed to connect ${channelType}`);
    } finally {
      setConnectingChannel(null);
    }
  };

  const openChannelSettings = (channel: ChannelType) => {
    const channelData = connectedChannelData.find(
      (c: any) => c.type === channel,
    );
    const channelAutomations = automationsByChannel[channel] || [];
    setSelectedChannelForSettings({
      type: channel,
      accountName: channelData?.accountName || "Connected",
      leads: Math.floor(Math.random() * 300) + 100,
      automationsActive: channelAutomations.length,
    });
    setSettingsDialogOpen(true);
  };

  // Available channels to connect
  const allChannels: ChannelType[] = [
    "instagram",
    "facebook",
    "whatsapp",
    "tiktok",
    "email",
  ];
  const availableToConnect = allChannels.filter(
    (c) => !connectedChannels.includes(c),
  );

  // Setup Roadmap Logic
  const hasPlan = localStorage.getItem("plan_confirmed") === "true";
  const hasChannels = connectedChannels.length > 0;
  const hasAutomations = configuredAutomations.length > 0;

  const roadmapSteps = [
    {
      id: "plan",
      title: "Pick a Plan & Pay",
      description: "Choose the best plan for your business needs",
      icon: CreditCard,
      status: hasPlan ? "complete" : "current",
      action: () => setUpgradeDialogOpen(true),
    },
    {
      id: "channels",
      title: "Connect Channels",
      description: "Link your social media or email accounts",
      icon: Link2,
      status: hasChannels ? "complete" : hasPlan ? "current" : "upcoming",
      action: () => {
        // Scroll to channels section or open a specific connect menu
        const el = document.getElementById("channels-section");
        el?.scrollIntoView({ behavior: "smooth" });
        toast.info("Select a channel to connect below");
      },
    },
    {
      id: "automations",
      title: "Enable Automations",
      description: "Set up your first AI automation flow",
      icon: Zap,
      status: hasAutomations
        ? "complete"
        : hasChannels
          ? "current"
          : "upcoming",
      action: () => setManageAutomationsOpen(true),
    },
  ];

  const showRoadmap = !hasPlan || !hasChannels || !hasAutomations;

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Setup Roadmap Banner */}
        {showRoadmap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="glass border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/5 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">
                    Getting Started Roadmap
                  </CardTitle>
                </div>
                <CardDescription>
                  Complete these steps to fully automate your business
                  operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  {/* Connection Lines (Desktop) */}
                  <div className="hidden md:block absolute top-[22px] left-[15%] right-[15%] h-[2px] bg-border z-0" />

                  {roadmapSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className="relative z-10 flex flex-col items-center text-center group"
                      >
                        <button
                          onClick={step.action}
                          disabled={step.status === "upcoming"}
                          className={`h-11 w-11 rounded-full flex items-center justify-center transition-all border-2 mb-4 ${
                            step.status === "complete"
                              ? "bg-accent border-accent text-white"
                              : step.status === "current"
                                ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] scale-110"
                                : "bg-muted border-border text-muted-foreground opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {step.status === "complete" ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </button>
                        <h4
                          className={`font-bold text-sm mb-1 ${
                            step.status === "upcoming"
                              ? "text-muted-foreground opacity-50"
                              : "text-foreground"
                          }`}
                        >
                          {index + 1}. {step.title}
                        </h4>
                        <p
                          className={`text-xs px-4 ${
                            step.status === "upcoming"
                              ? "text-muted-foreground opacity-50"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {/* Plan Overview Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <PlanIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">
                        {plan.name} Plan
                      </h3>
                      <Badge
                        variant="secondary"
                        className={
                          !hasPlan
                            ? "bg-yellow-500/10 text-yellow-600"
                            : isExpired
                              ? "bg-destructive/10 text-destructive"
                              : "bg-primary/10 text-primary"
                        }
                      >
                        {!hasPlan
                          ? "Selection Pending"
                          : isExpired
                            ? "Expired"
                            : "Active"}
                      </Badge>
                      {businessKindInfo && (
                        <Badge variant="outline" className="gap-1">
                          {businessKindInfo.icon} {businessKindInfo.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {connectedChannels.length} of {maxChannels} channels •{" "}
                      {automationsCount} of{" "}
                      {displayMaxAutomations === 999
                        ? "∞"
                        : displayMaxAutomations}{" "}
                      automations
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {isExpired ? (
                        <span className="text-destructive">
                          Plan expired on{" "}
                          {new Date(planExpiryDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span>
                          Expires on{" "}
                          {new Date(planExpiryDate).toLocaleDateString()} (
                          {daysUntilExpiry} days left)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {connectedChannels.map((channel) => (
                      <div
                        key={channel}
                        className={`h-9 w-9 rounded-full ${channelColors[channel]} flex items-center justify-center text-primary-foreground border-2 border-card`}
                        title={channel}
                      >
                        {channelIcons[channel]}
                      </div>
                    ))}
                  </div>
                  {isExpired ? (
                    <Button
                      size="sm"
                      className="gap-1 gradient-primary text-primary-foreground"
                      onClick={() => setUpgradeDialogOpen(true)}
                    >
                      <CreditCard className="h-3 w-3" /> Renew Plan
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => setUpgradeDialogOpen(true)}
                    >
                      Upgrade <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Channels Used</span>
                    <span className="font-medium">
                      {connectedChannels.length}/{maxChannels}
                    </span>
                  </div>
                  <Progress
                    value={(connectedChannels.length / maxChannels) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Automations Active
                    </span>
                    <span className="font-medium">
                      {automationsCount}/
                      {displayMaxAutomations === 999
                        ? "∞"
                        : displayMaxAutomations}
                    </span>
                  </div>
                  <Progress
                    value={
                      displayMaxAutomations === 999
                        ? 10
                        : (automationsCount / displayMaxAutomations) * 100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass rounded-2xl shadow-xl overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        stat.change.startsWith("+")
                          ? "bg-accent/10 text-accent"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass rounded-2xl shadow-xl overflow-hidden group">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  {businessKind === "vendor"
                    ? "Leads vs Orders"
                    : businessKind === "appointment_based"
                      ? "Bookings vs Completed"
                      : "Leads vs Conversions"}{" "}
                  over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorLeads"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorSales"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--accent))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--accent))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorLeads)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="hsl(var(--accent))"
                        fillOpacity={1}
                        fill="url(#colorSales)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Automations by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Active Automations</CardTitle>
                <CardDescription>By business type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(automationsByCategory).map(
                  ([category, automations]) => {
                    const categoryInfo = businessCategories.find(
                      (c) => c.id === category,
                    );
                    return (
                      <div
                        key={category}
                        className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${categoryColors[category]}`}
                          >
                            {categoryIcons[category]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {categoryInfo?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {automations.length} automation
                              {automations.length > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-accent/10 text-accent"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      </div>
                    );
                  },
                )}

                {configuredAutomations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No automations configured yet.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setManageAutomationsOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Automation
                    </Button>
                  </div>
                )}

                {configuredAutomations.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setManageAutomationsOpen(true)}
                  >
                    Manage Automations
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Channel Performance */}
        <motion.div
          id="channels-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Connected Channels</CardTitle>
                <CardDescription>
                  Manage your connected platforms
                </CardDescription>
              </div>
              {availableToConnect.length > 0 &&
                connectedChannels.length < maxChannels && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Connect Channel
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-card border border-border z-50"
                    >
                      {availableToConnect.map((channel) => (
                        <DropdownMenuItem
                          key={channel}
                          onClick={() => handleConnectChannel(channel)}
                          disabled={connectingChannel === channel}
                          className="cursor-pointer"
                        >
                          <div
                            className={`h-6 w-6 rounded ${channelColors[channel]} flex items-center justify-center text-white mr-2`}
                          >
                            {channelIcons[channel]}
                          </div>
                          <span className="capitalize">{channel}</span>
                          {connectingChannel === channel && (
                            <RefreshCw className="h-3 w-3 ml-auto animate-spin" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </CardHeader>
            <CardContent>
              {connectedChannels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Link2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="mb-4">No channels connected yet.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {allChannels.slice(0, maxChannels).map((channel) => (
                      <Button
                        key={channel}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleConnectChannel(channel)}
                        disabled={connectingChannel === channel}
                      >
                        <div
                          className={`h-5 w-5 rounded ${channelColors[channel]} flex items-center justify-center text-white`}
                        >
                          {channelIcons[channel]}
                        </div>
                        <span className="capitalize">{channel}</span>
                        {connectingChannel === channel && (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {connectedChannels.map((channel) => {
                    const channelAutomations =
                      automationsByChannel[channel] || [];
                    const channelData = connectedChannelData.find(
                      (c: any) => c.type === channel,
                    );
                    const mockLeads = Math.floor(Math.random() * 300) + 100;

                    return (
                      <Card key={channel} className="glass overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`h-11 w-11 rounded-xl ${channelColors[channel]} flex items-center justify-center text-white shrink-0`}
                              >
                                {channelIcons[channel]}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold capitalize">
                                  {channel}
                                </div>
                                <div
                                  className="text-xs text-muted-foreground truncate"
                                  title={channelData?.accountName}
                                >
                                  {channelData?.accountName || "Connected"}
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-card border border-border z-50"
                              >
                                <DropdownMenuItem
                                  className="text-sm cursor-pointer"
                                  onClick={() => openChannelSettings(channel)}
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  Channel Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-sm text-destructive cursor-pointer"
                                  onClick={() =>
                                    handleDisconnectChannel(channel)
                                  }
                                >
                                  <Unlink className="h-4 w-4 mr-2" />
                                  Disconnect Channel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Leads
                              </span>
                              <span className="font-medium">{mockLeads}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Responses
                              </span>
                              <span className="font-medium">
                                {Math.floor(mockLeads * 0.95)}
                              </span>
                            </div>
                          </div>

                          {channelAutomations.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-border">
                              <div className="text-xs text-muted-foreground mb-2">
                                Active:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {channelAutomations.map((auto, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {
                                      businessCategories.find(
                                        (c) => c.id === auto.businessCategory,
                                      )?.icon
                                    }
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest automation triggers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivities.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          activity.type === "lead"
                            ? "bg-green-500/10 text-green-600"
                            : activity.type === "sale"
                              ? "bg-orange-500/10 text-orange-600"
                              : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {activity.type === "lead" ? (
                          <UserPlus className="h-5 w-5" />
                        ) : activity.type === "sale" ? (
                          <ShoppingCart className="h-5 w-5" />
                        ) : (
                          <MessageSquare className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm capitalize">
                          {activity.platform}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.message}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentPlan={currentPlan}
        onPlanChange={handlePlanChange}
      />

      {selectedChannelForSettings && (
        <ChannelSettingsDialog
          open={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
          channel={selectedChannelForSettings}
          onDisconnect={() =>
            handleDisconnectChannel(selectedChannelForSettings.type)
          }
        />
      )}

      {/* Manage Automations Sheet */}
      <Sheet
        open={manageAutomationsOpen}
        onOpenChange={setManageAutomationsOpen}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Manage Automations</SheetTitle>
          </SheetHeader>
          <AutomationManager
            maxAutomations={
              plan.maxAutomations === "unlimited" ? 999 : plan.maxAutomations
            }
            connectedChannels={connectedChannels}
            currentPlan={currentPlan}
            onUpgradeNeeded={() => {
              setManageAutomationsOpen(false);
              setUpgradeDialogOpen(true);
            }}
            onUpdate={handleAutomationsUpdate}
          />
        </SheetContent>
      </Sheet>

      <ChannelSelectionDialog
        open={channelSelectionDialogOpen}
        onOpenChange={setChannelSelectionDialogOpen}
        onConnect={handleConnectChannel}
        onProceed={() => {
          setChannelSelectionDialogOpen(false);
          setTimeout(() => {
            setManageAutomationsOpen(true);
            toast.success("Ready to automate! Set up your first workflow.");
          }, 600);
        }}
        connectedChannels={connectedChannels}
        maxChannels={maxChannels}
      />
    </ClientLayout>
  );
}
