'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Megaphone,
  Send,
  Eye,
  MousePointer,
  Users,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Mail,
  MessageSquare,
  BarChart3,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { adminCampaignStats, getAdminCampaignSummary } from '@/lib/mockData';

const campaignSummary = getAdminCampaignSummary();

// Channel distribution for pie chart
const channelDistribution = [
  { name: 'SMS', value: 55, color: 'hsl(217, 91%, 60%)' },
  { name: 'WhatsApp', value: 45, color: 'hsl(142, 76%, 36%)' },
];

// Campaign performance over time
const campaignTrendData = [
  { name: 'Week 1', delivered: 25000, opened: 9500, clicked: 2800 },
  { name: 'Week 2', delivered: 32000, opened: 12800, clicked: 3600 },
  { name: 'Week 3', delivered: 28000, opened: 11200, clicked: 3200 },
  { name: 'Week 4', delivered: 38000, opened: 15600, clicked: 4800 },
];

// Top performing campaigns
const topCampaigns = [
  { name: 'Summer Sale Blast', client: 'Fashion Hub', openRate: 48.2, clickRate: 15.8, status: 'completed' },
  { name: 'New Product Launch', client: 'TechStart Inc', openRate: 44.5, clickRate: 12.3, status: 'active' },
  { name: 'Loyalty Rewards', client: 'Demo Company', openRate: 42.1, clickRate: 11.5, status: 'completed' },
  { name: 'Flash Sale Alert', client: 'Fashion Hub', openRate: 39.8, clickRate: 10.2, status: 'completed' },
];

const stats = [
  {
    label: 'Total Campaigns',
    value: campaignSummary.totalCampaigns.toString(),
    change: '+28%',
    icon: Megaphone,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    label: 'Messages Delivered',
    value: (campaignSummary.totalDelivered / 1000).toFixed(0) + 'K',
    change: '+42%',
    icon: Send,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'Avg Open Rate',
    value: campaignSummary.avgOpenRate + '%',
    change: '+5.2%',
    icon: Eye,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    label: 'Avg Click Rate',
    value: campaignSummary.avgClickRate + '%',
    change: '+3.8%',
    icon: MousePointer,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
];

export default function AdminMarketingOverview() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Megaphone className="h-6 w-6" />
              Marketing Overview
            </h2>
            <p className="text-muted-foreground">Aggregate marketing campaign metrics across all clients</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Dashboard
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Performance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Campaign Performance Trend</CardTitle>
                <CardDescription>Delivery, open, and click metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={campaignTrendData}>
                      <defs>
                        <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
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
                        tickFormatter={(value) => (value / 1000) + 'K'}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [value.toLocaleString(), '']}
                      />
                      <Area
                        type="monotone"
                        dataKey="delivered"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorDelivered)"
                        name="Delivered"
                      />
                      <Area
                        type="monotone"
                        dataKey="opened"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOpened)"
                        name="Opened"
                      />
                      <Line
                        type="monotone"
                        dataKey="clicked"
                        stroke="hsl(330, 81%, 60%)"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(330, 81%, 60%)', strokeWidth: 0, r: 4 }}
                        name="Clicked"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-muted-foreground">Opened</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-pink-500" />
                    <span className="text-sm text-muted-foreground">Clicked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Channel Distribution and Top Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Channel Distribution */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Channel Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {channelDistribution.map((channel, index) => (
                    <div key={index} className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {channel.name === 'SMS' ? (
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-500" />
                          )}
                          <span className="text-sm font-medium">{channel.name}</span>
                        </div>
                        <span className="text-sm font-bold">{channel.value}%</span>
                      </div>
                      <Progress value={channel.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Campaigns */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Performing Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCampaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <Badge variant="secondary" className={`text-xs ${
                          campaign.status === 'active'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-gray-500/10 text-gray-600'
                        }`}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{campaign.client}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Open</p>
                        <p className="text-sm font-semibold text-blue-600">{campaign.openRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Click</p>
                        <p className="text-sm font-semibold text-pink-600">{campaign.clickRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Client Marketing Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Client Marketing Performance</CardTitle>
              <CardDescription>Detailed marketing metrics by client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Campaigns</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Active</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Recipients</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Delivered</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" />
                          Open Rate
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <MousePointer className="h-4 w-4" />
                          Click Rate
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminCampaignStats.map((client) => (
                      <tr key={client.clientId} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600 font-medium text-xs">
                              {client.clientName.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium">{client.clientName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">{client.totalCampaigns}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                            {client.activeCampaigns}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center text-muted-foreground">
                          {(client.totalRecipients / 1000).toFixed(1)}K
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium">{(client.totalDelivered / 1000).toFixed(1)}K</span>
                            <span className="text-xs text-muted-foreground">
                              {((client.totalDelivered / client.totalRecipients) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className={`${
                            client.avgOpenRate >= 40
                              ? 'bg-green-500/10 text-green-600'
                              : client.avgOpenRate >= 30
                                ? 'bg-yellow-500/10 text-yellow-600'
                                : 'bg-red-500/10 text-red-600'
                          }`}>
                            {client.avgOpenRate.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className={`${
                            client.avgClickRate >= 10
                              ? 'bg-green-500/10 text-green-600'
                              : client.avgClickRate >= 5
                                ? 'bg-yellow-500/10 text-yellow-600'
                                : 'bg-red-500/10 text-red-600'
                          }`}>
                            {client.avgClickRate.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Marketing Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border/50 bg-gradient-to-r from-pink-500/5 via-transparent to-purple-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Marketing Performance Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Fashion Hub leads with the highest engagement rates across all campaigns
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{campaignSummary.avgOpenRate}%</p>
                    <p className="text-xs text-muted-foreground">Avg Open Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-pink-600">{campaignSummary.avgClickRate}%</p>
                    <p className="text-xs text-muted-foreground">Avg Click Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{(campaignSummary.totalDelivered / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Total Delivered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{campaignSummary.activeCampaigns}</p>
                    <p className="text-xs text-muted-foreground">Active Campaigns</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
