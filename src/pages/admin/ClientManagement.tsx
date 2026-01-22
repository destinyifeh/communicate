import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Key,
  Users,
  Plus,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { mockClients, Client } from '@/lib/mockData';
import { ClientDetailsDialog } from '@/components/admin/ClientDetailsDialog';
import { AddClientWizard } from '@/components/admin/AddClientWizard';

export default function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState(mockClients);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [leadLimitDialog, setLeadLimitDialog] = useState<Client | null>(null);
  const [newLeadLimit, setNewLeadLimit] = useState('');
  const [addClientWizardOpen, setAddClientWizardOpen] = useState(false);
  const [viewDetailsClient, setViewDetailsClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuspend = (clientId: string) => {
    setClients(prev => prev.map(c => 
      c.id === clientId 
        ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } 
        : c
    ));
    toast.success('Client status updated');
  };

  const handleRegenerateKey = (clientId: string) => {
    const newKey = 'ak_live_' + Math.random().toString(36).substring(2, 30);
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, apiKey: newKey } : c
    ));
    toast.success('New API key generated');
  };

  const handleUpdateLeadLimit = () => {
    if (leadLimitDialog && newLeadLimit) {
      setClients(prev => prev.map(c => 
        c.id === leadLimitDialog.id ? { ...c, leadLimit: parseInt(newLeadLimit) } : c
      ));
      toast.success('Lead limit updated');
      setLeadLimitDialog(null);
      setNewLeadLimit('');
    }
  };

  const viewAsClient = (client: Client) => {
    toast.success(`Viewing as ${client.name}`, {
      description: 'This would redirect to client portal with impersonation'
    });
  };

  const handleClientAdded = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Client Management</h2>
            <p className="text-sm text-muted-foreground">Manage all registered clients and their subscriptions</p>
          </div>
          <Button 
            className="gradient-primary text-primary-foreground gap-2 w-fit"
            onClick={() => setAddClientWizardOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        {/* Search */}
        <Card className="border-border/50">
          <CardContent className="p-3 md:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {client.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.company}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-popover">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setViewDetailsClient(client)}>
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditClient(client)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => viewAsClient(client)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View as Client
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setLeadLimitDialog(client);
                          setNewLeadLimit(client.leadLimit.toString());
                        }}>
                          <Users className="h-4 w-4 mr-2" />
                          Set Lead Limit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRegenerateKey(client.id)}>
                          <Key className="h-4 w-4 mr-2" />
                          Generate New API Key
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleSuspend(client.id)}
                          className={client.status === 'active' ? 'text-destructive' : 'text-accent'}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          {client.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Plan</span>
                      <Badge variant="secondary" className="text-xs">{client.plan}</Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Lead Usage</span>
                        <span>{client.leadsUsed.toLocaleString()} / {client.leadLimit.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(client.leadsUsed / client.leadLimit) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Revenue</span>
                      <span className="font-medium text-sm">₦{(client.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${client.status === 'active' 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {client.status === 'active' ? (
                          <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                        ) : (
                          <><XCircle className="h-3 w-3 mr-1" /> Suspended</>
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Desktop Table View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:block"
        >
          <Card className="border-border/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Client</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Lead Usage</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client, index) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {client.company.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.company}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{client.plan}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>{client.leadsUsed.toLocaleString()}</span>
                            <span className="text-muted-foreground">/ {client.leadLimit.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={(client.leadsUsed / client.leadLimit) * 100} 
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₦{(client.revenue / 1000000).toFixed(1)}M
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={client.status === 'active' 
                            ? 'bg-accent/10 text-accent' 
                            : 'bg-destructive/10 text-destructive'
                          }
                        >
                          {client.status === 'active' ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" /> Suspended</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-popover">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setViewDetailsClient(client)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditClient(client)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => viewAsClient(client)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View as Client
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setLeadLimitDialog(client);
                              setNewLeadLimit(client.leadLimit.toString());
                            }}>
                              <Users className="h-4 w-4 mr-2" />
                              Set Lead Limit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRegenerateKey(client.id)}>
                              <Key className="h-4 w-4 mr-2" />
                              Generate New API Key
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleSuspend(client.id)}
                              className={client.status === 'active' ? 'text-destructive' : 'text-accent'}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              {client.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Limit Dialog */}
        <Dialog open={!!leadLimitDialog} onOpenChange={() => setLeadLimitDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Lead Limit</DialogTitle>
              <DialogDescription>
                Update the monthly lead limit for {leadLimitDialog?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Limit: {leadLimitDialog?.leadLimit.toLocaleString()} leads/month</Label>
                <Input
                  type="number"
                  value={newLeadLimit}
                  onChange={(e) => setNewLeadLimit(e.target.value)}
                  placeholder="Enter new limit"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setNewLeadLimit('500')}>500</Button>
                <Button variant="outline" size="sm" onClick={() => setNewLeadLimit('1000')}>1,000</Button>
                <Button variant="outline" size="sm" onClick={() => setNewLeadLimit('2500')}>2,500</Button>
                <Button variant="outline" size="sm" onClick={() => setNewLeadLimit('5000')}>5,000</Button>
                <Button variant="outline" size="sm" onClick={() => setNewLeadLimit('10000')}>10,000</Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLeadLimitDialog(null)}>Cancel</Button>
              <Button onClick={handleUpdateLeadLimit} className="gradient-primary text-primary-foreground">
                Update Limit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog open={!!editClient} onOpenChange={() => setEditClient(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update client information for {editClient?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={editClient?.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={editClient?.email} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={editClient?.phone} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditClient(null)}>Cancel</Button>
              <Button onClick={() => {
                toast.success('Client updated');
                setEditClient(null);
              }} className="gradient-primary text-primary-foreground">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Client Wizard */}
        <AddClientWizard
          open={addClientWizardOpen}
          onOpenChange={setAddClientWizardOpen}
          onClientAdded={handleClientAdded}
        />

        {/* View Details Dialog */}
        <ClientDetailsDialog
          open={!!viewDetailsClient}
          onOpenChange={() => setViewDetailsClient(null)}
          client={viewDetailsClient}
        />
      </div>
    </AdminLayout>
  );
}
