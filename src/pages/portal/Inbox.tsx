"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Filter,
  Mail,
  MessageSquare,
  MoreVertical,
  Phone,
  Search,
  Send,
  Star,
  User,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Channel = "all" | "whatsapp" | "sms" | "email" | "voice";
type ConversationStatus = "bot_handled" | "escalated" | "agent_active" | "closed";

interface Message {
  id: string;
  from: "contact" | "bot" | "agent";
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: string;
  contact: string;
  initials: string;
  channel: Exclude<Channel, "all">;
  status: ConversationStatus;
  lastMessage: string;
  time: string;
  unread: number;
  starred: boolean;
  messages: Message[];
  phoneNumber?: string;
  email?: string;
  subject?: string;
}

const channelIcon: Record<Exclude<Channel, "all">, React.ReactNode> = {
  whatsapp: <MessageSquare className="h-3.5 w-3.5" />,
  sms: <MessageSquare className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  voice: <Phone className="h-3.5 w-3.5" />,
};

const channelColor: Record<Exclude<Channel, "all">, string> = {
  whatsapp: "bg-green-500",
  sms: "bg-blue-500",
  email: "bg-cyan-500",
  voice: "bg-orange-500",
};

const statusConfig: Record<ConversationStatus, { label: string; color: string }> = {
  bot_handled: {
    label: "Bot",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  escalated: {
    label: "Escalated",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  agent_active: {
    label: "Agent",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  closed: {
    label: "Closed",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
};

const mockConversations: Conversation[] = [
  {
    id: "1",
    contact: "Amara Okafor",
    initials: "AO",
    channel: "whatsapp",
    phoneNumber: "+1 555-0100",
    status: "bot_handled",
    lastMessage: "Hi! I saw your post about the skincare bundle. How much is it?",
    time: "2m ago",
    unread: 2,
    starred: true,
    messages: [
      { id: "m1", from: "contact", text: "Hi! I saw your post about the skincare bundle. How much is it?", time: "10:32 AM", read: false },
      { id: "m2", from: "bot", text: "Hello Amara! Thanks for reaching out. Our Glow Bundle is $45 and includes the Vitamin C serum, moisturizer, and SPF 50 sunscreen. Would you like to place an order?", time: "10:32 AM", read: false },
      { id: "m3", from: "contact", text: "Yes please! Do you deliver to California?", time: "10:33 AM", read: false },
    ],
  },
  {
    id: "2",
    contact: "John Smith",
    initials: "JS",
    channel: "sms",
    status: "bot_handled",
    phoneNumber: "+1 555-0123",
    lastMessage: "Your appointment is confirmed for tomorrow at 2pm",
    time: "10m ago",
    unread: 0,
    starred: false,
    messages: [
      { id: "m1", from: "contact", text: "Hi, I'd like to book an appointment for tomorrow", time: "9:45 AM", read: true },
      { id: "m2", from: "bot", text: "Hello! I have availability tomorrow at:\n- 10:00 AM\n- 2:00 PM\n- 4:30 PM\n\nWhich time works best for you?", time: "9:45 AM", read: true },
      { id: "m3", from: "contact", text: "2pm please", time: "9:52 AM", read: true },
      { id: "m4", from: "bot", text: "Your appointment is confirmed for tomorrow at 2pm. You'll receive a reminder 1 hour before.", time: "9:52 AM", read: true },
    ],
  },
  {
    id: "3",
    contact: "Sarah Johnson",
    initials: "SJ",
    channel: "whatsapp",
    status: "escalated",
    phoneNumber: "+1 555-0456",
    lastMessage: "I've been waiting for my refund for 2 weeks now!",
    time: "15m ago",
    unread: 3,
    starred: true,
    messages: [
      { id: "m1", from: "contact", text: "I need to speak to someone about my refund", time: "8:20 AM", read: true },
      { id: "m2", from: "bot", text: "I understand you're inquiring about a refund. Could you please provide your order number?", time: "8:20 AM", read: true },
      { id: "m3", from: "contact", text: "Order #45892. I've been waiting for my refund for 2 weeks now!", time: "8:25 AM", read: false },
      { id: "m4", from: "bot", text: "I apologize for the delay. Let me escalate this to a team member who can help resolve this right away.", time: "8:25 AM", read: false },
    ],
  },
  {
    id: "4",
    contact: "Mike Brown",
    initials: "MB",
    channel: "voice",
    status: "agent_active",
    phoneNumber: "+1 555-0789",
    lastMessage: "Voice call - Billing inquiry",
    time: "30m ago",
    unread: 1,
    starred: false,
    messages: [
      { id: "m1", from: "contact", text: "[Voice call received] - Billing inquiry", time: "9:00 AM", read: true },
      { id: "m2", from: "agent", text: "Connected with customer. Discussing billing discrepancy on account.", time: "9:02 AM", read: false },
    ],
  },
  {
    id: "5",
    contact: "Emily Davis",
    initials: "ED",
    channel: "whatsapp",
    status: "closed",
    phoneNumber: "+1 555-0234",
    lastMessage: "Great, thank you so much!",
    time: "1h ago",
    unread: 0,
    starred: false,
    messages: [
      { id: "m1", from: "contact", text: "Hi, I'd like to place an order for the premium package", time: "7:30 AM", read: true },
      { id: "m2", from: "bot", text: "The Premium Package is $99 and includes all features. Would you like to proceed?", time: "7:30 AM", read: true },
      { id: "m3", from: "contact", text: "Yes, please send me the payment link", time: "7:35 AM", read: true },
      { id: "m4", from: "bot", text: "Here's your secure payment link: pay.example.com/xyz123", time: "7:35 AM", read: true },
      { id: "m5", from: "contact", text: "Great, thank you so much!", time: "7:40 AM", read: true },
    ],
  },
  {
    id: "6",
    contact: "Lisa Anderson",
    initials: "LA",
    channel: "sms",
    phoneNumber: "+1 555-0345",
    status: "bot_handled",
    lastMessage: "Your appointment is confirmed for Friday 3pm",
    time: "3h ago",
    unread: 0,
    starred: false,
    messages: [
      { id: "m1", from: "contact", text: "I need to book a consultation for this week", time: "5:20 AM", read: true },
      { id: "m2", from: "bot", text: "Hi Lisa! We have slots available:\n- Thursday 2pm\n- Friday 3pm\n- Saturday 10am\nWhich works for you?", time: "5:20 AM", read: true },
      { id: "m3", from: "contact", text: "Friday 3pm please", time: "5:25 AM", read: true },
      { id: "m4", from: "bot", text: "Your appointment is confirmed for Friday 3pm. See you then!", time: "5:25 AM", read: true },
    ],
  },
  {
    id: "7",
    contact: "David Chen",
    initials: "DC",
    channel: "email",
    email: "david.chen@example.com",
    subject: "Re: Order #12345 - Shipping Update",
    status: "bot_handled",
    lastMessage: "Thank you for the update. When can I expect delivery?",
    time: "5m ago",
    unread: 1,
    starred: false,
    messages: [
      { id: "m1", from: "agent", text: "Subject: Order #12345 - Shipping Update\n\nHi David,\n\nYour order #12345 has been shipped and is on its way!\n\nTracking Number: 1Z999AA10123456784\nEstimated Delivery: April 15, 2026\n\nBest regards,\nSupport Team", time: "9:00 AM", read: true },
      { id: "m2", from: "contact", text: "Subject: Re: Order #12345 - Shipping Update\n\nHi,\n\nThank you for the update. When can I expect delivery? I need it before the weekend if possible.\n\nThanks,\nDavid", time: "10:15 AM", read: false },
    ],
  },
  {
    id: "8",
    contact: "Emma Wilson",
    initials: "EW",
    channel: "email",
    email: "emma.wilson@company.com",
    subject: "Partnership Inquiry",
    status: "escalated",
    lastMessage: "I'd like to discuss a potential partnership opportunity",
    time: "25m ago",
    unread: 2,
    starred: true,
    messages: [
      { id: "m1", from: "contact", text: "Subject: Partnership Inquiry\n\nHello,\n\nI'm the Marketing Director at TechCorp and I'd like to discuss a potential partnership opportunity with your company.\n\nWe're impressed with your product and believe there could be mutual benefits from collaboration.\n\nCould we schedule a call this week?\n\nBest,\nEmma Wilson\nMarketing Director, TechCorp", time: "8:30 AM", read: true },
      { id: "m2", from: "bot", text: "Thank you for reaching out! I've forwarded your inquiry to our partnerships team. Someone will get back to you within 24 hours.", time: "8:30 AM", read: true },
      { id: "m3", from: "contact", text: "Subject: Re: Partnership Inquiry\n\nThank you for the quick response. Looking forward to hearing from your team.\n\nEmma", time: "8:45 AM", read: false },
    ],
  },
  {
    id: "9",
    contact: "James Miller",
    initials: "JM",
    channel: "email",
    email: "james.m@gmail.com",
    subject: "Refund Request - Invoice #INV-2024-089",
    status: "agent_active",
    lastMessage: "I've attached the receipt as requested",
    time: "1h ago",
    unread: 0,
    starred: false,
    messages: [
      { id: "m1", from: "contact", text: "Subject: Refund Request - Invoice #INV-2024-089\n\nHi Support,\n\nI purchased the Premium Plan on April 5th but it doesn't meet my needs. I'd like to request a full refund per your 30-day money-back guarantee.\n\nInvoice: INV-2024-089\nAmount: $99.00\n\nPlease advise on next steps.\n\nJames Miller", time: "7:00 AM", read: true },
      { id: "m2", from: "bot", text: "I understand you'd like to request a refund. To process this, could you please provide the email address associated with your account and any receipt or confirmation email?", time: "7:00 AM", read: true },
      { id: "m3", from: "contact", text: "Subject: Re: Refund Request - Invoice #INV-2024-089\n\nSure, the account email is james.m@gmail.com. I've attached the receipt as requested.\n\nThanks,\nJames", time: "7:15 AM", read: true },
      { id: "m4", from: "agent", text: "Hi James,\n\nThank you for providing that information. I've verified your purchase and initiated the refund process.\n\nYou should see the $99.00 credited back to your original payment method within 5-7 business days.\n\nIs there anything else I can help you with?\n\nBest regards,\nSupport Team", time: "8:00 AM", read: true },
    ],
  },
  {
    id: "10",
    contact: "Sophie Turner",
    initials: "ST",
    channel: "email",
    email: "sophie.t@outlook.com",
    subject: "Question about your services",
    status: "bot_handled",
    lastMessage: "That's exactly what I was looking for, thank you!",
    time: "2h ago",
    unread: 0,
    starred: false,
    messages: [
      { id: "m1", from: "contact", text: "Subject: Question about your services\n\nHi there,\n\nI'm interested in your Business plan but I have a few questions:\n\n1. Do you offer custom integrations?\n2. What's included in the onboarding?\n3. Is there a discount for annual billing?\n\nThanks!\nSophie", time: "4:00 AM", read: true },
      { id: "m2", from: "bot", text: "Hi Sophie! Great questions! Here's the information:\n\n1. Custom Integrations: Yes! Our Business plan includes API access and we support integrations with popular tools like Zapier, Slack, and HubSpot.\n\n2. Onboarding: You'll get a dedicated onboarding specialist, 3 training sessions, and documentation access.\n\n3. Annual Discount: Yes! Save 20% when you pay annually instead of monthly.\n\nWould you like me to set up a demo call to show you these features?", time: "4:00 AM", read: true },
      { id: "m3", from: "contact", text: "Subject: Re: Question about your services\n\nThat's exactly what I was looking for, thank you! Yes, I'd love a demo. How about Thursday at 2pm?\n\nSophie", time: "5:30 AM", read: true },
      { id: "m4", from: "bot", text: "Perfect! I've scheduled a demo for Thursday at 2pm. You'll receive a calendar invite shortly with the meeting link.\n\nLooking forward to showing you around!\n\nBest,\nAI Assistant", time: "5:30 AM", read: true },
    ],
  },
];

export default function Inbox() {
  const [activeChannel, setActiveChannel] = useState<Channel>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [replyText, setReplyText] = useState("");
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "all">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: { id: Channel; label: string; icon?: React.ReactNode }[] = [
    { id: "all", label: "All" },
    { id: "sms", label: "SMS", icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { id: "voice", label: "Voice", icon: <Phone className="h-3.5 w-3.5" /> },
    { id: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
  ];

  const filtered = conversations.filter((c) => {
    const matchChannel = activeChannel === "all" || c.channel === activeChannel;
    const matchSearch = !searchQuery || c.contact.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchChannel && matchSearch && matchStatus;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);
  const escalatedCount = conversations.filter((c) => c.status === "escalated").length;

  const handleSelectConv = (conv: Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c)));
    setSelectedConv({ ...conv, unread: 0 });
    setShowMobileThread(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConv) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: "agent",
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    const updatedConv = {
      ...selectedConv,
      messages: [...selectedConv.messages, newMsg],
      lastMessage: replyText.trim(),
      time: "Just now",
    };
    setSelectedConv(updatedConv);
    setConversations((prev) => prev.map((c) => (c.id === selectedConv.id ? updatedConv : c)));
    setReplyText("");
    toast.success("Reply sent");
  };

  const handleToggleStar = (convId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, starred: !c.starred } : c)));
    if (selectedConv?.id === convId) {
      setSelectedConv((prev) => (prev ? { ...prev, starred: !prev.starred } : prev));
    }
  };

  const handleArchive = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (selectedConv?.id === convId) {
      setSelectedConv(null);
      setShowMobileThread(false);
    }
    toast.success("Conversation archived");
  };

  const handleTakeOver = (convId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, status: "agent_active" } : c)));
    if (selectedConv?.id === convId) {
      setSelectedConv((prev) => (prev ? { ...prev, status: "agent_active" } : prev));
    }
    toast.success("You've taken over this conversation");
  };

  const handleCloseConversation = (convId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, status: "closed" } : c)));
    if (selectedConv?.id === convId) {
      setSelectedConv((prev) => (prev ? { ...prev, status: "closed" } : prev));
    }
    toast.success("Conversation closed");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages]);

  return (
    <ClientLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)] -m-4 lg:-m-6">
        <div className="flex flex-1 min-h-0">
          {/* Conversation List */}
          <div
            className={cn(
              "w-full lg:w-96 border-r border-border flex flex-col bg-background",
              showMobileThread ? "hidden lg:flex" : "flex"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Inbox</h2>
                  <p className="text-xs text-muted-foreground">
                    {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
                    {escalatedCount > 0 && ` | ${escalatedCount} escalated`}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      {statusFilter === "all" ? "All" : statusConfig[statusFilter].label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter("bot_handled")}>Bot Handled</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("escalated")}>Escalated</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("agent_active")}>Agent Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("closed")}>Closed</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary/50"
                />
              </div>

              {/* Channel Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant={activeChannel === channel.id ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "shrink-0 text-xs h-8",
                      activeChannel === channel.id && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => setActiveChannel(channel.id)}
                  >
                    {channel.icon && <span className="mr-1.5">{channel.icon}</span>}
                    {channel.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              <div className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No conversations found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                ) : (
                  filtered.map((conv) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "p-4 cursor-pointer transition-colors hover:bg-secondary/50",
                        selectedConv?.id === conv.id && "bg-secondary"
                      )}
                      onClick={() => handleSelectConv(conv)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {conv.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center text-white",
                              channelColor[conv.channel]
                            )}
                          >
                            {channelIcon[conv.channel]}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-medium text-sm truncate">{conv.contact}</span>
                              {conv.starred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />}
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">{conv.time}</span>
                          </div>

                          {conv.channel === "email" && conv.subject ? (
                            <>
                              <p className="text-sm font-medium truncate mt-0.5">{conv.subject}</p>
                              <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", statusConfig[conv.status].color)}>
                              {statusConfig[conv.status].label}
                            </Badge>
                            {conv.unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Conversation Thread */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-background min-w-0",
              !showMobileThread ? "hidden lg:flex" : "flex"
            )}
          >
            {selectedConv ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden h-8 w-8"
                      onClick={() => {
                        setShowMobileThread(false);
                        setSelectedConv(null);
                      }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>

                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {selectedConv.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{selectedConv.contact}</span>
                        <Badge variant="secondary" className={cn("text-xs", statusConfig[selectedConv.status].color)}>
                          {statusConfig[selectedConv.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{selectedConv.channel}</span>
                        {selectedConv.phoneNumber && (
                          <>
                            <span>|</span>
                            <span>{selectedConv.phoneNumber}</span>
                          </>
                        )}
                        {selectedConv.email && (
                          <>
                            <span>|</span>
                            <span>{selectedConv.email}</span>
                          </>
                        )}
                      </div>
                      {selectedConv.subject && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                          {selectedConv.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleStar(selectedConv.id)}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          selectedConv.starred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                        )}
                      />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          toast.success(`${selectedConv.contact} saved to contacts`, {
                            description: "Go to Contacts to view and edit",
                            action: {
                              label: "View",
                              onClick: () => window.location.href = "/portal/contacts"
                            }
                          });
                        }}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Save to Contacts
                        </DropdownMenuItem>
                        {selectedConv.status === "bot_handled" && (
                          <DropdownMenuItem onClick={() => handleTakeOver(selectedConv.id)}>
                            <User className="h-4 w-4 mr-2" />
                            Take Over
                          </DropdownMenuItem>
                        )}
                        {selectedConv.status !== "closed" && (
                          <DropdownMenuItem onClick={() => handleCloseConversation(selectedConv.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Close Conversation
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleArchive(selectedConv.id)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    <AnimatePresence mode="popLayout">
                      {selectedConv.messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "flex",
                            msg.from === "contact" ? "justify-start" : "justify-end"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2.5",
                              msg.from === "contact"
                                ? "bg-secondary text-secondary-foreground rounded-bl-md"
                                : msg.from === "bot"
                                  ? "bg-blue-500/10 text-blue-900 dark:text-blue-100 rounded-br-md"
                                  : "bg-primary text-primary-foreground rounded-br-md"
                            )}
                          >
                            {msg.from !== "contact" && (
                              <div className="flex items-center gap-1.5 mb-1">
                                {msg.from === "bot" ? (
                                  <Bot className="h-3 w-3" />
                                ) : (
                                  <User className="h-3 w-3" />
                                )}
                                <span className="text-[10px] font-medium uppercase">
                                  {msg.from === "bot" ? "AI Assistant" : "You"}
                                </span>
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <p
                              className={cn(
                                "text-[10px] mt-1",
                                msg.from === "contact"
                                  ? "text-muted-foreground"
                                  : msg.from === "bot"
                                    ? "text-blue-600/70 dark:text-blue-300/70"
                                    : "text-primary-foreground/70"
                              )}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Reply Input */}
                {selectedConv.status !== "closed" && (
                  <div className="p-4 border-t border-border">
                    <div className="flex items-end gap-3 max-w-3xl mx-auto">
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type your message..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendReply();
                            }
                          }}
                          className="pr-12 bg-secondary/50"
                        />
                      </div>
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the list to view messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
