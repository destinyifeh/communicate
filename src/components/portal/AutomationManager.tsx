import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus, 
  Settings, 
  Trash2, 
  Play, 
  Pause, 
  MoreVertical,
  Instagram,
  Facebook,
  MessageSquare,
  Edit2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  automationGoals, 
  AutomationGoalType, 
  ConfiguredAutomation,
  ChannelType 
} from '@/lib/onboardingTypes';

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const channelInfo: Record<ChannelType, { icon: React.ReactNode; name: string; color: string }> = {
  instagram: { icon: <Instagram className="h-4 w-4" />, name: 'Instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  facebook: { icon: <Facebook className="h-4 w-4" />, name: 'Facebook', color: 'bg-blue-500' },
  whatsapp: { icon: <MessageSquare className="h-4 w-4" />, name: 'WhatsApp', color: 'bg-green-500' },
  tiktok: { icon: <TikTokIcon />, name: 'TikTok', color: 'bg-gray-900 dark:bg-white dark:text-black' },
};

interface AutomationManagerProps {
  maxAutomations: number;
  connectedChannels: ChannelType[];
}

export function AutomationManager({ maxAutomations, connectedChannels }: AutomationManagerProps) {
  const [automations, setAutomations] = useState<ConfiguredAutomation[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<ConfiguredAutomation | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  
  // Form state
  const [selectedGoal, setSelectedGoal] = useState<AutomationGoalType | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | null>(connectedChannels[0] || null);
  const [goalConfig, setGoalConfig] = useState('');

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('configured_automations');
    if (saved) {
      setAutomations(JSON.parse(saved));
    }
  }, []);

  const saveAutomations = (newAutomations: ConfiguredAutomation[]) => {
    setAutomations(newAutomations);
    localStorage.setItem('configured_automations', JSON.stringify(newAutomations));
  };

  const handleAddAutomation = () => {
    if (!selectedGoal || !goalConfig || !selectedChannel) {
      toast.error('Please fill in all fields');
      return;
    }

    if (automations.length >= maxAutomations) {
      toast.error('You have reached your automation limit');
      return;
    }

    const goal = automationGoals.find(g => g.id === selectedGoal);
    if (!goal) return;

    const newAutomation: ConfiguredAutomation = {
      goalId: selectedGoal,
      goalName: goal.name,
      config: goalConfig,
      channel: selectedChannel,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    saveAutomations([...automations, newAutomation]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('Automation added successfully!');
  };

  const handleUpdateAutomation = () => {
    if (!editingAutomation || editingIndex === -1) return;

    const updated = [...automations];
    updated[editingIndex] = editingAutomation;
    saveAutomations(updated);
    setIsEditDialogOpen(false);
    setEditingAutomation(null);
    setEditingIndex(-1);
    toast.success('Automation updated!');
  };

  const handleToggleStatus = (index: number) => {
    const updated = [...automations];
    updated[index].status = updated[index].status === 'active' ? 'paused' : 'active';
    saveAutomations(updated);
    toast.success(`Automation ${updated[index].status === 'active' ? 'activated' : 'paused'}`);
  };

  const handleDelete = (index: number) => {
    const updated = automations.filter((_, i) => i !== index);
    saveAutomations(updated);
    toast.success('Automation deleted');
  };

  const resetForm = () => {
    setSelectedGoal(null);
    setSelectedChannel(connectedChannels[0] || null);
    setGoalConfig('');
  };

  const currentGoal = automationGoals.find(g => g.id === selectedGoal);

  return (
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="gap-2 gradient-primary text-primary-foreground"
              disabled={automations.length >= maxAutomations}
            >
              <Plus className="h-4 w-4" />
              Add Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Automation</DialogTitle>
              <DialogDescription>
                Choose what you want to automate and configure it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Channel Selection */}
              <div className="space-y-2">
                <Label>Channel</Label>
                <div className="flex gap-2 flex-wrap">
                  {connectedChannels.map((channel) => {
                    const info = channelInfo[channel];
                    return (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => setSelectedChannel(channel)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                          selectedChannel === channel
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`h-6 w-6 rounded ${info.color} flex items-center justify-center text-white`}>
                          {info.icon}
                        </div>
                        <span className="text-sm font-medium">{info.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Goal Selection */}
              <div className="space-y-2">
                <Label>Automation Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  {automationGoals.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => {
                        setSelectedGoal(goal.id);
                        setGoalConfig('');
                      }}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        selectedGoal === goal.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{goal.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{goal.name}</div>
                          <div className="text-xs text-muted-foreground">{goal.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              {selectedGoal && currentGoal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <Label>{currentGoal.followUpQuestion}</Label>
                  {currentGoal.followUpType === 'textarea' ? (
                    <Textarea
                      placeholder={currentGoal.followUpPlaceholder}
                      value={goalConfig}
                      onChange={(e) => setGoalConfig(e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      type={currentGoal.followUpType === 'phone' ? 'tel' : 'text'}
                      placeholder={currentGoal.followUpPlaceholder}
                      value={goalConfig}
                      onChange={(e) => setGoalConfig(e.target.value)}
                    />
                  )}
                </motion.div>
              )}

              <Button
                onClick={handleAddAutomation}
                disabled={!selectedGoal || !goalConfig || !selectedChannel}
                className="w-full gradient-primary text-primary-foreground"
              >
                Add Automation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {automations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No automations configured yet.</p>
            <p className="text-sm mt-1">Click "Add Automation" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {automations.map((automation, index) => {
              const goal = automationGoals.find(g => g.id === automation.goalId);
              const channel = channelInfo[automation.channel];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg ${channel.color} flex items-center justify-center text-white`}>
                        {channel.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{goal?.icon}</span>
                          <span className="font-medium">{automation.goalName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {channel.name} • {automation.config.substring(0, 40)}...
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {automation.status === 'active' ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 gap-1">
                          <Play className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 gap-1">
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleStatus(index)}>
                            {automation.status === 'active' ? (
                              <><Pause className="h-4 w-4 mr-2" /> Pause</>
                            ) : (
                              <><Play className="h-4 w-4 mr-2" /> Activate</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setEditingAutomation(automation);
                            setEditingIndex(index);
                            setIsEditDialogOpen(true);
                          }}>
                            <Edit2 className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(index)}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Automation</DialogTitle>
              <DialogDescription>
                Update your automation configuration.
              </DialogDescription>
            </DialogHeader>
            {editingAutomation && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Configuration</Label>
                  <Textarea
                    value={editingAutomation.config}
                    onChange={(e) => setEditingAutomation({
                      ...editingAutomation,
                      config: e.target.value
                    })}
                    rows={3}
                  />
                </div>
                <Button onClick={handleUpdateAutomation} className="w-full">
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}