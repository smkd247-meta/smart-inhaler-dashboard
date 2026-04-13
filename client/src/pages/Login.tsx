/*
 * Design: Clinical Precision — Swiss Medical Design
 * Login page with split layout: left side hero, right side form
 * Teal primary, DM Sans typography, clean clinical aesthetic
 */
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Stethoscope, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const LOGIN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349106928/Vf5cRhPsscQkwvi2tj2uGF/login-bg-iYEPkC9wwXJiwvimsSMncW.webp";
const HERO_INHALER = "https://d2xsxph8kpxj0f.cloudfront.net/310519663349106928/Vf5cRhPsscQkwvi2tj2uGF/hero-inhaler-6b8fYfQ3cndjaxjQGWiisU.webp";

export default function Login() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password, role);
    if (success) {
      navigate(role === "doctor" ? "/doctor" : "/dashboard");
    } else {
      setError("Invalid credentials. Try any email/password.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left hero panel */}
      <div
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-end"
        style={{
          backgroundImage: `url(${LOGIN_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/80 via-[#0F172A]/50 to-transparent" />
        <div className="relative z-10 p-12 pb-16 max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/90 text-lg font-semibold tracking-tight">Smart Inhaler</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Intelligent Inhaler<br />Monitoring System
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            AI-powered real-time tracking of inhaler technique, medication adherence, and predictive health analytics. Connecting patients and doctors for better respiratory care.
          </p>
          <div className="flex gap-6 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400 metric-value">93%</p>
              <p className="text-xs text-white/50 mt-1">AI Accuracy</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400 metric-value">&lt;2s</p>
              <p className="text-xs text-white/50 mt-1">Data Latency</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-400 metric-value">24/7</p>
              <p className="text-xs text-white/50 mt-1">Monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">Smart Inhaler</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground text-sm mt-1">Sign in to access your dashboard</p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="patient" className="gap-2 text-sm">
                <User className="w-4 h-4" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="doctor" className="gap-2 text-sm">
                <Stethoscope className="w-4 h-4" />
                Doctor
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === "patient" ? "patient@demo.com" : "doctor@demo.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 text-sm font-semibold">
              Sign In as {role === "patient" ? "Patient" : "Doctor"}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Demo Mode:</strong> Enter any email and password. Choose "Patient" to see the patient dashboard or "Doctor" to see the doctor dashboard. All data shown is simulated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
