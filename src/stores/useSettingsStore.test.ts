import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from './useSettingsStore';
import type { ExportQuality, MeasurementUnit } from './useSettingsStore';

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      hapticFeedback: true,
      autoSave: true,
      exportQuality: 'high',
      measurementUnit: 'metric',
    });
  });

  describe('initial state', () => {
    it('has the correct defaults', () => {
      const { hapticFeedback, autoSave, exportQuality, measurementUnit } =
        useSettingsStore.getState();
      expect(hapticFeedback).toBe(true);
      expect(autoSave).toBe(true);
      expect(exportQuality).toBe('high');
      expect(measurementUnit).toBe('metric');
    });
  });

  describe('toggleHapticFeedback', () => {
    it('flips hapticFeedback from true to false', () => {
      useSettingsStore.getState().toggleHapticFeedback();
      expect(useSettingsStore.getState().hapticFeedback).toBe(false);
    });

    it('flips hapticFeedback from false to true', () => {
      useSettingsStore.getState().toggleHapticFeedback();
      useSettingsStore.getState().toggleHapticFeedback();
      expect(useSettingsStore.getState().hapticFeedback).toBe(true);
    });
  });

  describe('toggleAutoSave', () => {
    it('flips autoSave from true to false', () => {
      useSettingsStore.getState().toggleAutoSave();
      expect(useSettingsStore.getState().autoSave).toBe(false);
    });

    it('flips autoSave from false to true', () => {
      useSettingsStore.getState().toggleAutoSave();
      useSettingsStore.getState().toggleAutoSave();
      expect(useSettingsStore.getState().autoSave).toBe(true);
    });
  });

  describe('setExportQuality', () => {
    it('changes the export quality', () => {
      const qualities: ExportQuality[] = ['low', 'medium', 'high'];
      for (const quality of qualities) {
        useSettingsStore.getState().setExportQuality(quality);
        expect(useSettingsStore.getState().exportQuality).toBe(quality);
      }
    });
  });

  describe('setMeasurementUnit', () => {
    it('changes the measurement unit', () => {
      const units: MeasurementUnit[] = ['metric', 'imperial'];
      for (const unit of units) {
        useSettingsStore.getState().setMeasurementUnit(unit);
        expect(useSettingsStore.getState().measurementUnit).toBe(unit);
      }
    });
  });
});
