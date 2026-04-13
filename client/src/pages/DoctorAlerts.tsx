/*
 * Design: Clinical Precision — Swiss Medical Design
 * Doctor Alerts: Alerts across all patients with patient attribution
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alerts as baseAlerts, patients } from "@/lib/mockData";
import {
  AlertTriangle, Bell, BellOff, CheckCircle, Clock, Info, ShieldAlert, Wind, WifiOff, XCircle
} from "lucide-react";
import { useState } from "react";

// Assign patients to alerts for doctor view
const doctorAlerts = baseAlerts.map((alert, i) => ({
  ...alert,
  patientName: patients[i % patients.length].name,
  patientId: patients[i % patients.length].id,
}));

const severityConfig = {
  critical: { bg: "bg-rose-50", icon: ShieldAlert, iconColor: "text-rose-600", badgeBg: "bg-rose-100 text-rose-700" },
  warning: { bg: "bg-amber-50", icon: AlertTriangle, iconColor: "text-amber-600", badgeBg: "bg-amber-100 text-amber-700" },
  info: { bg: "bg-blue-50", icon: Info, iconColor: "text-blue-600", badgeBg: "bg-blue-100 text-blue-700" },
};

const typeIcons: Record<string, typeof Bell> = {
  missed_dose: Clock,
  wrong_technique: XCircle,
  overuse: AlertTriangle,
  low_flow: Wind,
  risk_prediction: ShieldAlert,
  device_offline: WifiOff,
};

export default function DoctorAlerts() {
  const [alertList, setAlertList] = useState(doctorAlerts);
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "warning" | "info">("all");

  const markAllRead = () => {
    setAlertList(prev => prev.map(a => ({ ...a, read: true })));
  };

  const filtered = filterSeverity === "all" ? alertList : alertList.filter(a => a.severity === filterSeverity);
  const unreadCount = alertList.filter(a => !a.read).length;

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Alerts across all patients &middot; {unreadCount > 0 ? `${unreadCount} unread` : "All read"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs gap-2">
            <CheckCircle className="w-3.5 h-3.5" />
            Mark All Read
          </Button>
        )}
      </div>

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

            return (
              <Card
                key={alert.id}
                className={`transition-all ${!alert.read ? `${config.bg} border` : "border-border/60 opacity-75"}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${!alert.read ? "bg-white/80" : "bg-muted/50"}`}>
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
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-medium text-teal-600">Patient: {alert.patientName}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
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
