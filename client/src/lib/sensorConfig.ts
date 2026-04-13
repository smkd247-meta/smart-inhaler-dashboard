// ============================================================
// SENSOR CONFIGURATION FILE
// ============================================================
// This is the ONLY file you need to edit to add/remove sensors.
// The entire dashboard will automatically adapt.
//
// HOW TO ADD A NEW SENSOR:
//   1. Add a new entry to the SENSOR_CONFIG array below
//   2. Add the matching field in your ThingSpeak channel
//   3. That's it! The dashboard will show it automatically.
//
// HOW TO REMOVE A SENSOR:
//   1. Delete (or comment out) the entry from SENSOR_CONFIG
//   2. The dashboard will stop showing it automatically.
// ============================================================

export interface SensorConfig {
  id: string;                    // Unique sensor ID (e.g., "temperature")
  name: string;                  // Display name (e.g., "Temperature")
  unit: string;                  // Unit of measurement (e.g., "°C")
  thingSpeakField: string;       // ThingSpeak field name (e.g., "field1")
  icon: string;                  // Lucide icon name (e.g., "thermometer")
  color: string;                 // Chart/card color (hex or tailwind)
  chartColor: string;            // Recharts line color
  min: number;                   // Expected minimum value (for gauge display)
  max: number;                   // Expected maximum value (for gauge display)
  warningThreshold?: number;     // Value above which to show warning (optional)
  criticalThreshold?: number;    // Value above which to show critical alert (optional)
  description: string;           // Short description of what this sensor measures
  enabled: boolean;              // Set to false to hide without deleting
}

// ============================================================
// THINGSPEAK CONFIGURATION
// ============================================================
// Replace these with your actual ThingSpeak values.
// Channel ID: the number from your ThingSpeak channel URL
// Read API Key: found in ThingSpeak > Your Channel > API Keys tab
// ============================================================

export const THINGSPEAK_CONFIG = {
  channelId: "3313355",          // ← Replace with your Channel ID
  readApiKey: "2J091DGKTN81W4ZW",       // ← Replace with your Read API Key
  baseUrl: "https://api.thingspeak.com",
  updateIntervalMs: 15000,               // How often to fetch new data (15 seconds)
};

// ============================================================
// YOUR SENSORS — ADD, REMOVE, OR EDIT HERE
// ============================================================
// Each sensor maps to one ThingSpeak field (field1, field2, etc.)
// ThingSpeak supports up to 8 fields per channel.
//
// To ADD a sensor: copy any block below, paste it at the end,
//   and change the values.
// To REMOVE a sensor: delete the block OR set enabled: false
// To TEMPORARILY HIDE a sensor: set enabled: false
// ============================================================

export const SENSOR_CONFIG: SensorConfig[] = [

  // ── SENSOR 1: Temperature (DHT11) ──
  {
    id: "temperature",
    name: "Temperature",
    unit: "°C",
    thingSpeakField: "field1",
    icon: "thermometer",
    color: "#ef4444",              // Red
    chartColor: "#ef4444",
    min: 0,
    max: 50,
    warningThreshold: 35,
    criticalThreshold: 40,
    description: "Ambient temperature from DHT11 sensor",
    enabled: false,
  },

  // ── SENSOR 2: Humidity (DHT11) ──
  {
    id: "humidity",
    name: "Humidity",
    unit: "%",
    thingSpeakField: "field2",
    icon: "droplets",
    color: "#3b82f6",              // Blue
    chartColor: "#3b82f6",
    min: 0,
    max: 100,
    warningThreshold: 80,
    criticalThreshold: 90,
    description: "Relative humidity from DHT11 sensor",
    enabled: false,
  },

  // ── SENSOR 3: Air Quality (MQ135) ──
  {
    id: "airQuality",
    name: "Air Quality",
    unit: "PPM",
    thingSpeakField: "field3",
    icon: "wind",
    color: "#f59e0b",              // Amber
    chartColor: "#f59e0b",
    min: 0,
    max: 1000,
    warningThreshold: 200,
    criticalThreshold: 400,
    description: "Air quality index from MQ135 gas sensor",
    enabled: false,
  },

  // ── SENSOR 4: Dose Count (Push Button) ──
  {
    id: "doseCount",
    name: "Dose Count",
    unit: "doses",
    thingSpeakField: "field4",
    icon: "pill",
    color: "#10b981",              // Emerald
    chartColor: "#10b981",
    min: 0,
    max: 20,
    warningThreshold: 8,
    criticalThreshold: 12,
    description: "Number of inhaler doses taken today",
    enabled: false,
  },
  
  // ── SENSOR: Total Dose ──
  {
    id: "totalDose",
    name: "Total Dose",
    unit: "count",
    thingSpeakField: "field1",
    icon: "pill",
    color: "#10b981",
    chartColor: "#10b981",
    min: 0,
    max: 500,
    warningThreshold: 300,
    criticalThreshold: 400,
    description: "Total inhaler usage",
    enabled: true,
  },
  
  // ── SENSOR: Daily Dose ──
  {
    id: "dailyDose",
    name: "Daily Dose",
    unit: "count",
    thingSpeakField: "field2",
    icon: "activity",
    color: "#3b82f6",
    chartColor: "#3b82f6",
    min: 0,
    max: 20,
    warningThreshold: 8,
    criticalThreshold: 12,
    description: "Daily inhaler usage",
    enabled: true,
  },
  
  

  // ── EXAMPLE: How to add a new sensor ──
  // Uncomment the block below and change the values:
  //
  // {
  //   id: "heartRate",
  //   name: "Heart Rate",
  //   unit: "BPM",
  //   thingSpeakField: "field5",
  //   icon: "heart-pulse",
  //   color: "#ec4899",
  //   chartColor: "#ec4899",
  //   min: 40,
  //   max: 200,
  //   warningThreshold: 120,
  //   criticalThreshold: 150,
  //   description: "Heart rate from pulse sensor",
  //   enabled: true,
  // },

];

// ============================================================
// HELPER FUNCTIONS — DON'T CHANGE BELOW THIS LINE
// ============================================================

/** Get only enabled sensors */
export function getActiveSensors(): SensorConfig[] {
  return SENSOR_CONFIG.filter(s => s.enabled);
}

/** Get a sensor by its ID */
export function getSensorById(id: string): SensorConfig | undefined {
  return SENSOR_CONFIG.find(s => s.id === id);
}

/** Get a sensor by its ThingSpeak field */
export function getSensorByField(field: string): SensorConfig | undefined {
  return SENSOR_CONFIG.find(s => s.thingSpeakField === field);
}

/** Check if a value is in warning range */
export function isWarning(sensor: SensorConfig, value: number): boolean {
  if (sensor.warningThreshold === undefined) return false;
  if (sensor.criticalThreshold !== undefined && value >= sensor.criticalThreshold) return false;
  return value >= sensor.warningThreshold;
}

/** Check if a value is in critical range */
export function isCritical(sensor: SensorConfig, value: number): boolean {
  if (sensor.criticalThreshold === undefined) return false;
  return value >= sensor.criticalThreshold;
}

/** Get status color for a sensor value */
export function getStatusColor(sensor: SensorConfig, value: number): string {
  if (isCritical(sensor, value)) return "text-red-500";
  if (isWarning(sensor, value)) return "text-amber-500";
  return "text-emerald-500";
}

/** Get status label for a sensor value */
export function getStatusLabel(sensor: SensorConfig, value: number): string {
  if (isCritical(sensor, value)) return "Critical";
  if (isWarning(sensor, value)) return "Warning";
  return "Normal";
}

/** Get status badge variant */
export function getStatusBadge(sensor: SensorConfig, value: number): "destructive" | "warning" | "success" {
  if (isCritical(sensor, value)) return "destructive";
  if (isWarning(sensor, value)) return "warning";
  return "success";
}
