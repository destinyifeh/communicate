import { ClientLayout } from '@/components/layouts/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2,
  MessageSquare,
  Calendar,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const projects = [
  { 
    name: 'E-commerce Automation', 
    status: 'in-progress',
    progress: 65,
    dueDate: 'Dec 15, 2024',
    updates: 3,
  },
  { 
    name: 'CRM Integration', 
    status: 'review',
    progress: 90,
    dueDate: 'Dec 10, 2024',
    updates: 1,
  },
];

const recentActivity = [
  { 
    type: 'update',
    message: 'New workflow deployed for order processing',
    time: '2 hours ago',
  },
  { 
    type: 'comment',
    message: 'Your account manager left a comment on CRM Integration',
    time: '5 hours ago',
  },
  { 
    type: 'milestone',
    message: 'Phase 2 completed for E-commerce Automation',
    time: '1 day ago',
  },
];

const statusColors: Record<string, string> = {
  'in-progress': 'bg-primary/10 text-primary',
  'review': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  'completed': 'bg-accent/10 text-accent',
};

export default function ClientPortal() {
  const { user } = useAuth();

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h2>
            <p className="text-muted-foreground">Here's an overview of your projects and recent activity.</p>
          </div>
          <Button className="gradient-accent text-accent-foreground gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">Completed Projects</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Projects & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>Current project status and progress</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant="secondary" className={statusColors[project.status]}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Due: {project.dueDate}
                        </span>
                        {project.updates > 0 && (
                          <span className="flex items-center gap-1 text-primary">
                            <MessageSquare className="h-3.5 w-3.5" />
                            {project.updates} new updates
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      {activity.type === 'update' && <FileText className="h-4 w-4 text-primary" />}
                      {activity.type === 'comment' && <MessageSquare className="h-4 w-4 text-accent" />}
                      {activity.type === 'milestone' && <CheckCircle2 className="h-4 w-4 text-accent" />}
                    </div>
                    <div>
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
