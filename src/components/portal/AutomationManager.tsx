import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Play, 
  Pause, 
  MoreVertical,
  Instagram,
  Facebook,
  MessageSquare,
  AlertCircle,
  ShoppingCart,
  Calendar,
  HelpCircle,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  ChannelType,
  ConfiguredBusinessAutomation,
  businessCategories,
  BusinessCategoryType,
  PlanType
} from '@/lib/businessTypes';
import { AutomationBuilder } from '@/components/automation/AutomationBuilder';

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const channelInfo: Record<ChannelType, { icon: React.ReactNode; name: string; color: string }> = {
  instagram: { icon: <Instagram className="h-4 w-4" />, name: 'Instagram', color: 'bg-primary' },
  facebook: { icon: <Facebook className="h-4 w-4" />, name: 'Facebook', color: 'bg-primary' },
  whatsapp: { icon: <MessageSquare className="h-4 w-4" />, name: 'WhatsApp', color: 'bg-accent' },
  tiktok: { icon: <TikTokIcon />, name: 'TikTok', color: 'bg-foreground' },
};

const categoryIcons: Record<BusinessCategoryType, React.ReactNode> = {
  sales_orders: <ShoppingCart className="h-5 w-5" />,
  appointments_bookings: <Calendar className="h-5 w-5" />,
  enquiries_support: <HelpCircle className="h-5 w-5" />,
  lead_capture: <UserPlus className="h-5 w-5" />,
};

interface AutomationManagerProps {
  maxAutomations: number;
  connectedChannels: ChannelType[];
  currentPlan?: PlanType;
  onUpgradeNeeded?: () => void;
}

export function AutomationManager({ 
  maxAutomations, 
  connectedChannels, 
  currentPlan = 'starter',
  onUpgradeNeeded 
}: AutomationManagerProps) {
  const [automations, setAutomations] = useState<ConfiguredBusinessAutomation[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [automationToDelete, setAutomationToDelete] = useState<string | null>(null);
  const [duplicateAlertOpen, setDuplicateAlertOpen] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('configured_automations');
    if (saved) {
      try {
        setAutomations(JSON.parse(saved));
      } catch {
        setAutomations([]);
      }
    }
  }, []);

  const saveAutomations = (newAutomations: ConfiguredBusinessAutomation[]) => {
    setAutomations(newAutomations);
    localStorage.setItem('configured_automations', JSON.stringify(newAutomations));
  };

  // Check if automation already exists for channel + category combo
  const isAutomationDuplicate = (category: BusinessCategoryType, channel: ChannelType): boolean => {
    return automations.some(a => a.businessCategory === category && a.channel === channel);
  };

  const handleAddAutomation = (automation: {
    category: BusinessCategoryType;
    channel: ChannelType;
    config: any;
  }) => {
    if (automations.length >= maxAutomations) {
      toast.error('You have reached your automation limit');
      if (onUpgradeNeeded) onUpgradeNeeded();
      return;
    }

    if (isAutomationDuplicate(automation.category, automation.channel)) {
      const categoryInfo = businessCategories.find(c => c.id === automation.category);
      const channel = channelInfo[automation.channel];
      setDuplicateMessage(`"${categoryInfo?.name}" automation is already configured for ${channel.name}. Please edit the existing automation or choose a different type.`);
      setDuplicateAlertOpen(true);
      return;
    }

    const categoryInfo = businessCategories.find(c => c.id === automation.category);
    
    const newAutomation: ConfiguredBusinessAutomation = {
      id: Math.random().toString(36).substring(2, 9),
      businessCategory: automation.category,
      categoryName: categoryInfo?.name || '',
      channel: automation.channel,
      automation: automation.config,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAutomations([...automations, newAutomation]);
    setIsAddDialogOpen(false);
    toast.success('Automation added successfully!');
  };

  const handleToggleStatus = (id: string) => {
    const updated = automations.map(a => 
      a.id === id 
        ? { ...a, status: (a.status === 'active' ? 'paused' : 'active') as 'active' | 'paused' }
        : a
    );
    saveAutomations(updated);
    const automation = updated.find(a => a.id === id);
    toast.success(`Automation ${automation?.status === 'active' ? 'activated' : 'paused'}`);
  };

  const handleDelete = () => {
    if (!automationToDelete) return;
    const updated = automations.filter(a => a.id !== automationToDelete);
    saveAutomations(updated);
    setDeleteAlertOpen(false);
    setAutomationToDelete(null);
    toast.success('Automation deleted');
  };

  const handleAddClick = () => {
    if (automations.length >= maxAutomations) {
      toast.error('You have reached your automation limit');
      if (onUpgradeNeeded) onUpgradeNeeded();
      return;
    }
    setIsAddDialogOpen(true);
  };

  return (
    <>
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Manage Automations
            </CardTitle>
            <CardDescription>
              {automations.length} of {maxAutomations === 999 ? '∞' : maxAutomations} automations configured
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            className="gap-2 gradient-primary text-primary-foreground"
            disabled={automations.length >= maxAutomations}
            onClick={handleAddClick}
          >
            <Plus className="h-4 w-4" />
            Add Automation
          </Button>
        </CardHeader>
        <CardContent>
          {automations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No automations configured yet.</p>
              <p className="text-sm mt-1">Click "Add Automation" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {automations.map((automation) => {
                const category = businessCategories.find(c => c.id === automation.businessCategory);
                const channel = channelInfo[automation.channel as ChannelType];
                
                return (
                  <motion.div
                    key={automation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg ${channel?.color} flex items-center justify-center text-primary-foreground`}>
                          {channel?.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category?.icon}</span>
                            <span className="font-medium">{automation.categoryName}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {channel?.name} • {automation.automation.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {automation.status === 'active' ? (
                          <Badge variant="secondary" className="bg-accent/10 text-accent gap-1">
                            <Play className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1">
                            <Pause className="h-3 w-3" />
                            Paused
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem onClick={() => handleToggleStatus(automation.id)}>
                              {automation.status === 'active' ? (
                                <><Pause className="h-4 w-4 mr-2" /> Pause</>
                              ) : (
                                <><Play className="h-4 w-4 mr-2" /> Activate</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setAutomationToDelete(automation.id);
                                setDeleteAlertOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Automation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Automation</DialogTitle>
            <DialogDescription>
              Choose what you want to automate and configure it.
            </DialogDescription>
          </DialogHeader>
          <AutomationBuilder
            currentPlan={currentPlan}
            connectedChannels={connectedChannels}
            onComplete={handleAddAutomation}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Duplicate Alert */}
      <AlertDialog open={duplicateAlertOpen} onOpenChange={setDuplicateAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Automation Already Exists
            </AlertDialogTitle>
            <AlertDialogDescription>
              {duplicateMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDuplicateAlertOpen(false)}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Automation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this automation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
