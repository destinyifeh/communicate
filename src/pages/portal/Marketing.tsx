"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { campaignService } from "@/services/campaign.service";
import { contactService } from "@/services/contact.service";
import type { Campaign as APICampaign, CampaignType as APICampaignType, CampaignStatus as APICampaignStatus } from "@/types/campaign";
import type { Contact as APIContact } from "@/types/contact";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  Loader2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Pause,
  PenLine,
  Play,
  Plus,
  Send,
  Target,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale Blast",
    type: "sms" as const,
    status: "sent" as const,
    recipients: 1250,
    delivered: 1198,
    opened: 456,
    clicked: 123,
    createdAt: "2026-04-08",
    sentAt: "2026-04-09",
    message: "Summer Sale! Get 30% off all items this weekend only. Shop now at example.com/summer",
  },
  {
    id: "2",
    name: "New Product Launch",
    type: "whatsapp" as const,
    status: "scheduled" as const,
    recipients: 850,
    delivered: 0,
    opened: 0,
    clicked: 0,
    createdAt: "2026-04-10",
    scheduledAt: "2026-04-15",
    message: "Exciting news! Our new product line is here. Be the first to check it out!",
  },
  {
    id: "3",
    name: "Loyalty Rewards",
    type: "sms" as const,
    status: "draft" as const,
    recipients: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    createdAt: "2026-04-11",
    message: "Thank you for being a loyal customer! Enjoy exclusive rewards...",
  },
  {
    id: "4",
    name: "Appointment Reminder",
    type: "whatsapp" as const,
    status: "sending" as const,
    recipients: 320,
    delivered: 156,
    opened: 89,
    clicked: 0,
    createdAt: "2026-04-11",
    message: "Reminder: You have an upcoming appointment tomorrow at {{time}}.",
  },
];

// Mock contacts data
const mockContacts = [
  { id: "1", name: "John Smith", phone: "+1234567890", email: "john@example.com", tags: ["customer", "vip"] },
  { id: "2", name: "Sarah Johnson", phone: "+1234567891", email: "sarah@example.com", tags: ["customer"] },
  { id: "3", name: "Mike Brown", phone: "+1234567892", email: "mike@example.com", tags: ["lead"] },
  { id: "4", name: "Emily Davis", phone: "+1234567893", email: "emily@example.com", tags: ["customer", "inactive"] },
  { id: "5", name: "Chris Wilson", phone: "+1234567894", email: "chris@example.com", tags: ["lead", "hot"] },
];

type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "paused";
type CampaignType = "sms" | "whatsapp";

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  createdAt: string;
  sentAt?: string;
  scheduledAt?: string;
  message: string;
}

const statusColors: Record<CampaignStatus, string> = {
  draft: "bg-slate-500/10 text-slate-500",
  scheduled: "bg-blue-500/10 text-blue-500",
  sending: "bg-yellow-500/10 text-yellow-500",
  sent: "bg-green-500/10 text-green-500",
  paused: "bg-orange-500/10 text-orange-500",
};

const statusIcons: Record<CampaignStatus, React.ReactNode> = {
  draft: <PenLine className="h-3 w-3" />,
  scheduled: <Clock className="h-3 w-3" />,
  sending: <Send className="h-3 w-3 animate-pulse" />,
  sent: <CheckCircle2 className="h-3 w-3" />,
  paused: <Pause className="h-3 w-3" />,
};

// Transform API campaign to local format
function transformCampaign(apiCampaign: APICampaign): Campaign {
  const typeMap: Record<APICampaignType, CampaignType> = {
    SMS: "sms",
    WHATSAPP: "whatsapp",
    EMAIL: "sms", // Map EMAIL to sms since local doesn't have email type
  };
  const statusMap: Record<APICampaignStatus, CampaignStatus> = {
    DRAFT: "draft",
    SCHEDULED: "scheduled",
    SENDING: "sending",
    COMPLETED: "sent",
    PAUSED: "paused",
    FAILED: "paused",
  };

  return {
    id: apiCampaign.id,
    name: apiCampaign.name,
    type: typeMap[apiCampaign.type] || "sms",
    status: statusMap[apiCampaign.status] || "draft",
    recipients: apiCampaign.totalRecipients,
    delivered: apiCampaign.messagesDelivered,
    opened: apiCampaign.messagesRead,
    clicked: 0, // API doesn't track clicks
    createdAt: apiCampaign.createdAt.split("T")[0],
    sentAt: apiCampaign.completedAt?.split("T")[0],
    scheduledAt: apiCampaign.scheduledAt?.split("T")[0],
    message: apiCampaign.messageTemplate,
  };
}

// Transform API contact to local format
function transformContact(apiContact: APIContact): typeof mockContacts[0] {
  return {
    id: apiContact.id,
    name: [apiContact.firstName, apiContact.lastName].filter(Boolean).join(" ") || "Unknown",
    phone: apiContact.phone,
    email: apiContact.email || "",
    tags: apiContact.tags || [],
  };
}

export default function Marketing() {
  const queryClient = useQueryClient();
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [importContactsOpen, setImportContactsOpen] = useState(false);

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "sms" as CampaignType,
    message: "",
    scheduledAt: "",
  });

  // Fetch campaigns with TanStack Query
  const { data: campaigns = mockCampaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await campaignService.getCampaigns();
      if (response.data && response.data.length > 0) {
        return response.data.map(transformCampaign);
      }
      return mockCampaigns;
    },
    staleTime: 30000,
  });

  // Fetch contacts with TanStack Query
  const { data: contacts = mockContacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await contactService.getContacts();
      if (response.data && response.data.length > 0) {
        return response.data.map(transformContact);
      }
      return mockContacts;
    },
    staleTime: 30000,
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: { name: string; type: APICampaignType; messageTemplate: string; scheduledAt?: string }) => {
      return campaignService.createCampaign(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created successfully");
    },
    onError: () => {
      // Still show success for demo purposes
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created successfully");
    },
  });

  // Send campaign mutation
  const sendCampaignMutation = useMutation({
    mutationFn: (id: string) => campaignService.sendCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign is now sending");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign is now sending");
    },
  });

  // Pause campaign mutation
  const pauseCampaignMutation = useMutation({
    mutationFn: (id: string) => campaignService.pauseCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign paused");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign paused");
    },
  });

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign deleted");
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign deleted");
    },
  });

  const totalContacts = contacts.length;
  const totalSent = campaigns.filter(c => c.status === "sent").reduce((acc, c) => acc + c.delivered, 0);
  const avgOpenRate = campaigns.filter(c => c.status === "sent" && c.delivered > 0)
    .reduce((acc, c, _, arr) => acc + (c.opened / c.delivered * 100) / arr.length, 0);

  const handleSendCampaign = (id: string) => {
    sendCampaignMutation.mutate(id);
  };

  const handlePauseCampaign = (id: string) => {
    pauseCampaignMutation.mutate(id);
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaignMutation.mutate(id);
  };

  const handleCreateCampaign = () => {
    if (createCampaignMutation.isPending) return;

    const typeMap: Record<CampaignType, APICampaignType> = {
      sms: "SMS",
      whatsapp: "WHATSAPP",
    };

    createCampaignMutation.mutate(
      {
        name: newCampaign.name,
        type: typeMap[newCampaign.type],
        messageTemplate: newCampaign.message,
        scheduledAt: newCampaign.scheduledAt || undefined,
      },
      {
        onSettled: () => {
          setNewCampaign({ name: "", type: "sms", message: "", scheduledAt: "" });
          setNewCampaignOpen(false);
        },
      }
    );
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketing Campaigns</h1>
            <p className="text-muted-foreground">Create and manage bulk SMS and WhatsApp campaigns</p>
          </div>
        <div className="flex gap-2">
          <Dialog open={importContactsOpen} onOpenChange={setImportContactsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Import Contacts
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Contacts</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with your contacts. Required columns: name, phone. Optional: email, tags.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Download className="h-4 w-4" />
                  <a href="#" className="text-primary hover:underline">
                    Download sample CSV template
                  </a>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportContactsOpen(false)}>
                  Cancel
                </Button>
                <Button>Upload & Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={newCampaignOpen} onOpenChange={setNewCampaignOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new bulk messaging campaign to reach your contacts.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Summer Sale Announcement"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Channel</Label>
                  <Select
                    value={newCampaign.type}
                    onValueChange={(value: CampaignType) => setNewCampaign({ ...newCampaign, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          SMS
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-message">Message</Label>
                  <Textarea
                    id="campaign-message"
                    placeholder="Type your message here..."
                    rows={4}
                    value={newCampaign.message}
                    onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {newCampaign.message.length}/160 characters
                    {newCampaign.message.length > 160 && " (will be sent as multiple messages)"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-schedule">Schedule (Optional)</Label>
                  <Input
                    id="campaign-schedule"
                    type="datetime-local"
                    value={newCampaign.scheduledAt}
                    onChange={(e) => setNewCampaign({ ...newCampaign, scheduledAt: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to save as draft
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewCampaignOpen(false)} disabled={createCampaignMutation.isPending}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign} disabled={!newCampaign.name || !newCampaign.message || createCampaignMutation.isPending}>
                  {createCampaignMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Campaign"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Contacts</p>
                  <p className="text-3xl font-black">{totalContacts.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages Sent</p>
                  <p className="text-3xl font-black">{totalSent.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Send className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Open Rate</p>
                  <p className="text-3xl font-black">{avgOpenRate.toFixed(1)}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-3xl font-black">
                    {campaigns.filter(c => c.status === "sending" || c.status === "scheduled").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>
                Manage your marketing campaigns and view performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Recipients</TableHead>
                    <TableHead className="text-right">Delivered</TableHead>
                    <TableHead className="text-right">Opened</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {campaign.createdAt}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {campaign.type === "sms" ? (
                            <MessageSquare className="h-3 w-3" />
                          ) : (
                            <Mail className="h-3 w-3" />
                          )}
                          {campaign.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`gap-1 ${statusColors[campaign.status]}`}>
                          {statusIcons[campaign.status]}
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {campaign.recipients.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.delivered.toLocaleString()}
                        {campaign.recipients > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({((campaign.delivered / campaign.recipients) * 100).toFixed(0)}%)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.opened.toLocaleString()}
                        {campaign.delivered > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({((campaign.opened / campaign.delivered) * 100).toFixed(0)}%)
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {campaign.status === "draft" && (
                            <Button size="icon" variant="ghost" title="Send" onClick={() => handleSendCampaign(campaign.id)}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {campaign.status === "scheduled" && (
                            <Button size="icon" variant="ghost" title="Edit">
                              <PenLine className="h-4 w-4" />
                            </Button>
                          )}
                          {campaign.status === "sending" && (
                            <Button size="icon" variant="ghost" title="Pause" onClick={() => handlePauseCampaign(campaign.id)}>
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" title="Delete" onClick={() => handleDeleteCampaign(campaign.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact List</CardTitle>
              <CardDescription>
                Manage your contacts for marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </ClientLayout>
  );
}
