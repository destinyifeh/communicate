import { useState } from 'react';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockLeads, Lead } from '@/lib/mockData';

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
};

export default function LeadCRM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.phone.includes(searchQuery);
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ClientLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Lead CRM</h2>
            <p className="text-sm text-muted-foreground">Manage and track all captured leads</p>
          </div>
          <Badge variant="secondary" className="text-sm md:text-lg px-3 md:px-4 py-1.5 md:py-2 w-fit">
            {mockLeads.length} Total Leads
          </Badge>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
                  <Button
                    variant={statusFilter === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(null)}
                    className="text-xs md:text-sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === 'new' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('new')}
                    className="text-xs md:text-sm"
                  >
                    New
                  </Button>
                  <Button
                    variant={statusFilter === 'interested' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('interested')}
                    className="text-xs md:text-sm"
                  >
                    Interested
                  </Button>
                  <Button
                    variant={statusFilter === 'paid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('paid')}
                    className="text-xs md:text-sm"
                  >
                    Paid
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leads - Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                    </div>
                    <Badge variant="secondary" className={statusStyles[lead.status]}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`${platformIcons[lead.platform].color} text-xs`}>
                        {platformIcons[lead.platform].icon} {lead.platform}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(lead.date).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <MessageSquare className="h-3 w-3" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {filteredLeads.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Filter className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No leads found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Leads Table - Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden md:block"
        >
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(`tel:${lead.phone}`, '_self')}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            View Chat
                          </Button>
                        </div>
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
        </motion.div>

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
