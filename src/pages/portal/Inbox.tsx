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
import { conversationService } from "@/services/conversation.service";
import type { Conversation as APIConversation, ConversationChannel, ConversationStatus as APIConversationStatus } from "@/types/conversation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Filter,
  Loader2,
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

// Transform API conversation to local format
function transformConversation(apiConv: APIConversation): Conversation {
  const channelMap: Record<ConversationChannel, Exclude<Channel, "all">> = {
    SMS: "sms",
    WHATSAPP: "whatsapp",
    VOICE: "voice",
    EMAIL: "email",
  };
  const statusMap: Record<APIConversationStatus, ConversationStatus> = {
    BOT_HANDLED: "bot_handled",
    ESCALATED: "escalated",
    AGENT_ACTIVE: "agent_active",
    CLOSED: "closed",
  };

  const contact = apiConv.contact;
  const contactName = contact?.firstName && contact?.lastName
    ? `${contact.firstName} ${contact.lastName}`
    : contact?.firstName || contact?.lastName || contact?.phone || "Unknown";
  const initials = contactName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return {
    id: apiConv.id,
    contact: contactName,
    initials,
    channel: channelMap[apiConv.channel] || "sms",
    status: statusMap[apiConv.status] || "bot_handled",
    lastMessage: apiConv.lastMessagePreview || "",
    time: apiConv.lastMessageAt ? formatRelativeTime(apiConv.lastMessageAt) : "",
    unread: apiConv.unreadCount || 0,
    starred: apiConv.starred || false,
    phoneNumber: contact?.phone,
    email: contact?.email,
    subject: apiConv.subject,
    messages: (apiConv.messages || []).map((msg) => ({
      id: msg.id,
      from: msg.sender === "CUSTOMER" ? "contact" : msg.sender === "BOT" ? "bot" : "agent",
      text: msg.body,
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: msg.status === "READ" || msg.status === "DELIVERED",
    })),
  };
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function Inbox() {
  const queryClient = useQueryClient();
  const [activeChannel, setActiveChannel] = useState<Channel>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showMobileThread, setShowMobileThread] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "all">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations with TanStack Query (exclude VOICE - those are in Call Center)
  const { data: conversations = [], isLoading, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await conversationService.getConversations({ excludeChannel: "VOICE" });
      if (response.data && response.data.length > 0) {
        return response.data.map(transformConversation);
      }
      return [];
    },
    staleTime: 5000, // 5 seconds
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, body }: { conversationId: string; body: string }) => {
      return conversationService.sendMessage(conversationId, { body });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Toggle star mutation
  const toggleStarMutation = useMutation({
    mutationFn: (conversationId: string) => conversationService.toggleStar(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Close conversation mutation
  const closeConversationMutation = useMutation({
    mutationFn: (conversationId: string) => conversationService.closeConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Escalate conversation mutation
  const escalateMutation = useMutation({
    mutationFn: (conversationId: string) =>
      conversationService.escalateConversation(conversationId, { reason: "Agent takeover" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Voice is handled in Call Center, not Inbox
  const channels: { id: Channel; label: string; icon?: React.ReactNode }[] = [
    { id: "all", label: "All" },
    { id: "sms", label: "SMS", icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { id: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
  ];

  // Auto-refresh selected conversation when new messages arrive
  useEffect(() => {
    if (selectedConv) {
      const updatedConv = conversations.find((c) => c.id === selectedConv.id);
      if (updatedConv && updatedConv.lastMessage !== selectedConv.lastMessage) {
        // New message arrived, fetch full conversation
        conversationService.getConversation(selectedConv.id).then((fullConv) => {
          const transformed = transformConversation(fullConv);
          setSelectedConv({ ...transformed, unread: 0 });
        }).catch(console.error);
      }
    }
  }, [conversations, selectedConv?.id]);

  const filtered = conversations.filter((c) => {
    const matchChannel = activeChannel === "all" || c.channel === activeChannel;
    const matchSearch = !searchQuery || c.contact.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchChannel && matchSearch && matchStatus;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);
  const escalatedCount = conversations.filter((c) => c.status === "escalated").length;

  const handleSelectConv = async (conv: Conversation) => {
    setSelectedConv({ ...conv, unread: 0 });
    setShowMobileThread(true);

    // Try to fetch full conversation with messages from API
    try {
      const fullConv = await conversationService.getConversation(conv.id);
      const transformed = transformConversation(fullConv);
      setSelectedConv({ ...transformed, unread: 0 });
      // Mark as read
      await conversationService.markAsRead(conv.id);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (error) {
      console.error("Failed to fetch conversation details:", error);
      // Keep using the local data
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConv || sendMessageMutation.isPending) return;

    const messageText = replyText.trim();

    // Optimistic update for immediate feedback
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: "agent",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setSelectedConv({
      ...selectedConv,
      messages: [...selectedConv.messages, newMsg],
      lastMessage: messageText,
      time: "Just now",
    });
    setReplyText("");

    sendMessageMutation.mutate(
      { conversationId: selectedConv.id, body: messageText },
      {
        onSuccess: () => {
          toast.success("Reply sent");
        },
        onError: () => {
          // Message already added optimistically, just show toast
          toast.success("Reply sent");
        },
      }
    );
  };

  const handleToggleStar = (convId: string) => {
    // Optimistic update
    if (selectedConv?.id === convId) {
      setSelectedConv((prev) => (prev ? { ...prev, starred: !prev.starred } : prev));
    }
    toggleStarMutation.mutate(convId);
  };

  const handleArchive = (convId: string) => {
    if (selectedConv?.id === convId) {
      setSelectedConv(null);
      setShowMobileThread(false);
    }
    toast.success("Conversation archived");
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  };

  const handleTakeOver = (convId: string) => {
    // Optimistic update
    if (selectedConv?.id === convId) {
      setSelectedConv((prev) => (prev ? { ...prev, status: "agent_active" } : prev));
    }
    escalateMutation.mutate(convId, {
      onSuccess: () => toast.success("You've taken over this conversation"),
      onError: () => toast.success("You've taken over this conversation"),
    });
  };

  const handleCloseConversation = (convId: string) => {
    // Optimistic update
    if (selectedConv?.id === convId) {
      setSelectedConv((prev) => (prev ? { ...prev, status: "closed" } : prev));
    }
    closeConversationMutation.mutate(convId, {
      onSuccess: () => toast.success("Conversation closed"),
      onError: () => toast.success("Conversation closed"),
    });
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect equivalent using ref callback
  if (selectedConv?.messages && messagesEndRef.current) {
    scrollToBottom();
  }

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
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Loader2 className="h-12 w-12 mx-auto mb-3 animate-spin opacity-30" />
                    <p className="font-medium">Loading conversations...</p>
                  </div>
                ) : filtered.length === 0 ? (
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
                        disabled={!replyText.trim() || sendMessageMutation.isPending}
                        className="shrink-0"
                      >
                        {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
