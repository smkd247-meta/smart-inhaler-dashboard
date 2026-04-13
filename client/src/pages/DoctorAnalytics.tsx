/*
 * Design: Clinical Precision — Swiss Medical Design
 * Doctor Analytics: Aggregate analytics across all patients
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { patients, weeklyFlowData } from "@/lib/mockData";
import { useSensorData } from "@/hooks/useSensorData";
import { getStatusLabel } from "@/lib/sensorConfig";
import { BarChart3, TrendingUp, Users, Activity, Gauge, Thermometer, Droplets, Wind, Pill, HeartPulse, Loader2 } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";

const TEAL = "#0D9488";
const EMERALD = "#10B981";
const AMBER = "#F59E0B";
const ROSE = "#EF4444";

const adherenceByPatient = patients.map(p => ({
  name: p.name.split(" ")[0],
  adherence: p.adherencePercent,
  fill: p.adherencePercent >= 80 ? EMERALD : p.adherencePercent >= 60 ? AMBER : ROSE,
}));

const weeklyTrend = [
  { week: "W1", avgAdherence: 72, avgTechnique: 78 },
  { week: "W2", avgAdherence: 75, avgTechnique: 80 },
  { week: "W3", avgAdherence: 71, avgTechnique: 82 },
  { week: "W4", avgAdherence: 78, avgTechnique: 85 },
];

const conditionBreakdown = [
  { condition: "Asthma (Mild)", count: 2, avgAdherence: 92 },
  { condition: "Asthma (Moderate)", count: 2, avgAdherence: 80 },
  { condition: "COPD (Stage II)", count: 1, avgAdherence: 58 },
  { condition: "COPD (Stage III)", count: 1, avgAdherence: 65 },
];

const sensorIconMap: Record<string, React.ElementType> = {
  thermometer: Thermometer, droplets: Droplets, wind: Wind, pill: Pill,
  "heart-pulse": HeartPulse, gauge: Gauge, activity: Activity,
};

export default function DoctorAnalytics() {
  const { current, sensors, loading, isLive } = useSensorData();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Aggregate insights across all patients</p>
      </div>

      {/* Dynamic sensor overview */}
      {sensors.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Gauge className="w-4 h-4 text-teal-600" />
              Current Sensor Readings
              <Badge variant="outline" className={`text-[10px] ml-2 ${isLive ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700"}`}>
                {isLive ? "Live" : "Demo"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`grid gap-4 ${sensors.length <= 2 ? "grid-cols-2" : sensors.length <= 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-4"}`}>
              {sensors.map((sensor) => {
                const value = current[sensor.id] ?? 0;
                const Icon = sensorIconMap[sensor.icon] || Activity;
                const status = getStatusLabel(sensor, value);
                return (
                  <div key={sensor.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: sensor.color }} />
                      <span className="text-xs text-muted-foreground">{sensor.name}</span>
                    </div>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <p className="metric-value text-xl text-foreground">{value} <span className="text-xs font-normal text-muted-foreground">{sensor.unit}</span></p>
                    )}
                    <Badge variant="outline" className={`text-[9px] mt-1 ${
                      status === "Normal" ? "border-emerald-300 text-emerald-700" :
                      status === "Warning" ? "border-amber-300 text-amber-700" :
                      "border-rose-300 text-rose-700"
                    }`}>{status}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adherence by patient */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            Adherence by Patient
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adherenceByPatient} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[0, 100]} />
                <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} formatter={(v: number) => [`${v}%`, "Adherence"]} />
                <Bar dataKey="adherence" radius={[4, 4, 0, 0]} barSize={40} name="Adherence %">
                  {adherenceByPatient.map((entry, i) => (
                    <Bar key={i} dataKey="adherence" fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Weekly trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Weekly Trends (All Patients)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[60, 100]} />
                  <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="avgAdherence" stroke={TEAL} strokeWidth={2} dot={{ r: 4 }} name="Avg Adherence %" />
                  <Line type="monotone" dataKey="avgTechnique" stroke={EMERALD} strokeWidth={2} dot={{ r: 4 }} name="Avg Technique %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Condition breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Adherence by Condition
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4 mt-2">
              {conditionBreakdown.map((item) => (
                <div key={item.condition}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.condition}</span>
                      <span className="text-xs text-muted-foreground ml-2">({item.count} patients)</span>
                    </div>
                    <span className="metric-value text-sm text-foreground">{item.avgAdherence}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.avgAdherence}%`,
                        backgroundColor: item.avgAdherence >= 80 ? EMERALD : item.avgAdherence >= 60 ? AMBER : ROSE,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flow rate trends */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Average Flow Rate Trends (All Patients)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[0, 60]} />
                <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                <Bar dataKey="avgFlow" fill={TEAL} radius={[4, 4, 0, 0]} barSize={32} name="Avg Flow (L/min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
