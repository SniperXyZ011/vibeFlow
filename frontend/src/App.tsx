// import React from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { PredictionForm } from './components/features/PredictionForm';
import { ScoreDisplay } from './components/features/ScoreDisplay';

function App() {
  return (
    <MainLayout>
      <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-16 pt-8">
        
        {/* Left column: Controls */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">
              Predict the Hit.
            </h1>
            <p className="mt-4 text-textSecondary text-lg max-w-xl leading-relaxed">
              Define the sonic properties of your track. TuneOps utilizes AI to instantly gauge how popular it could become on Spotify.
            </p>
          </div>
          
          <PredictionForm />
        </div>

        {/* Right column: Output */}
        <div className="w-full lg:w-[40%] flex justify-center lg:sticky lg:top-32">
          <ScoreDisplay />
        </div>
        
      </div>
    </MainLayout>
  );
}

export default App;
