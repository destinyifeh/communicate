import { useState, useEffect } from 'react';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search, 
  MessageSquare,
  Phone,
  Calendar,
  Filter,
  ShoppingCart,
  UserPlus,
  HeadphonesIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockLeads, Lead } from '@/lib/mockData';
import { BusinessKindType, businessKinds } from '@/lib/businessTypes';

const platformIcons: Record<string, { icon: string; color: string }> = {
  whatsapp: { icon: '💬', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  instagram: { icon: '📸', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  facebook: { icon: '👤', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  tiktok: { icon: '🎵', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
};

const statusStyles: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  interested: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  paid: 'bg-green-500/10 text-green-600 dark:text-green-400',
  pending: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  confirmed: 'bg-green-500/10 text-green-600 dark:text-green-400',
  cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
  open: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  resolved: 'bg-green-500/10 text-green-600 dark:text-green-400',
};

// Mock data for different business types
const mockAppointments = [
  { id: '1', name: 'Sarah Johnson', phone: '+234 803 123 4567', service: 'Consultation', date: '2026-02-05', time: '10:00 AM', status: 'confirmed', platform: 'whatsapp' },
  { id: '2', name: 'Michael Chen', phone: '+234 805 234 5678', service: 'Haircut', date: '2026-02-05', time: '2:00 PM', status: 'pending', platform: 'instagram' },
  { id: '3', name: 'Emily Brown', phone: '+234 807 345 6789', service: 'Coaching Session', date: '2026-02-06', time: '11:00 AM', status: 'confirmed', platform: 'whatsapp' },
  { id: '4', name: 'David Wilson', phone: '+234 809 456 7890', service: 'Dental Checkup', date: '2026-02-04', time: '3:00 PM', status: 'cancelled', platform: 'facebook' },
];

const mockOrders = [
  { id: '1', name: 'Amaka Okonkwo', phone: '+234 803 123 4567', product: 'Luxury Watch', amount: '₦250,000', status: 'paid', platform: 'instagram', date: '2026-02-03' },
  { id: '2', name: 'Chidi Eze', phone: '+234 805 234 5678', product: 'Designer Bag', amount: '₦180,000', status: 'pending', platform: 'whatsapp', date: '2026-02-04' },
  { id: '3', name: 'Fatima Ibrahim', phone: '+234 807 345 6789', product: 'Gold Necklace', amount: '₦120,000', status: 'paid', platform: 'facebook', date: '2026-02-04' },
  { id: '4', name: 'Kemi Adeleke', phone: '+234 809 456 7890', product: 'Sneakers', amount: '₦45,000', status: 'new', platform: 'tiktok', date: '2026-02-05' },
];

const mockTickets = [
  { id: '1', name: 'John Doe', phone: '+234 803 123 4567', subject: 'Payment Issue', category: 'Billing', status: 'open', platform: 'whatsapp', date: '2026-02-04' },
  { id: '2', name: 'Jane Smith', phone: '+234 805 234 5678', subject: 'Service Question', category: 'General', status: 'resolved', platform: 'instagram', date: '2026-02-03' },
  { id: '3', name: 'Mike Brown', phone: '+234 807 345 6789', subject: 'Technical Problem', category: 'Technical', status: 'open', platform: 'facebook', date: '2026-02-04' },
];

export default function LeadCRM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [businessKind, setBusinessKind] = useState<BusinessKindType | null>(null);
  const [activeTab, setActiveTab] = useState('leads');

  useEffect(() => {
    const savedBusinessKind = localStorage.getItem('business_kind') as BusinessKindType;
    if (savedBusinessKind) {
      setBusinessKind(savedBusinessKind);
      // Set default tab based on business type
      if (savedBusinessKind === 'appointment_based') {
        setActiveTab('appointments');
      } else if (savedBusinessKind === 'vendor') {
        setActiveTab('orders');
      } else if (savedBusinessKind === 'service_provider') {
        setActiveTab('tickets');
      }
    }
  }, []);

  const businessKindInfo = businessKind ? businessKinds.find(b => b.id === businessKind) : null;

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.phone.includes(searchQuery);
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get tabs based on business type
  const getTabs = () => {
    if (businessKind === 'vendor') {
      return [
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'leads', label: 'Leads', icon: UserPlus },
      ];
    } else if (businessKind === 'appointment_based') {
      return [
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'tickets', label: 'Support', icon: HeadphonesIcon },
      ];
    } else if (businessKind === 'service_provider') {
      return [
        { id: 'leads', label: 'Leads', icon: UserPlus },
        { id: 'tickets', label: 'Support', icon: HeadphonesIcon },
      ];
    } else {
      // Lead-driven
      return [
        { id: 'leads', label: 'Leads', icon: UserPlus },
      ];
    }
  };

  const tabs = getTabs();

  const getPageTitle = () => {
    if (businessKind === 'vendor') return 'Orders & Leads';
    if (businessKind === 'appointment_based') return 'Appointments & Support';
    if (businessKind === 'service_provider') return 'Leads & Support';
    return 'Lead CRM';
  };

  return (
    <ClientLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{getPageTitle()}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Manage and track all your {businessKind === 'vendor' ? 'orders and leads' : 
                businessKind === 'appointment_based' ? 'appointments and support tickets' : 
                businessKind === 'service_provider' ? 'leads and support tickets' : 'captured leads'}
              {businessKindInfo && (
                <Badge variant="outline" className="gap-1 text-xs">
                  {businessKindInfo.icon} {businessKindInfo.name}
                </Badge>
              )}
            </p>
          </div>
        </div>

        {/* Tabs for different data types */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4">
            {/* Filters */}
            <Card className="border-border/50">
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant={statusFilter === null ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(null)} className="text-xs md:text-sm">All</Button>
                    <Button variant={statusFilter === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('new')} className="text-xs md:text-sm">New</Button>
                    <Button variant={statusFilter === 'interested' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('interested')} className="text-xs md:text-sm">Interested</Button>
                    <Button variant={statusFilter === 'paid' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('paid')} className="text-xs md:text-sm">Converted</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{mockLeads.length}</div>
                  <div className="text-xs text-muted-foreground">Total Leads</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{mockLeads.filter(l => l.status === 'new').length}</div>
                  <div className="text-xs text-muted-foreground">New</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{mockLeads.filter(l => l.status === 'interested').length}</div>
                  <div className="text-xs text-muted-foreground">Interested</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{mockLeads.filter(l => l.status === 'paid').length}</div>
                  <div className="text-xs text-muted-foreground">Converted</div>
                </CardContent>
              </Card>
            </div>

            {/* Leads Table */}
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group hover:bg-secondary/30"
                      >
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            {lead.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={platformIcons[lead.platform].color}>
                            {platformIcons[lead.platform].icon} {lead.platform}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusStyles[lead.status]}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(lead.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            View Chat
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredLeads.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No leads found matching your criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab (for Vendors) */}
          <TabsContent value="orders" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{mockOrders.length}</div>
                  <div className="text-xs text-muted-foreground">Total Orders</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{mockOrders.filter(o => o.status === 'paid').length}</div>
                  <div className="text-xs text-muted-foreground">Paid</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{mockOrders.filter(o => o.status === 'pending').length}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">₦595K</div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-secondary/30"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.name}</div>
                            <div className="text-xs text-muted-foreground">{order.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell className="font-semibold">{order.amount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={platformIcons[order.platform].color}>
                            {platformIcons[order.platform].icon} {order.platform}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusStyles[order.status]}>
                            {order.status === 'paid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{order.date}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{mockAppointments.length}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{mockAppointments.filter(a => a.status === 'confirmed').length}</div>
                  <div className="text-xs text-muted-foreground">Confirmed</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{mockAppointments.filter(a => a.status === 'pending').length}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{mockAppointments.filter(a => a.status === 'cancelled').length}</div>
                  <div className="text-xs text-muted-foreground">Cancelled</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAppointments.map((apt, index) => (
                      <motion.tr
                        key={apt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-secondary/30"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{apt.name}</div>
                            <div className="text-xs text-muted-foreground">{apt.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{apt.service}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{apt.date} at {apt.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={platformIcons[apt.platform].color}>
                            {platformIcons[apt.platform].icon} {apt.platform}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusStyles[apt.status]}>
                            {apt.status === 'confirmed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {apt.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                            {apt.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{mockTickets.length}</div>
                  <div className="text-xs text-muted-foreground">Total Tickets</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{mockTickets.filter(t => t.status === 'open').length}</div>
                  <div className="text-xs text-muted-foreground">Open</div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{mockTickets.filter(t => t.status === 'resolved').length}</div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Customer</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTickets.map((ticket, index) => (
                      <motion.tr
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-secondary/30"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{ticket.name}</div>
                            <div className="text-xs text-muted-foreground">{ticket.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={platformIcons[ticket.platform].color}>
                            {platformIcons[ticket.platform].icon} {ticket.platform}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusStyles[ticket.status]}>
                            {ticket.status === 'resolved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {ticket.status === 'open' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{ticket.date}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Chat Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span>{platformIcons[selectedLead?.platform || 'whatsapp'].icon}</span>
                Chat with {selectedLead?.name}
              </DialogTitle>
              <DialogDescription>
                Conversation history from {selectedLead?.platform}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-3 md:p-4 bg-secondary/30 rounded-lg">
              {selectedLead?.messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 md:px-4 py-2 ${
                      message.sender === 'bot'
                        ? 'bg-secondary text-foreground'
                        : 'gradient-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'bot' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}
