"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Inbox,
  Mail,
  MailOpen,
  MessageSquare,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Send,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Chart data for conversations
const chartData = [
  { name: "Mon", conversations: 45, resolved: 38 },
  { name: "Tue", conversations: 52, resolved: 48 },
  { name: "Wed", conversations: 61, resolved: 55 },
  { name: "Thu", conversations: 48, resolved: 42 },
  { name: "Fri", conversations: 73, resolved: 68 },
  { name: "Sat", conversations: 38, resolved: 35 },
  { name: "Sun", conversations: 29, resolved: 27 },
];

// Recent conversations mock data
const recentConversations = [
  {
    id: "1",
    name: "Amara Okafor",
    initials: "AO",
    message: "Hi! I saw your post about the skincare bundle...",
    time: "2m ago",
    channel: "instagram",
    unread: true,
  },
  {
    id: "2",
    name: "John Smith",
    initials: "JS",
    message: "Your appointment is confirmed for tomorrow at 2pm",
    time: "10m ago",
    channel: "sms",
    unread: false,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    initials: "SJ",
    message: "I've been waiting for my refund for 2 weeks now!",
    time: "15m ago",
    channel: "whatsapp",
    unread: true,
  },
  {
    id: "4",
    name: "Mike Brown",
    initials: "MB",
    message: "Voice call - Billing inquiry",
    time: "30m ago",
    channel: "voice",
    unread: false,
  },
];

// Recent emails mock data
const recentEmails = [
  {
    id: "1",
    name: "David Chen",
    initials: "DC",
    email: "david.chen@example.com",
    subject: "Re: Order #12345 - Shipping Update",
    preview: "Thank you for the update. I'll be available...",
    time: "5m ago",
    type: "inbound" as const,
    unread: true,
  },
  {
    id: "2",
    name: "Emma Wilson",
    initials: "EW",
    email: "emma.wilson@example.com",
    subject: "Your Invoice #INV-2024-001",
    preview: "Please find attached your invoice for...",
    time: "20m ago",
    type: "outbound" as const,
    unread: false,
  },
  {
    id: "3",
    name: "James Miller",
    initials: "JM",
    email: "james.miller@example.com",
    subject: "Question about your services",
    preview: "Hi, I was wondering if you offer...",
    time: "45m ago",
    type: "inbound" as const,
    unread: true,
  },
  {
    id: "4",
    name: "Lisa Thompson",
    initials: "LT",
    email: "lisa.t@example.com",
    subject: "Appointment Confirmation",
    preview: "Your appointment has been confirmed for...",
    time: "1h ago",
    type: "outbound" as const,
    unread: false,
  },
];

// Upcoming appointments
const upcomingAppointments = [
  {
    id: "1",
    title: "Hair Consultation",
    customer: "Amara Okafor",
    time: "10:00 AM",
    type: "in-person",
  },
  {
    id: "2",
    title: "Dental Checkup",
    customer: "Chidi Nwosu",
    time: "2:00 PM",
    type: "in-person",
  },
  {
    id: "3",
    title: "Strategy Call",
    customer: "Fatima Bello",
    time: "Tomorrow, 11:00 AM",
    type: "virtual",
  },
];

// Recent calls
const recentCalls = [
  {
    id: "1",
    name: "John Smith",
    number: "+1234567890",
    type: "inbound",
    duration: "4:05",
    time: "2:30 PM",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    number: "+1234567891",
    type: "outbound",
    duration: "3:00",
    time: "1:15 PM",
  },
  {
    id: "3",
    name: "Unknown",
    number: "+1234567892",
    type: "missed",
    duration: "0:00",
    time: "12:45 PM",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <ClientLayout>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Good morning!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/portal/calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Conversations
                  </p>
                  <p className="text-2xl font-bold">346</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+12%</span>
                    <span className="text-xs text-muted-foreground">
                      vs last week
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Emails
                  </p>
                  <p className="text-2xl font-bold">156</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+18%</span>
                    <span className="text-xs text-muted-foreground">
                      vs last week
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-cyan-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Appointments
                  </p>
                  <p className="text-2xl font-bold">28</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+8%</span>
                    <span className="text-xs text-muted-foreground">
                      vs last week
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Calls
                  </p>
                  <p className="text-2xl font-bold">89</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+15%</span>
                    <span className="text-xs text-muted-foreground">
                      vs last week
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Customers
                  </p>
                  <p className="text-2xl font-bold">1,247</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+23%</span>
                    <span className="text-xs text-muted-foreground">
                      vs last week
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-border/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Conversation Analytics
                  </CardTitle>
                  <CardDescription>
                    Weekly overview of conversations
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  This Week
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorConversations"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorResolved"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="conversations"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorConversations)"
                        name="Total"
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorResolved)"
                        name="Resolved"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]" />
                    <span className="text-sm text-muted-foreground">
                      Resolved
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Quick Actions
                </CardTitle>
                <CardDescription>Frequently used features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/portal/inbox">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Inbox className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">View Inbox</p>
                        <p className="text-xs text-muted-foreground">
                          5 unread messages
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link href="/portal/calendar">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Calendar</p>
                        <p className="text-xs text-muted-foreground">
                          3 appointments today
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link href="/portal/call-center">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Call Center</p>
                        <p className="text-xs text-muted-foreground">
                          2 missed calls
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link href="/portal/marketing">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Marketing</p>
                        <p className="text-xs text-muted-foreground">
                          1 campaign active
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Grid: Recent Conversations, Emails, Appointments, Calls */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Recent Conversations */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Recent Conversations
                  </CardTitle>
                  <CardDescription>Latest messages</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/inbox">
                    View all
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {conv.initials}
                      </div>
                      {conv.unread && (
                        <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {conv.name}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.message}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Emails */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Recent Emails
                  </CardTitle>
                  <CardDescription>Inbox & sent</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/inbox?channel=email">
                    View all
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentEmails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                          email.type === "inbound"
                            ? "bg-cyan-500/10"
                            : "bg-emerald-500/10"
                        }`}
                      >
                        {email.type === "inbound" ? (
                          <MailOpen className="h-4 w-4 text-cyan-500" />
                        ) : (
                          <Send className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                      {email.unread && (
                        <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-cyan-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {email.name}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {email.time}
                        </span>
                      </div>
                      <p className="text-xs font-medium truncate text-muted-foreground">
                        {email.subject}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>Today's schedule</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/calendar">
                    View all
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{apt.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {apt.customer}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {apt.time}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        apt.type === "virtual"
                          ? "bg-purple-500/10 text-purple-600"
                          : "bg-green-500/10 text-green-600"
                      }
                    >
                      {apt.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Calls */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Recent Calls
                  </CardTitle>
                  <CardDescription>Call history</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/call-center">
                    View all
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        call.type === "inbound"
                          ? "bg-green-500/10"
                          : call.type === "outbound"
                            ? "bg-blue-500/10"
                            : "bg-red-500/10"
                      }`}
                    >
                      {call.type === "inbound" ? (
                        <PhoneIncoming className="h-4 w-4 text-green-500" />
                      ) : call.type === "outbound" ? (
                        <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Phone className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{call.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {call.number}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {call.time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {call.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Performance Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Assistant Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Your AI handled 89% of conversations automatically this
                      week
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-2xl font-bold">312</p>
                    <p className="text-xs text-muted-foreground">
                      Auto-resolved
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">34</p>
                    <p className="text-xs text-muted-foreground">Escalated</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.8s</p>
                    <p className="text-xs text-muted-foreground">Avg response</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </ClientLayout>
  );
}
