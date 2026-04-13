/*
 * Design: Clinical Precision — Swiss Medical Design
 * Usage History: Full event log with filters, detailed sensor data per event
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { inhalerEvents, hourlyUsagePattern } from "@/lib/mockData";
import { CheckCircle2, XCircle, Clock, Filter, ChevronDown, BarChart3 } from "lucide-react";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";

const TEAL = "#0D9488";

export default function UsageHistory() {
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect">("all");

  const filtered = filter === "all"
    ? inhalerEvents
    : inhalerEvents.filter(e => e.techniqueLabel === filter);

  const groupedByDate: Record<string, typeof inhalerEvents> = {};
  filtered.forEach(event => {
    const date = event.timestamp.split("T")[0];
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(event);
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usage History</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete log of all inhaler events with sensor data</p>
        </div>
      </div>

      {/* Usage pattern chart */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            Usage Pattern by Hour of Day
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyUsagePattern} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94A3B8" }} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} />
                <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                <Bar dataKey="count" fill={TEAL} radius={[3, 3, 0, 0]} barSize={20} name="Uses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground mr-2">Filter:</span>
        {(["all", "correct", "incorrect"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="text-xs capitalize h-8"
          >
            {f === "all" ? `All (${inhalerEvents.length})` :
             f === "correct" ? `Correct (${inhalerEvents.filter(e => e.techniqueLabel === "correct").length})` :
             `Incorrect (${inhalerEvents.filter(e => e.techniqueLabel === "incorrect").length})`}
          </Button>
        ))}
      </div>

      {/* Event list grouped by date */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, events]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-sm font-semibold text-foreground">{formatDate(date)}</h3>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{events.length} events</span>
            </div>
            <div className="space-y-2">
              {events.map((event) => (
                <Card key={event.id} className="border-border/60 hover:border-border transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        event.techniqueLabel === "correct" ? "bg-emerald-50" : "bg-rose-50"
                      }`}>
                        {event.techniqueLabel === "correct"
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          : <XCircle className="w-5 h-5 text-rose-600" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={event.techniqueLabel === "correct" ? "default" : "destructive"} className="text-[10px] uppercase tracking-wider">
                              {event.techniqueLabel}
                            </Badge>
                            {event.reason && (
                              <span className="text-xs text-rose-600">{event.reason}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs">
                              {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                            </span>
                          </div>
                        </div>
                        {/* Sensor data grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-2.5 rounded-md bg-muted/40">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Angle</p>
                            <p className="metric-value text-sm text-foreground">{event.angle}°</p>
                            <p className="text-[10px] text-muted-foreground">Target: 45°–60°</p>
                          </div>
                          <div className="p-2.5 rounded-md bg-muted/40">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Flow Rate</p>
                            <p className="metric-value text-sm text-foreground">{event.flowRate} <span className="text-[10px] font-normal">L/min</span></p>
                            <p className="text-[10px] text-muted-foreground">Target: &gt;40</p>
                          </div>
                          <div className="p-2.5 rounded-md bg-muted/40">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Press Duration</p>
                            <p className="metric-value text-sm text-foreground">{event.actuationDuration} <span className="text-[10px] font-normal">ms</span></p>
                            <p className="text-[10px] text-muted-foreground">Target: 200–400</p>
                          </div>
                          <div className="p-2.5 rounded-md bg-muted/40">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Coordination</p>
                            <p className="metric-value text-sm text-foreground">{event.coordinationDelay} <span className="text-[10px] font-normal">ms</span></p>
                            <p className="text-[10px] text-muted-foreground">Target: &lt;300</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
