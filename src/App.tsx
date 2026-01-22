import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Demo from "./pages/Demo";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ClientManagement from "./pages/admin/ClientManagement";
import WebhookLogs from "./pages/admin/WebhookLogs";
import AdminNotifications from "./pages/admin/Notifications";
import AdminSettings from "./pages/admin/Settings";

// Client Portal Pages
import ClientDashboard from "./pages/portal/Dashboard";
import AutomationSettings from "./pages/portal/AutomationSettings";
import LeadCRM from "./pages/portal/LeadCRM";
import Notifications from "./pages/portal/Notifications";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/demo" element={<Demo />} />
              
              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/clients"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ClientManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/webhooks"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <WebhookLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminNotifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Client portal routes */}
              <Route
                path="/portal"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/settings"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <AutomationSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/leads"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <LeadCRM />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/notifications"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portal/*"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
