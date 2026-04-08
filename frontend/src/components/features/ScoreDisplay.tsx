// import React from 'react';  
import { usePredictionStore } from '../../store/usePredictionStore';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export const ScoreDisplay = () => {
  const { prediction, isLoading } = usePredictionStore();

  if (isLoading || prediction === null) {
    if (prediction === null && !isLoading) {
      return (
        <div className="w-full max-w-sm aspect-square flex flex-col items-center justify-center bg-surface border border-white/5 rounded-2xl p-8 shadow-2xl opacity-50">
          <div className="w-24 h-24 rounded-full border-4 border-dashed border-surfaceHighlight animate-[spin_10s_linear_infinite]" />
          <p className="mt-8 text-textSecondary text-center">Awaiting track data to project popularity metrics.</p>
        </div>
      );
    }
    
    // Loading state just shows the empty frame returning
    return (
      <div className="w-full max-w-sm aspect-square flex items-center justify-center bg-surface border border-white/5 rounded-2xl p-8 shadow-2xl">
         <div className="text-primary animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin"></div>
            <p className="font-mono text-sm tracking-widest">CALCULATING...</p>
         </div>
      </div>
    );
  }

  // Derive score categorization
  let categoryLabel = '';
  let color = '#1DB954'; // Spotify green
  
  if (prediction >= 80) {
    categoryLabel = 'Potential Hit! 🚀';
    color = '#1DB954'; // Neon green
  } else if (prediction >= 50) {
    categoryLabel = 'Mainstream Potential 🎧';
    color = '#3b82f6'; // Blue
  } else if (prediction >= 30) {
    categoryLabel = 'Niche Audience 🎸';
    color = '#a855f7'; // Purple
  } else {
    categoryLabel = 'Underground Vibe 🕳️';
    color = '#ef4444'; // Red
  }

  const data = [
    {
      name: 'Score',
      value: prediction,
      fill: color,
    }
  ];

  return (
    <div className="w-full max-w-sm flex flex-col items-center justify-center bg-surface border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl rounded-full transition-colors duration-1000"
        style={{ backgroundColor: color }}
      />
      
      <h3 className="text-textSecondary uppercase tracking-widest text-xs font-bold mb-2">Predicted Popularity</h3>
      
      <div className="relative w-64 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={15} 
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            {/* Background Track */}
            <RadialBar
              background={{ fill: '#282828' }}
              dataKey="value"
              cornerRadius={10}
              animationDuration={2000}
              animationEasing="ease-out"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        
        {/* Absolute centered text for the gauge */}
        <div className="absolute inset-x-0 bottom-[35%] flex flex-col items-center justify-center translate-y-4">
          <span className="text-6xl font-black text-white tracking-tighter" style={{ textShadow: `0 0 20px ${color}40` }}>
            {Math.round(prediction)}
          </span>
          <span className="text-textSecondary/50 font-mono text-xs mt-1">/ 100</span>
        </div>
      </div>
      
      <div 
        className="mt-0 py-2 px-6 rounded-full border border-white/10 shadow-lg"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <span className="font-semibold text-sm">{categoryLabel}</span>
      </div>
    </div>
  );
};
