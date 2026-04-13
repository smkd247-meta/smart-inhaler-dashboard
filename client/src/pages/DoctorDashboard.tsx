/*
 * Design: Clinical Precision — Swiss Medical Design
 * Doctor Dashboard: Overview of all patients, risk distribution, adherence summary
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { patients } from "@/lib/mockData";
import {
  Activity, AlertTriangle, CheckCircle2, Stethoscope, Users, Wifi, WifiOff, TrendingUp, Eye
} from "lucide-react";
import { Link } from "wouter";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from "recharts";

const DOCTOR_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349106928/Vf5cRhPsscQkwvi2tj2uGF/doctor-dashboard-hero-3bLdBoPSuJ8HUzKTuCL47w.webp";
const TEAL = "#0D9488";
const EMERALD = "#10B981";
const AMBER = "#F59E0B";
const ROSE = "#EF4444";

export default function DoctorDashboard() {
  const totalPatients = patients.length;
  const onlineDevices = patients.filter(p => p.deviceStatus === "online").length;
  const avgAdherence = Math.round(patients.reduce((s, p) => s + p.adherencePercent, 0) / totalPatients);
  const highRiskCount = patients.filter(p => p.riskLevel === "high").length;

  const riskDistribution = [
    { name: "Low Risk", value: patients.filter(p => p.riskLevel === "low").length, color: EMERALD },
    { name: "Medium Risk", value: patients.filter(p => p.riskLevel === "medium").length, color: AMBER },
    { name: "High Risk", value: patients.filter(p => p.riskLevel === "high").length, color: ROSE },
  ];

  const riskColor = (level: string) => {
    if (level === "low") return { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" };
    if (level === "medium") return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" };
    return { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500" };
  };

  return (
    <DashboardLayout>
      {/* Hero banner */}
      <div className="relative rounded-xl overflow-hidden mb-8 h-[180px]">
        <img src={DOCTOR_HERO} alt="Doctor dashboard" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-[#0F172A]/50 to-transparent" />
        <div className="absolute inset-0 flex items-center p-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span className="text-teal-400 text-sm font-medium">Doctor Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome, Dr. Meera Joshi</h1>
            <p className="text-white/60 text-sm mt-1">Monitor your patients' inhaler usage and health metrics</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-teal-600" />
              </div>
            </div>
            <p className="metric-value text-3xl text-foreground">{totalPatients}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="metric-value text-3xl text-foreground">{onlineDevices}/{totalPatients}</p>
            <p className="text-sm text-muted-foreground mt-1">Devices Online</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="metric-value text-3xl text-foreground">{avgAdherence}%</p>
            <p className="text-sm text-muted-foreground mt-1">Avg Adherence</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
            </div>
            <p className="metric-value text-3xl text-foreground">{highRiskCount}</p>
            <p className="text-sm text-muted-foreground mt-1">High Risk Patients</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Risk distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col items-center">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {riskDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2">
              {riskDistribution.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-xs text-muted-foreground">{r.name} ({r.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient list */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Patient Overview</CardTitle>
              <Link href="/doctor/patients" className="text-xs text-teal-600 hover:underline">View All</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {patients.map((patient) => {
                const rc = riskColor(patient.riskLevel);
                return (
                  <Link key={patient.id} href={`/doctor/patient/${patient.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-semibold text-teal-700 shrink-0">
                        {patient.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{patient.name}</span>
                          <div className="flex items-center gap-2">
                            {patient.deviceStatus === "online" ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-gray-300" />
                            )}
                            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${rc.text} ${rc.bg} border-0`}>
                              {patient.riskLevel}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">{patient.condition}</span>
                          <span className="text-xs text-muted-foreground">
                            Adherence: <span className="metric-value text-foreground">{patient.adherencePercent}%</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
