'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  Plus,
  UserPlus,
  MessageSquare,
  Mail,
  Phone,
  Bot,
  LucideIcon,
  Calendar,
  PhoneCall,
  Megaphone,
  Send,
  Clock,
  CheckCircle,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { mockClients, clientTrafficData, getAdminBookingSummary, getAdminCallSummary, getAdminCampaignSummary, adminBookingStats, adminCallStats, adminCampaignStats } from '@/lib/mockData';

const totalRevenue = mockClients.reduce((sum, c) => sum + c.revenue, 0);
const activeClients = mockClients.filter(c => c.status === 'active').length;
const totalLeads = mockClients.reduce((sum, c) => sum + c.leadsUsed, 0);

// Get aggregate data for new features
const bookingSummary = getAdminBookingSummary();
const callSummary = getAdminCallSummary();
const campaignSummary = getAdminCampaignSummary();

const stats = [
  {
    label: 'Total Revenue',
    value: `₦${(totalRevenue / 1000000).toFixed(1)}M`,
    change: '+24%',
    icon: DollarSign,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    label: 'Active Clients',
    value: activeClients.toString(),
    change: '+2',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Total Conversations',
    value: '24.5K',
    change: '+32%',
    icon: MessageSquare,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'AI Resolution Rate',
    value: '89%',
    change: '+5.2%',
    icon: Bot,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
];

// New feature stats
const featureStats = [
  {
    label: 'Total Bookings',
    value: bookingSummary.totalBookings.toLocaleString(),
    subValue: `${bookingSummary.pendingBookings} pending`,
    change: '+18%',
    icon: Calendar,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    href: '/admin/bookings',
  },
  {
    label: 'Total Calls',
    value: callSummary.totalCalls.toLocaleString(),
    subValue: `${callSummary.avgResolutionRate}% resolved`,
    change: '+15%',
    icon: PhoneCall,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
    href: '/admin/call-center',
  },
  {
    label: 'Campaigns Sent',
    value: campaignSummary.totalCampaigns.toLocaleString(),
    subValue: `${campaignSummary.activeCampaigns} active`,
    change: '+28%',
    icon: Megaphone,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10',
    href: '/admin/marketing',
  },
  {
    label: 'Messages Delivered',
    value: `${(campaignSummary.totalDelivered / 1000).toFixed(1)}K`,
    subValue: `${campaignSummary.avgOpenRate}% open rate`,
    change: '+42%',
    icon: Send,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    href: '/admin/marketing',
  },
];

// Performance chart data for new features
const featurePerformanceData = [
  { name: 'Mon', bookings: 45, calls: 28, campaigns: 3 },
  { name: 'Tue', bookings: 52, calls: 35, campaigns: 5 },
  { name: 'Wed', bookings: 48, calls: 42, campaigns: 2 },
  { name: 'Thu', bookings: 61, calls: 38, campaigns: 4 },
  { name: 'Fri', bookings: 55, calls: 45, campaigns: 6 },
  { name: 'Sat', bookings: 38, calls: 22, campaigns: 1 },
  { name: 'Sun', bookings: 29, calls: 15, campaigns: 0 },
];

// Mock data for conversation types distribution
const conversationTypesData = [
  { name: 'AI Auto-resolved', value: 45, color: 'hsl(271, 91%, 65%)' },
  { name: 'Support Inquiries', value: 25, color: 'hsl(199, 89%, 48%)' },
  { name: 'Appointments', value: 18, color: 'hsl(142, 76%, 36%)' },
  { name: 'Escalated', value: 12, color: 'hsl(25, 95%, 53%)' },
];

// Mock data for channel distribution
interface ChannelDistribution {
  name: string;
  value: number;
  icon: LucideIcon | (() => React.ReactNode);
  color: string;
}

const channelDistributionData: ChannelDistribution[] = [
  { name: 'SMS', value: 38, icon: MessageSquare, color: 'bg-blue-500' },
  { name: 'WhatsApp', value: 32, icon: MessageSquare, color: 'bg-green-500' },
  { name: 'Voice', value: 18, icon: Phone, color: 'bg-orange-500' },
  { name: 'Email', value: 12, icon: Mail, color: 'bg-cyan-500' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Agency Command Center</h2>
            <p className="text-muted-foreground">Overview of all client communications across SMS, WhatsApp, Voice & Email</p>
          </div>
          <Link href="/admin/clients">
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent flex items-center gap-1">
                      {stat.change}
                      <ArrowUpRight className="h-3 w-3" />
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* New Features Stats */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Platform Features Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featureStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link href={stat.href}>
                  <Card className="border-border/50 hover:shadow-medium transition-all hover:scale-[1.02] cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <Badge variant="secondary" className="bg-accent/10 text-accent flex items-center gap-1">
                          {stat.change}
                          <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                      <div className="text-xs text-muted-foreground/70 mt-1">{stat.subValue}</div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Weekly Feature Performance</CardTitle>
              <CardDescription>Bookings, calls, and campaigns activity this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={featurePerformanceData}>
                    <defs>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bookings"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBookings)"
                      name="Bookings"
                    />
                    <Area
                      type="monotone"
                      dataKey="calls"
                      stroke="hsl(25, 95%, 53%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCalls)"
                      name="Calls"
                    />
                    <Line
                      type="monotone"
                      dataKey="campaigns"
                      stroke="hsl(330, 81%, 60%)"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(330, 81%, 60%)', strokeWidth: 0, r: 4 }}
                      name="Campaigns"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-muted-foreground">Bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-muted-foreground">Calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-pink-500" />
                  <span className="text-sm text-muted-foreground">Campaigns</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Message Volume Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Client Message Volume</CardTitle>
                <CardDescription>Messages sent by each active client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clientTrafficData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [value.toLocaleString() + ' messages', 'Messages']}
                      />
                      <Bar
                        dataKey="messages"
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Conversation Types Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Conversation Outcomes</CardTitle>
                <CardDescription>How conversations are handled across all clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conversationTypesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {conversationTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`${value}%`, 'Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {conversationTypesData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Channel Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Channel Distribution</CardTitle>
              <CardDescription>Conversations per communication channel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {channelDistributionData.map((channel, index) => {
                const IconComponent = channel.icon as LucideIcon;
                return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg ${channel.color} flex items-center justify-center text-white`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{channel.name}</span>
                      <span className="text-sm text-muted-foreground">{channel.value}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${channel.color}`}
                        style={{ width: `${channel.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
              })}
            </CardContent>
          </Card>

          {/* Top Performer */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Top Performing Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  FH
                </div>
                <div>
                  <p className="font-semibold text-lg">Fashion Hub</p>
                  <p className="text-sm text-muted-foreground">Enterprise Plan</p>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium">₦7.5M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Conversations</span>
                  <span className="font-medium">4,520</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AI Resolution</span>
                  <span className="font-medium text-accent">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-green-600" />
                  <span className="text-sm">New Clients</span>
                </div>
                <span className="font-semibold text-green-600">+3</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">AI Resolved</span>
                </div>
                <span className="font-semibold text-purple-600">18.2K</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/10">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-600" />
                  <span className="text-sm">Emails Sent</span>
                </div>
                <span className="font-semibold text-cyan-600">4.5K</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                  <span className="text-sm">Upgrades</span>
                </div>
                <span className="font-semibold text-primary">2</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Feature Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Client Feature Performance</CardTitle>
                  <CardDescription>Bookings, calls, and marketing metrics by client</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href="/admin/bookings">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Calendar className="h-4 w-4" />
                      Bookings
                    </Button>
                  </Link>
                  <Link href="/admin/call-center">
                    <Button variant="outline" size="sm" className="gap-1">
                      <PhoneCall className="h-4 w-4" />
                      Calls
                    </Button>
                  </Link>
                  <Link href="/admin/marketing">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Megaphone className="h-4 w-4" />
                      Marketing
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Bookings
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <PhoneCall className="h-4 w-4" />
                          Calls
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Megaphone className="h-4 w-4" />
                          Campaigns
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" />
                          Open Rate
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Call Resolution
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminBookingStats.map((booking, index) => {
                      const callData = adminCallStats.find(c => c.clientId === booking.clientId);
                      const campaignData = adminCampaignStats.find(c => c.clientId === booking.clientId);
                      return (
                        <tr key={booking.clientId} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                                {booking.clientName.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="font-medium">{booking.clientName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-semibold">{booking.totalBookings}</span>
                              <span className="text-xs text-muted-foreground">{booking.pendingBookings} pending</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-semibold">{callData?.totalCalls || 0}</span>
                              <span className="text-xs text-muted-foreground">{callData?.missedCalls || 0} missed</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-semibold">{campaignData?.totalCampaigns || 0}</span>
                              <span className="text-xs text-muted-foreground">{campaignData?.activeCampaigns || 0} active</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant="secondary" className={`${
                              (campaignData?.avgOpenRate || 0) >= 40
                                ? 'bg-green-500/10 text-green-600'
                                : 'bg-yellow-500/10 text-yellow-600'
                            }`}>
                              {campaignData?.avgOpenRate.toFixed(1) || 0}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant="secondary" className={`${
                              (callData?.resolutionRate || 0) >= 90
                                ? 'bg-green-500/10 text-green-600'
                                : (callData?.resolutionRate || 0) >= 80
                                  ? 'bg-yellow-500/10 text-yellow-600'
                                  : 'bg-red-500/10 text-red-600'
                            }`}>
                              {callData?.resolutionRate || 0}%
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
