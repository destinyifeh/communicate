import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Clock, 
  AlertTriangle,
  FileText,
  MessageSquare,
  Phone,
  Calendar,
  ShoppingCart,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { BusinessKindType } from '@/lib/businessTypes';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'bot' | 'agent';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file';
    name: string;
    url: string;
  };
}

interface MessageTemplate {
  id: string;
  name: string;
  category: 'appointment' | 'order' | 'followup' | 'general';
  content: string;
  icon: React.ReactNode;
}

interface ConversationThreadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    id: string;
    name: string;
    phone: string;
    platform: string;
    lastMessageTime?: Date;
    status?: string;
  } | null;
  businessKind?: BusinessKindType | null;
}

// Message templates based on business type
const getTemplatesForBusiness = (businessKind: BusinessKindType | null): MessageTemplate[] => {
  const commonTemplates: MessageTemplate[] = [
    {
      id: 'followup_1',
      name: 'General Follow-up',
      category: 'followup',
      content: 'Hi {{name}}, just following up on our previous conversation. Is there anything else I can help you with?',
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: 'thank_you',
      name: 'Thank You',
      category: 'general',
      content: 'Thank you for choosing us, {{name}}! We appreciate your business. Feel free to reach out if you need anything.',
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ];

  if (businessKind === 'vendor') {
    return [
      {
        id: 'order_update',
        name: 'Order Update',
        category: 'order',
        content: 'Hi {{name}}, your order #{{order_id}} has been {{status}}. Track your delivery here: {{tracking_link}}',
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        id: 'order_confirm',
        name: 'Order Confirmation',
        category: 'order',
        content: 'Hi {{name}}, your order has been confirmed! Expected delivery: {{delivery_date}}. Order total: {{amount}}',
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        id: 'payment_reminder',
        name: 'Payment Reminder',
        category: 'order',
        content: 'Hi {{name}}, this is a friendly reminder that payment of {{amount}} for your order is pending. Please complete payment to process your order.',
        icon: <Bell className="h-4 w-4" />,
      },
      ...commonTemplates,
    ];
  }

  if (businessKind === 'appointment_based') {
    return [
      {
        id: 'apt_reminder_24h',
        name: 'Appointment Reminder (24h)',
        category: 'appointment',
        content: 'Hi {{name}}, this is a reminder for your appointment tomorrow at {{time}}. Reply YES to confirm or NO to reschedule.',
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        id: 'apt_reminder_1h',
        name: 'Appointment Reminder (1h)',
        category: 'appointment',
        content: 'Hi {{name}}, your appointment is in 1 hour at {{time}}. We look forward to seeing you!',
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        id: 'apt_confirmation',
        name: 'Appointment Confirmation',
        category: 'appointment',
        content: 'Hi {{name}}, your {{service}} appointment is confirmed for {{date}} at {{time}}. Address: {{address}}',
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        id: 'apt_reschedule',
        name: 'Reschedule Request',
        category: 'appointment',
        content: 'Hi {{name}}, we need to reschedule your appointment. Please reply with your preferred date and time.',
        icon: <Calendar className="h-4 w-4" />,
      },
      ...commonTemplates,
    ];
  }

  if (businessKind === 'service_provider') {
    return [
      {
        id: 'quote_sent',
        name: 'Quote Sent',
        category: 'followup',
        content: 'Hi {{name}}, we have sent you a quote for {{service}}. Please review and let us know if you have any questions.',
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: 'service_complete',
        name: 'Service Complete',
        category: 'general',
        content: 'Hi {{name}}, your {{service}} has been completed. We hope you are satisfied! Please leave us a review.',
        icon: <MessageSquare className="h-4 w-4" />,
      },
      ...commonTemplates,
    ];
  }

  // Lead-driven
  return [
    {
      id: 'lead_followup',
      name: 'Lead Follow-up',
      category: 'followup',
      content: 'Hi {{name}}, thank you for your interest in {{product}}. Would you like to schedule a call to discuss further?',
      icon: <Phone className="h-4 w-4" />,
    },
    {
      id: 'info_request',
      name: 'Information Request',
      category: 'general',
      content: 'Hi {{name}}, we have some exciting updates about {{product}}. Would you like to learn more?',
      icon: <MessageSquare className="h-4 w-4" />,
    },
    ...commonTemplates,
  ];
};

// Mock conversation data
const generateMockMessages = (): Message[] => [
  {
    id: '1',
    text: 'Hi, I am interested in your services',
    sender: 'customer',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'read',
  },
  {
    id: '2',
    text: 'Hello! Thank you for reaching out. How can I help you today?',
    sender: 'bot',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000),
    status: 'read',
  },
  {
    id: '3',
    text: 'I would like to know more about your pricing',
    sender: 'customer',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    status: 'read',
  },
  {
    id: '4',
    text: 'Sure! Our pricing starts from ₦25,000/month. Would you like me to send you detailed information?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'delivered',
  },
];

export function ConversationThread({
  open,
  onOpenChange,
  contact,
  businessKind,
}: ConversationThreadProps) {
  const [messages, setMessages] = useState<Message[]>(generateMockMessages());
  const [newMessage, setNewMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'templates'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates = getTemplatesForBusiness(businessKind || null);

  // Calculate if within 24-hour window
  const lastCustomerMessage = [...messages]
    .reverse()
    .find(m => m.sender === 'customer');
  
  const isWithin24Hours = lastCustomerMessage
    ? (Date.now() - lastCustomerMessage.timestamp.getTime()) < 24 * 60 * 60 * 1000
    : false;

  const hoursRemaining = lastCustomerMessage
    ? Math.max(0, 24 - Math.floor((Date.now() - lastCustomerMessage.timestamp.getTime()) / (60 * 60 * 1000)))
    : 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (!isWithin24Hours) {
      toast.error('24-hour window expired. Please use a message template.');
      setActiveTab('templates');
      return;
    }

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'agent',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const handleSendTemplate = (template: MessageTemplate) => {
    const personalizedContent = template.content
      .replace('{{name}}', contact?.name || 'Customer')
      .replace('{{phone}}', contact?.phone || '');

    const message: Message = {
      id: Date.now().toString(),
      text: personalizedContent,
      sender: 'agent',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, message]);
    setActiveTab('chat');
    toast.success('Template message sent');
  };

  const handleFileUpload = () => {
    if (!isWithin24Hours) {
      toast.error('24-hour window expired. Cannot send attachments.');
      return;
    }
    fileInputRef.current?.click();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!contact) return null;

  const platformEmoji = {
    whatsapp: '💬',
    instagram: '📸',
    facebook: '👤',
    tiktok: '🎵',
  }[contact.platform] || '💬';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                {platformEmoji}
              </div>
              <div>
                <DialogTitle className="text-base">{contact.name}</DialogTitle>
                <DialogDescription className="text-xs flex items-center gap-2">
                  <Phone className="h-3 w-3" /> {contact.phone}
                </DialogDescription>
              </div>
            </div>
            
            {/* 24-hour window indicator */}
            <div className="flex items-center gap-2">
              {isWithin24Hours ? (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 gap-1">
                  <Clock className="h-3 w-3" />
                  {hoursRemaining}h left
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Use Template
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'chat' | 'templates')} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-2 grid grid-cols-2">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" /> Chat
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" /> Templates
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 mt-0 p-0">
            {/* 24-hour window warning */}
            {!isWithin24Hours && (
              <div className="mx-4 mt-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-600">24-hour window expired</p>
                  <p className="text-muted-foreground">You can only send approved message templates. Switch to the Templates tab to continue the conversation.</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center text-xs text-muted-foreground my-4">
                          {formatDate(message.timestamp)}
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                            message.sender === 'customer'
                              ? 'bg-secondary text-foreground rounded-bl-md'
                              : message.sender === 'bot'
                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-br-md'
                              : 'bg-primary text-primary-foreground rounded-br-md'
                          }`}
                        >
                          {message.sender === 'bot' && (
                            <span className="text-xs opacity-70 block mb-1">🤖 Bot</span>
                          )}
                          <p className="text-sm">{message.text}</p>
                          <div className={`text-xs mt-1 flex items-center gap-1 ${
                            message.sender === 'customer' ? 'text-muted-foreground' : 'opacity-70'
                          }`}>
                            {formatTime(message.timestamp)}
                            {message.sender !== 'customer' && message.status && (
                              <span className="ml-1">
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && <span className="text-blue-400">✓✓</span>}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      toast.success(`File "${e.target.files[0].name}" attached`);
                    }
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                  onClick={handleFileUpload}
                  disabled={!isWithin24Hours}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                  onClick={handleFileUpload}
                  disabled={!isWithin24Hours}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Textarea
                  placeholder={isWithin24Hours ? "Type a message..." : "Use a template to send a message"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[44px] max-h-32 resize-none"
                  disabled={!isWithin24Hours}
                />
                <Button 
                  size="icon" 
                  className="shrink-0 gradient-primary"
                  onClick={handleSendMessage}
                  disabled={!isWithin24Hours || !newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="flex-1 overflow-auto mt-0 p-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Select an approved template to re-open the conversation. These templates are pre-approved by Meta for WhatsApp Business API.
              </p>
              
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all cursor-pointer"
                  onClick={() => handleSendTemplate(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{template.name}</span>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0">
                      Use
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
