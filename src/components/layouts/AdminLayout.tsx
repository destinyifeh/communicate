"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/hooks";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Phone,
  Settings,
  Users,
  Webhook,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/admin" },
  { icon: Users, label: "Client Management", href: "/admin/clients" },
  { icon: Calendar, label: "Bookings Overview", href: "/admin/bookings" },
  { icon: Phone, label: "Call Center", href: "/admin/call-center" },
  { icon: Megaphone, label: "Marketing", href: "/admin/marketing" },
  { icon: Webhook, label: "Webhook Logs", href: "/admin/webhooks" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-black tracking-tighter text-foreground">
          Partner<span className="text-primary">Peak</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User menu */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent/50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60">Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card hidden lg:block shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-64 bg-sidebar border-sidebar-border"
        >
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-black tracking-tight text-foreground">
              {navItems.find((item) => item.href === pathname)?.label ||
                "Command Center"}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/admin/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() =>
                toast.info("Messages coming soon!", {
                  description:
                    "Direct messaging will be available in a future update.",
                })
              }
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
