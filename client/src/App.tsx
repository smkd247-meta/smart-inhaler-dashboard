import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import UsageHistory from "./pages/UsageHistory";
import Alerts from "./pages/Alerts";
import Recommendations from "./pages/Recommendations";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorPatients from "./pages/DoctorPatients";
import PatientDetail from "./pages/PatientDetail";
import DoctorAnalytics from "./pages/DoctorAnalytics";
import DoctorAlerts from "./pages/DoctorAlerts";
import Settings from "./pages/Settings";
import type { ReactNode } from "react";

function ProtectedRoute({ children, allowedRole }: { children: ReactNode; allowedRole?: "patient" | "doctor" }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (allowedRole && user?.role !== allowedRole) {
    return <Redirect to={user?.role === "doctor" ? "/doctor" : "/dashboard"} />;
  }
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />

      {/* Patient routes */}
      <Route path="/dashboard">
        <ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>
      </Route>
      <Route path="/usage-history">
        <ProtectedRoute allowedRole="patient"><UsageHistory /></ProtectedRoute>
      </Route>
      <Route path="/alerts">
        <ProtectedRoute allowedRole="patient"><Alerts /></ProtectedRoute>
      </Route>
      <Route path="/recommendations">
        <ProtectedRoute allowedRole="patient"><Recommendations /></ProtectedRoute>
      </Route>

      {/* Doctor routes */}
      <Route path="/doctor">
        <ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>
      </Route>
      <Route path="/doctor/patients">
        <ProtectedRoute allowedRole="doctor"><DoctorPatients /></ProtectedRoute>
      </Route>
      <Route path="/doctor/patient/:id">
        <ProtectedRoute allowedRole="doctor"><PatientDetail /></ProtectedRoute>
      </Route>
      <Route path="/doctor/analytics">
        <ProtectedRoute allowedRole="doctor"><DoctorAnalytics /></ProtectedRoute>
      </Route>
      <Route path="/doctor/alerts">
        <ProtectedRoute allowedRole="doctor"><DoctorAlerts /></ProtectedRoute>
      </Route>

      {/* Shared routes */}
      <Route path="/settings">
        <ProtectedRoute><Settings /></ProtectedRoute>
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
