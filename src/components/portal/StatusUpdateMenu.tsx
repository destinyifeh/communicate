import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
  Loader2,
  UserCheck,
  Ban,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export type LeadStatus = 'new' | 'interested' | 'contacted' | 'qualified' | 'paid' | 'lost';
export type OrderStatus = 'new' | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

type StatusType = LeadStatus | OrderStatus | AppointmentStatus | TicketStatus;

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const leadStatuses: Record<LeadStatus, StatusConfig> = {
  new: { label: 'New', icon: <Sparkles className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  interested: { label: 'Interested', icon: <AlertCircle className="h-3.5 w-3.5" />, color: 'bg-yellow-500/10 text-yellow-600' },
  contacted: { label: 'Contacted', icon: <UserCheck className="h-3.5 w-3.5" />, color: 'bg-purple-500/10 text-purple-600' },
  qualified: { label: 'Qualified', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'bg-cyan-500/10 text-cyan-600' },
  paid: { label: 'Paid / Converted', icon: <DollarSign className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  lost: { label: 'Lost', icon: <Ban className="h-3.5 w-3.5" />, color: 'bg-red-500/10 text-red-600' },
};

const orderStatuses: Record<OrderStatus, StatusConfig> = {
  new: { label: 'New', icon: <Sparkles className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  pending: { label: 'Pending Payment', icon: <Clock className="h-3.5 w-3.5" />, color: 'bg-orange-500/10 text-orange-600' },
  paid: { label: 'Paid', icon: <DollarSign className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  processing: { label: 'Processing', icon: <Loader2 className="h-3.5 w-3.5" />, color: 'bg-purple-500/10 text-purple-600' },
  shipped: { label: 'Shipped', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'bg-cyan-500/10 text-cyan-600' },
  delivered: { label: 'Delivered', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  cancelled: { label: 'Cancelled', icon: <XCircle className="h-3.5 w-3.5" />, color: 'bg-red-500/10 text-red-600' },
};

const appointmentStatuses: Record<AppointmentStatus, StatusConfig> = {
  pending: { label: 'Pending', icon: <Clock className="h-3.5 w-3.5" />, color: 'bg-orange-500/10 text-orange-600' },
  confirmed: { label: 'Confirmed', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  completed: { label: 'Completed', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  cancelled: { label: 'Cancelled', icon: <XCircle className="h-3.5 w-3.5" />, color: 'bg-red-500/10 text-red-600' },
  no_show: { label: 'No Show', icon: <Ban className="h-3.5 w-3.5" />, color: 'bg-gray-500/10 text-gray-600' },
};

const ticketStatuses: Record<TicketStatus, StatusConfig> = {
  open: { label: 'Open', icon: <AlertCircle className="h-3.5 w-3.5" />, color: 'bg-blue-500/10 text-blue-600' },
  in_progress: { label: 'In Progress', icon: <Loader2 className="h-3.5 w-3.5" />, color: 'bg-purple-500/10 text-purple-600' },
  resolved: { label: 'Resolved', icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'bg-green-500/10 text-green-600' },
  closed: { label: 'Closed', icon: <XCircle className="h-3.5 w-3.5" />, color: 'bg-gray-500/10 text-gray-600' },
};

interface StatusUpdateMenuProps {
  type: 'lead' | 'order' | 'appointment' | 'ticket';
  currentStatus: StatusType;
  onStatusChange: (newStatus: StatusType) => void;
  compact?: boolean;
}

export function StatusUpdateMenu({
  type,
  currentStatus,
  onStatusChange,
  compact = false,
}: StatusUpdateMenuProps) {
  const getStatusConfig = (): Record<string, StatusConfig> => {
    switch (type) {
      case 'lead': return leadStatuses;
      case 'order': return orderStatuses;
      case 'appointment': return appointmentStatuses;
      case 'ticket': return ticketStatuses;
    }
  };

  const statuses = getStatusConfig();
  const current = statuses[currentStatus as string];

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(newStatus as StatusType);
    toast.success(`Status updated to ${statuses[newStatus].label}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-1.5 h-auto py-1 px-2 ${compact ? 'text-xs' : 'text-sm'}`}
        >
          <Badge variant="secondary" className={`${current?.color || ''} gap-1`}>
            {current?.icon}
            {current?.label || currentStatus}
          </Badge>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Update Status
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(statuses).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleStatusChange(key)}
            className={`cursor-pointer ${currentStatus === key ? 'bg-secondary' : ''}`}
          >
            <div className="flex items-center gap-2">
              <span className={config.color.split(' ')[1]}>{config.icon}</span>
              <span>{config.label}</span>
            </div>
            {currentStatus === key && (
              <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
