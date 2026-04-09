"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Calendar,
  CheckCheck,
  ChevronLeft,
  Clock,
  Facebook,
  HeadphonesIcon,
  Inbox,
  Instagram,
  Mail,
  MessageSquare,
  MoreVertical,
  Search,
  Send,
  ShoppingCart,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

type Channel =
  | "all"
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "tiktok"
  | "email";
type ConversationTag = "lead" | "order" | "support" | "booking" | "general";

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
  tag: ConversationTag;
  lastMessage: string;
  time: string;
  unread: number;
  starred: boolean;
  messages: Message[];
}

const channelIcon: Record<Exclude<Channel, "all">, React.ReactNode> = {
  instagram: <Instagram className="h-3.5 w-3.5" />,
  facebook: <Facebook className="h-3.5 w-3.5" />,
  whatsapp: <MessageSquare className="h-3.5 w-3.5" />,
  tiktok: <TikTokIcon />,
  email: <Mail className="h-3.5 w-3.5" />,
};

const channelColor: Record<Exclude<Channel, "all">, string> = {
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  whatsapp: "bg-green-500",
  tiktok: "bg-foreground",
  email: "bg-red-500",
};

const tagConfig: Record<
  ConversationTag,
  { label: string; icon: React.ReactNode; color: string }
> = {
  lead: {
    label: "Lead",
    icon: <UserPlus className="h-3 w-3" />,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  order: {
    label: "Order",
    icon: <ShoppingCart className="h-3 w-3" />,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  support: {
    label: "Support",
    icon: <HeadphonesIcon className="h-3 w-3" />,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  booking: {
    label: "Booking",
    icon: <Calendar className="h-3 w-3" />,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  general: {
    label: "General",
    icon: <MessageSquare className="h-3 w-3" />,
    color: "bg-secondary text-muted-foreground",
  },
};

const mockConversations: Conversation[] = [
  {
    id: "1",
    contact: "Amara Okafor",
    initials: "AO",
    channel: "instagram",
    tag: "lead",
    lastMessage:
      "Hi! I saw your post about the skincare bundle. How much is it?",
    time: "2m ago",
    unread: 2,
    starred: true,
    messages: [
      {
        id: "m1",
        from: "contact",
        text: "Hi! I saw your post about the skincare bundle. How much is it?",
        time: "10:32 AM",
        read: false,
      },
      {
        id: "m2",
        from: "bot",
        text: "Hello Amara! 👋 Thanks for reaching out. Our Glow Bundle is ₦15,000 and includes the Vitamin C serum, moisturizer, and SPF 50 sunscreen. Would you like to place an order?",
        time: "10:32 AM",
        read: false,
      },
      {
        id: "m3",
        from: "contact",
        text: "Yes please! Do you deliver to Abuja?",
        time: "10:33 AM",
        read: false,
      },
    ],
  },
  {
    id: "2",
    contact: "Chidi Nwosu",
    initials: "CN",
    channel: "whatsapp",
    tag: "order",
    lastMessage: "Order #2847 confirmed. Payment received ✅",
    time: "15m ago",
    unread: 0,
    starred: false,
    messages: [
      {
        id: "m1",
        from: "contact",
        text: "I want to order 2 units of the hair growth oil",
        time: "9:45 AM",
        read: true,
      },
      {
        id: "m2",
        from: "bot",
        text: "Great choice! 2x Hair Growth Oil = ₦24,000. Please pay to: GTBank 0123456789 (AutomateFlow Ltd). Send proof of payment to confirm your order.",
        time: "9:45 AM",
        read: true,
      },
      {
        id: "m3",
        from: "contact",
        text: "Done! Just sent the transfer",
        time: "9:52 AM",
        read: true,
      },
      {
        id: "m4",
        from: "bot",
        text: "Order #2847 confirmed. Payment received ✅ Your order will be dispatched within 24 hours. Track via: track.autoflow.ng/2847",
        time: "9:52 AM",
        read: true,
      },
    ],
  },
  {
    id: "3",
    contact: "Fatima Bello",
    initials: "FB",
    channel: "facebook",
    tag: "booking",
    lastMessage: "Your appointment is confirmed for Friday 3pm",
    time: "1h ago",
    unread: 1,
    starred: false,
    messages: [
      {
        id: "m1",
        from: "contact",
        text: "I need to book a lash appointment for this week",
        time: "8:20 AM",
        read: true,
      },
      {
        id: "m2",
        from: "bot",
        text: "Hi Fatima! 💅 We have slots available:\n• Thursday 2pm\n• Friday 3pm\n• Saturday 10am\nWhich works for you?",
        time: "8:20 AM",
        read: true,
      },
      {
        id: "m3",
        from: "contact",
        text: "Friday 3pm please",
        time: "8:25 AM",
        read: true,
      },
      {
        id: "m4",
        from: "bot",
        text: "Your appointment is confirmed for Friday 3pm ✅\nLocation: 14 Adeola Odeku, VI, Lagos\nPlease arrive 5 mins early. See you then! 🎉",
        time: "8:25 AM",
        read: false,
      },
    ],
  },
  {
    id: "4",
    contact: "Emeka Eze",
    initials: "EE",
    channel: "whatsapp",
    tag: "support",
    lastMessage: "My order hasn't arrived after 5 days",
    time: "2h ago",
    unread: 3,
    starred: false,
    messages: [
      {
        id: "m1",
        from: "contact",
        text: "My order hasn't arrived after 5 days. Order #2801",
        time: "7:10 AM",
        read: false,
      },
      {
        id: "m2",
        from: "bot",
        text: "Hi Emeka, I'm sorry to hear that! Let me check your order status. Order #2801 was dispatched on Monday via GIG Logistics. Tracking: GIG-48291. Sometimes there are delays in transit. I'll escalate this to our team right away.",
        time: "7:10 AM",
        read: false,
      },
      {
        id: "m3",
        from: "contact",
        text: "Please do, I need it urgently",
        time: "7:15 AM",
        read: false,
      },
    ],
  },
  {
    id: "5",
    contact: "Ngozi Adeyemi",
    initials: "NA",
    channel: "instagram",
    tag: "lead",
    lastMessage:
      "Can I get more info about your social media management service?",
    time: "3h ago",
    unread: 0,
    starred: true,
    messages: [
      {
        id: "m1",
        from: "contact",
        text: "Can I get more info about your social media management service?",
        time: "6:00 AM",
        read: true,
      },
      {
        id: "m2",
        from: "bot",
        text: "Hi Ngozi! 🌟 Our Social Media Management packages start from ₦80,000/month and include:\n✅ Daily content creation\n✅ Community management\n✅ Monthly analytics report\n✅ Paid ads management\n\nWould you like to schedule a free consultation call?",
        time: "6:00 AM",
        read: true,
      },
    ],
  },
  {
    id: "6",
    contact: "Tunde Fashola",
    initials: "TF",
    channel: "tiktok",
    tag: "lead",
    lastMessage: "Interested in the course bundle you advertised",
    time: "5h ago",
    unread: 1,
    starred: false,
    messages: [
      {
        id: "m1",
        from: "contact",
        text: "Interested in the course bundle you advertised",
        time: "4:30 AM",
        read: false,
      },
      {
        id: "m2",
        from: "bot",
        text: 'Hi Tunde! 🎓 Our Digital Marketing Masterclass Bundle includes 6 courses for just ₦45,000 (normally ₦120,000). Limited spots available! Reply "ENROLL" to get started.',
        time: "4:30 AM",
        read: true,
      },
    ],
  },
  {
    id: "7",
    contact: "Adaeze Obi",
    initials: "AO",
    channel: "email",
    tag: "general",
    lastMessage: "Thank you for the newsletter! Very informative.",
    time: "Yesterday",
    unread: 0,
    starred: false,
    messages: [
      {
        id: "m1",
        from: "contact",
        text: "Thank you for the newsletter! Very informative. I especially liked the section on email automation.",
        time: "Yesterday",
        read: true,
      },
      {
        id: "m2",
        from: "bot",
        text: "Thank you so much, Adaeze! We're glad you found it helpful. Stay tuned for next week's edition on WhatsApp automation strategies. 🚀",
        time: "Yesterday",
        read: true,
      },
    ],
  },
];

export default function UnifiedInbox() {
  const [activeChannel, setActiveChannel] = useState<Channel>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [replyText, setReplyText] = useState("");
  const [showMobileThread, setShowMobileThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels: { id: Channel; label: string; icon?: React.ReactNode }[] = [
    { id: "all", label: "All" },
    {
      id: "instagram",
      label: "Instagram",
      icon: <Instagram className="h-3.5 w-3.5" />,
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: <Facebook className="h-3.5 w-3.5" />,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <MessageSquare className="h-3.5 w-3.5" />,
    },
    { id: "tiktok", label: "TikTok", icon: <TikTokIcon /> },
    { id: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
  ];

  const filtered = conversations.filter((c) => {
    const matchChannel = activeChannel === "all" || c.channel === activeChannel;
    const matchSearch =
      !searchQuery ||
      c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchChannel && matchSearch;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const handleSelectConv = (conv: Conversation) => {
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c)),
    );
    setSelectedConv({ ...conv, unread: 0 });
    setShowMobileThread(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConv) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: "agent",
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: true,
    };
    const updatedConv = {
      ...selectedConv,
      messages: [...selectedConv.messages, newMsg],
      lastMessage: replyText.trim(),
      time: "Just now",
    };
    setSelectedConv(updatedConv);
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedConv.id ? updatedConv : c)),
    );
    setReplyText("");
    toast.success("Reply sent");
  };

  const handleToggleStar = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, starred: !c.starred } : c)),
    );
    if (selectedConv?.id === convId) {
      setSelectedConv((prev) =>
        prev ? { ...prev, starred: !prev.starred } : prev,
      );
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConv?.messages]);

  return (
    <ClientLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)] min-w-0 overflow-hidden">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-2 md:mb-4 shrink-0 px-1 md:px-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Inbox className="h-5 w-5 md:h-6 md:w-6" />
              Unified Inbox
              {totalUnread > 0 && (
                <Badge className="gradient-primary text-primary-foreground text-[10px] md:text-xs px-1.5 md:px-2 py-0 md:py-0.5">
                  {totalUnread} new
                </Badge>
              )}
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              All conversations across every channel
            </p>
          </div>
        </div>

        {/* Channel Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 shrink-0 scrollbar-none snap-x -mx-1 px-1 max-w-full">
          {channels.map((ch) => {
            const chUnread =
              ch.id === "all"
                ? totalUnread
                : conversations
                    .filter((c) => c.channel === ch.id)
                    .reduce((s, c) => s + c.unread, 0);
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all snap-start",
                  activeChannel === ch.id
                    ? "gradient-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {ch.icon}
                {ch.label}
                {chUnread > 0 && (
                  <span
                    className={cn(
                      "text-[10px] md:text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center",
                      activeChannel === ch.id
                        ? "bg-white/20"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    {chUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Panel */}
        <div className="flex flex-1 gap-0 rounded-xl border border-border/50 overflow-hidden min-h-0">
          {/* Conversation List */}
          <div
            className={cn(
              "flex flex-col border-r border-border/50 bg-card",
              "w-full md:w-[340px] md:min-w-[340px]",
              showMobileThread && "hidden md:flex",
            )}
          >
            {/* Search */}
            <div className="p-3 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-secondary/50 border-0 focus-visible:ring-1"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
                  <Inbox className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">No conversations found</p>
                </div>
              ) : (
                filtered.map((conv) => (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleSelectConv(conv)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-border/30 hover:bg-secondary/50 transition-colors",
                      selectedConv?.id === conv.id &&
                        "bg-primary/5 border-l-2 border-l-primary",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar with channel badge */}
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs font-semibold bg-secondary">
                            {conv.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-4 w-4 md:h-5 md:w-5 rounded-full flex items-center justify-center text-white border-2 border-card",
                            channelColor[conv.channel],
                          )}
                        >
                          {/* Scale down icon on mobile */}
                          <div className="scale-75 md:scale-100">
                            {channelIcon[conv.channel]}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span
                            className={cn(
                              "text-sm font-medium truncate",
                              conv.unread > 0 && "font-semibold",
                            )}
                          >
                            {conv.contact}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            {conv.starred && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {conv.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-xs truncate",
                                conv.unread > 0
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground",
                              )}
                            >
                              {conv.lastMessage}
                            </p>
                          </div>
                          {conv.unread > 0 && (
                            <span className="shrink-0 h-5 w-5 rounded-full gradient-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <div className="mt-1">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full",
                              tagConfig[conv.tag].color,
                            )}
                          >
                            {tagConfig[conv.tag].icon}
                            {tagConfig[conv.tag].label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Thread Panel */}
          <div
            className={cn(
              "flex-1 flex flex-col bg-background min-w-0",
              !showMobileThread && "hidden md:flex",
              showMobileThread && "flex",
            )}
          >
            {selectedConv ? (
              <>
                {/* Thread Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card shrink-0">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden h-8 w-8"
                      onClick={() => setShowMobileThread(false)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs font-semibold bg-secondary">
                          {selectedConv.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 md:h-4 md:w-4 rounded-full flex items-center justify-center text-white border-2 border-card",
                          channelColor[selectedConv.channel],
                        )}
                      >
                        <div className="scale-75 md:scale-100">
                          {channelIcon[selectedConv.channel]}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {selectedConv.contact}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full",
                            tagConfig[selectedConv.tag].color,
                          )}
                        >
                          {tagConfig[selectedConv.tag].icon}
                          {tagConfig[selectedConv.tag].label}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          via {selectedConv.channel}
                        </span>
                      </div>
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
                          selectedConv.starred &&
                            "fill-yellow-500 text-yellow-500",
                        )}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border border-border z-50"
                      >
                        <DropdownMenuItem
                          onClick={() => handleToggleStar(selectedConv.id)}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {selectedConv.starred ? "Unstar" : "Star"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleArchive(selectedConv.id)}
                        >
                          <Archive className="h-4 w-4 mr-2" /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleArchive(selectedConv.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {selectedConv.messages.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={cn(
                          "flex",
                          msg.from === "contact"
                            ? "justify-start"
                            : "justify-end",
                        )}
                      >
                        {msg.from === "contact" && (
                          <Avatar className="h-7 w-7 mr-2 shrink-0 mt-1">
                            <AvatarFallback className="text-xs bg-secondary">
                              {selectedConv.initials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                            msg.from === "contact"
                              ? "bg-secondary text-foreground rounded-tl-sm"
                              : msg.from === "bot"
                                ? "bg-primary/10 text-foreground border border-primary/20 rounded-tr-sm"
                                : "gradient-primary text-primary-foreground rounded-tr-sm",
                          )}
                        >
                          {msg.from === "bot" && (
                            <div className="text-xs text-primary font-medium mb-1 flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                              AutoBot
                            </div>
                          )}
                          <p className="whitespace-pre-line leading-relaxed">
                            {msg.text}
                          </p>
                          <div
                            className={cn(
                              "flex items-center gap-1 mt-1 text-xs",
                              msg.from === "contact"
                                ? "text-muted-foreground"
                                : msg.from === "bot"
                                  ? "text-muted-foreground"
                                  : "text-primary-foreground/70 justify-end",
                            )}
                          >
                            <Clock className="h-3 w-3" />
                            {msg.time}
                            {msg.from === "agent" && (
                              <CheckCheck className="h-3 w-3 ml-1" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <div className="p-3 border-t border-border/50 bg-card shrink-0">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <Input
                        placeholder={`Reply to ${selectedConv.contact}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        className="pr-4 bg-secondary/50 border-border/50"
                      />
                    </div>
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="gradient-primary text-primary-foreground shrink-0 gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 pl-1">
                    Press Enter to send · Shift+Enter for new line
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <MessageSquare className="h-10 w-10 opacity-30" />
                </div>
                <p className="font-medium">Select a conversation</p>
                <p className="text-sm mt-1">
                  Choose a conversation from the left to start replying
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
