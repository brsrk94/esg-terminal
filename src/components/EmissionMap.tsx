import { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Plus, Minus, Layers } from 'lucide-react';
import { FacilityLocation } from '@/data/emissionData';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface EmissionMapProps {
  facilities: (FacilityLocation & { totalEmissions: number; recordCount: number })[];
  selectedFacility: string | null;
  onFacilitySelect: (facilityId: string) => void;
  searchQuery: string;
  selectedCompanies: string[];
}

export const EmissionMap = ({
  facilities,
  selectedFacility,
  onFacilitySelect,
  searchQuery,
  selectedCompanies,
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

  // Check if any company is selected (via dropdown or search)
  const hasCompanyFilter = selectedCompanies.length > 0 || searchQuery.trim().length > 0;

  // Filter facilities based on search and company selection
  const filteredFacilities = useMemo(() => {
    if (!hasCompanyFilter) return [];
    
    return facilities.filter((facility) => {
      // Check search query (supports multiple terms separated by spaces)
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
      const matchesSearch = searchTerms.length === 0 || searchTerms.some(term =>
        facility.name.toLowerCase().includes(term) ||
        facility.description.toLowerCase().includes(term)
      );
      
      // Check selected companies
      const matchesCompany = selectedCompanies.length === 0 || 
        selectedCompanies.includes(facility.name);
      
      return matchesSearch || matchesCompany;
    });
  }, [facilities, searchQuery, selectedCompanies, hasCompanyFilter]);

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: filteredFacilities.map((facility) => ({
        type: 'Feature' as const,
        properties: {
          emissions: facility.totalEmissions,
          name: facility.name,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [facility.lng, facility.lat],
        },
      })),
    };
  }, [filteredFacilities]);

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
        center: [78.9629, 22.5937],
        zoom: 4,
        pitch: 0,
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

  // Update map style and re-add heatmap
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    map.current.setStyle(getStyleUrl(mapStyle));
    
    // Re-add circle layer after style change
    map.current.once('style.load', () => {
      addCircleLayer();
    });
  }, [mapStyle]);

  // Add circle layer function
  const addCircleLayer = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Remove existing source and layer if they exist
    if (map.current.getLayer('emissions-circle')) {
      map.current.removeLayer('emissions-circle');
    }
    if (map.current.getSource('emissions')) {
      map.current.removeSource('emissions');
    }

    // Add source
    map.current.addSource('emissions', {
      type: 'geojson',
      data: heatmapData,
    });

    // Add simple circle layer instead of heatmap
    map.current.addLayer({
      id: 'emissions-circle',
      type: 'circle',
      source: 'emissions',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'emissions'],
          0, 4,
          5000, 5,
          10000, 6,
          20000, 7,
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['get', 'emissions'],
          0, '#22c55e',
          5000, '#eab308',
          10000, '#f97316',
          20000, '#ef4444',
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': 'rgba(255, 255, 255, 0.8)',
        'circle-opacity': hasCompanyFilter ? 1 : 0,
      },
    });
  };

  // Update heatmap data when facilities change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Wait for style to be loaded before adding layers
    if (!map.current.isStyleLoaded()) {
      map.current.once('style.load', () => {
        const source = map.current?.getSource('emissions') as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(heatmapData);
        } else {
          addCircleLayer();
        }
      });
      return;
    }

    const source = map.current.getSource('emissions') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(heatmapData);
    } else {
      addCircleLayer();
    }
  }, [heatmapData, mapLoaded]);

  // Update circle layer visibility
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (map.current.getLayer('emissions-circle')) {
      map.current.setPaintProperty(
        'emissions-circle',
        'circle-opacity',
        hasCompanyFilter ? 1 : 0
      );
    }
  }, [hasCompanyFilter, mapLoaded]);

  // Add/update markers - only when company is filtered
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Only add markers when companies are filtered
    if (!hasCompanyFilter) return;

    // Add markers for each facility
    filteredFacilities.forEach((facility) => {
      const isSelected = selectedFacility === facility.id;
      const emissionLevel = facility.totalEmissions > 15000 ? 'critical' : 
                           facility.totalEmissions > 8000 ? 'high' :
                           facility.totalEmissions > 4000 ? 'medium' : 'low';

      // Create marker element with simple styling
      const el = document.createElement('div');
      el.className = 'facility-marker';
      
      const size = isSelected ? 14 : 10;
      
      const colors = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
        low: '#22c55e',
      };
      
      const color = colors[emissionLevel];

      el.innerHTML = `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.6)'};
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        "></div>
      `;

      const innerEl = el.firstElementChild as HTMLElement;
      
      // Show company name on hover
      el.addEventListener('mouseenter', () => {
        if (innerEl) {
          innerEl.style.transform = 'scale(1.3)';
        }
        
        if (popupRef.current) {
          popupRef.current.remove();
        }
        
        popupRef.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'terminal-popup',
          maxWidth: '280px',
          offset: 15,
        })
          .setLngLat([facility.lng, facility.lat])
          .setHTML(`
            <div class="popup-content">
              <div class="popup-header">${facility.name}</div>
              <div class="popup-desc">${facility.description}</div>
              <div class="popup-stats">
                <div class="popup-stat">
                  <div class="popup-value" style="color: #00ff88;">${facility.totalEmissions.toLocaleString()}</div>
                  <div class="popup-label">TONS CO₂e</div>
                </div>
              </div>
            </div>
          `)
          .addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        if (innerEl) {
          innerEl.style.transform = 'scale(1)';
        }
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([facility.lng, facility.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [filteredFacilities, selectedFacility, mapLoaded, onFacilitySelect, hasCompanyFilter]);


  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();

  // Token input screen
  if (!mapboxToken) {
    return (
      <div className="relative h-full min-h-[300px] bg-gradient-to-br from-card to-background flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center backdrop-blur border border-primary/20">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-mono text-xl font-bold text-foreground mb-3">
            Connect Mapbox
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Enter your Mapbox public token to view the interactive emissions map. 
            Get one free at{' '}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="pk.eyJ1..."
              className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <button
              onClick={handleTokenSubmit}
              disabled={!tokenInput.trim()}
              className="px-6 py-3 bg-primary text-primary-foreground font-mono text-sm font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
            >
              CONNECT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[300px] bg-card overflow-hidden">
      {/* Mapbox Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Instruction overlay when no company is selected */}
      {!hasCompanyFilter && mapLoaded && (
        <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none">
          <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 px-6 py-4 shadow-xl text-center max-w-xs">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-mono text-sm font-bold text-foreground mb-2">
              SELECT COMPANIES
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Use the company filter or search above to view facility locations and emission heatmaps
            </p>
          </div>
        </div>
      )}

      {/* Map Header - Modern glassmorphism */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-auto z-10">
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 px-4 py-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <h2 className="font-mono text-sm font-bold text-foreground">
              ESG EMISSIONS MAP
            </h2>
          </div>
          {hasCompanyFilter && (
            <div className="mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs text-muted-foreground">
                Viewing: <span className="text-primary">{filteredFacilities.length} facilities</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legend - Responsive */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-3 shadow-xl">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Emission Level</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <span className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 bg-terminal-green rounded-full shadow-sm shadow-terminal-green/50"></span>
                Low
              </span>
              <span className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 bg-terminal-yellow rounded-full shadow-sm shadow-terminal-yellow/50"></span>
                Medium
              </span>
              <span className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 bg-terminal-orange rounded-full shadow-sm shadow-terminal-orange/50"></span>
                High
              </span>
              <span className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 bg-terminal-red rounded-full shadow-sm shadow-terminal-red/50"></span>
                Critical
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls - Bottom right for mobile accessibility */}
      <div className="absolute bottom-20 right-3 sm:bottom-4 sm:right-4 z-10 flex flex-col gap-2">
        {/* Style Selector */}
        <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-1.5 flex flex-col gap-1 shadow-xl">
          <button
            onClick={() => setMapStyle('dark')}
            className={`p-2.5 rounded-lg font-mono text-xs transition-all ${
              mapStyle === 'dark' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'
            }`}
            title="Dark Mode"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`p-2.5 rounded-lg font-mono text-xs transition-all ${
              mapStyle === 'satellite' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'
            }`}
            title="Satellite"
          >
            🛰️
          </button>
          <button
            onClick={() => setMapStyle('terrain')}
            className={`p-2.5 rounded-lg font-mono text-xs transition-all ${
              mapStyle === 'terrain' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted'
            }`}
            title="Terrain"
          >
            🏔️
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 p-1.5 flex flex-col gap-1 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-2.5 rounded-lg hover:bg-muted transition-all"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 rounded-lg hover:bg-muted transition-all"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Instructions */}
      {!selectedFacility && mapLoaded && (
        <div className="absolute bottom-3 left-3 right-16 sm:bottom-4 sm:left-4 sm:right-auto z-10">
          <div className="bg-card/80 backdrop-blur-xl rounded-xl border border-border/50 px-4 py-2.5 shadow-xl">
            <p className="font-mono text-xs text-muted-foreground">
              {hasCompanyFilter 
                ? `Showing ${filteredFacilities.length} facilities`
                : 'Select companies or search to see emission heatmap'
              }
            </p>
          </div>
        </div>
      )}

      {/* Custom Popup Styles */}
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
          border-radius: 16px !important;
        }
        .mapboxgl-popup-close-button {
          color: #00ff88 !important;
          font-size: 18px !important;
          right: 8px !important;
          top: 8px !important;
          width: 24px !important;
          height: 24px !important;
          border-radius: 6px !important;
          background: rgba(0,0,0,0.3) !important;
        }
        .mapboxgl-popup-close-button:hover {
          background: rgba(0,255,136,0.2) !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
        .popup-content {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95));
          padding: 16px;
          border: 1px solid rgba(0,255,136,0.3);
          border-radius: 16px;
          min-width: 220px;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .popup-header {
          color: #00ff88;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 6px;
        }
        .popup-desc {
          color: #888;
          font-size: 11px;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .popup-stats {
          display: flex;
          gap: 20px;
        }
        .popup-stat {
          text-align: left;
        }
        .popup-value {
          font-size: 20px;
          font-weight: 700;
        }
        .popup-label {
          color: #666;
          font-size: 9px;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};
