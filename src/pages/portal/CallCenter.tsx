"use client";

import { ClientLayout } from "@/components/layouts/ClientLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Delete,
  Mic,
  MicOff,
  MoreVertical,
  Pause,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  Play,
  User,
  UserPlus,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CallHistoryStatus = "completed" | "missed" | "no_answer";

interface CallHistoryItem {
  id: string;
  type: CallDirection;
  status: CallHistoryStatus;
  callerName: string;
  callerNumber: string;
  duration: number;
  timestamp: string;
  notes: string | null;
}

// Mock call history
const mockCallHistory: CallHistoryItem[] = [
  {
    id: "1",
    type: "inbound",
    status: "completed",
    callerName: "John Smith",
    callerNumber: "+1234567890",
    duration: 245,
    timestamp: "2026-04-11T14:30:00",
    notes: "Customer inquiry about pricing",
  },
  {
    id: "2",
    type: "outbound",
    status: "completed",
    callerName: "Sarah Johnson",
    callerNumber: "+1234567891",
    duration: 180,
    timestamp: "2026-04-11T13:15:00",
    notes: "Follow-up on booking confirmation",
  },
  {
    id: "3",
    type: "inbound",
    status: "missed",
    callerName: "Unknown",
    callerNumber: "+1234567892",
    duration: 0,
    timestamp: "2026-04-11T12:45:00",
    notes: null,
  },
  {
    id: "4",
    type: "inbound",
    status: "completed",
    callerName: "Mike Brown",
    callerNumber: "+1234567893",
    duration: 420,
    timestamp: "2026-04-11T11:00:00",
    notes: "Support ticket discussion",
  },
  {
    id: "5",
    type: "outbound",
    status: "no_answer",
    callerName: "Emily Davis",
    callerNumber: "+1234567894",
    duration: 0,
    timestamp: "2026-04-11T10:30:00",
    notes: "Attempted callback - no answer",
  },
];

type CallStatus = "idle" | "ringing" | "connected" | "on_hold";
type CallDirection = "inbound" | "outbound";

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

export default function CallCenter() {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [callDirection, setCallDirection] = useState<CallDirection | null>(null);
  const [dialNumber, setDialNumber] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callHistory, setCallHistory] = useState(mockCallHistory);
  const [incomingCall, setIncomingCall] = useState<{
    name: string;
    number: string;
  } | null>(null);

  // Simulate incoming call for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (callStatus === "idle" && Math.random() > 0.7) {
        setIncomingCall({
          name: "Demo Caller",
          number: "+1555000123",
        });
        setCallStatus("ringing");
        setCallDirection("inbound");
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [callStatus]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const handleDialPad = useCallback((digit: string) => {
    if (callStatus === "idle") {
      setDialNumber((prev) => prev + digit);
    }
  }, [callStatus]);

  const handleBackspace = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialNumber.length >= 10) {
      setCallStatus("ringing");
      setCallDirection("outbound");
      // Simulate connection after 2 seconds
      setTimeout(() => {
        setCallStatus("connected");
      }, 2000);
    }
  };

  const handleAcceptCall = () => {
    setCallStatus("connected");
    setCallDuration(0);
  };

  const handleRejectCall = () => {
    setCallStatus("idle");
    setIncomingCall(null);
    setCallDirection(null);
  };

  const handleEndCall = () => {
    // Add to history
    if (callDirection && (callStatus === "connected" || callStatus === "ringing")) {
      const newCall: CallHistoryItem = {
        id: Date.now().toString(),
        type: callDirection,
        status: callStatus === "connected" ? "completed" : "missed",
        callerName: incomingCall?.name || "Outgoing Call",
        callerNumber: incomingCall?.number || dialNumber,
        duration: callDuration,
        timestamp: new Date().toISOString(),
        notes: null,
      };
      setCallHistory([newCall, ...callHistory]);
    }

    setCallStatus("idle");
    setCallDirection(null);
    setCallDuration(0);
    setIncomingCall(null);
    setDialNumber("");
    setIsMuted(false);
  };

  const handleHold = () => {
    if (callStatus === "connected") {
      setCallStatus("on_hold");
    } else if (callStatus === "on_hold") {
      setCallStatus("connected");
    }
  };

  const todayCalls = callHistory.filter(
    (c) => new Date(c.timestamp).toDateString() === new Date().toDateString()
  );
  const missedCalls = callHistory.filter((c) => c.status === "missed" || c.status === "no_answer");
  const totalDuration = callHistory.reduce((acc, c) => acc + c.duration, 0);

  const dialPadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Call Center</h1>
          <p className="text-muted-foreground">Handle inbound and outbound voice calls</p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Calls</p>
                  <p className="text-3xl font-black">{todayCalls.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <PhoneCall className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Missed Calls</p>
                  <p className="text-3xl font-black">{missedCalls.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <PhoneMissed className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Talk Time</p>
                  <p className="text-3xl font-black">{Math.floor(totalDuration / 60)}m</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-xl font-black capitalize">
                    {callStatus === "idle" ? "Available" : callStatus.replace("_", " ")}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    callStatus === "idle"
                      ? "bg-green-500/10"
                      : callStatus === "ringing"
                      ? "bg-yellow-500/10 animate-pulse"
                      : callStatus === "connected"
                      ? "bg-blue-500/10"
                      : "bg-orange-500/10"
                  }`}
                >
                  <Phone
                    className={`h-6 w-6 ${
                      callStatus === "idle"
                        ? "text-green-500"
                        : callStatus === "ringing"
                        ? "text-yellow-500"
                        : callStatus === "connected"
                        ? "text-blue-500"
                        : "text-orange-500"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dialer Card */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Dialer</CardTitle>
            <CardDescription>
              Make outbound calls or handle incoming calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Active Call Display */}
            {callStatus !== "idle" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
              >
                <div className="text-center">
                  {callStatus === "ringing" && callDirection === "inbound" ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                        <PhoneIncoming className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-lg font-bold">{incomingCall?.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {incomingCall?.number}
                      </p>
                      <p className="text-sm text-primary animate-pulse mb-4">Incoming call...</p>
                      <div className="flex justify-center gap-4">
                        <Button
                          size="lg"
                          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600"
                          onClick={handleAcceptCall}
                        >
                          <Phone className="h-6 w-6" />
                        </Button>
                        <Button
                          size="lg"
                          variant="destructive"
                          className="rounded-full w-14 h-14"
                          onClick={handleRejectCall}
                        >
                          <PhoneOff className="h-6 w-6" />
                        </Button>
                      </div>
                    </>
                  ) : callStatus === "ringing" && callDirection === "outbound" ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <PhoneOutgoing className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                      <p className="text-lg font-bold">{dialNumber}</p>
                      <p className="text-sm text-primary animate-pulse mb-4">Calling...</p>
                      <Button
                        size="lg"
                        variant="destructive"
                        className="rounded-full w-14 h-14"
                        onClick={handleEndCall}
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Phone className="h-8 w-8 text-green-500" />
                      </div>
                      <p className="text-lg font-bold">
                        {callDirection === "inbound" ? incomingCall?.name : dialNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {callDirection === "inbound" ? incomingCall?.number : "Outbound Call"}
                      </p>
                      <p className="text-2xl font-mono font-bold mt-2 mb-4">
                        {formatDuration(callDuration)}
                      </p>
                      {callStatus === "on_hold" && (
                        <Badge className="mb-4 bg-orange-500/10 text-orange-500">On Hold</Badge>
                      )}
                      <div className="flex justify-center gap-3">
                        <Button
                          size="icon"
                          variant={isMuted ? "default" : "outline"}
                          className="rounded-full w-12 h-12"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                        <Button
                          size="icon"
                          variant={callStatus === "on_hold" ? "default" : "outline"}
                          className="rounded-full w-12 h-12"
                          onClick={handleHold}
                        >
                          {callStatus === "on_hold" ? (
                            <Play className="h-5 w-5" />
                          ) : (
                            <Pause className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant={isSpeakerOn ? "default" : "outline"}
                          className="rounded-full w-12 h-12"
                          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                        >
                          {isSpeakerOn ? (
                            <Volume2 className="h-5 w-5" />
                          ) : (
                            <VolumeX className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full w-12 h-12"
                          title="Transfer Call"
                        >
                          <PhoneForwarded className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="rounded-full w-12 h-12"
                          onClick={handleEndCall}
                        >
                          <PhoneOff className="h-5 w-5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Dial Pad */}
            {callStatus === "idle" && (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Input
                      value={dialNumber}
                      onChange={(e) => setDialNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="text-center text-2xl font-mono h-14 pr-12"
                    />
                    {dialNumber && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={handleBackspace}
                      >
                        <Delete className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {dialPadButtons.flat().map((digit) => (
                    <Button
                      key={digit}
                      variant="outline"
                      className="h-14 text-xl font-bold"
                      onClick={() => handleDialPad(digit)}
                    >
                      {digit}
                    </Button>
                  ))}
                </div>

                <Button
                  className="w-full h-14 text-lg font-bold gap-2"
                  onClick={handleCall}
                  disabled={dialNumber.length < 10}
                >
                  <Phone className="h-5 w-5" />
                  Call
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Call History */}
        <Card>
          <CardHeader>
            <CardTitle>Call History</CardTitle>
            <CardDescription>Recent inbound and outbound calls</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="inbound">Inbound</TabsTrigger>
                <TabsTrigger value="outbound">Outbound</TabsTrigger>
                <TabsTrigger value="missed">Missed</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <CallHistoryList calls={callHistory} />
              </TabsContent>
              <TabsContent value="inbound">
                <CallHistoryList calls={callHistory.filter((c) => c.type === "inbound")} />
              </TabsContent>
              <TabsContent value="outbound">
                <CallHistoryList calls={callHistory.filter((c) => c.type === "outbound")} />
              </TabsContent>
              <TabsContent value="missed">
                <CallHistoryList
                  calls={callHistory.filter(
                    (c) => c.status === "missed" || c.status === "no_answer"
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </div>
      </div>
    </ClientLayout>
  );
}

function CallHistoryList({
  calls,
}: {
  calls: CallHistoryItem[];
}) {
  if (calls.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No calls to display
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {calls.map((call) => (
          <div
            key={call.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback
                className={`${
                  call.status === "missed" || call.status === "no_answer"
                    ? "bg-red-500/10 text-red-500"
                    : call.type === "inbound"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {call.type === "inbound" ? (
                  call.status === "missed" ? (
                    <PhoneMissed className="h-5 w-5" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5" />
                  )
                ) : call.status === "no_answer" ? (
                  <PhoneMissed className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{call.callerName}</p>
              <p className="text-sm text-muted-foreground">{call.callerNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {call.duration > 0 ? formatDuration(call.duration) : "--:--"}
              </p>
              <p className="text-xs text-muted-foreground">{formatTime(call.timestamp)}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost">
                <Phone className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    toast.success(`${call.callerName} saved to contacts`, {
                      description: "Go to Contacts to view and edit",
                      action: {
                        label: "View",
                        onClick: () => window.location.href = "/portal/contacts"
                      }
                    });
                  }}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Save to Contacts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Back
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
