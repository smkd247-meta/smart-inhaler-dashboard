/*
 * Design: Clinical Precision — Swiss Medical Design
 * Patient Dashboard: Dynamic sensor cards + live charts from sensorConfig
 * Sensors auto-adapt from config — add/remove sensors in sensorConfig.ts
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSensorData } from "@/hooks/useSensorData";
import { getStatusColor, getStatusLabel, isWarning, isCritical, type SensorConfig } from "@/lib/sensorConfig";
import { generateDailyData, inhalerEvents, alerts } from "@/lib/mockData";
import {
  Activity, AlertTriangle, CheckCircle2, Clock, Droplets, Target, TrendingUp,
  Wind, XCircle, Thermometer, Pill, HeartPulse, Gauge, RefreshCw, WifiOff, Wifi,
  Loader2
} from "lucide-react";
import { useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";

const TEAL = "#0D9488";
const EMERALD = "#10B981";
const AMBER = "#F59E0B";
const ROSE = "#EF4444";

// Map sensor icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  thermometer: Thermometer,
  droplets: Droplets,
  wind: Wind,
  pill: Pill,
  "heart-pulse": HeartPulse,
  gauge: Gauge,
  activity: Activity,
};

function getSensorIcon(iconName: string) {
  return iconMap[iconName] || Activity;
}

export default function PatientDashboard() {
  // Live sensor data from ThingSpeak (or mock if not configured)
  const { current, history, sensors, loading, isLive, lastUpdated, refresh } = useSensorData();

  // Existing mock data for adherence, technique, events
  const dailyData = useMemo(() => generateDailyData(), []);
  const todayData = dailyData[dailyData.length - 1];
  const avgAdherence = Math.round(dailyData.reduce((s, d) => s + d.adherencePercent, 0) / dailyData.length);

  const totalCorrect = dailyData.reduce((s, d) => s + d.correctTechnique, 0);
  const totalIncorrect = dailyData.reduce((s, d) => s + d.incorrectTechnique, 0);
  const techniqueAccuracy = Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100);

  const pieData = [
    { name: "Correct", value: totalCorrect, color: EMERALD },
    { name: "Incorrect", value: totalIncorrect, color: ROSE },
  ];

  const recentEvents = inhalerEvents.slice(0, 5);
  const unreadAlerts = alerts.filter(a => !a.read).length;

  // Format time series data for charts
  const chartData = useMemo(() => {
    return history.map((point) => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
  }, [history]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time inhaler monitoring overview</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live / Demo indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
            isLive
              ? "bg-emerald-50 border-emerald-200"
              : "bg-amber-50 border-amber-200"
          }`}>
            {isLive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
                <span className="text-xs font-medium text-emerald-700">Live — ThingSpeak</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-amber-700">Demo Mode</span>
              </>
            )}
          </div>
          <button
            onClick={refresh}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {unreadAlerts > 0 && (
            <Badge variant="destructive" className="text-xs">{unreadAlerts} new alerts</Badge>
          )}
        </div>
      </div>

      {/* ── DYNAMIC SENSOR CARDS ── */}
      {/* These cards auto-generate from sensorConfig.ts */}
      {sensors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5" />
            Live Sensor Readings
            {lastUpdated && (
              <span className="text-[10px] font-normal normal-case ml-auto">
                Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </h2>
          <div className={`grid gap-4 ${
            sensors.length === 1 ? "grid-cols-1" :
            sensors.length === 2 ? "grid-cols-1 sm:grid-cols-2" :
            sensors.length === 3 ? "grid-cols-1 sm:grid-cols-3" :
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}>
            {sensors.map((sensor, index) => {
              const value = current[sensor.id] ?? 0;
              const Icon = getSensorIcon(sensor.icon);
              const statusColor = getStatusColor(sensor, value);
              const statusLabel = getStatusLabel(sensor, value);
              const percent = Math.min(((value - sensor.min) / (sensor.max - sensor.min)) * 100, 100);

              return (
                <Card key={sensor.id} className={`animate-fade-in-up opacity-0`} style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${sensor.color}15` }}>
                        <Icon className="w-4 h-4" style={{ color: sensor.color }} />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase tracking-wider ${
                          statusLabel === "Normal" ? "border-emerald-300 text-emerald-700" :
                          statusLabel === "Warning" ? "border-amber-300 text-amber-700" :
                          "border-rose-300 text-rose-700"
                        }`}
                      >
                        {statusLabel}
                      </Badge>
                    </div>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    ) : (
                      <p className="metric-value text-3xl text-foreground">
                        {value}<span className="text-sm font-normal text-muted-foreground ml-1">{sensor.unit}</span>
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">{sensor.name}</p>
                    <Progress value={percent} className="mt-3 h-1.5" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DYNAMIC SENSOR CHARTS ── */}
      {/* One line chart per sensor, auto-generated */}
      {sensors.length > 0 && chartData.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Sensor History
          </h2>
          <div className={`grid gap-4 ${
            sensors.length <= 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-2"
          }`}>
            {sensors.map((sensor) => (
              <Card key={sensor.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    {(() => { const Icon = getSensorIcon(sensor.icon); return <Icon className="w-4 h-4" style={{ color: sensor.color }} />; })()}
                    {sensor.name} ({sensor.unit})
                    {sensor.warningThreshold !== undefined && (
                      <span className="text-[10px] font-normal text-muted-foreground ml-auto">
                        Warning: {sensor.warningThreshold}{sensor.unit}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={sensor.chartColor} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={sensor.chartColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94A3B8" }} interval={Math.floor(chartData.length / 6)} />
                        <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[sensor.min, sensor.max]} />
                        {sensor.warningThreshold !== undefined && (
                          <RechartsTooltip
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
                            formatter={(value: number) => [`${value} ${sensor.unit}`, sensor.name]}
                          />
                        )}
                        {!sensor.warningThreshold && (
                          <RechartsTooltip
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
                            formatter={(value: number) => [`${value} ${sensor.unit}`, sensor.name]}
                          />
                        )}
                        <Area
                          type="monotone"
                          dataKey={sensor.id}
                          stroke={sensor.chartColor}
                          strokeWidth={2}
                          fill={`url(#grad-${sensor.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── STATIC SECTIONS: Adherence, Technique, Events ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Adherence trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Daily Adherence — Last 30 Days
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adherenceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={TEAL} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} tickFormatter={(v) => v.slice(5)} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[0, 100]} />
                  <RechartsTooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
                    formatter={(value: number) => [`${value}%`, "Adherence"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area type="monotone" dataKey="adherencePercent" stroke={TEAL} strokeWidth={2} fill="url(#adherenceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Technique pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              Technique Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col items-center">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Correct ({totalCorrect})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs text-muted-foreground">Incorrect ({totalIncorrect})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Metric cards + Recent events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Summary metrics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Today's Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Doses Today</p>
                <p className="metric-value text-2xl text-foreground">{todayData.actualDoses}/{todayData.expectedDoses}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">30-Day Adherence</p>
                <p className="metric-value text-2xl text-foreground">{avgAdherence}%</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Technique Accuracy</p>
                <p className="metric-value text-2xl text-foreground">{techniqueAccuracy}%</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Active Sensors</p>
                <p className="metric-value text-2xl text-foreground">{sensors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Recent Inhaler Events
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    event.techniqueLabel === "correct" ? "bg-emerald-50" : "bg-rose-50"
                  }`}>
                    {event.techniqueLabel === "correct"
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      : <XCircle className="w-4 h-4 text-rose-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{event.techniqueLabel}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[11px] text-muted-foreground">
                        Angle: <span className="metric-value text-foreground">{event.angle}°</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Flow: <span className="metric-value text-foreground">{event.flowRate}</span> L/min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
