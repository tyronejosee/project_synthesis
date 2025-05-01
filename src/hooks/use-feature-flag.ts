import { useContext } from "react";
import { FeatureContext } from "../features/feature-provider";
import { FeatureId } from "../features/constants";

type UseFeatureFlagResult = {
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
};

export const useFeatureFlag = (featureKey: FeatureId): UseFeatureFlagResult => {
  const { isFeatureEnabled, updateFeature } = useContext(FeatureContext);

  return {
    isEnabled: isFeatureEnabled(featureKey),
    enable: () => updateFeature(featureKey, true),
    disable: () => updateFeature(featureKey, false),
    toggle: () => updateFeature(featureKey, !isFeatureEnabled(featureKey)),
  };
};
