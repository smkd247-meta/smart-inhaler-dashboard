/*
 * Design: Clinical Precision — Swiss Medical Design
 * Landing page: Hero with CTA, feature highlights, how it works
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity, ArrowRight, BarChart3, Bell, Brain, CheckCircle2,
  Cpu, Shield, Smartphone, Stethoscope, Target, Wind, Wifi
} from "lucide-react";
import { Link } from "wouter";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349106928/Vf5cRhPsscQkwvi2tj2uGF/hero-inhaler-6b8fYfQ3cndjaxjQGWiisU.webp";
const PATTERN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349106928/Vf5cRhPsscQkwvi2tj2uGF/dashboard-bg-pattern-MmcDNBUvVCajF3UUR8qSAN.webp";

const features = [
  { icon: Target, title: "Technique Detection", desc: "AI classifies inhaler angle, flow rate, and coordination in real-time using Random Forest models." },
  { icon: BarChart3, title: "Adherence Tracking", desc: "Automated dose counting with daily/weekly adherence scoring and trend visualization." },
  { icon: Brain, title: "Predictive Analytics", desc: "LSTM neural networks predict symptom flare-ups 48 hours in advance based on usage patterns." },
  { icon: Bell, title: "Smart Alerts", desc: "Instant notifications for missed doses, incorrect technique, overuse, and risk predictions." },
  { icon: Stethoscope, title: "Doctor Dashboard", desc: "Physicians monitor all patients, view risk distributions, and access detailed analytics." },
  { icon: Shield, title: "Secure & Private", desc: "End-to-end encrypted data transmission with Firebase cloud infrastructure." },
];

const steps = [
  { num: "01", title: "Use Your Inhaler", desc: "Sensors on the smart inhaler capture angle, airflow, and actuation data automatically." },
  { num: "02", title: "Data Transmitted", desc: "ESP32 sends sensor readings to the cloud via Wi-Fi in under 2 seconds." },
  { num: "03", title: "AI Analyzes", desc: "Machine learning models classify technique and calculate adherence scores." },
  { num: "04", title: "Get Insights", desc: "View personalized recommendations, alerts, and trends on your dashboard." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${PATTERN_BG})`, backgroundSize: "cover" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
                <Wind className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-foreground tracking-tight">Smart Inhaler</span>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-2 text-sm">
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 mb-6">
                <Cpu className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-xs font-medium text-teal-700">AI + IoT Powered</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] mb-5">
                Intelligent Inhaler<br />
                <span className="text-teal-600">Monitoring System</span>
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-lg mb-8">
                Real-time tracking of inhaler technique, medication adherence, and predictive health analytics. Powered by ESP32 sensors, Random Forest classification, and LSTM neural networks.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button size="lg" className="gap-2 text-sm font-semibold h-12 px-6">
                    Open Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-sm h-12 px-6">
                  Learn More
                </Button>
              </div>
              <div className="flex gap-8 mt-10">
                <div>
                  <p className="metric-value text-2xl text-teal-600">93%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">AI Accuracy</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="metric-value text-2xl text-teal-600">&lt;2s</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Latency</p>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <p className="metric-value text-2xl text-teal-600">24/7</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Monitoring</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-teal-100/30 rounded-2xl blur-2xl" />
                <img
                  src={HERO_IMG}
                  alt="Smart inhaler device"
                  className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-3">Key Features</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Comprehensive monitoring powered by IoT sensors and artificial intelligence
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Card key={i} className="border-border/60 hover:border-teal-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              From sensor data to actionable insights in four simple steps
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-bold text-teal-100 mb-3 metric-value">{step.num}</div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-3 w-5 h-5 text-teal-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">Technology Stack</h2>
            <p className="text-sm text-white/60">Built with industry-leading hardware and software</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "ESP32", sub: "Microcontroller" },
              { label: "MPU6050", sub: "Accelerometer" },
              { label: "Firebase", sub: "Cloud Backend" },
              { label: "Random Forest", sub: "AI Classification" },
            ].map((tech, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-base font-semibold text-teal-400 metric-value">{tech.label}</p>
                <p className="text-xs text-white/50 mt-1">{tech.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-foreground">Smart Inhaler Monitoring System</span>
          </div>
          <p className="text-xs text-muted-foreground">Final Year Project &middot; 2026</p>
        </div>
      </footer>
    </div>
  );
}
