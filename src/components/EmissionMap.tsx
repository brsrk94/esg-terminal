import { useState, useEffect, useMemo } from 'react';
import { MapPin, Factory, Zap, Building2 } from 'lucide-react';
import { FacilityLocation, getFacilityEmissions } from '@/data/emissionData';

interface EmissionMapProps {
  facilities: (FacilityLocation & { totalEmissions: number; recordCount: number })[];
  selectedFacility: string | null;
  onFacilitySelect: (facilityId: string) => void;
  searchQuery: string;
  selectedCompany: string;
}

export const EmissionMap = ({
  facilities,
  selectedFacility,
  onFacilitySelect,
  searchQuery,
  selectedCompany,
}: EmissionMapProps) => {
  const [hoveredFacility, setHoveredFacility] = useState<string | null>(null);

  // Filter facilities based on search and company selection
  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const matchesSearch =
        !searchQuery ||
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompany =
        selectedCompany === 'all' || facility.name === selectedCompany;
      return matchesSearch && matchesCompany;
    });
  }, [facilities, searchQuery, selectedCompany]);

  // Calculate map bounds for India
  const mapBounds = {
    minLat: 8,
    maxLat: 35,
    minLng: 68,
    maxLng: 97,
  };

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x, y };
  };

  const getEmissionColor = (emissions: number) => {
    if (emissions > 15000) return 'bg-terminal-red';
    if (emissions > 8000) return 'bg-terminal-orange';
    if (emissions > 4000) return 'bg-terminal-yellow';
    return 'bg-terminal-green';
  };

  const getEmissionSize = (emissions: number) => {
    if (emissions > 15000) return 'w-6 h-6';
    if (emissions > 8000) return 'w-5 h-5';
    if (emissions > 4000) return 'w-4 h-4';
    return 'w-3 h-3';
  };

  const getIndustryIcon = (industry: string) => {
    if (industry.includes('Energy') || industry.includes('Power')) return Zap;
    if (industry.includes('Steel') || industry.includes('Metals')) return Factory;
    return Building2;
  };

  const currentFacility = hoveredFacility || selectedFacility;
  const facilityData = facilities.find((f) => f.id === currentFacility);

  return (
    <div className="relative h-full bg-card border border-border overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-card/95 border-b border-border px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-bold text-foreground">
            ESG FACILITY MAP
          </h2>
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-terminal-green rounded-full"></span>
              Low
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-terminal-yellow rounded-full"></span>
              Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-terminal-orange rounded-full"></span>
              High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-terminal-red rounded-full"></span>
              Critical
            </span>
          </div>
        </div>
      </div>

      {/* Map Grid Background */}
      <div className="absolute inset-0 pt-10 grid-terminal opacity-50" />

      {/* India Map Outline (Simplified) */}
      <div className="absolute inset-0 pt-10 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Simplified India shape overlay */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full opacity-20"
            preserveAspectRatio="none"
          >
            <path
              d="M30,10 L70,10 L80,25 L85,45 L75,65 L65,85 L50,95 L35,85 L25,65 L20,45 L25,25 Z"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
          </svg>

          {/* Facility Markers */}
          {filteredFacilities.map((facility) => {
            const pos = getPosition(facility.lat, facility.lng);
            const Icon = getIndustryIcon(facility.industry);
            const isSelected = selectedFacility === facility.id;
            const isHovered = hoveredFacility === facility.id;

            return (
              <div
                key={facility.id}
                className={`absolute cursor-pointer transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
                  isSelected || isHovered ? 'z-20 scale-125' : 'z-10'
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y + 10}%`, // Offset for header
                }}
                onClick={() => onFacilitySelect(facility.id)}
                onMouseEnter={() => setHoveredFacility(facility.id)}
                onMouseLeave={() => setHoveredFacility(null)}
              >
                {/* Emission ring */}
                <div
                  className={`absolute inset-0 rounded-full ${getEmissionColor(
                    facility.totalEmissions
                  )} opacity-30 animate-ping`}
                  style={{
                    width: isSelected || isHovered ? '32px' : '24px',
                    height: isSelected || isHovered ? '32px' : '24px',
                    marginLeft: isSelected || isHovered ? '-8px' : '-4px',
                    marginTop: isSelected || isHovered ? '-8px' : '-4px',
                  }}
                />

                {/* Marker */}
                <div
                  className={`relative flex items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : isHovered
                      ? 'bg-muted border-primary'
                      : `${getEmissionColor(facility.totalEmissions)} border-border`
                  } ${getEmissionSize(facility.totalEmissions)} ${
                    isSelected || isHovered ? '!w-8 !h-8' : ''
                  }`}
                >
                  {(isSelected || isHovered) && (
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>

                {/* Label on hover/select */}
                {(isSelected || isHovered) && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
                    <div className="bg-popover border border-border px-2 py-1 font-mono text-xs">
                      <span className="text-primary font-bold">{facility.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {facility.totalEmissions.toLocaleString()} tons
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Facility Details Panel */}
      {facilityData && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-card/95 border-t border-border p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-mono text-sm font-bold text-foreground">
                  {facilityData.name}
                </h3>
                <span className="px-2 py-0.5 bg-secondary text-secondary-foreground font-mono text-xs">
                  {facilityData.id}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                {facilityData.description}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-primary">
                  {facilityData.totalEmissions.toLocaleString()}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  Total Tons
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-terminal-blue">
                  {facilityData.recordCount}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  Records
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions when no facility selected */}
      {!facilityData && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-muted/80 border border-border px-4 py-2 font-mono text-xs text-muted-foreground text-center">
            Click on a facility marker to view emission details
          </div>
        </div>
      )}
    </div>
  );
};
