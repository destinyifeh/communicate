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
import { contactService } from "@/services/contact.service";
import { voiceService, CallHistoryItem as APICallHistoryItem } from "@/services/voice.service";
import { useTwilioVoice } from "@/hooks/useTwilioVoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Delete,
  Loader2,
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
  UserPlus,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type CallHistoryStatus = "completed" | "missed" | "no_answer" | "in-progress";
type CallDirection = "inbound" | "outbound";

interface CallHistoryItem {
  id: string;
  type: CallDirection;
  status: CallHistoryStatus;
  callerName: string;
  callerNumber: string;
  duration: number;
  timestamp: string;
  notes: string | null;
  callCount?: number;
  totalDuration?: number;
}


const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

// Transform API call history to our format
function transformCallHistory(item: APICallHistoryItem): CallHistoryItem {
  const contactName = item.contact
    ? `${item.contact.firstName || ''} ${item.contact.lastName || ''}`.trim() || 'Unknown'
    : 'Unknown';

  // Get the actual phone number - for outbound calls it's in 'to', for inbound it's in 'from'
  // Also check the phoneNumber field and contact.phone as fallbacks
  const phoneNumber = item.phoneNumber
    || item.contact?.phone
    || (item.direction === 'outbound' ? item.to : item.from)
    || 'Unknown';

  return {
    id: item.id,
    type: item.direction,
    status: item.status as CallHistoryStatus,
    callerName: contactName !== 'Unknown' ? contactName : phoneNumber,
    callerNumber: phoneNumber,
    duration: item.totalDuration || item.duration || 0,
    timestamp: item.timestamp,
    notes: null,
    callCount: item.callCount,
    totalDuration: item.totalDuration,
  };
}

export default function CallCenter() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [dialNumber, setDialNumber] = useState("");
  const [saveContactDialog, setSaveContactDialog] = useState<{
    open: boolean;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  }>({ open: false, phoneNumber: "", firstName: "", lastName: "" });
  const autoDialedRef = useRef(false);
  const pendingCallNumber = searchParams?.get("call");
  const [isPreparingCall, setIsPreparingCall] = useState(false);

  // Use the Twilio Voice hook
  const {
    isReady,
    isInitializing,
    activeCall,
    incomingCall,
    error: voiceError,
    businessPhoneNumber,
    businessName,
    initialize,
    makeCall,
    acceptCall,
    rejectCall,
    hangUp,
    toggleMute,
    toggleHold,
    toggleSpeaker,
    sendDigits,
  } = useTwilioVoice();

  // Initialize voice on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show preparing state when call param is present
  useEffect(() => {
    const callNumber = searchParams?.get("call");
    if (callNumber && !autoDialedRef.current) {
      setIsPreparingCall(true);
      setDialNumber(callNumber);
    }
  }, [searchParams]);

  // Auto-dial when voice is ready
  useEffect(() => {
    const callNumber = searchParams?.get("call");
    if (callNumber && isReady && !activeCall && !autoDialedRef.current) {
      autoDialedRef.current = true;
      // Small delay to ensure UI is ready
      setTimeout(() => {
        makeCall(callNumber);
        setIsPreparingCall(false);
      }, 300);
    }
    // Clear preparing state if voice failed to initialize
    if (!isInitializing && !isReady && isPreparingCall && autoDialedRef.current) {
      setIsPreparingCall(false);
    }
  }, [searchParams, isReady, isInitializing, activeCall, makeCall, isPreparingCall]);

  // Fetch call history with TanStack Query (grouped by phone number)
  const { data: callHistory = [], isLoading } = useQuery({
    queryKey: ["callHistory"],
    queryFn: async () => {
      const response = await voiceService.getCallHistory(50, true);
      if (response.data && response.data.length > 0) {
        return response.data.map(transformCallHistory);
      }
      return [];
    },
    staleTime: 30000,
    refetchInterval: 10000, // Refetch every 10 seconds to show new calls
  });

  const handleDialPad = (digit: string) => {
    if (!activeCall || activeCall.status === 'idle') {
      setDialNumber((prev) => prev + digit);
    } else if (activeCall.status === 'connected') {
      // Send DTMF during active call
      sendDigits(digit);
    }
  };

  const handleBackspace = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (dialNumber.length >= 10) {
      await makeCall(dialNumber);
    } else {
      toast.error("Please enter a valid phone number (at least 10 digits)");
    }
  };

  const handleEndCall = () => {
    // Add to history (optimistic update)
    if (activeCall && (activeCall.status === 'connected' || activeCall.status === 'ringing')) {
      const newCall: CallHistoryItem = {
        id: Date.now().toString(),
        type: activeCall.direction,
        status: activeCall.status === 'connected' ? 'completed' : 'missed',
        callerName: activeCall.direction === 'inbound' ? activeCall.from : 'Outgoing Call',
        callerNumber: activeCall.direction === 'inbound' ? activeCall.from : activeCall.to,
        duration: activeCall.duration,
        timestamp: new Date().toISOString(),
        notes: null,
      };
      queryClient.setQueryData<CallHistoryItem[]>(["callHistory"], (old) =>
        old ? [newCall, ...old] : [newCall]
      );
    }

    hangUp();
    setDialNumber("");
  };

  // Save contact mutation
  const saveContactMutation = useMutation({
    mutationFn: async (data: { phone: string; firstName?: string; lastName?: string }) => {
      return contactService.createContact({
        phone: data.phone,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        source: "manual",
      });
    },
    onSuccess: (_, data) => {
      const name = [data.firstName, data.lastName].filter(Boolean).join(" ") || data.phone;
      toast.success(`${name} saved to contacts`);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["callHistory"] });
      setSaveContactDialog({ open: false, phoneNumber: "", firstName: "", lastName: "" });
    },
    onError: (error) => {
      console.error("Failed to save contact:", error);
      toast.error("Failed to save contact");
    },
  });

  const handleOpenSaveDialog = (call: CallHistoryItem) => {
    setSaveContactDialog({
      open: true,
      phoneNumber: call.callerNumber,
      firstName: "",
      lastName: "",
    });
  };

  const handleSaveContact = () => {
    if (!saveContactDialog.phoneNumber) return;
    saveContactMutation.mutate({
      phone: saveContactDialog.phoneNumber,
      firstName: saveContactDialog.firstName,
      lastName: saveContactDialog.lastName,
    });
  };

  const handleCallBack = async (phoneNumber: string) => {
    setDialNumber(phoneNumber);
    if (phoneNumber.length >= 10 && !activeCall) {
      await makeCall(phoneNumber);
    }
  };

  const todayCalls = callHistory.filter(
    (c:any) => new Date(c.timestamp).toDateString() === new Date().toDateString()
  );
  const missedCalls = callHistory.filter((c:any) => c.status === "missed" || c.status === "no_answer");
  const totalDuration = callHistory.reduce((acc:any, c:any) => acc + c.duration, 0);

  const dialPadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  // Determine display status
  const displayStatus = activeCall?.status || 'idle';
  const isOnHold = activeCall?.status === 'on_hold';

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Call Center</h1>
            <p className="text-muted-foreground">Handle inbound and outbound voice calls</p>
          </div>
          {/* Voice Status Indicator */}
          <div className="flex items-center gap-2">
            {isInitializing ? (
              <Badge variant="secondary" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Connecting...
              </Badge>
            ) : isReady ? (
              <Badge variant="default" className="gap-1 bg-green-500">
                <Wifi className="h-3 w-3" />
                Voice Ready
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <WifiOff className="h-3 w-3" />
                Voice Offline
              </Badge>
            )}
          </div>
        </div>

        {/* Business Phone Number Display */}
        {businessPhoneNumber && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <PhoneCall className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Your Business Line</p>
                      <p className="text-xl font-bold tracking-wide">{businessPhoneNumber}</p>
                      {businessName && (
                        <p className="text-sm text-muted-foreground">{businessName}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Calls from this number</p>
                    <p className="text-xs text-muted-foreground">will show your business ID</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Voice Error Alert */}
        {voiceError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            Voice Error: {voiceError}
          </div>
        )}

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
                      {displayStatus === "idle" ? "Available" : displayStatus.replace("_", " ")}
                    </p>
                  </div>
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      displayStatus === "idle"
                        ? "bg-green-500/10"
                        : displayStatus === "ringing" || displayStatus === "connecting"
                        ? "bg-yellow-500/10 animate-pulse"
                        : displayStatus === "connected"
                        ? "bg-blue-500/10"
                        : "bg-orange-500/10"
                    }`}
                  >
                    <Phone
                      className={`h-6 w-6 ${
                        displayStatus === "idle"
                          ? "text-green-500"
                          : displayStatus === "ringing" || displayStatus === "connecting"
                          ? "text-yellow-500"
                          : displayStatus === "connected"
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
              {/* Preparing Call Display - shown when navigating from contacts */}
              {isPreparingCall && !activeCall && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <p className="text-lg font-bold">{pendingCallNumber}</p>
                    <p className="text-sm text-primary animate-pulse mb-2">
                      Preparing call...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isInitializing ? "Initializing voice..." : "Starting call..."}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Active Call Display */}
              {activeCall && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
                >
                  <div className="text-center">
                    {(activeCall.status === "ringing" || activeCall.status === "connecting") && activeCall.direction === "inbound" ? (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                          <PhoneIncoming className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-lg font-bold">{incomingCall?.from || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {incomingCall?.from}
                        </p>
                        <p className="text-sm text-primary animate-pulse mb-4">Incoming call...</p>
                        <div className="flex justify-center gap-4">
                          <Button
                            size="lg"
                            className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600"
                            onClick={acceptCall}
                          >
                            <Phone className="h-6 w-6" />
                          </Button>
                          <Button
                            size="lg"
                            variant="destructive"
                            className="rounded-full w-14 h-14"
                            onClick={rejectCall}
                          >
                            <PhoneOff className="h-6 w-6" />
                          </Button>
                        </div>
                      </>
                    ) : (activeCall.status === "ringing" || activeCall.status === "connecting") && activeCall.direction === "outbound" ? (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <PhoneOutgoing className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <p className="text-lg font-bold">{activeCall.to || dialNumber}</p>
                        <p className="text-sm text-primary animate-pulse mb-4">
                          {activeCall.status === "connecting" ? "Connecting..." : "Calling..."}
                        </p>
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
                          {activeCall.direction === "inbound" ? activeCall.from : activeCall.to}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activeCall.direction === "inbound" ? "Incoming Call" : "Outbound Call"}
                        </p>
                        <p className="text-2xl font-mono font-bold mt-2 mb-4">
                          {formatDuration(activeCall.duration)}
                        </p>
                        {isOnHold && (
                          <Badge className="mb-4 bg-orange-500/10 text-orange-500">On Hold</Badge>
                        )}
                        <div className="flex justify-center gap-3">
                          <Button
                            size="icon"
                            variant={activeCall.isMuted ? "default" : "outline"}
                            className="rounded-full w-12 h-12"
                            onClick={toggleMute}
                            title={activeCall.isMuted ? "Unmute" : "Mute"}
                          >
                            {activeCall.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </Button>
                          <Button
                            size="icon"
                            variant={isOnHold ? "default" : "outline"}
                            className="rounded-full w-12 h-12"
                            onClick={toggleHold}
                            title={isOnHold ? "Resume" : "Hold"}
                          >
                            {isOnHold ? (
                              <Play className="h-5 w-5" />
                            ) : (
                              <Pause className="h-5 w-5" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant={activeCall.isSpeakerOn ? "default" : "outline"}
                            className="rounded-full w-12 h-12"
                            onClick={toggleSpeaker}
                            title={activeCall.isSpeakerOn ? "Speaker Off" : "Speaker On"}
                          >
                            {activeCall.isSpeakerOn ? (
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
                            title="End Call"
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
              {!activeCall && (
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
                    disabled={dialNumber.length < 10 || !isReady}
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
                  <CallHistoryList calls={callHistory} isLoading={isLoading} onSaveContact={handleOpenSaveDialog} onCallBack={handleCallBack} />
                </TabsContent>
                <TabsContent value="inbound">
                  <CallHistoryList calls={callHistory.filter((c:any) => c.type === "inbound")} isLoading={isLoading} onSaveContact={handleOpenSaveDialog} onCallBack={handleCallBack} />
                </TabsContent>
                <TabsContent value="outbound">
                  <CallHistoryList calls={callHistory.filter((c:any) => c.type === "outbound")} isLoading={isLoading} onSaveContact={handleOpenSaveDialog} onCallBack={handleCallBack} />
                </TabsContent>
                <TabsContent value="missed">
                  <CallHistoryList
                    calls={callHistory.filter(
                      (c:any) => c.status === "missed" || c.status === "no_answer"
                    )}
                    isLoading={isLoading}
                    onSaveContact={handleOpenSaveDialog}
                    onCallBack={handleCallBack}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Save Contact Dialog */}
        <Dialog open={saveContactDialog.open} onOpenChange={(open) => !open && setSaveContactDialog({ open: false, phoneNumber: "", firstName: "", lastName: "" })}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save Contact</DialogTitle>
              <DialogDescription>
                Add a name for this phone number to save it to your contacts.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={saveContactDialog.phoneNumber}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={saveContactDialog.firstName}
                  onChange={(e) => setSaveContactDialog(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name (optional)</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={saveContactDialog.lastName}
                  onChange={(e) => setSaveContactDialog(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveContactDialog({ open: false, phoneNumber: "", firstName: "", lastName: "" })}>
                Cancel
              </Button>
              <Button onClick={handleSaveContact} disabled={saveContactMutation.isPending}>
                {saveContactMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Contact"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ClientLayout>
  );
}

function CallHistoryList({
  calls,
  isLoading,
  onSaveContact,
  onCallBack,
}: {
  calls: CallHistoryItem[];
  isLoading?: boolean;
  onSaveContact: (call: CallHistoryItem) => void;
  onCallBack: (phoneNumber: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin opacity-50" />
        Loading call history...
      </div>
    );
  }

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
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{call.callerName}</p>
                {call.callCount && call.callCount > 1 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                    {call.callCount} calls
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{call.callerNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {call.duration > 0 ? formatDuration(call.duration) : "--:--"}
              </p>
              <p className="text-xs text-muted-foreground">{formatTime(call.timestamp)}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" onClick={() => onCallBack(call.callerNumber)} title="Call back">
                <Phone className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Only show "Save to Contacts" if contact doesn't have a name yet */}
                  {call.callerName === call.callerNumber && (
                    <DropdownMenuItem onClick={() => onSaveContact(call)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Save to Contacts
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onCallBack(call.callerNumber)}>
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
