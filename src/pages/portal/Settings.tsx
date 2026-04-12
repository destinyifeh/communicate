"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Bot,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Globe,
  Headphones,
  Image,
  Inbox,
  Key,
  Lock,
  Mail,
  MessageSquare,
  Mic,
  Moon,
  Palette,
  Phone,
  Plus,
  RefreshCw,
  Settings2,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  Upload,
  User,
  Users,
  Volume2,
  Workflow,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Settings navigation items
const settingsNav = [
  { id: "branding", label: "Branding", icon: Palette, description: "Logo, colors, business name" },
  { id: "channels", label: "Channels", icon: MessageSquare, description: "SMS, WhatsApp, Voice, Email" },
  { id: "booking", label: "Booking Rules", icon: Calendar, description: "Hours, availability, slots" },
  { id: "call-center", label: "Call Center", icon: Headphones, description: "IVR, routing, voicemail" },
  { id: "inbox", label: "Inbox Automation", icon: Inbox, description: "Auto-reply, escalation" },
  { id: "team", label: "Team & Agents", icon: Users, description: "Manage team members" },
  { id: "workflows", label: "Workflows", icon: Workflow, description: "Advanced automation", pro: true },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alert preferences" },
  { id: "billing", label: "Billing", icon: CreditCard, description: "Plan & payments" },
  { id: "security", label: "Security", icon: Shield, description: "Password, 2FA" },
];

// Brand colors presets
const brandColorPresets = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Green", value: "#22C55E" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink", value: "#EC4899" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Red", value: "#EF4444" },
  { name: "Indigo", value: "#6366F1" },
];

// Days of week
const daysOfWeek = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

export default function Settings() {
  const { user, updateBranding } = useAuth();
  const [activeSection, setActiveSection] = useState("branding");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Branding state
  const [branding, setBranding] = useState({
    businessName: user?.businessName || "",
    logoUrl: user?.businessLogo || "",
    brandColor: user?.brandColor || "#3B82F6",
    tagline: "Your trusted partner",
  });

  // Channels state
  const [channels, setChannels] = useState({
    sms: { enabled: true, phoneNumber: "+1 555-0123" },
    whatsapp: { enabled: true, phoneNumber: "+1 555-0123" },
    voice: { enabled: true, phoneNumber: "+1 555-0123" },
    email: { enabled: true, address: user?.email || "" },
  });

  // Booking rules state
  const [bookingRules, setBookingRules] = useState({
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    workingHours: { start: "09:00", end: "17:00" },
    slotDuration: 30,
    bufferTime: 15,
    autoConfirm: false,
    maxAdvanceBooking: 30,
    minNotice: 24,
    allowCancellation: true,
    cancellationNotice: 24,
  });

  // Call center state
  const [callCenter, setCallCenter] = useState({
    ivrEnabled: true,
    ivrMessage: "Thank you for calling. Press 1 for Sales, Press 2 for Support, Press 0 for operator.",
    greetingMessage: "Welcome! How can we help you today?",
    holdMusic: "default",
    voicemailEnabled: true,
    voicemailGreeting: "We're sorry we missed your call. Please leave a message.",
    afterHoursEnabled: true,
    afterHoursMessage: "Our office is currently closed. Please call back during business hours.",
    routingRules: [
      { id: "1", name: "Sales", keypress: "1", destination: "sales-team", type: "team" },
      { id: "2", name: "Support", keypress: "2", destination: "support-team", type: "team" },
      { id: "3", name: "Billing", keypress: "3", destination: "billing@example.com", type: "email" },
    ],
  });

  // Inbox automation state
  const [inboxAutomation, setInboxAutomation] = useState({
    autoReplyEnabled: true,
    autoReplyMessage: "Hi! Thanks for reaching out. We typically respond within 1 hour during business hours.",
    awayMessageEnabled: true,
    awayMessage: "We're currently away. We'll get back to you as soon as possible.",
    escalationEnabled: true,
    escalationDelay: 5, // minutes
    escalationEmail: user?.email || "",
    tagRules: [
      { id: "1", keyword: "urgent", tag: "High Priority", action: "escalate" },
      { id: "2", keyword: "price", tag: "Sales Lead", action: "assign" },
      { id: "3", keyword: "refund", tag: "Support", action: "assign" },
    ],
  });

  // Team state
  const [team, setTeam] = useState({
    members: [
      { id: "1", name: "Alex Johnson", email: "alex@example.com", role: "Admin", status: "active", avatar: "" },
      { id: "2", name: "Sarah Smith", email: "sarah@example.com", role: "Agent", status: "active", avatar: "" },
      { id: "3", name: "Mike Brown", email: "mike@example.com", role: "Agent", status: "away", avatar: "" },
    ],
    teams: [
      { id: "sales-team", name: "Sales Team", members: ["1", "2"] },
      { id: "support-team", name: "Support Team", members: ["2", "3"] },
    ],
  });

  // Workflow automation state (Pro tier)
  const [workflows, setWorkflows] = useState({
    rules: [
      {
        id: "1",
        name: "Price Inquiry Response",
        trigger: { type: "message_contains", value: "price" },
        action: { type: "send_template", template: "pricing_info" },
        enabled: true,
      },
      {
        id: "2",
        name: "After Hours Call Routing",
        trigger: { type: "call_time", value: "after_hours" },
        action: { type: "route_to", destination: "voicemail" },
        enabled: true,
      },
      {
        id: "3",
        name: "VIP Customer Priority",
        trigger: { type: "contact_tag", value: "VIP" },
        action: { type: "assign_priority", priority: "high" },
        enabled: false,
      },
    ],
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newMessages: true,
    appointments: true,
    missedCalls: true,
    marketing: false,
  });

  // API Key
  const [apiKey] = useState("ak_live_Xk9j2mNp4Q7rT1wZ8vB3cD6fH0gI");
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (section: string) => {
    // If saving branding, update the user context
    if (section === "Branding") {
      updateBranding({
        businessName: branding.businessName,
        businessLogo: branding.logoUrl,
        brandColor: branding.brandColor,
      });
    }
    toast.success(`${section} settings saved successfully`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "branding":
        return <BrandingSection branding={branding} setBranding={setBranding} onSave={() => handleSave("Branding")} />;
      case "channels":
        return <ChannelsSection channels={channels} setChannels={setChannels} onSave={() => handleSave("Channels")} />;
      case "booking":
        return <BookingSection bookingRules={bookingRules} setBookingRules={setBookingRules} onSave={() => handleSave("Booking")} />;
      case "call-center":
        return <CallCenterSection callCenter={callCenter} setCallCenter={setCallCenter} onSave={() => handleSave("Call Center")} />;
      case "inbox":
        return <InboxSection inboxAutomation={inboxAutomation} setInboxAutomation={setInboxAutomation} onSave={() => handleSave("Inbox")} />;
      case "team":
        return <TeamSection team={team} setTeam={setTeam} onSave={() => handleSave("Team")} />;
      case "workflows":
        return <WorkflowsSection workflows={workflows} setWorkflows={setWorkflows} onSave={() => handleSave("Workflows")} />;
      case "notifications":
        return <NotificationsSection notifications={notifications} setNotifications={setNotifications} onSave={() => handleSave("Notifications")} />;
      case "billing":
        return <BillingSection />;
      case "security":
        return <SecuritySection apiKey={apiKey} showApiKey={showApiKey} setShowApiKey={setShowApiKey} copied={copied} copyApiKey={copyApiKey} />;
      default:
        return null;
    }
  };

  return (
    <ClientLayout>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                {settingsNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 border-l-2",
                      activeSection === item.id
                        ? "bg-muted/50 border-l-primary text-foreground"
                        : "border-l-transparent text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{item.label}</span>
                        {item.pro && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600">
                            PRO
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform", activeSection === item.id && "rotate-90")} />
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Select value={activeSection} onValueChange={setActiveSection}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {(() => {
                  const item = settingsNav.find((i) => i.id === activeSection);
                  return item ? (
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                  ) : null;
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {settingsNav.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <span className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.pro && <Badge variant="secondary" className="text-[10px] ml-2">PRO</Badge>}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>
    </ClientLayout>
  );
}

// ============================================
// BRANDING SECTION
// ============================================
function BrandingSection({ branding, setBranding, onSave }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Branding</h2>
        <p className="text-muted-foreground">Customize your business identity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={branding.businessName}
              onChange={(e) => setBranding({ ...branding, businessName: e.target.value })}
              placeholder="Your Business Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={branding.tagline}
              onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
              placeholder="Your business tagline"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Business Logo</Label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <Image className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                  {branding.logoUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setBranding({ ...branding, logoUrl: "" })}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error("File size must be less than 2MB");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setBranding({ ...branding, logoUrl: reader.result as string });
                        toast.success("Logo uploaded successfully");
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB. Recommended: 512x512px</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Brand Color</Label>
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-lg border shadow-sm cursor-pointer"
                style={{ backgroundColor: branding.brandColor }}
              />
              <Input
                type="text"
                value={branding.brandColor}
                onChange={(e) => setBranding({ ...branding, brandColor: e.target.value })}
                className="w-32 font-mono"
                placeholder="#3B82F6"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {brandColorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBranding({ ...branding, brandColor: color.value })}
                  className={cn(
                    "h-8 w-8 rounded-lg border-2 transition-all hover:scale-110",
                    branding.brandColor === color.value ? "border-foreground" : "border-transparent"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <Check className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ============================================
// CHANNELS SECTION
// ============================================
function ChannelsSection({ channels, setChannels, onSave }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Channels</h2>
        <p className="text-muted-foreground">Configure your communication channels</p>
      </div>

      <div className="grid gap-4">
        {/* SMS */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">SMS</h3>
                  <p className="text-sm text-muted-foreground">Twilio SMS messaging</p>
                </div>
              </div>
              <Switch
                checked={channels.sms.enabled}
                onCheckedChange={(checked) => setChannels({ ...channels, sms: { ...channels.sms, enabled: checked } })}
              />
            </div>
            {channels.sms.enabled && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={channels.sms.phoneNumber} onChange={(e) => setChannels({ ...channels, sms: { ...channels.sms, phoneNumber: e.target.value } })} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">Twilio WhatsApp Business</p>
                </div>
              </div>
              <Switch
                checked={channels.whatsapp.enabled}
                onCheckedChange={(checked) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, enabled: checked } })}
              />
            </div>
            {channels.whatsapp.enabled && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input value={channels.whatsapp.phoneNumber} onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, phoneNumber: e.target.value } })} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Voice</h3>
                  <p className="text-sm text-muted-foreground">Twilio Voice calls</p>
                </div>
              </div>
              <Switch
                checked={channels.voice.enabled}
                onCheckedChange={(checked) => setChannels({ ...channels, voice: { ...channels.voice, enabled: checked } })}
              />
            </div>
            {channels.voice.enabled && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="space-y-2">
                  <Label>Voice Number</Label>
                  <Input value={channels.voice.phoneNumber} onChange={(e) => setChannels({ ...channels, voice: { ...channels.voice, phoneNumber: e.target.value } })} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">SendGrid email</p>
                </div>
              </div>
              <Switch
                checked={channels.email.enabled}
                onCheckedChange={(checked) => setChannels({ ...channels, email: { ...channels.email, enabled: checked } })}
              />
            </div>
            {channels.email.enabled && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={channels.email.address} onChange={(e) => setChannels({ ...channels, email: { ...channels.email, address: e.target.value } })} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <Check className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ============================================
// BOOKING SECTION
// ============================================
function BookingSection({ bookingRules, setBookingRules, onSave }: any) {
  const toggleDay = (day: string) => {
    const days = bookingRules.workingDays.includes(day)
      ? bookingRules.workingDays.filter((d: string) => d !== day)
      : [...bookingRules.workingDays, day];
    setBookingRules({ ...bookingRules, workingDays: days });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Booking Rules</h2>
        <p className="text-muted-foreground">Configure your appointment booking system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Working Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Working Days</Label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                    bookingRules.workingDays.includes(day.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={bookingRules.workingHours.start}
                onChange={(e) => setBookingRules({ ...bookingRules, workingHours: { ...bookingRules.workingHours, start: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={bookingRules.workingHours.end}
                onChange={(e) => setBookingRules({ ...bookingRules, workingHours: { ...bookingRules.workingHours, end: e.target.value } })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Appointment Settings
          </CardTitle>
          <CardDescription>
            Configure how customers can book appointments with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Slot Duration</Label>
              <Select value={bookingRules.slotDuration.toString()} onValueChange={(v) => setBookingRules({ ...bookingRules, slotDuration: parseInt(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How long each appointment slot lasts. Choose based on your typical service duration.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Buffer Between Appointments</Label>
              <Select value={bookingRules.bufferTime.toString()} onValueChange={(v) => setBookingRules({ ...bookingRules, bufferTime: parseInt(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No buffer</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Break time between appointments for preparation or cleanup.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Max Advance Booking</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={bookingRules.maxAdvanceBooking}
                  onChange={(e) => setBookingRules({ ...bookingRules, maxAdvanceBooking: parseInt(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground">
                How far in the future customers can book. E.g., 30 days means they can book up to 1 month ahead.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Minimum Notice Required</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={bookingRules.minNotice}
                  onChange={(e) => setBookingRules({ ...bookingRules, minNotice: parseInt(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum time before an appointment that a customer can book. E.g., 24 hours prevents same-day bookings.
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <p className="font-medium">Auto-confirm Bookings</p>
                <p className="text-sm text-muted-foreground">
                  When enabled, appointments are confirmed instantly. When disabled, you'll need to manually approve each booking.
                </p>
              </div>
              <Switch
                checked={bookingRules.autoConfirm}
                onCheckedChange={(checked) => setBookingRules({ ...bookingRules, autoConfirm: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 pr-4">
                <p className="font-medium">Allow Cancellations</p>
                <p className="text-sm text-muted-foreground">
                  Let customers cancel their own appointments. You can require advance notice below.
                </p>
              </div>
              <Switch
                checked={bookingRules.allowCancellation}
                onCheckedChange={(checked) => setBookingRules({ ...bookingRules, allowCancellation: checked })}
              />
            </div>

            {bookingRules.allowCancellation && (
              <div className="space-y-2 ml-4 pl-4 border-l-2 border-primary/30">
                <Label>Cancellation Notice Required</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={bookingRules.cancellationNotice}
                    onChange={(e) => setBookingRules({ ...bookingRules, cancellationNotice: parseInt(e.target.value) })}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">hours</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customers must cancel at least this many hours before the appointment. E.g., 24 hours prevents last-minute cancellations.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <Check className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ============================================
// CALL CENTER SECTION
// ============================================
function CallCenterSection({ callCenter, setCallCenter, onSave }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Call Center Settings</h2>
        <p className="text-muted-foreground">Configure your voice call handling</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            IVR (Interactive Voice Response)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable IVR Menu</p>
              <p className="text-sm text-muted-foreground">Play menu options when customers call</p>
            </div>
            <Switch
              checked={callCenter.ivrEnabled}
              onCheckedChange={(checked) => setCallCenter({ ...callCenter, ivrEnabled: checked })}
            />
          </div>

          {callCenter.ivrEnabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>IVR Message</Label>
                <Textarea
                  value={callCenter.ivrMessage}
                  onChange={(e) => setCallCenter({ ...callCenter, ivrMessage: e.target.value })}
                  placeholder="Thank you for calling. Press 1 for Sales..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">This message will be read to callers</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Routing Rules</Label>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Rule
                  </Button>
                </div>
                <div className="space-y-2">
                  {callCenter.routingRules.map((rule: any) => (
                    <div key={rule.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {rule.keypress}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rule.name}</p>
                        <p className="text-xs text-muted-foreground">Route to: {rule.destination}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Greetings & Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Business Greeting</Label>
            <Textarea
              value={callCenter.greetingMessage}
              onChange={(e) => setCallCenter({ ...callCenter, greetingMessage: e.target.value })}
              placeholder="Welcome to our business..."
              rows={2}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Voicemail</p>
              <p className="text-sm text-muted-foreground">Allow callers to leave messages</p>
            </div>
            <Switch
              checked={callCenter.voicemailEnabled}
              onCheckedChange={(checked) => setCallCenter({ ...callCenter, voicemailEnabled: checked })}
            />
          </div>

          {callCenter.voicemailEnabled && (
            <div className="space-y-2">
              <Label>Voicemail Greeting</Label>
              <Textarea
                value={callCenter.voicemailGreeting}
                onChange={(e) => setCallCenter({ ...callCenter, voicemailGreeting: e.target.value })}
                placeholder="We're sorry we missed your call..."
                rows={2}
              />
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">After Hours Message</p>
              <p className="text-sm text-muted-foreground">Play when office is closed</p>
            </div>
            <Switch
              checked={callCenter.afterHoursEnabled}
              onCheckedChange={(checked) => setCallCenter({ ...callCenter, afterHoursEnabled: checked })}
            />
          </div>

          {callCenter.afterHoursEnabled && (
            <div className="space-y-2">
              <Label>After Hours Message</Label>
              <Textarea
                value={callCenter.afterHoursMessage}
                onChange={(e) => setCallCenter({ ...callCenter, afterHoursMessage: e.target.value })}
                placeholder="Our office is currently closed..."
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <Check className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ============================================
// INBOX AUTOMATION SECTION
// ============================================
function InboxSection({ inboxAutomation, setInboxAutomation, onSave }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inbox Automation</h2>
        <p className="text-muted-foreground">Configure auto-replies and message handling</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Auto-Reply
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Auto-Reply</p>
              <p className="text-sm text-muted-foreground">Automatically respond to incoming messages</p>
            </div>
            <Switch
              checked={inboxAutomation.autoReplyEnabled}
              onCheckedChange={(checked) => setInboxAutomation({ ...inboxAutomation, autoReplyEnabled: checked })}
            />
          </div>

          {inboxAutomation.autoReplyEnabled && (
            <div className="space-y-2">
              <Label>Auto-Reply Message</Label>
              <Textarea
                value={inboxAutomation.autoReplyMessage}
                onChange={(e) => setInboxAutomation({ ...inboxAutomation, autoReplyMessage: e.target.value })}
                placeholder="Thanks for reaching out..."
                rows={3}
              />
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Away Message</p>
              <p className="text-sm text-muted-foreground">Send when you're not available</p>
            </div>
            <Switch
              checked={inboxAutomation.awayMessageEnabled}
              onCheckedChange={(checked) => setInboxAutomation({ ...inboxAutomation, awayMessageEnabled: checked })}
            />
          </div>

          {inboxAutomation.awayMessageEnabled && (
            <div className="space-y-2">
              <Label>Away Message</Label>
              <Textarea
                value={inboxAutomation.awayMessage}
                onChange={(e) => setInboxAutomation({ ...inboxAutomation, awayMessage: e.target.value })}
                placeholder="We're currently away..."
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Escalation Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Escalation</p>
              <p className="text-sm text-muted-foreground">Escalate to human when bot can't help</p>
            </div>
            <Switch
              checked={inboxAutomation.escalationEnabled}
              onCheckedChange={(checked) => setInboxAutomation({ ...inboxAutomation, escalationEnabled: checked })}
            />
          </div>

          {inboxAutomation.escalationEnabled && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Escalation Delay (minutes)</Label>
                <Input
                  type="number"
                  value={inboxAutomation.escalationDelay}
                  onChange={(e) => setInboxAutomation({ ...inboxAutomation, escalationDelay: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Escalation Email</Label>
                <Input
                  type="email"
                  value={inboxAutomation.escalationEmail}
                  onChange={(e) => setInboxAutomation({ ...inboxAutomation, escalationEmail: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Auto-Tagging Rules
          </CardTitle>
          <CardDescription>Automatically tag and route messages based on keywords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Rule
            </Button>
          </div>
          <div className="space-y-2">
            {inboxAutomation.tagRules.map((rule: any) => (
              <div key={rule.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
                <div className="flex-1">
                  <p className="text-sm">
                    If message contains "<span className="font-semibold text-primary">{rule.keyword}</span>"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Apply tag: <Badge variant="secondary" className="ml-1">{rule.tag}</Badge>
                    {rule.action === "escalate" && <span className="ml-2 text-orange-500">+ Escalate</span>}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <Check className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ============================================
// TEAM SECTION
// ============================================
function TeamSection({ team, setTeam, onSave }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Team & Agents</h2>
        <p className="text-muted-foreground">Manage your team members and their roles</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {team.members.map((member: any) => (
              <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{member.name}</p>
                    <Badge variant="secondary" className={cn(
                      "text-xs",
                      member.status === "active" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                    )}>
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <Badge variant="outline">{member.role}</Badge>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Teams</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {team.teams.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.members.length} members</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// WORKFLOWS SECTION (PRO)
// ============================================
function WorkflowsSection({ workflows, setWorkflows, onSave }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Workflow Automation</h2>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">PRO</Badge>
          </div>
          <p className="text-muted-foreground">Create advanced automation rules</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <div className="grid gap-4">
        {workflows.rules.map((rule: any) => (
          <Card key={rule.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    rule.enabled ? "bg-green-500/10" : "bg-muted"
                  )}>
                    <Workflow className={cn("h-5 w-5", rule.enabled ? "text-green-500" : "text-muted-foreground")} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{rule.name}</h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">When:</span>{" "}
                        {rule.trigger.type === "message_contains" && `Message contains "${rule.trigger.value}"`}
                        {rule.trigger.type === "call_time" && `Call time is ${rule.trigger.value}`}
                        {rule.trigger.type === "contact_tag" && `Contact has tag "${rule.trigger.value}"`}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Then:</span>{" "}
                        {rule.action.type === "send_template" && `Send template "${rule.action.template}"`}
                        {rule.action.type === "route_to" && `Route to ${rule.action.destination}`}
                        {rule.action.type === "assign_priority" && `Set priority to ${rule.action.priority}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) => {
                      setWorkflows({
                        ...workflows,
                        rules: workflows.rules.map((r: any) =>
                          r.id === rule.id ? { ...r, enabled: checked } : r
                        ),
                      });
                    }}
                  />
                  <Button variant="ghost" size="icon">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">Create a New Workflow</h3>
            <p className="text-sm text-muted-foreground">Build custom automation for your business</p>
            <Button variant="outline" className="mt-2">Get Started</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// NOTIFICATIONS SECTION
// ============================================
function NotificationsSection({ notifications, setNotifications, onSave }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">Manage your notification preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "email", icon: Mail, color: "blue", label: "Email Notifications", desc: "Receive notifications via email" },
            { key: "push", icon: Smartphone, color: "purple", label: "Push Notifications", desc: "Receive push notifications on your device" },
            { key: "sms", icon: Phone, color: "green", label: "SMS Notifications", desc: "Receive important alerts via SMS" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg bg-${item.color}-500/10 flex items-center justify-center`}>
                  <item.icon className={`h-4 w-4 text-${item.color}-500`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "newMessages", label: "New Messages", desc: "When you receive a new conversation message" },
            { key: "appointments", label: "Appointments", desc: "Reminders for upcoming appointments" },
            { key: "missedCalls", label: "Missed Calls", desc: "When you miss an incoming call" },
            { key: "marketing", label: "Marketing Updates", desc: "News, tips, and feature announcements" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <Check className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ============================================
// BILLING SECTION
// ============================================
function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing & Subscription</h2>
        <p className="text-muted-foreground">Manage your plan and payment information</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Pro Plan</h3>
                  <Badge className="bg-primary">Current</Badge>
                </div>
                <p className="text-sm text-muted-foreground">$49/month | Renews April 15, 2026</p>
              </div>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Monthly Messages</p>
            <p className="text-3xl font-bold mt-1">45,230</p>
            <p className="text-xs text-muted-foreground">of 100,000</p>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-3">
              <div className="h-full bg-primary" style={{ width: "45%" }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">AI Responses</p>
            <p className="text-3xl font-bold mt-1">2,140</p>
            <p className="text-xs text-muted-foreground">of 5,000</p>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-3">
              <div className="h-full bg-blue-500" style={{ width: "42%" }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-16 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
              { date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
              { date: "Feb 1, 2026", amount: "$49.00", status: "Paid" },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{invoice.amount}</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// SECURITY SECTION
// ============================================
function SecuritySection({ apiKey, showApiKey, setShowApiKey, copied, copyApiKey }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Security</h2>
        <p className="text-muted-foreground">Manage your account security</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Not Enabled</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button>Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key
          </CardTitle>
          <CardDescription>Use this key to integrate with external services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="font-mono text-sm pr-24 bg-muted/30"
              />
              <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500/10 text-green-600">
                Live
              </Badge>
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
              {showApiKey ? <Lock className="h-4 w-4" /> : <Key className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={copyApiKey}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              <Shield className="h-4 w-4 inline mr-2" />
              Keep your API key secure. Never share it publicly.
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate Key
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-500/20">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
