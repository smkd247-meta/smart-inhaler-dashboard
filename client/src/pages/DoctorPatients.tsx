/*
 * Design: Clinical Precision — Swiss Medical Design
 * Doctor Patients page: Full patient list with search and risk filters
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { patients } from "@/lib/mockData";
import { Search, Users, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function DoctorPatients() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const filtered = patients
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase()))
    .filter(p => riskFilter === "all" || p.riskLevel === riskFilter);

  const riskColor = (level: string) => {
    if (level === "low") return "text-emerald-700 bg-emerald-50";
    if (level === "medium") return "text-amber-700 bg-amber-50";
    return "text-rose-700 bg-rose-50";
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Patients</h1>
        <p className="text-sm text-muted-foreground mt-1">{patients.length} patients under your care</p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name or condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "low", "medium", "high"] as const).map((r) => (
            <Button
              key={r}
              variant={riskFilter === r ? "default" : "outline"}
              size="sm"
              onClick={() => setRiskFilter(r)}
              className="text-xs capitalize h-10"
            >
              {r === "all" ? "All" : `${r} Risk`}
            </Button>
          ))}
        </div>
      </div>

      {/* Patient cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((patient) => (
          <Link key={patient.id} href={`/doctor/patient/${patient.id}`}>
            <Card className="hover:border-teal-300 transition-colors cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700 shrink-0">
                    {patient.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-xs text-muted-foreground">{patient.condition}</p>
                    <p className="text-xs text-muted-foreground">Age: {patient.age}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider border-0 ${riskColor(patient.riskLevel)}`}>
                      {patient.riskLevel} risk
                    </Badge>
                    <div className="flex items-center gap-1">
                      {patient.deviceStatus === "online" ? (
                        <>
                          <Wifi className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] text-emerald-600">Online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-500">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Adherence</span>
                      <span className="metric-value text-xs text-foreground">{patient.adherencePercent}%</span>
                    </div>
                    <Progress value={patient.adherencePercent} className="h-1.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Prescribed: {patient.prescribedDosesPerDay} doses/day</span>
                    <span>Last: {new Date(patient.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No patients match your search</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
