export const FEATURE_LIMITS = {
  bpm: { min: 50, max: 210, step: 1, label: 'Tempo (BPM)' },
  'danceability_%': { min: 0, max: 100, step: 1, label: 'Danceability (%)' },
  'valence_%': { min: 0, max: 100, step: 1, label: 'Valence (%)' },
  'energy_%': { min: 0, max: 100, step: 1, label: 'Energy (%)' },
  'acousticness_%': { min: 0, max: 100, step: 1, label: 'Acousticness (%)' },
  'instrumentalness_%': { min: 0, max: 100, step: 1, label: 'Instrumentalness (%)' },
  'liveness_%': { min: 0, max: 100, step: 1, label: 'Liveness (%)' },
  'speechiness_%': { min: 0, max: 100, step: 1, label: 'Speechiness (%)' },
  artist_count: { min: 1, max: 10, step: 1, label: 'Artist Count' },
  released_month: { min: 1, max: 12, step: 1, label: 'Released Month' },
};

export type FeatureKey = keyof typeof FEATURE_LIMITS;

export const DEFAULT_FEATURES: Record<FeatureKey, number> = {
  bpm: 120,
  'danceability_%': 60,
  'valence_%': 50,
  'energy_%': 70,
  'acousticness_%': 20,
  'instrumentalness_%': 0,
  'liveness_%': 15,
  'speechiness_%': 8,
  artist_count: 1,
  released_month: 6,
};
