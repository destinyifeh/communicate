import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Bell,
  Mail,
  X,
  File
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { BusinessKindType, ChannelType } from '@/lib/businessTypes';

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
    email?: string;
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
  const [activeTab, setActiveTab] = useState<'chat' | 'templates' | 'email'>('chat');
  const [emailSubject, setEmailSubject] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const templates = getTemplatesForBusiness(businessKind || null);

  // Check if platform is WhatsApp (only WhatsApp has 24-hour window restriction)
  const isWhatsApp = contact?.platform === 'whatsapp';
  const isEmail = contact?.platform === 'email';

  // Calculate if within 24-hour window (only for WhatsApp)
  const lastCustomerMessage = [...messages]
    .reverse()
    .find(m => m.sender === 'customer');
  
  const isWithin24Hours = isWhatsApp
    ? (lastCustomerMessage
        ? (Date.now() - lastCustomerMessage.timestamp.getTime()) < 24 * 60 * 60 * 1000
        : false)
    : true; // Non-WhatsApp channels always allow free-form messaging

  const hoursRemaining = lastCustomerMessage && isWhatsApp
    ? Math.max(0, 24 - Math.floor((Date.now() - lastCustomerMessage.timestamp.getTime()) / (60 * 60 * 1000)))
    : 24;

  // Can send messages freely (WhatsApp needs 24hr window, others always can)
  const canSendFreeMessage = !isWhatsApp || isWithin24Hours;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (isWhatsApp && !isWithin24Hours) {
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

    // Add attachments info to message if any
    if (attachedFiles.length > 0) {
      message.attachment = {
        type: attachedFiles[0].type.startsWith('image/') ? 'image' : 'file',
        name: attachedFiles[0].name,
        url: URL.createObjectURL(attachedFiles[0]),
      };
    }

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setAttachedFiles([]);
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

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !newMessage.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }

    toast.success(`Email sent to ${contact?.email || contact?.phone}`);
    setEmailSubject('');
    setNewMessage('');
    setAttachedFiles([]);
    setActiveTab('chat');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) attached`);
    }
    // Reset input
    if (e.target) e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
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

  const platformEmoji: Record<string, string> = {
    whatsapp: '💬',
    instagram: '📸',
    facebook: '👤',
    tiktok: '🎵',
    email: '📧',
  };

  const platformIcon = platformEmoji[contact.platform] || '💬';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                {platformIcon}
              </div>
              <div>
                <DialogTitle className="text-base">{contact.name}</DialogTitle>
                <DialogDescription className="text-xs flex items-center gap-2">
                  {contact.email ? (
                    <>
                      <Mail className="h-3 w-3" /> {contact.email}
                    </>
                  ) : (
                    <>
                      <Phone className="h-3 w-3" /> {contact.phone}
                    </>
                  )}
                </DialogDescription>
              </div>
            </div>
            
            {/* 24-hour window indicator - Only for WhatsApp */}
            {isWhatsApp && (
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
            )}

            {/* Email badge */}
            {isEmail && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 gap-1">
                <Mail className="h-3 w-3" />
                Email
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'chat' | 'templates' | 'email')} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-2 grid grid-cols-3">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" /> Chat
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" /> Templates
            </TabsTrigger>
            {contact.email && (
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" /> Email
              </TabsTrigger>
            )}
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 mt-0 p-0">
            {/* 24-hour window warning - Only for WhatsApp */}
            {isWhatsApp && !isWithin24Hours && (
              <div className="mx-4 mt-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-600">WhatsApp 24-hour window expired</p>
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
                          {message.attachment && (
                            <div className="mt-2 p-2 bg-background/20 rounded-lg flex items-center gap-2">
                              {message.attachment.type === 'image' ? (
                                <ImageIcon className="h-4 w-4" />
                              ) : (
                                <File className="h-4 w-4" />
                              )}
                              <span className="text-xs truncate">{message.attachment.name}</span>
                            </div>
                          )}
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

            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="mx-4 mb-2 flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-xs">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="h-3 w-3" />
                    ) : (
                      <File className="h-3 w-3" />
                    )}
                    <span className="max-w-[100px] truncate">{file.name}</span>
                    <button 
                      onClick={() => removeAttachment(index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  multiple
                  onChange={(e) => handleFileSelect(e, 'file')}
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e, 'image')}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isWhatsApp && !canSendFreeMessage}
                  title="Attach file"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isWhatsApp && !canSendFreeMessage}
                  title="Attach image"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Textarea
                  placeholder={
                    isWhatsApp && !canSendFreeMessage 
                      ? "Use a template to send a message" 
                      : "Type a message..."
                  }
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-[44px] max-h-32 resize-none"
                  disabled={isWhatsApp && !canSendFreeMessage}
                />
                <Button 
                  size="icon" 
                  className="shrink-0 gradient-primary"
                  onClick={handleSendMessage}
                  disabled={(isWhatsApp && !canSendFreeMessage) || (!newMessage.trim() && attachedFiles.length === 0)}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="flex-1 overflow-auto mt-0 p-4">
            <div className="space-y-3">
              {isWhatsApp && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>WhatsApp Templates:</strong> These are pre-approved messages you can send anytime, even after the 24-hour window expires.
                  </p>
                </div>
              )}
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer group"
                  onClick={() => handleSendTemplate(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{template.name}</span>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Send className="h-3 w-3" /> Use Template
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Email Tab */}
          {contact.email && (
            <TabsContent value="email" className="flex-1 flex flex-col min-h-0 mt-0 p-4">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">To</label>
                  <Input value={contact.email} disabled className="bg-secondary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Subject</label>
                  <Input 
                    placeholder="Enter email subject" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <Textarea 
                    placeholder="Write your email message..." 
                    className="min-h-[200px] resize-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>

                {/* Email Attachments */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-xs">
                        <File className="h-3 w-3" />
                        <span className="max-w-[100px] truncate">{file.name}</span>
                        <button 
                          onClick={() => removeAttachment(index)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4 mr-2" /> Attach Files
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveTab('chat')}>
                  Cancel
                </Button>
                <Button 
                  className="gradient-primary text-primary-foreground gap-2"
                  onClick={handleSendEmail}
                  disabled={!emailSubject.trim() || !newMessage.trim()}
                >
                  <Mail className="h-4 w-4" /> Send Email
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
