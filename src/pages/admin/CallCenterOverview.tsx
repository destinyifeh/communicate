'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Timer,
  Headphones,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { adminCallStats, getAdminCallSummary } from '@/lib/mockData';

const callSummary = getAdminCallSummary();

// Call type distribution for pie chart
const callTypeDistribution = [
  { name: 'Inbound', value: callSummary.inboundCalls, color: 'hsl(142, 76%, 36%)' },
  { name: 'Outbound', value: callSummary.outboundCalls, color: 'hsl(217, 91%, 60%)' },
  { name: 'Missed', value: callSummary.missedCalls, color: 'hsl(0, 84%, 60%)' },
];

// Hourly call volume data
const hourlyCallData = [
  { hour: '9AM', calls: 45 },
  { hour: '10AM', calls: 78 },
  { hour: '11AM', calls: 92 },
  { hour: '12PM', calls: 65 },
  { hour: '1PM', calls: 48 },
  { hour: '2PM', calls: 89 },
  { hour: '3PM', calls: 105 },
  { hour: '4PM', calls: 87 },
  { hour: '5PM', calls: 62 },
];

// Daily call trend
const dailyCallTrend = [
  { name: 'Mon', inbound: 156, outbound: 78 },
  { name: 'Tue', inbound: 189, outbound: 95 },
  { name: 'Wed', inbound: 165, outbound: 82 },
  { name: 'Thu', inbound: 201, outbound: 108 },
  { name: 'Fri', inbound: 178, outbound: 92 },
  { name: 'Sat', inbound: 89, outbound: 45 },
  { name: 'Sun', inbound: 56, outbound: 28 },
];

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const stats = [
  {
    label: 'Total Calls',
    value: callSummary.totalCalls.toLocaleString(),
    change: '+15%',
    icon: PhoneCall,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    label: 'Inbound Calls',
    value: callSummary.inboundCalls.toLocaleString(),
    change: '+12%',
    icon: PhoneIncoming,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'Avg Duration',
    value: formatDuration(callSummary.avgCallDuration),
    change: '+8s',
    icon: Timer,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    label: 'Resolution Rate',
    value: callSummary.avgResolutionRate + '%',
    change: '+2.5%',
    icon: CheckCircle,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
];

export default function AdminCallCenterOverview() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Phone className="h-6 w-6" />
              Call Center Overview
            </h2>
            <p className="text-muted-foreground">Aggregate call center metrics across all clients</p>
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
          {/* Daily Call Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Daily Call Volume</CardTitle>
                <CardDescription>Inbound vs outbound calls per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyCallTrend}>
                      <defs>
                        <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="inbound"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorInbound)"
                        name="Inbound"
                      />
                      <Area
                        type="monotone"
                        dataKey="outbound"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOutbound)"
                        name="Outbound"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Inbound</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-muted-foreground">Outbound</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Call Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Call Type Distribution</CardTitle>
                <CardDescription>Breakdown by call type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={callTypeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {callTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [value + ' calls', 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {callTypeDistribution.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Hourly Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
              <CardDescription>Call volume distribution throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyCallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="hour"
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
                      formatter={(value: number) => [value + ' calls', 'Calls']}
                    />
                    <Bar
                      dataKey="calls"
                      fill="hsl(25, 95%, 53%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Client Call Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Client Call Performance</CardTitle>
              <CardDescription>Detailed call metrics by client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Total Calls</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <PhoneIncoming className="h-4 w-4 text-green-500" />
                          Inbound
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                          Outbound
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <PhoneMissed className="h-4 w-4 text-red-500" />
                          Missed
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Avg Duration</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Avg Wait</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Resolution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminCallStats.map((client) => (
                      <tr key={client.clientId} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 font-medium text-xs">
                              {client.clientName.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium">{client.clientName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">{client.totalCalls}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                            {client.inboundCalls}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                            {client.outboundCalls}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                            {client.missedCalls}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {formatDuration(client.avgCallDuration)}
                        </td>
                        <td className="py-3 px-4 text-center text-muted-foreground">
                          {client.avgWaitTime}s
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className={`${
                            client.resolutionRate >= 90
                              ? 'bg-green-500/10 text-green-600'
                              : client.resolutionRate >= 80
                                ? 'bg-yellow-500/10 text-yellow-600'
                                : 'bg-red-500/10 text-red-600'
                          }`}>
                            {client.resolutionRate}%
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

        {/* Call Center Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border/50 bg-gradient-to-r from-orange-500/5 via-transparent to-green-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Center Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Peak call hours are between 2PM-4PM with an average of 97 calls/hour
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{callSummary.avgResolutionRate}%</p>
                    <p className="text-xs text-muted-foreground">Avg Resolution</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{callSummary.missedCalls}</p>
                    <p className="text-xs text-muted-foreground">Missed Calls</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatDuration(callSummary.avgCallDuration)}</p>
                    <p className="text-xs text-muted-foreground">Avg Duration</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{callSummary.totalClients}</p>
                    <p className="text-xs text-muted-foreground">Active Clients</p>
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
