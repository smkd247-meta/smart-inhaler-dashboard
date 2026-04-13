/*
 * Design: Clinical Precision — Swiss Medical Design
 * Settings page: Profile, notifications, device config
 */
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Bluetooth, Shield, User, Wifi } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();

  const handleSave = () => {
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated.",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile, notifications, and device preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Full Name</Label>
                <Input defaultValue={user?.name || ""} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Email</Label>
                <Input defaultValue={user?.email || ""} className="h-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Phone</Label>
                <Input defaultValue="+91 98765 43210" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Role</Label>
                <Input defaultValue={user?.role === "doctor" ? "Doctor" : "Patient"} disabled className="h-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Missed Dose Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when a scheduled dose is missed</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Technique Warnings</p>
                <p className="text-xs text-muted-foreground">Alert when incorrect technique is detected</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Risk Predictions</p>
                <p className="text-xs text-muted-foreground">Receive predictive health risk notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Daily Summary</p>
                <p className="text-xs text-muted-foreground">Receive a daily usage summary at 9 PM</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Device settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wifi className="w-4 h-4 text-teal-600" />
              Device Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Bluetooth className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Smart Inhaler v2.1</p>
                  <p className="text-xs text-muted-foreground">Device ID: SI-2026-0311-A</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 status-pulse" />
                <span className="text-xs text-emerald-600">Connected</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Data Sync Interval</Label>
                <Input defaultValue="30 seconds" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Firmware Version</Label>
                <Input defaultValue="v1.4.2" disabled className="h-10" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <Button variant="outline" size="sm" className="text-xs">
              Change Password
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-8">
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
