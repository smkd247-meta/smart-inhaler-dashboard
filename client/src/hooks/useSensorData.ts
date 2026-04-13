// ============================================================
// LIVE SENSOR DATA HOOK
// ============================================================
// Use this hook in any component to get live sensor readings.
// It auto-fetches from ThingSpeak if configured, or uses mock data.
// ============================================================

import { useEffect, useState, useCallback } from "react";
import {
  THINGSPEAK_CONFIG,
  getActiveSensors,
  type SensorConfig,
} from "@/lib/sensorConfig";
import {
  isThingSpeakConfigured,
  fetchLatestReading,
  fetchHistoricalData,
  generateMockSnapshot,
  generateMockTimeSeries,
  type SensorSnapshot,
  type TimeSeriesPoint,
} from "@/lib/thingSpeakService";

interface UseSensorDataReturn {
  /** Current sensor values */
  current: SensorSnapshot;
  /** Historical time series data */
  history: TimeSeriesPoint[];
  /** List of active sensors from config */
  sensors: SensorConfig[];
  /** Whether data is being loaded */
  loading: boolean;
  /** Whether we're using live ThingSpeak data or mock data */
  isLive: boolean;
  /** Last time data was updated */
  lastUpdated: Date | null;
  /** Any error message */
  error: string | null;
  /** Manually refresh data */
  refresh: () => Promise<void>;
}

export function useSensorData(): UseSensorDataReturn {
  const [current, setCurrent] = useState<SensorSnapshot>({});
  const [history, setHistory] = useState<TimeSeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sensors = getActiveSensors();
  const isLive = isThingSpeakConfigured();

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      if (isLive) {
        // Fetch real data from ThingSpeak
        const [snapshot, timeSeries] = await Promise.all([
          fetchLatestReading(),
          fetchHistoricalData(50),
        ]);

        if (snapshot) setCurrent(snapshot);
        if (timeSeries.length > 0) setHistory(timeSeries);
      } else {
        // Use mock data for demo
        setCurrent(generateMockSnapshot());
        setHistory(generateMockTimeSeries(50));
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [isLive]);

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval
    const interval = setInterval(
      fetchData,
      isLive ? THINGSPEAK_CONFIG.updateIntervalMs : 30000
    );

    return () => clearInterval(interval);
  }, [fetchData, isLive]);

  return {
    current,
    history,
    sensors,
    loading,
    isLive,
    lastUpdated,
    error,
    refresh: fetchData,
  };
}
