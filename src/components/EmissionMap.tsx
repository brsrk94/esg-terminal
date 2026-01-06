import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Factory, Zap, Building2, Plus, Minus, Layers } from 'lucide-react';
import { FacilityLocation } from '@/data/emissionData';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || '';
  });
  const [tokenInput, setTokenInput] = useState('');
  const [mapStyle, setMapStyle] = useState<'satellite' | 'dark' | 'terrain'>('dark');
  const [mapLoaded, setMapLoaded] = useState(false);

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

  const getEmissionColor = (emissions: number) => {
    if (emissions > 15000) return '#ef4444'; // red
    if (emissions > 8000) return '#f97316'; // orange
    if (emissions > 4000) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  const getEmissionSize = (emissions: number) => {
    if (emissions > 15000) return 24;
    if (emissions > 8000) return 20;
    if (emissions > 4000) return 16;
    return 12;
  };

  const getStyleUrl = (style: string) => {
    switch (style) {
      case 'satellite':
        return 'mapbox://styles/mapbox/satellite-streets-v12';
      case 'terrain':
        return 'mapbox://styles/mapbox/outdoors-v12';
      default:
        return 'mapbox://styles/mapbox/dark-v11';
    }
  };

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: getStyleUrl(mapStyle),
        center: [78.9629, 22.5937], // Center of India
        zoom: 4.5,
        pitch: 30,
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        const error = e.error as { status?: number } | undefined;
        if (error?.status === 401) {
          localStorage.removeItem('mapbox_token');
          setMapboxToken('');
        }
      });

      return () => {
        map.current?.remove();
        setMapLoaded(false);
      };
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }, [mapboxToken]);

  // Update map style
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(getStyleUrl(mapStyle));
    }
  }, [mapStyle, mapLoaded]);

  // Add/update markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    filteredFacilities.forEach((facility) => {
      const color = getEmissionColor(facility.totalEmissions);
      const size = getEmissionSize(facility.totalEmissions);
      const isSelected = selectedFacility === facility.id;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'facility-marker';
      el.style.cssText = `
        width: ${isSelected ? size + 12 : size}px;
        height: ${isSelected ? size + 12 : size}px;
        background: ${color};
        border: 2px solid ${isSelected ? '#00ff88' : 'rgba(255,255,255,0.5)'};
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 ${isSelected ? '20px' : '10px'} ${color}80;
        transition: all 0.2s ease;
      `;

      // Pulsing ring for selected
      if (isSelected) {
        const ring = document.createElement('div');
        ring.style.cssText = `
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 2px solid ${color};
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        `;
        el.style.position = 'relative';
        el.appendChild(ring);
      }

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '100';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
      });

      el.addEventListener('click', () => {
        onFacilitySelect(facility.id);
        
        // Show popup
        if (popupRef.current) {
          popupRef.current.remove();
        }
        
        popupRef.current = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          className: 'terminal-popup',
        })
          .setLngLat([facility.lng, facility.lat])
          .setHTML(`
            <div style="font-family: 'JetBrains Mono', monospace; background: rgba(0,0,0,0.9); padding: 12px; border: 1px solid #00ff88; min-width: 200px;">
              <div style="color: #00ff88; font-weight: bold; font-size: 14px; margin-bottom: 8px;">${facility.name}</div>
              <div style="color: #888; font-size: 11px; margin-bottom: 8px;">${facility.description}</div>
              <div style="display: flex; gap: 16px;">
                <div>
                  <div style="color: #00ff88; font-size: 18px; font-weight: bold;">${facility.totalEmissions.toLocaleString()}</div>
                  <div style="color: #666; font-size: 10px;">TOTAL TONS</div>
                </div>
                <div>
                  <div style="color: #3b82f6; font-size: 18px; font-weight: bold;">${facility.recordCount}</div>
                  <div style="color: #666; font-size: 10px;">RECORDS</div>
                </div>
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([facility.lng, facility.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [filteredFacilities, selectedFacility, mapLoaded, onFacilitySelect]);

  // Fly to selected facility
  useEffect(() => {
    if (!map.current || !selectedFacility || !mapLoaded) return;

    const facility = facilities.find((f) => f.id === selectedFacility);
    if (facility) {
      map.current.flyTo({
        center: [facility.lng, facility.lat],
        zoom: 7,
        pitch: 45,
        duration: 1500,
      });
    }
  }, [selectedFacility, facilities, mapLoaded]);

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  const currentFacility = facilities.find((f) => f.id === selectedFacility);

  // Token input screen
  if (!mapboxToken) {
    return (
      <div className="relative h-full bg-card border border-border overflow-hidden flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-mono text-lg font-bold text-foreground mb-2">
            Mapbox Token Required
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-6">
            Enter your Mapbox public token to enable the interactive map. 
            Get one free at{' '}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="pk.eyJ1..."
              className="flex-1 bg-secondary border border-border px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleTokenSubmit}
              disabled={!tokenInput.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONNECT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-card border border-border overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-card/90 backdrop-blur border-b border-border px-4 py-2">
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

      {/* Mapbox Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Map Controls */}
      <div className="absolute top-14 right-4 z-10 flex flex-col gap-2">
        {/* Style Selector */}
        <div className="bg-card/90 backdrop-blur border border-border p-1 flex flex-col gap-1">
          <button
            onClick={() => setMapStyle('dark')}
            className={`p-2 font-mono text-xs ${
              mapStyle === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
            title="Dark Mode"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`p-2 font-mono text-xs ${
              mapStyle === 'satellite' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
            title="Satellite"
          >
            🛰️
          </button>
          <button
            onClick={() => setMapStyle('terrain')}
            className={`p-2 font-mono text-xs ${
              mapStyle === 'terrain' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
            title="Terrain"
          >
            🏔️
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-card/90 backdrop-blur border border-border p-1 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-secondary"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-secondary"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Facility Details Panel */}
      {currentFacility && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-card/95 backdrop-blur border-t border-border p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-mono text-sm font-bold text-foreground">
                  {currentFacility.name}
                </h3>
                <span className="px-2 py-0.5 bg-secondary text-secondary-foreground font-mono text-xs">
                  {currentFacility.id}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                {currentFacility.description}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-primary">
                  {currentFacility.totalEmissions.toLocaleString()}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  Total Tons
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-terminal-blue">
                  {currentFacility.recordCount}
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
      {!currentFacility && mapLoaded && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-muted/80 backdrop-blur border border-border px-4 py-2 font-mono text-xs text-muted-foreground text-center">
            Click on a facility marker to view emission details
          </div>
        </div>
      )}

      {/* Ping animation style */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-close-button {
          color: #00ff88 !important;
          font-size: 20px !important;
          right: 4px !important;
          top: 4px !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
