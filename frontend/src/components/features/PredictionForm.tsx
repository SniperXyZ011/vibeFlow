import React from 'react';
import { usePredictionStore } from '../../store/usePredictionStore';
import { FEATURE_LIMITS, type FeatureKey } from '../../utils/constants';
import { Spinner } from '../ui/Spinner';
import { Sparkles, AlertCircle } from 'lucide-react';

export const PredictionForm = () => {
  const { features, setFeature, fetchPrediction, isLoading, error } = usePredictionStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrediction();
  };

  return (
    <div className="w-full max-w-2xl bg-surface rounded-2xl border border-white/5 p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
      {/* Subtle background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Audio Features
        </h2>
        <p className="text-textSecondary mt-2">Adjust the sliders to shape the track's DNA.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {(Object.keys(FEATURE_LIMITS) as FeatureKey[]).map((key) => {
            const limit = FEATURE_LIMITS[key];
            const value = features[key];
            
            return (
              <div key={key} className="space-y-3 group/slider">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-textPrimary capitalize tracking-wide">
                    {limit.label}
                  </label>
                  <span className="text-xs font-mono bg-surfaceHighlight px-2 py-1 rounded text-primary border border-primary/20 shadow-[0_0_10px_rgba(29,185,84,0.1)]">
                    {Math.round(value)}
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min={limit.min}
                    max={limit.max}
                    step={limit.step}
                    value={value}
                    onChange={(e) => setFeature(key, parseFloat(e.target.value))}
                    className="w-full h-2 bg-surfaceHighlight rounded-lg appearance-none cursor-pointer accent-primary hover:accent-green-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  {/* Custom progress track visual */}
                  <div 
                     className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary/80 to-primary rounded-l-lg pointer-events-none"
                     style={{ width: `${((value - limit.min) / (limit.max - limit.min)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-textSecondary/50 font-mono">
                  <span>{limit.min}</span>
                  <span>{limit.max}</span>
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        <div className="pt-6 border-t border-white/5">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden group bg-primary hover:bg-green-400 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)]"
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span>Analyzing DNA...</span>
                </>
              ) : (
                <span>Predict Popularity</span>
              )}
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer z-0" />
          </button>
        </div>
      </form>
    </div>
  );
};
