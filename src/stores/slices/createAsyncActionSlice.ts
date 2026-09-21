import { StateCreator } from 'zustand';

export type FeatureSlice<K extends string, TConfig, TMode> = {
  [P in `${K}Config`]: TConfig;
} & {
  [P in `${K}Mode`]: TMode;
} & {
  [P in `set${Capitalize<K>}Config`]: (config: Partial<TConfig>) => void;
} & {
  [P in `update${Capitalize<K>}Config`]: (config: Partial<TConfig>) => void;
} & {
  [P in `reset${Capitalize<K>}Config`]: () => void;
} & {
  [P in `set${Capitalize<K>}Mode`]: (mode: TMode) => void;
};

export function createAsyncActionSlice<K extends string, TConfig, TMode>(
  key: K,
  defaultConfig: TConfig,
  defaultMode: TMode,
  resetModeTo?: TMode
): StateCreator<FeatureSlice<K, TConfig, TMode>, [], [], FeatureSlice<K, TConfig, TMode>> {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const capKey = capitalize(key);

  const configKey = `${key}Config` as keyof FeatureSlice<K, TConfig, TMode>;
  const modeKey = `${key}Mode` as keyof FeatureSlice<K, TConfig, TMode>;
  const setConfigKey = `set${capKey}Config` as keyof FeatureSlice<K, TConfig, TMode>;
  const updateConfigKey = `update${capKey}Config` as keyof FeatureSlice<K, TConfig, TMode>;
  const resetConfigKey = `reset${capKey}Config` as keyof FeatureSlice<K, TConfig, TMode>;
  const setModeKey = `set${capKey}Mode` as keyof FeatureSlice<K, TConfig, TMode>;

  return (set) => ({
    [configKey]: defaultConfig,
    [modeKey]: defaultMode,
    [setConfigKey]: (config: Partial<TConfig>) =>
      set((state) => ({
        [configKey]: { ...(state[configKey] as any), ...config },
      }) as any),
    [updateConfigKey]: (config: Partial<TConfig>) =>
      set((state) => ({
        [configKey]: { ...(state[configKey] as any), ...config },
      }) as any),
    [resetConfigKey]: () =>
      set(() => {
        const resetState: any = { [configKey]: defaultConfig };
        if (resetModeTo !== undefined) {
          resetState[modeKey] = resetModeTo;
        }
        return resetState;
      }),
    [setModeKey]: (mode: TMode) => set({ [modeKey]: mode } as any),
  } as any);
}
