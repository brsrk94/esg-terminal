import { useState, useMemo, useEffect } from 'react';
import { TerminalHeader } from '@/components/TerminalHeader';
import { SearchBar } from '@/components/SearchBar';
import { EmissionMap } from '@/components/EmissionMap';
import { EmissionDetails } from '@/components/EmissionDetails';
import { StatsSidebar } from '@/components/StatsSidebar';
import { getFacilitiesWithEmissions, getUniqueCompanies, emissionData } from '@/data/emissionData';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedScope, setSelectedScope] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const facilities = useMemo(() => getFacilitiesWithEmissions(), []);
  const companies = useMemo(() => getUniqueCompanies(), []);
  
  const totalEmissions = useMemo(() => {
    return emissionData.reduce((sum, record) => sum + record.emissions, 0);
  }, []);

  const selectedFacilityData = useMemo(() => {
    return facilities.find(f => f.id === selectedFacility) || null;
  }, [facilities, selectedFacility]);

  const handleFacilitySelect = (facilityId: string) => {
    setSelectedFacility(prev => prev === facilityId ? null : facilityId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Terminal Header */}
      <TerminalHeader
        totalEmissions={Math.round(totalEmissions)}
        facilitiesCount={facilities.length}
        companiesCount={companies.length}
      />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        selectedScope={selectedScope}
        onScopeChange={setSelectedScope}
        companies={companies}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-[400px] lg:min-h-0">
          {/* Map */}
          <div className="flex-1 relative">
            <EmissionMap
              facilities={facilities}
              selectedFacility={selectedFacility}
              onFacilitySelect={handleFacilitySelect}
              searchQuery={searchQuery}
              selectedCompany={selectedCompany}
            />
          </div>

          {/* Emission Details Panel (Desktop) */}
          <div className="hidden lg:block w-[400px] border-l border-border">
            <EmissionDetails
              facility={selectedFacilityData}
              onClose={() => setSelectedFacility(null)}
            />
          </div>
        </div>

        {/* Stats Sidebar (Desktop) */}
        <div className="hidden xl:block w-[300px]">
          <StatsSidebar />
        </div>
      </div>

      {/* Mobile/Tablet Emission Details */}
      {selectedFacilityData && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="h-full overflow-auto">
            <EmissionDetails
              facility={selectedFacilityData}
              onClose={() => setSelectedFacility(null)}
            />
          </div>
        </div>
      )}

      {/* Mobile Stats Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="xl:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-card border-primary shadow-glow"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? (
          <X className="w-5 h-5 text-primary" />
        ) : (
          <Menu className="w-5 h-5 text-primary" />
        )}
      </Button>

      {/* Mobile Stats Sidebar */}
      {showSidebar && (
        <div className="xl:hidden fixed inset-0 z-30 bg-background/95 backdrop-blur-sm">
          <div className="h-full overflow-auto pt-16">
            <StatsSidebar />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setShowSidebar(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Footer Status Bar */}
      <footer className="border-t border-border bg-card px-4 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
              SYSTEM ONLINE
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              {emissionData.length} records loaded
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">
              {facilities.length} facilities tracked
            </span>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            ESG Terminal v1.0 • Data refreshed: {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
