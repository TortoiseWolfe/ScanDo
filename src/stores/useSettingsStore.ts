import { create } from 'zustand';

export type ExportQuality = 'low' | 'medium' | 'high';
export type MeasurementUnit = 'metric' | 'imperial';

interface SettingsState {
  /** Whether haptic feedback is enabled during scanning. */
  hapticFeedback: boolean;
  /** Whether scans are automatically saved on completion. */
  autoSave: boolean;
  /** Default export mesh quality. */
  exportQuality: ExportQuality;
  /** Measurement display units. */
  measurementUnit: MeasurementUnit;
}

interface SettingsActions {
  toggleHapticFeedback: () => void;
  toggleAutoSave: () => void;
  setExportQuality: (quality: ExportQuality) => void;
  setMeasurementUnit: (unit: MeasurementUnit) => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>(
  (set) => ({
    hapticFeedback: true,
    autoSave: true,
    exportQuality: 'high',
    measurementUnit: 'metric',

    toggleHapticFeedback: () =>
      set((state) => ({ hapticFeedback: !state.hapticFeedback })),

    toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),

    setExportQuality: (quality) => set({ exportQuality: quality }),

    setMeasurementUnit: (unit) => set({ measurementUnit: unit }),
  }),
);
