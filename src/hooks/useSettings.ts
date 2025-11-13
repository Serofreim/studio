import { useState, useEffect, useCallback, useRef } from "react";
import { load, Store } from "@tauri-apps/plugin-store";

interface Settings {
  projectPath: string | null;
}

const DEFAULT_SETTINGS: Settings & { [key: string]: unknown } = {
  projectPath: null,
};

let storeInstance: Store | null = null;
let storeLoadingPromise: Promise<Store> | null = null;

async function getStore(): Promise<Store> {
  if (storeInstance) {
    return storeInstance;
  }

  if (storeLoadingPromise) {
    return storeLoadingPromise;
  }

  storeLoadingPromise = load("settings.json", {
    autoSave: true,
    defaults: DEFAULT_SETTINGS,
  });

  storeInstance = await storeLoadingPromise;
  return storeInstance;
}

let globalLoading = true;
let globalSettings: Settings = DEFAULT_SETTINGS;
const settingsListeners = new Set<() => void>();

// Initialize store loading on module load
let initPromise: Promise<void> | null = null;

async function initializeSettings() {
  try {
    const store = await getStore();
    const projectPath = await store.get<string>("projectPath");
    globalSettings = {
      projectPath: projectPath ?? DEFAULT_SETTINGS.projectPath,
    };
  } catch (error) {
    console.error("Failed to initialize settings:", error);
  } finally {
    globalLoading = false;
    settingsListeners.forEach((listener) => listener());
  }
}

if (!initPromise) {
  initPromise = initializeSettings();
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(globalSettings);
  const [loading, setLoading] = useState(globalLoading);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // If already loaded, update immediately
    if (!globalLoading) {
      setSettings(globalSettings);
      setLoading(false);
      return;
    }

    // Add listener for when settings are loaded
    const listener = () => {
      if (isMountedRef.current) {
        setSettings(globalSettings);
        setLoading(globalLoading);
      }
    };

    settingsListeners.add(listener);

    return () => {
      isMountedRef.current = false;
      settingsListeners.delete(listener);
    };
  }, []);

  const updateProjectPath = useCallback(async (path: string) => {
    try {
      const store = await getStore();
      await store.set("projectPath", path);
      globalSettings = { projectPath: path };
      if (isMountedRef.current) {
        setSettings({ projectPath: path });
      }
      // Notify all listeners
      settingsListeners.forEach((listener) => listener());
    } catch (error) {
      console.error("Failed to update project path:", error);
      throw error;
    }
  }, []);

  return {
    settings,
    loading,
    updateProjectPath,
  };
}
