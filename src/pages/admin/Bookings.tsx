'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { adminBookingStats, getAdminBookingSummary } from '@/lib/mockData';

const bookingSummary = getAdminBookingSummary();

// Booking status distribution for pie chart
const statusDistribution = [
  { name: 'Completed', value: bookingSummary.completedBookings, color: 'hsl(142, 76%, 36%)' },
  { name: 'Confirmed', value: bookingSummary.confirmedBookings, color: 'hsl(217, 91%, 60%)' },
  { name: 'Pending', value: bookingSummary.pendingBookings, color: 'hsl(45, 93%, 47%)' },
  { name: 'Cancelled', value: bookingSummary.cancelledBookings, color: 'hsl(0, 84%, 60%)' },
];

// Weekly booking trend data
const weeklyTrendData = [
  { name: 'Mon', bookings: 145 },
  { name: 'Tue', bookings: 168 },
  { name: 'Wed', bookings: 152 },
  { name: 'Thu', bookings: 189 },
  { name: 'Fri', bookings: 201 },
  { name: 'Sat', bookings: 98 },
  { name: 'Sun', bookings: 49 },
];

const stats = [
  {
    label: 'Total Bookings',
    value: bookingSummary.totalBookings.toLocaleString(),
    change: '+18%',
    icon: Calendar,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    label: 'Pending',
    value: bookingSummary.pendingBookings.toString(),
    change: '-5%',
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    label: 'Completed',
    value: bookingSummary.completedBookings.toLocaleString(),
    change: '+22%',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    label: 'Active Clients',
    value: bookingSummary.totalClients.toString(),
    change: '+2',
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
];

export default function AdminBookings() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Bookings Overview
            </h2>
            <p className="text-muted-foreground">Aggregate booking data across all clients</p>
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
          {/* Weekly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Weekly Booking Trend</CardTitle>
                <CardDescription>Number of bookings per day this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                        formatter={(value: number) => [value + ' bookings', 'Bookings']}
                      />
                      <Bar
                        dataKey="bookings"
                        fill="hsl(217, 91%, 60%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>Breakdown by booking status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [value + ' bookings', 'Count']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {statusDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Client Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Client Booking Performance</CardTitle>
              <CardDescription>Detailed booking metrics by client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Total</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Pending</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Confirmed</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Completed</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Cancelled</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">No-Show Rate</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Avg/Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminBookingStats.map((client) => (
                      <tr key={client.clientId} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-medium text-xs">
                              {client.clientName.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium">{client.clientName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">{client.totalBookings}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                            {client.pendingBookings}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                            {client.confirmedBookings}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                            {client.completedBookings}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                            {client.cancelledBookings}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={client.noShowRate > 5 ? 'text-red-600' : 'text-green-600'}>
                            {client.noShowRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">{client.avgBookingsPerDay.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* No-Show Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border/50 bg-gradient-to-r from-yellow-500/5 via-transparent to-orange-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">No-Show Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Average no-show rate across all clients is {bookingSummary.avgNoShowRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{bookingSummary.avgNoShowRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Avg No-Show Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{bookingSummary.cancelledBookings}</p>
                    <p className="text-xs text-muted-foreground">Total Cancelled</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {((bookingSummary.completedBookings / bookingSummary.totalBookings) * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
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
