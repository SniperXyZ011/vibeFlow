import { create } from 'zustand';
import { getPrediction } from '../services/api';
import { DEFAULT_FEATURES, type FeatureKey } from '../utils/constants';

interface PredictionState {
  features: Record<FeatureKey, number>;
  prediction: number | null;
  isLoading: boolean;
  error: string | null;
  setFeature: (key: FeatureKey, value: number) => void;
  fetchPrediction: () => Promise<void>;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  features: DEFAULT_FEATURES,
  prediction: null,
  isLoading: false,
  error: null,
  setFeature: (key, value) => 
    set((state) => ({
      features: { ...state.features, [key]: value },
      error: null, // Clear error when user changes input
    })),
  fetchPrediction: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getPrediction(get().features);
      const predValue = response.prediction_score;
      set({ prediction: Number(predValue), isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
