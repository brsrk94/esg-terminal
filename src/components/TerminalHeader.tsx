import { Activity, TrendingUp, AlertTriangle, Leaf } from 'lucide-react';

interface TerminalHeaderProps {
  totalEmissions: number;
  facilitiesCount: number;
  companiesCount: number;
}

export const TerminalHeader = ({ totalEmissions, facilitiesCount, companiesCount }: TerminalHeaderProps) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  return (
    <header className="border-b border-border bg-card px-4 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold text-foreground tracking-wide">
              ESG<span className="text-primary">TERMINAL</span>
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              Environmental Data Intelligence
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border">
            <Activity className="w-4 h-4 text-terminal-green" />
            <div className="font-mono text-xs">
              <span className="text-muted-foreground">LIVE</span>
              <span className="ml-2 text-terminal-green animate-pulse">●</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border">
            <TrendingUp className="w-4 h-4 text-terminal-orange" />
            <div className="font-mono text-xs">
              <span className="text-muted-foreground">EMISSIONS:</span>
              <span className="ml-2 text-foreground">{totalEmissions.toLocaleString()} tons</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted border border-border">
            <AlertTriangle className="w-4 h-4 text-terminal-yellow" />
            <div className="font-mono text-xs">
              <span className="text-muted-foreground">FACILITIES:</span>
              <span className="ml-2 text-foreground">{facilitiesCount}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted border border-border">
            <div className="font-mono text-xs">
              <span className="text-muted-foreground">COMPANIES:</span>
              <span className="ml-2 text-foreground">{companiesCount}</span>
            </div>
          </div>
        </div>

        {/* Time Display */}
        <div className="font-mono text-right">
          <div className="text-lg text-primary font-bold tracking-widest">{currentTime}</div>
          <div className="text-xs text-muted-foreground">{currentDate}</div>
        </div>
      </div>
    </header>
  );
};
