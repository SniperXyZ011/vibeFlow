import React from 'react';
import { Activity } from 'lucide-react';
import { SystemStatus } from '../features/SystemStatus';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Tune<span className="text-primary">Ops</span>
            </span>
          </div>
          
          <div className="flex items-center">
            <SystemStatus />
          </div>
        </div>
      </div>
    </header>
  );
};
