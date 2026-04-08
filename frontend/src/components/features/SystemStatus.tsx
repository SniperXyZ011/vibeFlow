import { useEffect, useState } from 'react';
import { checkHealth } from '../../services/api';

export const SystemStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const pingAPI = async () => {
      const status = await checkHealth();
      setIsOnline(status);
    };
    
    pingAPI();
    const interval = setInterval(pingAPI, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-surfaceHighlight px-3 py-1.5 rounded-full text-sm font-medium border border-white/5">
      {isOnline === null ? (
        <>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></span>
          <span className="text-textSecondary">Checking API...</span>
        </>
      ) : isOnline ? (
        <>
          <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(29,185,84,0.6)]"></span>
          <span className="text-textPrimary">API Online</span>
        </>
      ) : (
        <>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
          <span className="text-red-400">API Offline</span>
        </>
      )}
    </div>
  );
};
