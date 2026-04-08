// import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full py-6 mt-12 border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-textSecondary text-sm">
          &copy; {new Date().getFullYear()} TuneOps - AI Spotify Popularity Predictor.
        </p>
      </div>
    </footer>
  );
};
