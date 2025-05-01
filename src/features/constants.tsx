export const FEATURES = {
  CALCULATOR: "calculator",
  NOTE_EDITOR: "noteEditor",
  IMAGE_CROPPER: "imageCropper",
  COLOR_PICKER: "colorPicker",
  CODE_EDITOR: "codeEditor",
} as const;

export type FeatureKey = keyof typeof FEATURES;
export type FeatureId = (typeof FEATURES)[FeatureKey];
