import { useMemo } from 'react';
import { X, TrendingUp, TrendingDown, AlertTriangle, Factory, Calendar, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FacilityLocation, getFacilityEmissions, getEmissionsByScope, getEmissionsByGHGType } from '@/data/emissionData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface EmissionDetailsProps {
  facility: (FacilityLocation & { totalEmissions: number; recordCount: number }) | null;
  onClose: () => void;
  selectedScope: string;
}

export const EmissionDetails = ({ facility, onClose, selectedScope }: EmissionDetailsProps) => {
  if (!facility) {
    return (
      <div className="h-full flex items-center justify-center bg-card border border-border p-6">
        <div className="text-center">
          <Factory className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-mono text-sm font-bold text-foreground mb-2">
            No Facility Selected
          </h3>
          <p className="font-mono text-xs text-muted-foreground max-w-xs">
            Select a facility from the map to view detailed emission data and analytics
          </p>
        </div>
      </div>
    );
  }

  // Get facility emissions and filter by selected scope
  const allEmissions = getFacilityEmissions(facility.id);
  const emissions = selectedScope === 'all' 
    ? allEmissions 
    : allEmissions.filter(e => e.scope === selectedScope);

  // Calculate scope data - always show all scopes with their actual values
  const scopeData = useMemo(() => {
    const totals = { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 };
    allEmissions.forEach(record => {
      totals[record.scope] += record.emissions;
    });
    // Filter to only show selected scope if one is selected
    if (selectedScope !== 'all') {
      return [{ scope: selectedScope, value: totals[selectedScope as keyof typeof totals] || 0 }];
    }
    return Object.entries(totals).map(([scope, value]) => ({ scope, value }));
  }, [allEmissions, selectedScope]);

  // Calculate GHG data from filtered emissions
  const ghgData = useMemo(() => {
    const totals: Record<string, number> = { 'CO₂': 0, 'CH₄': 0, 'N₂O': 0 };
    emissions.forEach(record => {
      totals[record.ghgType] += record.emissions;
    });
    return Object.entries(totals).map(([type, value]) => ({ type, value }));
  }, [emissions]);

  // Calculate total emissions from filtered data
  const totalEmissionsFiltered = emissions.reduce((sum, e) => sum + e.emissions, 0);

  const scopeColors = ['hsl(var(--terminal-red))', 'hsl(var(--terminal-orange))', 'hsl(var(--terminal-blue))'];
  const ghgColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  // Calculate trends (mock data for demonstration)
  const trend = Math.random() > 0.5 ? 'up' : 'down';
  const trendValue = (Math.random() * 20).toFixed(1);

  // Group emissions by period
  const periodData = emissions.reduce((acc, e) => {
    const period = e.reportingPeriod;
    if (!acc[period]) acc[period] = 0;
    acc[period] += e.emissions;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(periodData)
    .map(([period, value]) => ({ period, value }))
    .sort((a, b) => a.period.localeCompare(b.period));

  return (
    <div className="h-full bg-card border border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-3">
          <Factory className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-mono text-sm font-bold text-foreground">
              {facility.name}
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {facility.id} • {facility.industry}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-destructive/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6 scrollbar-terminal">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-muted-foreground">
                TOTAL EMISSIONS
              </span>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-terminal-red" />
              ) : (
                <TrendingDown className="w-4 h-4 text-terminal-green" />
              )}
            </div>
            <div className="font-mono text-xl font-bold text-foreground">
              {totalEmissionsFiltered.toLocaleString()}
            </div>
            <div className={`font-mono text-xs ${trend === 'up' ? 'text-terminal-red' : 'text-terminal-green'}`}>
              {trend === 'up' ? '+' : '-'}{trendValue}% vs prev quarter
            </div>
          </div>

          <div className="bg-muted border border-border p-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">
                DATA POINTS
              </span>
            </div>
            <div className="font-mono text-xl font-bold text-foreground">
              {facility.recordCount}
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              Across all periods
            </div>
          </div>
        </div>

        {/* Emission by Scope Chart */}
        <div className="bg-muted border border-border p-3">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-mono text-xs font-bold text-foreground">
              EMISSIONS BY SCOPE
            </h3>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scopeData}
                  dataKey="value"
                  nameKey="scope"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  strokeWidth={2}
                  stroke="hsl(var(--background))"
                >
                  {scopeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={scopeColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} tons`, '']}
                />
                <Legend
                  formatter={(value) => (
                    <span className="font-mono text-xs text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GHG Type Breakdown */}
        <div className="bg-muted border border-border p-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-terminal-yellow" />
            <h3 className="font-mono text-xs font-bold text-foreground">
              GHG TYPE BREAKDOWN
            </h3>
          </div>
          <div className="space-y-2">
            {ghgData.map((item, index) => {
              const total = ghgData.reduce((sum, d) => sum + d.value, 0);
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-foreground">{item.type}</span>
                    <span className="text-muted-foreground">
                      {item.value.toLocaleString()} tons ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-background border border-border">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: ghgColors[index],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quarterly Trend */}
        <div className="bg-muted border border-border p-3">
          <h3 className="font-mono text-xs font-bold text-foreground mb-3">
            QUARTERLY TREND
          </h3>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="period"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} tons`, 'Emissions']}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-muted border border-border">
          <div className="px-3 py-2 border-b border-border">
            <h3 className="font-mono text-xs font-bold text-foreground">
              EMISSION RECORDS
            </h3>
          </div>
          <div className="max-h-[200px] overflow-auto scrollbar-terminal">
            <table className="w-full">
              <thead className="sticky top-0 bg-muted">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-mono text-xs text-muted-foreground">
                    Period
                  </th>
                  <th className="px-3 py-2 text-left font-mono text-xs text-muted-foreground">
                    Scope
                  </th>
                  <th className="px-3 py-2 text-left font-mono text-xs text-muted-foreground">
                    Type
                  </th>
                  <th className="px-3 py-2 text-right font-mono text-xs text-muted-foreground">
                    Tons
                  </th>
                </tr>
              </thead>
              <tbody>
                {emissions.map((record, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 hover:bg-primary/5"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {record.reportingPeriod}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 font-mono text-xs ${
                          record.scope === 'Scope 1'
                            ? 'bg-terminal-red/20 text-terminal-red'
                            : record.scope === 'Scope 2'
                            ? 'bg-terminal-orange/20 text-terminal-orange'
                            : 'bg-terminal-blue/20 text-terminal-blue'
                        }`}
                      >
                        {record.scope}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {record.ghgType}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground text-right">
                      {record.emissions.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
