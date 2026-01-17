import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FolderKanban, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { 
    label: 'Total Clients', 
    value: '24', 
    change: '+3', 
    trend: 'up',
    icon: Users 
  },
  { 
    label: 'Active Projects', 
    value: '12', 
    change: '+2', 
    trend: 'up',
    icon: FolderKanban 
  },
  { 
    label: 'Revenue (MTD)', 
    value: '$48,250', 
    change: '+18%', 
    trend: 'up',
    icon: TrendingUp 
  },
  { 
    label: 'Avg. Response Time', 
    value: '2.4h', 
    change: '-15%', 
    trend: 'down',
    icon: Clock 
  },
];

const recentProjects = [
  { 
    name: 'E-commerce Automation', 
    client: 'Acme Corp', 
    status: 'in-progress',
    progress: 65,
  },
  { 
    name: 'CRM Integration', 
    client: 'TechStart Inc', 
    status: 'review',
    progress: 90,
  },
  { 
    name: 'Email Marketing Flow', 
    client: 'Growth Co', 
    status: 'in-progress',
    progress: 40,
  },
  { 
    name: 'Inventory Sync', 
    client: 'RetailMax', 
    status: 'completed',
    progress: 100,
  },
];

const statusColors: Record<string, string> = {
  'in-progress': 'bg-primary/10 text-primary',
  'review': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  'completed': 'bg-accent/10 text-accent',
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Alex</h2>
            <p className="text-muted-foreground">Here's what's happening with your agency today.</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-accent' : 'text-destructive'
                    }`}>
                      {stat.change}
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent projects & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest project activity</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View all</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant="secondary" className={statusColors[project.status]}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div 
                            className="h-full rounded-full gradient-primary transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Add New Client
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FolderKanban className="h-4 w-4" />
                Create Project
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
