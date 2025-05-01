import { FEATURES, FeatureId } from "./constants";

export type FeatureMap = {
  [K in FeatureId]: boolean;
};

const defaultFeatures: FeatureMap = {
  [FEATURES.CALCULATOR]: true,
  [FEATURES.NOTE_EDITOR]: true,
  [FEATURES.IMAGE_CROPPER]: false,
  [FEATURES.COLOR_PICKER]: true,
  [FEATURES.CODE_EDITOR]: false,
};

export const getFeatureConfig = (): FeatureMap => {
  const storedConfig = localStorage.getItem("featureFlags");
  if (storedConfig) {
    try {
      const parsedConfig = JSON.parse(storedConfig);
      return { ...defaultFeatures, ...parsedConfig };
    } catch (e) {
      console.error("Error parsing stored feature flags", e);
    }
  }
  return defaultFeatures;
};
