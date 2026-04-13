/*
 * Design: Clinical Precision — Swiss Medical Design
 * Alerts page: Color-coded severity, read/unread states, grouped by time
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alerts as initialAlerts, type Alert } from "@/lib/mockData";
import {
  AlertTriangle, Bell, BellOff, CheckCircle, Clock, Info, ShieldAlert,
  Wifi, WifiOff, XCircle, Wind
} from "lucide-react";
import { useState } from "react";

const severityConfig = {
  critical: { bg: "bg-rose-50", border: "border-rose-200", icon: ShieldAlert, iconColor: "text-rose-600", badgeBg: "bg-rose-100 text-rose-700" },
  warning: { bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle, iconColor: "text-amber-600", badgeBg: "bg-amber-100 text-amber-700" },
  info: { bg: "bg-blue-50", border: "border-blue-200", icon: Info, iconColor: "text-blue-600", badgeBg: "bg-blue-100 text-blue-700" },
};

const typeIcons: Record<string, typeof Bell> = {
  missed_dose: Clock,
  wrong_technique: XCircle,
  overuse: AlertTriangle,
  low_flow: Wind,
  risk_prediction: ShieldAlert,
  device_offline: WifiOff,
};

export default function Alerts() {
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "warning" | "info">("all");

  const markAllRead = () => {
    setAlertList(prev => prev.map(a => ({ ...a, read: true })));
  };

  const markRead = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const filtered = filterSeverity === "all" ? alertList : alertList.filter(a => a.severity === filterSeverity);
  const unreadCount = alertList.filter(a => !a.read).length;

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}` : "All alerts read"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs gap-2">
            <CheckCircle className="w-3.5 h-3.5" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Severity filter */}
      <div className="flex items-center gap-2 mb-6">
        {(["all", "critical", "warning", "info"] as const).map((sev) => (
          <Button
            key={sev}
            variant={filterSeverity === sev ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSeverity(sev)}
            className="text-xs capitalize h-8"
          >
            {sev === "all" ? `All (${alertList.length})` : `${sev} (${alertList.filter(a => a.severity === sev).length})`}
          </Button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BellOff className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No alerts matching this filter</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((alert) => {
            const config = severityConfig[alert.severity];
            const TypeIcon = typeIcons[alert.type] || Bell;
            const SeverityIcon = config.icon;

            return (
              <Card
                key={alert.id}
                className={`transition-all cursor-pointer ${
                  !alert.read ? `${config.bg} ${config.border} border` : "border-border/60 opacity-75"
                }`}
                onClick={() => markRead(alert.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      !alert.read ? "bg-white/80" : "bg-muted/50"
                    }`}>
                      <TypeIcon className={`w-5 h-5 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-semibold ${!alert.read ? "text-foreground" : "text-muted-foreground"}`}>
                            {alert.title}
                          </h3>
                          {!alert.read && <span className="w-2 h-2 rounded-full bg-teal-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${config.badgeBg} border-0`}>
                            {alert.severity}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">{formatTime(alert.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
