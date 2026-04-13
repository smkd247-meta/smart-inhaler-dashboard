/*
 * Design: Clinical Precision — Swiss Medical Design
 * AI Recommendations page: Personalized insights from AI analysis
 */
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recommendations } from "@/lib/mockData";
import {
  Activity, AlertTriangle, Bell, Brain, Lightbulb, Target, TrendingUp, Wind
} from "lucide-react";

const PATIENT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349106928/Vf5cRhPsscQkwvi2tj2uGF/patient-breathing-FaArYxcYqGWTaPHYmtAajK.webp";

const iconMap: Record<string, typeof Activity> = {
  target: Target,
  bell: Bell,
  wind: Wind,
  "alert-triangle": AlertTriangle,
  lungs: Activity,
  activity: TrendingUp,
};

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  technique: { label: "Technique", color: "text-teal-700", bg: "bg-teal-50" },
  adherence: { label: "Adherence", color: "text-blue-700", bg: "bg-blue-50" },
  lifestyle: { label: "Lifestyle", color: "text-emerald-700", bg: "bg-emerald-50" },
  prediction: { label: "AI Prediction", color: "text-amber-700", bg: "bg-amber-50" },
};

const priorityConfig: Record<string, { label: string; variant: "destructive" | "default" | "outline" }> = {
  high: { label: "High Priority", variant: "destructive" },
  medium: { label: "Medium", variant: "default" },
  low: { label: "Low", variant: "outline" },
};

export default function Recommendations() {
  const highPriority = recommendations.filter(r => r.priority === "high");
  const otherRecs = recommendations.filter(r => r.priority !== "high");

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Insights & Recommendations</h1>
          <p className="text-sm text-muted-foreground mt-1">Personalized suggestions based on your usage patterns</p>
        </div>
      </div>

      {/* AI Summary card */}
      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <Brain className="w-4 h-4 text-teal-600" />
              </div>
              <h2 className="text-base font-semibold">AI Analysis Summary</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Based on your last 30 days of inhaler usage data, our AI model has identified several areas for improvement. Your overall technique accuracy is good but declining slightly. Adherence to evening doses needs attention. The predictive model indicates a moderate risk period in the coming days.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-muted/40 text-center">
                <p className="metric-value text-xl text-teal-600">88%</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Model Confidence</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 text-center">
                <p className="metric-value text-xl text-foreground">342</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Events Analyzed</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 text-center">
                <p className="metric-value text-xl text-amber-600">Medium</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Risk Level</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-[200px] shrink-0">
            <img
              src={PATIENT_IMG}
              alt="Correct inhaler technique"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>

      {/* High priority recommendations */}
      {highPriority.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Requires Attention
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highPriority.map((rec) => {
              const Icon = iconMap[rec.icon] || Lightbulb;
              const cat = categoryConfig[rec.category];
              return (
                <Card key={rec.id} className="border-rose-200 bg-rose-50/30">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-rose-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="destructive" className="text-[10px]">High Priority</Badge>
                          <Badge variant="outline" className={`text-[10px] ${cat.color} ${cat.bg} border-0`}>{cat.label}</Badge>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mt-2">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Other recommendations */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-teal-600" />
          Additional Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherRecs.map((rec) => {
            const Icon = iconMap[rec.icon] || Lightbulb;
            const cat = categoryConfig[rec.category];
            const pri = priorityConfig[rec.priority];
            return (
              <Card key={rec.id} className="border-border/60">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={pri.variant} className="text-[10px]">{pri.label}</Badge>
                        <Badge variant="outline" className={`text-[10px] ${cat.color} ${cat.bg} border-0`}>{cat.label}</Badge>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mt-2">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
