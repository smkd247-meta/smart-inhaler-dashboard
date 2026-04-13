import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Activity, AlertTriangle, BarChart3, Bell, ChevronLeft, ChevronRight,
  History, LayoutDashboard, LogOut, Settings, Stethoscope, Users, Wind, Lightbulb
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface DashboardLayoutProps {
  children: ReactNode;
}

const patientNav = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/usage-history", label: "Usage History", icon: History },
  { path: "/alerts", label: "Alerts", icon: Bell },
  { path: "/recommendations", label: "AI Insights", icon: Lightbulb },
  { path: "/settings", label: "Settings", icon: Settings },
];

const doctorNav = [
  { path: "/doctor", label: "Dashboard", icon: LayoutDashboard },
  { path: "/doctor/patients", label: "Patients", icon: Users },
  { path: "/doctor/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/doctor/alerts", label: "Alerts", icon: AlertTriangle },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = user?.role === "doctor" ? doctorNav : patientNav;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-200 ease-in-out border-r border-sidebar-border",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Wind className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Smart Inhaler</p>
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Monitoring System</p>
            </div>
          )}
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path + "/"));
            const Icon = item.icon;
            const linkContent = (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return linkContent;
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        {/* User info + collapse */}
        <div className="p-3 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-semibold text-sidebar-primary">
                {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-[11px] text-sidebar-foreground/50 capitalize">{user?.role}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex-1 justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 h-9"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="ml-2 text-xs">Sign Out</span>}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-9 w-9 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 shrink-0"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
