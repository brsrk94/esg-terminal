import { Building2, Flame, Wind, Droplets, TrendingUp } from 'lucide-react';
import { getTotalEmissionsByCompany, getEmissionsByScope, getEmissionsByGHGType, emissionData } from '@/data/emissionData';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

interface StatsSidebarProps {
  selectedScope: string;
  selectedCompanies: string[];
}

export const StatsSidebar = ({ selectedScope, selectedCompanies }: StatsSidebarProps) => {
  // Filter emission data based on selected scope and companies
  const filteredData = useMemo(() => {
    return emissionData.filter(record => {
      const matchesScope = selectedScope === 'all' || record.scope === selectedScope;
      const matchesCompany = selectedCompanies.length === 0 || selectedCompanies.includes(record.facilityName);
      return matchesScope && matchesCompany;
    });
  }, [selectedScope, selectedCompanies]);

  // Calculate company totals from filtered data
  const companyData = useMemo(() => {
    const totals: Record<string, number> = {};
    filteredData.forEach(record => {
      if (!totals[record.facilityName]) {
        totals[record.facilityName] = 0;
      }
      totals[record.facilityName] += record.emissions;
    });
    return Object.entries(totals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [filteredData]);

  // Calculate scope data from filtered data
  const scopeData = useMemo(() => {
    const totals = { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 };
    filteredData.forEach(record => {
      totals[record.scope] += record.emissions;
    });
    return Object.entries(totals).map(([scope, value]) => ({ scope, value }));
  }, [filteredData]);

  // Calculate GHG data from filtered data
  const ghgData = useMemo(() => {
    const totals: Record<string, number> = { 'CO₂': 0, 'CH₄': 0, 'N₂O': 0 };
    filteredData.forEach(record => {
      totals[record.ghgType] += record.emissions;
    });
    return Object.entries(totals).map(([type, value]) => ({ type, value }));
  }, [filteredData]);

  const totalEmissions = filteredData.reduce((sum, c) => sum + c.emissions, 0);
  const maxEmission = companyData.length > 0 ? Math.max(...companyData.map(c => c.total)) : 0;

  const getGHGIcon = (type: string) => {
    switch (type) {
      case 'CO₂': return Flame;
      case 'CH₄': return Wind;
      case 'N₂O': return Droplets;
      default: return Flame;
    }
  };

  return (
    <div className="h-full bg-card border-l border-border overflow-auto scrollbar-terminal">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/50">
        <h2 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          ANALYTICS
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Total Overview */}
        <div className="bg-muted border border-border p-3">
          <div className="font-mono text-xs text-muted-foreground mb-1">
            TOTAL EMISSIONS TRACKED
          </div>
          <div className="font-mono text-2xl font-bold text-primary">
            {totalEmissions.toLocaleString()}
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            metric tons CO₂e
          </div>
        </div>

        {/* Company Leaderboard */}
        <div>
          <h3 className="font-mono text-xs font-bold text-foreground mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            TOP EMITTERS
          </h3>
          <div className="space-y-3">
            {companyData.map((company, index) => {
              const percentage = (company.total / totalEmissions) * 100;
              const barPercentage = (company.total / maxEmission) * 100;
              
              return (
                <div key={company.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground w-4">
                        {index + 1}.
                      </span>
                      <span className="font-mono text-xs text-foreground font-medium">
                        {company.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-background border border-border ml-6">
                    <div
                      className={`h-full transition-all duration-500 ${
                        index === 0
                          ? 'bg-terminal-red'
                          : index === 1
                          ? 'bg-terminal-orange'
                          : index === 2
                          ? 'bg-terminal-yellow'
                          : 'bg-terminal-green'
                      }`}
                      style={{ width: `${barPercentage}%` }}
                    />
                  </div>
                  <div className="font-mono text-xs text-muted-foreground ml-6">
                    {company.total.toLocaleString()} tons
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scope Distribution */}
        <div>
          <h3 className="font-mono text-xs font-bold text-foreground mb-3">
            SCOPE DISTRIBUTION
          </h3>
          <div className="h-[100px] mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scopeData} layout="vertical">
                <Bar dataKey="value" radius={0}>
                  {scopeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? 'hsl(var(--terminal-red))'
                          : index === 1
                          ? 'hsl(var(--terminal-orange))'
                          : 'hsl(var(--terminal-blue))'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {scopeData.map((scope, index) => (
              <div key={scope.scope} className="text-center">
                <div
                  className={`font-mono text-lg font-bold ${
                    index === 0
                      ? 'text-terminal-red'
                      : index === 1
                      ? 'text-terminal-orange'
                      : 'text-terminal-blue'
                  }`}
                >
                  {((scope.value / totalEmissions) * 100).toFixed(0)}%
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  {scope.scope}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GHG Type Breakdown */}
        <div>
          <h3 className="font-mono text-xs font-bold text-foreground mb-3">
            GHG COMPOSITION
          </h3>
          <div className="space-y-3">
            {ghgData.map((ghg) => {
              const Icon = getGHGIcon(ghg.type);
              const percentage = (ghg.value / totalEmissions) * 100;
              
              return (
                <div
                  key={ghg.type}
                  className="flex items-center gap-3 p-2 bg-muted border border-border"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-background border border-border">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-xs font-bold text-foreground">
                      {ghg.type}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {ghg.value.toLocaleString()} tons
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold text-primary">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center justify-center gap-2 py-3 border-t border-border">
          <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">
            Data refreshed in real-time
          </span>
        </div>
      </div>
    </div>
  );
};
