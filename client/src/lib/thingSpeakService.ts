// ============================================================
// THINGSPEAK DATA SERVICE
// ============================================================
// This file handles all communication with ThingSpeak.
// It reads the sensor config and fetches data for each sensor.
// You should NOT need to edit this file.
// ============================================================

import {
  THINGSPEAK_CONFIG,
  getActiveSensors,
  type SensorConfig,
} from "./sensorConfig";

export interface SensorReading {
  sensorId: string;
  value: number;
  timestamp: string;
}

export interface SensorSnapshot {
  [sensorId: string]: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  [sensorId: string]: string | number;
}

// Check if ThingSpeak is configured (user has entered their keys)
export function isThingSpeakConfigured(): boolean {
  return (
    THINGSPEAK_CONFIG.channelId !== "YOUR_CHANNEL_ID" &&
    THINGSPEAK_CONFIG.readApiKey !== "YOUR_READ_API_KEY" &&
    THINGSPEAK_CONFIG.channelId.length > 0 &&
    THINGSPEAK_CONFIG.readApiKey.length > 0
  );
}

// Fetch the latest single reading from ThingSpeak
export async function fetchLatestReading(): Promise<SensorSnapshot | null> {
  if (!isThingSpeakConfigured()) return null;

  const url = `${THINGSPEAK_CONFIG.baseUrl}/channels/${THINGSPEAK_CONFIG.channelId}/feeds/last.json?api_key=${THINGSPEAK_CONFIG.readApiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const feed = await response.json();

    const snapshot: SensorSnapshot = {};
    const sensors = getActiveSensors();

    for (const sensor of sensors) {
      const rawValue = feed[sensor.thingSpeakField];
      if (rawValue !== null && rawValue !== undefined) {
        snapshot[sensor.id] = parseFloat(rawValue) || 0;
      }
    }

    return snapshot;
  } catch (error) {
    console.error("ThingSpeak fetch error:", error);
    return null;
  }
}

// Fetch historical data (time series) from ThingSpeak
export async function fetchHistoricalData(
  numResults: number = 100
): Promise<TimeSeriesPoint[]> {
  if (!isThingSpeakConfigured()) return [];

  const url = `${THINGSPEAK_CONFIG.baseUrl}/channels/${THINGSPEAK_CONFIG.channelId}/feeds.json?api_key=${THINGSPEAK_CONFIG.readApiKey}&results=${numResults}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const sensors = getActiveSensors();

    return (data.feeds || []).map((feed: any) => {
      const point: TimeSeriesPoint = {
        timestamp: feed.created_at,
      };

      for (const sensor of sensors) {
        const rawValue = feed[sensor.thingSpeakField];
        point[sensor.id] =
          rawValue !== null && rawValue !== undefined
            ? parseFloat(rawValue) || 0
            : 0;
      }

      return point;
    });
  } catch (error) {
    console.error("ThingSpeak historical fetch error:", error);
    return [];
  }
}

// Generate mock data for demo mode (when ThingSpeak is not configured)
export function generateMockSnapshot(): SensorSnapshot {
  const sensors = getActiveSensors();
  const snapshot: SensorSnapshot = {};

  for (const sensor of sensors) {
    const range = sensor.max - sensor.min;
    const midpoint = sensor.min + range * 0.4;
    const variance = range * 0.2;
    snapshot[sensor.id] =
      Math.round((midpoint + (Math.random() - 0.5) * variance) * 10) / 10;
  }

  return snapshot;
}

// Generate mock time series for demo mode
export function generateMockTimeSeries(points: number = 50): TimeSeriesPoint[] {
  const sensors = getActiveSensors();
  const data: TimeSeriesPoint[] = [];
  const now = new Date();

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000); // 15-min intervals
    const point: TimeSeriesPoint = {
      timestamp: timestamp.toISOString(),
    };

    for (const sensor of sensors) {
      const range = sensor.max - sensor.min;
      const midpoint = sensor.min + range * 0.4;
      const variance = range * 0.15;
      const trend = Math.sin(i / 8) * variance * 0.3;
      point[sensor.id] =
        Math.round(
          (midpoint + trend + (Math.random() - 0.5) * variance) * 10
        ) / 10;
    }

    data.push(point);
  }

  return data;
}
