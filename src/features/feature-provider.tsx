import React, { createContext, useState, useCallback, ReactNode } from "react";
import { FeatureMap, getFeatureConfig } from "./config";
import { FeatureId } from "./constants";

interface FeatureContextType {
  features: FeatureMap;
  isFeatureEnabled: (featureKey: FeatureId) => boolean;
  updateFeature: (featureKey: FeatureId, isEnabled: boolean) => void;
}

export const FeatureContext = createContext<FeatureContextType>({
  features: {} as FeatureMap,
  isFeatureEnabled: () => false,
  updateFeature: () => {},
});

type FeatureProviderProps = {
  children: ReactNode;
};

export const FeatureProvider: React.FC<FeatureProviderProps> = ({
  children,
}) => {
  const [features, setFeatures] = useState<FeatureMap>(getFeatureConfig());

  const isFeatureEnabled = useCallback(
    (featureKey: FeatureId): boolean => {
      return !!features[featureKey];
    },
    [features]
  );

  const updateFeature = useCallback(
    (featureKey: FeatureId, isEnabled: boolean): void => {
      setFeatures((prev) => {
        const newFeatures = { ...prev, [featureKey]: isEnabled };
        localStorage.setItem("featureFlags", JSON.stringify(newFeatures));
        return newFeatures;
      });
    },
    []
  );

  return (
    <FeatureContext.Provider
      value={{ features, isFeatureEnabled, updateFeature }}
    >
      {children}
    </FeatureContext.Provider>
  );
};
