import { Badge } from '@/components/ui/badge';
import { Database, Radio, Satellite, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

export const LiveDataIndicator = () => {
  const [isLive, setIsLive] = useState(true);
  const [dataCount, setDataCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
      setDataCount(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge 
        variant="outline" 
        className={`gap-1 transition-all ${
          isLive 
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 animate-pulse' 
            : 'border-amber-500/50 bg-amber-500/10 text-amber-400'
        }`}
      >
        <Radio className="h-3 w-3" />
        {isLive ? 'LIVE FEED' : 'SYNCING'}
      </Badge>

      <Badge variant="outline" className="gap-1 border-blue-500/50 bg-blue-500/10 text-blue-400">
        <Database className="h-3 w-3" />
        CelesTrak
      </Badge>

      <Badge variant="outline" className="gap-1 border-purple-500/50 bg-purple-500/10 text-purple-400">
        <Satellite className="h-3 w-3" />
        TLE Data
      </Badge>

      <Badge variant="outline" className="gap-1 border-cyan-500/50 bg-cyan-500/10 text-cyan-400">
        <Activity className="h-3 w-3" />
        {dataCount} Updates
      </Badge>
    </div>
  );
};
