import { useState, useEffect, useCallback } from "react";
import { load, Store } from "@tauri-apps/plugin-store";

interface Settings {
  projectPath: string | null;
  // Add more settings here as needed:
  // theme: 'light' | 'dark';
  // fontSize: number;
}

const DEFAULT_SETTINGS: Settings & { [key: string]: unknown } = {
  projectPath: null,
};

let storeInstance: Store | null = null;

async function getStore(): Promise<Store> {
  if (!storeInstance) {
    storeInstance = await load("settings.json", {
      autoSave: true,
      defaults: DEFAULT_SETTINGS,
    });
  }
  return storeInstance;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const store = await getStore();

        const projectPath = await store.get<string>("projectPath");
        // Load more settings here:
        // const theme = await store.get<string>('theme');

        setSettings((prev) => ({
          ...prev,
          projectPath: projectPath ?? DEFAULT_SETTINGS.projectPath,
        }));
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const updateProjectPath = useCallback(async (path: string) => {
    try {
      const store = await getStore();
      await store.set("projectPath", path);
      setSettings((prev) => ({ ...prev, projectPath: path }));
    } catch (error) {
      console.error("Failed to update project path:", error);
    }
  }, []);

  // Add more update functions here:
  // const updateTheme = useCallback(async (theme: 'light' | 'dark') => {
  //   try {
  //     const store = await getStore();
  //     await store.set('theme', theme);
  //     setSettings(prev => ({ ...prev, theme }));
  //   } catch (error) {
  //     console.error('Failed to update theme:', error);
  //   }
  // }, []);

  const clearSettings = useCallback(async () => {
    try {
      const store = await getStore();
      await store.clear();
      setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Failed to clear settings:", error);
    }
  }, []);

  return {
    settings,
    loading,
    updateProjectPath,
    clearSettings,
    // Add more update functions to the return object:
    // updateTheme,
  };
}
