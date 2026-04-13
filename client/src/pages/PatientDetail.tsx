/*
 * Design: Clinical Precision — Swiss Medical Design
 * Patient Detail (Doctor View): Full patient profile with dynamic sensor data, charts, and events
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { patients, generateDailyData, inhalerEvents } from "@/lib/mockData";
import { useSensorData } from "@/hooks/useSensorData";
import { getStatusLabel, type SensorConfig } from "@/lib/sensorConfig";
import {
  Activity, AlertTriangle, ArrowLeft, CheckCircle2, Clock, Droplets, Target,
  TrendingUp, User, Wifi, WifiOff, Wind, XCircle, Thermometer, Pill, HeartPulse, Gauge, Loader2
} from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "wouter";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";

const TEAL = "#0D9488";
const EMERALD = "#10B981";
const ROSE = "#EF4444";

const iconMap: Record<string, React.ElementType> = {
  thermometer: Thermometer, droplets: Droplets, wind: Wind, pill: Pill,
  "heart-pulse": HeartPulse, gauge: Gauge, activity: Activity,
};

export default function PatientDetail() {
  const params = useParams<{ id: string }>();
  const patient = patients.find(p => p.id === params.id);
  const dailyData = useMemo(() => generateDailyData(), []);
  const { current, history, sensors, loading, isLive } = useSensorData();

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <User className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Patient not found</p>
          <Link href="/doctor/patients">
            <Button variant="outline" className="mt-4 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Patients
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const totalCorrect = dailyData.reduce((s, d) => s + d.correctTechnique, 0);
  const totalIncorrect = dailyData.reduce((s, d) => s + d.incorrectTechnique, 0);
  const pieData = [
    { name: "Correct", value: totalCorrect, color: EMERALD },
    { name: "Incorrect", value: totalIncorrect, color: ROSE },
  ];

  const riskColor = (level: string) => {
    if (level === "low") return { text: "text-emerald-700", bg: "bg-emerald-50" };
    if (level === "medium") return { text: "text-amber-700", bg: "bg-amber-50" };
    return { text: "text-rose-700", bg: "bg-rose-50" };
  };
  const rc = riskColor(patient.riskLevel);

  const chartData = useMemo(() => {
    return history.map((point) => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
  }, [history]);

  return (
    <DashboardLayout>
      {/* Back button + header */}
      <div className="mb-6">
        <Link href="/doctor/patients">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Back to Patients
          </Button>
        </Link>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-lg font-bold text-teal-700 shrink-0">
            {patient.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
              <Badge variant="outline" className={`text-[10px] uppercase tracking-wider border-0 ${rc.text} ${rc.bg}`}>
                {patient.riskLevel} risk
              </Badge>
              {patient.deviceStatus === "online" ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
                  <span className="text-xs text-emerald-600">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="text-xs text-gray-500">Offline</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {patient.condition} &middot; Age {patient.age} &middot; {patient.prescribedDosesPerDay} doses/day
            </p>
          </div>
        </div>
      </div>

      {/* ── DYNAMIC SENSOR READINGS ── */}
      {sensors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5" />
            Live Sensor Readings
            <Badge variant="outline" className={`text-[10px] ml-2 ${isLive ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700"}`}>
              {isLive ? "Live" : "Demo"}
            </Badge>
          </h2>
          <div className={`grid gap-3 ${
            sensors.length <= 2 ? "grid-cols-2" :
            sensors.length <= 4 ? "grid-cols-2 lg:grid-cols-4" :
            "grid-cols-2 lg:grid-cols-4"
          }`}>
            {sensors.map((sensor) => {
              const value = current[sensor.id] ?? 0;
              const Icon = iconMap[sensor.icon] || Activity;
              const statusLabel = getStatusLabel(sensor, value);
              return (
                <Card key={sensor.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: sensor.color }} />
                      <p className="text-xs text-muted-foreground">{sensor.name}</p>
                    </div>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <p className="metric-value text-2xl text-foreground">
                        {value} <span className="text-sm font-normal text-muted-foreground">{sensor.unit}</span>
                      </p>
                    )}
                    <Badge variant="outline" className={`text-[9px] mt-1 ${
                      statusLabel === "Normal" ? "border-emerald-300 text-emerald-700" :
                      statusLabel === "Warning" ? "border-amber-300 text-amber-700" :
                      "border-rose-300 text-rose-700"
                    }`}>{statusLabel}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── DYNAMIC SENSOR CHARTS ── */}
      {sensors.length > 0 && chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {sensors.map((sensor) => (
            <Card key={sensor.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  {(() => { const Icon = iconMap[sensor.icon] || Activity; return <Icon className="w-4 h-4" style={{ color: sensor.color }} />; })()}
                  {sensor.name} History
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`grad-detail-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={sensor.chartColor} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={sensor.chartColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#94A3B8" }} interval={Math.floor(chartData.length / 5)} />
                      <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} domain={[sensor.min, sensor.max]} />
                      <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0" }} formatter={(v: number) => [`${v} ${sensor.unit}`, sensor.name]} />
                      <Area type="monotone" dataKey={sensor.id} stroke={sensor.chartColor} strokeWidth={2} fill={`url(#grad-detail-${sensor.id})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Static sections: Adherence + Technique */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              30-Day Adherence Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adherenceGradDetail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={TEAL} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} tickFormatter={(v) => v.slice(5)} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[0, 100]} />
                  <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                  <Area type="monotone" dataKey="adherencePercent" stroke={TEAL} strokeWidth={2} fill="url(#adherenceGradDetail)" name="Adherence %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              Technique Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col items-center">
            <div className="h-[170px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Correct ({totalCorrect})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs text-muted-foreground">Incorrect ({totalIncorrect})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            Recent Inhaler Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {inhalerEvents.slice(0, 6).map((event) => (
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">{event.techniqueLabel}</span>
                      {event.reason && <span className="text-xs text-rose-500">{event.reason}</span>}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[11px] text-muted-foreground">Angle: <span className="metric-value text-foreground">{event.angle}°</span></span>
                    <span className="text-[11px] text-muted-foreground">Flow: <span className="metric-value text-foreground">{event.flowRate}</span> L/min</span>
                    <span className="text-[11px] text-muted-foreground">Coord: <span className="metric-value text-foreground">{event.coordinationDelay}</span>ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
