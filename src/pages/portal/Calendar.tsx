"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Plus,
  User,
  Video,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Booking {
  id: string;
  title: string;
  customerName: string;
  customerPhone: string;
  date: Date;
  time: string;
  duration: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  type: "in-person" | "virtual";
  notes?: string;
}

const mockBookings: Booking[] = [
  {
    id: "1",
    title: "Hair Consultation",
    customerName: "Amara Okafor",
    customerPhone: "+1 (555) 123-4567",
    date: new Date(),
    time: "10:00 AM",
    duration: 30,
    status: "confirmed",
    type: "in-person",
  },
  {
    id: "2",
    title: "Dental Checkup",
    customerName: "Chidi Nwosu",
    customerPhone: "+1 (555) 234-5678",
    date: new Date(),
    time: "2:00 PM",
    duration: 45,
    status: "pending",
    type: "in-person",
  },
  {
    id: "3",
    title: "Strategy Call",
    customerName: "Fatima Bello",
    customerPhone: "+1 (555) 345-6789",
    date: addDays(new Date(), 1),
    time: "11:00 AM",
    duration: 60,
    status: "confirmed",
    type: "virtual",
    notes: "Discuss Q2 marketing strategy",
  },
  {
    id: "4",
    title: "Lash Appointment",
    customerName: "Ngozi Adeyemi",
    customerPhone: "+1 (555) 456-7890",
    date: addDays(new Date(), 2),
    time: "3:00 PM",
    duration: 90,
    status: "confirmed",
    type: "in-person",
  },
];

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  confirmed: "bg-green-500/10 text-green-600 border-green-200",
  cancelled: "bg-red-500/10 text-red-600 border-red-200",
  completed: "bg-blue-500/10 text-blue-600 border-blue-200",
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNewBooking, setShowNewBooking] = useState(false);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const todaysBookings = bookings.filter((b) => isSameDay(b.date, selectedDate));
  const upcomingBookings = bookings
    .filter((b) => b.date >= new Date() && b.status !== "cancelled")
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const handleStatusChange = (bookingId: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
    toast.success(`Booking ${status}`);
  };

  const stats = {
    today: bookings.filter((b) => isSameDay(b.date, new Date())).length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    thisWeek: bookings.filter(
      (b) => b.date >= weekStart && b.date <= addDays(weekStart, 6)
    ).length,
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-6 w-6" />
              Calendar
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage your appointments and bookings
            </p>
          </div>
          <Button
            onClick={() => setShowNewBooking(true)}
            className="gradient-primary text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today", value: stats.today, color: "text-primary" },
            { label: "Pending", value: stats.pending, color: "text-yellow-500" },
            { label: "Confirmed", value: stats.confirmed, color: "text-green-500" },
            { label: "This Week", value: stats.thisWeek, color: "text-blue-500" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2 space-y-4">
            {/* Week Navigation */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {format(selectedDate, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map((day) => {
                    const dayBookings = bookings.filter((b) =>
                      isSameDay(b.date, day)
                    );
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <button
                        key={day.toString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "p-3 rounded-xl text-center transition-all",
                          isSelected
                            ? "bg-primary text-white"
                            : isToday
                              ? "bg-primary/10"
                              : "hover:bg-secondary"
                        )}
                      >
                        <p className="text-xs font-medium mb-1">
                          {format(day, "EEE")}
                        </p>
                        <p className="text-lg font-bold">{format(day, "d")}</p>
                        {dayBookings.length > 0 && (
                          <div className="flex justify-center gap-0.5 mt-1">
                            {dayBookings.slice(0, 3).map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  isSelected ? "bg-white/70" : "bg-primary"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Day's Bookings */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {format(selectedDate, "EEEE, MMMM d")} ({todaysBookings.length}{" "}
                    bookings)
                  </h3>
                  {todaysBookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No bookings for this day</p>
                    </div>
                  ) : (
                    todaysBookings.map((booking) => (
                      <div
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className="p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{booking.title}</h4>
                              <Badge
                                variant="outline"
                                className={statusColors[booking.status]}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {booking.customerName}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.time} ({booking.duration} min)
                              </span>
                              <span className="flex items-center gap-1">
                                {booking.type === "virtual" ? (
                                  <Video className="h-3 w-3" />
                                ) : (
                                  <MapPin className="h-3 w-3" />
                                )}
                                {booking.type}
                              </span>
                            </div>
                          </div>
                          {booking.status === "pending" && (
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:bg-green-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(booking.id, "confirmed");
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:bg-red-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(booking.id, "cancelled");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Bookings Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{booking.title}</p>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", statusColors[booking.status])}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {booking.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(booking.date, "MMM d")} at {booking.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Details Dialog */}
        <Dialog
          open={!!selectedBooking}
          onOpenChange={() => setSelectedBooking(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedBooking?.title}</DialogTitle>
              <DialogDescription>
                Booking details and customer information
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Customer</Label>
                    <p className="font-medium">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {selectedBooking.customerPhone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date & Time</Label>
                    <p className="font-medium">
                      {format(selectedBooking.date, "MMM d, yyyy")} at{" "}
                      {selectedBooking.time}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Duration</Label>
                    <p className="font-medium">{selectedBooking.duration} minutes</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium capitalize">{selectedBooking.type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge
                      variant="outline"
                      className={statusColors[selectedBooking.status]}
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
                {selectedBooking.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="text-sm mt-1">{selectedBooking.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  {selectedBooking.status === "pending" && (
                    <>
                      <Button
                        className="flex-1"
                        onClick={() => {
                          handleStatusChange(selectedBooking.id, "confirmed");
                          setSelectedBooking(null);
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          handleStatusChange(selectedBooking.id, "cancelled");
                          setSelectedBooking(null);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {selectedBooking.status === "confirmed" && (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, "completed");
                        setSelectedBooking(null);
                      }}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* New Booking Dialog */}
        <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Booking</DialogTitle>
              <DialogDescription>
                Create a new appointment manually
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Service/Title</Label>
                <Input placeholder="e.g., Consultation, Haircut" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <Input placeholder="Full name" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select defaultValue="in-person">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In Person</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Notes (Optional)</Label>
                <Textarea placeholder="Any additional notes..." />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewBooking(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gradient-primary text-white"
                  onClick={() => {
                    toast.success("Booking created successfully");
                    setShowNewBooking(false);
                  }}
                >
                  Create Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}
