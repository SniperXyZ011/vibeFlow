export const FEATURE_LIMITS = {
  danceability: { min: 0.0, max: 1.0, step: 0.01, label: 'Danceability' },
  energy: { min: 0.0, max: 1.0, step: 0.01, label: 'Energy' },
  acousticness: { min: 0.0, max: 1.0, step: 0.01, label: 'Acousticness' },
  instrumentalness: { min: 0.0, max: 1.0, step: 0.01, label: 'Instrumentalness' },
  valence: { min: 0.0, max: 1.0, step: 0.01, label: 'Valence' },
  tempo: { min: 50, max: 200, step: 1, label: 'Tempo (BPM)' },
};

export type FeatureKey = keyof typeof FEATURE_LIMITS;

export const DEFAULT_FEATURES: Record<FeatureKey, number> = {
  danceability: 0.5,
  energy: 0.5,
  acousticness: 0.5,
  instrumentalness: 0.0,
  valence: 0.5,
  tempo: 120,
};
