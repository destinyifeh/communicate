import { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
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
  RefreshCw,
  CheckCircle,
  XCircle,
  Code,
  Clock,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockWebhookLogs, WebhookLog } from '@/lib/mockData';

export default function WebhookLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredLogs = mockWebhookLogs.filter(log => 
    log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.payload.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Webhook Logs</h2>
            <p className="text-sm text-muted-foreground">Monitor incoming data from integrations</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 w-fit"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <Card className="border-border/50">
            <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-4">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{mockWebhookLogs.filter(l => l.status === 'success').length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Success</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-4">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{mockWebhookLogs.filter(l => l.status === 'error').length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Errors</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-4">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{mockWebhookLogs.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border/50">
          <CardContent className="p-3 md:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs">{log.source}</Badge>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${log.status === 'success' 
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {log.status === 'success' ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> 200</>
                      ) : (
                        <><XCircle className="h-3 w-3 mr-1" /> Error</>
                      )}
                    </Badge>
                  </div>
                  
                  <p className="text-xs font-mono text-muted-foreground mb-2 truncate">
                    {log.endpoint}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(log.timestamp)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 h-7 text-xs"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Code className="h-3 w-3" />
                      View
                    </Button>
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
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group font-mono text-sm"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.source}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.endpoint}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={log.status === 'success' 
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                          }
                        >
                          {log.status === 'success' ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> 200 OK</>
                          ) : (
                            <><XCircle className="h-3 w-3 mr-1" /> Error</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Code className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
