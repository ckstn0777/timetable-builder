// src/hooks/useTimetableSettings.ts
import { useState, useCallback } from "react";
import { getDefaultSettings } from "@/lib/storage";
import type { TimetableSettings } from "@/types";

export function useTimetableSettings() {
  const [settings, setSettings] = useState<TimetableSettings>(
    getDefaultSettings()
  );

  const updateSettings = useCallback((updates: Partial<TimetableSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(getDefaultSettings());
  }, []);

  return {
    settings,
    setSettings, // 초기화용
    updateSettings,
    resetSettings,
  };
}
