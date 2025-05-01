import { FeatureMap } from "../features/config";

export const fetchRemoteFeatures = async (): Promise<Partial<FeatureMap>> => {
  try {
    const response = await fetch("https://api.example.com/feature-flags");
    if (!response.ok) throw new Error("Failed to fetch features");
    return (await response.json()) as Partial<FeatureMap>;
  } catch (error) {
    console.error("Error fetching remote features:", error);
    return {};
  }
};
