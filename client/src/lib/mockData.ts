// Mock data for Smart Inhaler Monitoring System

export interface InhalerEvent {
  id: string;
  timestamp: string;
  angle: number;
  flowRate: number;
  actuationDuration: number;
  coordinationDelay: number;
  techniqueLabel: "correct" | "incorrect";
  reason?: string;
}

export interface DailyAdherence {
  date: string;
  expectedDoses: number;
  actualDoses: number;
  adherencePercent: number;
  correctTechnique: number;
  incorrectTechnique: number;
}

export interface Alert {
  id: string;
  type: "missed_dose" | "wrong_technique" | "overuse" | "low_flow" | "risk_prediction" | "device_offline";
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  prescribedDosesPerDay: number;
  adherencePercent: number;
  riskLevel: "low" | "medium" | "high";
  lastActivity: string;
  deviceStatus: "online" | "offline";
  avatar: string;
}

export interface Recommendation {
  id: string;
  category: "technique" | "adherence" | "lifestyle" | "prediction";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  icon: string;
}

// Generate 30 days of usage data
export const generateDailyData = (): DailyAdherence[] => {
  const data: DailyAdherence[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const expected = 4;
    const actual = Math.min(expected, Math.max(0, Math.floor(Math.random() * 3) + 2));
    const correct = Math.floor(actual * (0.6 + Math.random() * 0.4));
    data.push({
      date: date.toISOString().split("T")[0],
      expectedDoses: expected,
      actualDoses: actual,
      adherencePercent: Math.round((actual / expected) * 100),
      correctTechnique: correct,
      incorrectTechnique: actual - correct,
    });
  }
  return data;
};

export const inhalerEvents: InhalerEvent[] = [
  { id: "e1", timestamp: "2026-03-11T08:15:00Z", angle: 52.3, flowRate: 48.7, actuationDuration: 320, coordinationDelay: 180, techniqueLabel: "correct" },
  { id: "e2", timestamp: "2026-03-11T12:30:00Z", angle: 71.2, flowRate: 35.1, actuationDuration: 280, coordinationDelay: 450, techniqueLabel: "incorrect", reason: "Angle too high (71.2°)" },
  { id: "e3", timestamp: "2026-03-11T18:00:00Z", angle: 48.9, flowRate: 52.3, actuationDuration: 350, coordinationDelay: 150, techniqueLabel: "correct" },
  { id: "e4", timestamp: "2026-03-10T08:00:00Z", angle: 55.1, flowRate: 45.8, actuationDuration: 310, coordinationDelay: 200, techniqueLabel: "correct" },
  { id: "e5", timestamp: "2026-03-10T12:15:00Z", angle: 42.7, flowRate: 18.3, actuationDuration: 150, coordinationDelay: 800, techniqueLabel: "incorrect", reason: "Weak inhalation (18.3 L/min)" },
  { id: "e6", timestamp: "2026-03-10T18:30:00Z", angle: 50.0, flowRate: 50.2, actuationDuration: 340, coordinationDelay: 170, techniqueLabel: "correct" },
  { id: "e7", timestamp: "2026-03-10T22:00:00Z", angle: 47.5, flowRate: 46.1, actuationDuration: 300, coordinationDelay: 220, techniqueLabel: "correct" },
  { id: "e8", timestamp: "2026-03-09T07:45:00Z", angle: 82.1, flowRate: 22.4, actuationDuration: 180, coordinationDelay: 1200, techniqueLabel: "incorrect", reason: "Wrong angle + poor coordination" },
  { id: "e9", timestamp: "2026-03-09T13:00:00Z", angle: 53.8, flowRate: 49.5, actuationDuration: 330, coordinationDelay: 160, techniqueLabel: "correct" },
  { id: "e10", timestamp: "2026-03-09T19:15:00Z", angle: 56.2, flowRate: 44.7, actuationDuration: 290, coordinationDelay: 250, techniqueLabel: "correct" },
  { id: "e11", timestamp: "2026-03-08T08:30:00Z", angle: 49.1, flowRate: 51.8, actuationDuration: 360, coordinationDelay: 140, techniqueLabel: "correct" },
  { id: "e12", timestamp: "2026-03-08T14:00:00Z", angle: 67.5, flowRate: 30.2, actuationDuration: 200, coordinationDelay: 600, techniqueLabel: "incorrect", reason: "Angle too high (67.5°)" },
];

export const alerts: Alert[] = [
  { id: "a1", type: "missed_dose", severity: "warning", title: "Missed Evening Dose", message: "You missed your 6:00 PM dose. Please take it as soon as possible.", timestamp: "2026-03-11T18:30:00Z", read: false },
  { id: "a2", type: "wrong_technique", severity: "warning", title: "Incorrect Technique Detected", message: "Your 12:30 PM dose had an angle of 71.2° (recommended: 45°-60°). Try tilting the inhaler less.", timestamp: "2026-03-11T12:31:00Z", read: false },
  { id: "a3", type: "risk_prediction", severity: "critical", title: "Elevated Risk Detected", message: "AI analysis predicts medium-high risk of symptom flare-up in the next 48 hours based on recent usage patterns.", timestamp: "2026-03-11T09:00:00Z", read: true },
  { id: "a4", type: "overuse", severity: "warning", title: "Potential Overuse", message: "You used your inhaler 6 times yesterday (prescribed: 4). Please consult your doctor if symptoms persist.", timestamp: "2026-03-10T22:00:00Z", read: true },
  { id: "a5", type: "low_flow", severity: "info", title: "Low Inhalation Flow", message: "Your average flow rate has decreased 15% this week. Practice deep, steady breaths.", timestamp: "2026-03-10T10:00:00Z", read: true },
  { id: "a6", type: "device_offline", severity: "info", title: "Device Reconnected", message: "Your smart inhaler reconnected to Wi-Fi after being offline for 2 hours.", timestamp: "2026-03-09T14:00:00Z", read: true },
];

export const patients: Patient[] = [
  { id: "p1", name: "Rahul Sharma", age: 34, condition: "Asthma (Moderate)", prescribedDosesPerDay: 4, adherencePercent: 82, riskLevel: "medium", lastActivity: "2026-03-11T08:15:00Z", deviceStatus: "online", avatar: "RS" },
  { id: "p2", name: "Priya Patel", age: 28, condition: "Asthma (Mild)", prescribedDosesPerDay: 2, adherencePercent: 95, riskLevel: "low", lastActivity: "2026-03-11T07:30:00Z", deviceStatus: "online", avatar: "PP" },
  { id: "p3", name: "Amit Kumar", age: 45, condition: "COPD (Stage II)", prescribedDosesPerDay: 4, adherencePercent: 58, riskLevel: "high", lastActivity: "2026-03-10T19:00:00Z", deviceStatus: "offline", avatar: "AK" },
  { id: "p4", name: "Sneha Reddy", age: 22, condition: "Asthma (Mild)", prescribedDosesPerDay: 2, adherencePercent: 90, riskLevel: "low", lastActivity: "2026-03-11T09:00:00Z", deviceStatus: "online", avatar: "SR" },
  { id: "p5", name: "Vikram Singh", age: 52, condition: "COPD (Stage III)", prescribedDosesPerDay: 6, adherencePercent: 65, riskLevel: "high", lastActivity: "2026-03-10T22:00:00Z", deviceStatus: "offline", avatar: "VS" },
  { id: "p6", name: "Ananya Gupta", age: 31, condition: "Asthma (Moderate)", prescribedDosesPerDay: 4, adherencePercent: 78, riskLevel: "medium", lastActivity: "2026-03-11T06:45:00Z", deviceStatus: "online", avatar: "AG" },
];

export const recommendations: Recommendation[] = [
  { id: "r1", category: "technique", title: "Improve Inhaler Angle", description: "Your average angle is 62°. Try holding the inhaler at 45°-55° for optimal medication delivery. Practice in front of a mirror.", priority: "high", icon: "target" },
  { id: "r2", category: "adherence", title: "Set Evening Reminders", description: "You've missed 40% of evening doses this week. Set a phone alarm for 6:00 PM to build consistency.", priority: "high", icon: "bell" },
  { id: "r3", category: "lifestyle", title: "Monitor Air Quality", description: "AQI in your area is 156 (Unhealthy). Consider staying indoors and keeping your rescue inhaler accessible.", priority: "medium", icon: "wind" },
  { id: "r4", category: "prediction", title: "Upcoming Risk Period", description: "Based on your 14-day pattern, the next 3 days show elevated risk. Ensure medication is taken on schedule.", priority: "high", icon: "alert-triangle" },
  { id: "r5", category: "technique", title: "Breathe More Deeply", description: "Your average flow rate is 38 L/min. Aim for 45+ L/min by taking a slow, deep breath when using the inhaler.", priority: "medium", icon: "lungs" },
  { id: "r6", category: "lifestyle", title: "Track Peak Flow Daily", description: "Recording your peak flow readings alongside inhaler data helps identify trends before symptoms worsen.", priority: "low", icon: "activity" },
];

export const weeklyFlowData = [
  { day: "Mon", avgFlow: 42.3, minFlow: 28.1, maxFlow: 52.7 },
  { day: "Tue", avgFlow: 45.1, minFlow: 35.2, maxFlow: 51.3 },
  { day: "Wed", avgFlow: 38.7, minFlow: 22.4, maxFlow: 48.9 },
  { day: "Thu", avgFlow: 47.2, minFlow: 38.6, maxFlow: 55.1 },
  { day: "Fri", avgFlow: 44.8, minFlow: 32.0, maxFlow: 53.2 },
  { day: "Sat", avgFlow: 46.5, minFlow: 40.1, maxFlow: 54.8 },
  { day: "Sun", avgFlow: 43.9, minFlow: 30.5, maxFlow: 50.6 },
];

export const hourlyUsagePattern = [
  { hour: "6AM", count: 2 }, { hour: "7AM", count: 5 }, { hour: "8AM", count: 8 },
  { hour: "9AM", count: 4 }, { hour: "10AM", count: 1 }, { hour: "11AM", count: 0 },
  { hour: "12PM", count: 6 }, { hour: "1PM", count: 3 }, { hour: "2PM", count: 1 },
  { hour: "3PM", count: 0 }, { hour: "4PM", count: 2 }, { hour: "5PM", count: 4 },
  { hour: "6PM", count: 7 }, { hour: "7PM", count: 5 }, { hour: "8PM", count: 2 },
  { hour: "9PM", count: 1 }, { hour: "10PM", count: 3 }, { hour: "11PM", count: 1 },
];
