import { requireNativeModule } from 'expo-modules-core';
import type { ScandoStorekitModuleInterface } from './ScandoStorekit.types';

export const ScandoStorekit =
  requireNativeModule<ScandoStorekitModuleInterface>('ScandoStorekit');
