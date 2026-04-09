"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChannelType } from "@/lib/onboardingTypes";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Music2,
} from "lucide-react";

interface ChannelSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (channel: ChannelType) => Promise<void>;
  onProceed?: () => void;
  connectedChannels: ChannelType[];
  maxChannels: number;
}

const channels = [
  {
    id: "instagram" as ChannelType,
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
  },
  {
    id: "facebook" as ChannelType,
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "whatsapp" as ChannelType,
    name: "WhatsApp",
    icon: MessageCircle,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    id: "tiktok" as ChannelType,
    name: "TikTok",
    icon: Music2,
    color: "text-black dark:text-white",
    bgColor: "bg-gray-500/10",
  },
  {
    id: "email" as ChannelType,
    name: "Email",
    icon: Mail,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
];

export function ChannelSelectionDialog({
  open,
  onOpenChange,
  onConnect,
  onProceed,
  connectedChannels,
  maxChannels,
}: ChannelSelectionDialogProps) {
  const isAtLimit = connectedChannels.length >= maxChannels;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Connect Your Channels
          </DialogTitle>
          <DialogDescription>
            Link your social media and communication accounts to enable AI
            automations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-muted-foreground font-medium">
              Selected Channels
            </span>
            <span
              className={`font-bold ${isAtLimit ? "text-red-500" : "text-primary"}`}
            >
              {connectedChannels.length} / {maxChannels}
            </span>
          </div>

          <div className="grid gap-3">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const isConnected = connectedChannels.includes(channel.id);

              return (
                <motion.button
                  key={channel.id}
                  whileTap={{ scale: 0.98 }}
                  disabled={isConnected || isAtLimit}
                  onClick={() => onConnect(channel.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    isConnected
                      ? "bg-secondary/50 border-border opacity-70 cursor-default"
                      : isAtLimit
                        ? "bg-secondary/20 border-border opacity-50 cursor-not-allowed"
                        : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-lg ${channel.bgColor} ${channel.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{channel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {isConnected ? "Already connected" : "Click to connect"}
                      </div>
                    </div>
                  </div>
                  {isConnected ? (
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <Button
            className="w-full h-11 text-base font-semibold"
            disabled={connectedChannels.length === 0}
            onClick={() => {
              if (onProceed) {
                onProceed();
              } else {
                onOpenChange(false);
              }
            }}
          >
            {connectedChannels.length > 0
              ? "Continue to Automations"
              : "Connect a Channel to Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
