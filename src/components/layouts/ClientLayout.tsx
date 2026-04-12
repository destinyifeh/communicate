"use client";

import { SupportDialog } from "@/components/portal/SupportDialog";
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
  ArrowLeft,
  Bell,
  Calendar,
  ChevronDown,
  HeadphonesIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Phone,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal" },
  { icon: Users, label: "Contacts", href: "/portal/contacts" },
  { icon: Calendar, label: "Calendar", href: "/portal/calendar" },
  { icon: Inbox, label: "Inbox", href: "/portal/inbox" },
  { icon: Phone, label: "Call Center", href: "/portal/call-center" },
  { icon: Megaphone, label: "Marketing", href: "/portal/marketing" },
  { icon: Settings, label: "Settings", href: "/portal/settings" },
];

function SidebarContent({
  onNavigate,
  onSupportClick,
}: {
  onNavigate?: () => void;
  onSupportClick?: () => void;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSupportClick = () => {
    if (onSupportClick) onSupportClick();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo & Business Name */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        {user?.businessLogo ? (
          <img
            src={user.businessLogo}
            alt={user.businessName || "Business"}
            className="h-8 w-8 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
            style={{ backgroundColor: user?.brandColor || 'hsl(var(--primary))' }}
          >
            <Zap className="h-4 w-4 text-white" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black tracking-tighter text-foreground truncate">
            {user?.businessName || "PartnerPeak"}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            Powered by PartnerPeak
          </span>
        </div>
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

      {/* Help card */}
      <div className="px-4 pb-4">
        <div className="rounded-lg bg-sidebar-accent/50 p-4">
          <h4 className="text-sm font-medium text-sidebar-foreground mb-1">
            Need help?
          </h4>
          <p className="text-xs text-sidebar-foreground/60 mb-3">
            Contact your dedicated account manager.
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="w-full text-xs gap-2"
            onClick={handleSupportClick}
          >
            <HeadphonesIcon className="h-3 w-3" />
            Get Support
          </Button>
        </div>
      </div>

      {/* User menu */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent/50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent/20 text-accent text-xs">
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
                <p className="text-xs text-sidebar-foreground/60">
                  {user?.businessName || "Client"}
                </p>
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

export function ClientLayout({ children }: ClientLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSupportClick = () => {
    setSupportDialogOpen(true);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card hidden lg:block shadow-xl">
        <SidebarContent onSupportClick={handleSupportClick} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-64 bg-sidebar border-sidebar-border"
        >
          <SidebarContent
            onNavigate={() => setMobileOpen(false)}
            onSupportClick={handleSupportClick}
          />
        </SheetContent>
      </Sheet>

      {/* Support Dialog */}
      <SupportDialog
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
      />

      {/* Main content */}
      <div className="flex-1 lg:pl-64 min-w-0 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-4 lg:px-6 w-full max-w-full overflow-hidden shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* Back button for non-dashboard pages */}
            {pathname !== "/portal" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hidden lg:flex h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              {/* Business name badge - visible on mobile */}
              <div className="lg:hidden flex items-center gap-2">
                {user?.businessLogo ? (
                  <img
                    src={user.businessLogo}
                    alt={user.businessName || "Business"}
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: user?.brandColor || 'hsl(var(--primary))' }}
                  >
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <span className="text-sm font-bold text-foreground truncate max-w-[120px]">
                  {user?.businessName || "PartnerPeak"}
                </span>
              </div>
              {/* Page title - desktop */}
              <h1 className="hidden lg:block text-lg font-bold tracking-tight text-foreground">
                {navItems.find((item) => item.href === pathname)?.label ||
                  "Dashboard"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/portal/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  2
                </span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 lg:p-6 min-w-0 overflow-x-hidden"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
