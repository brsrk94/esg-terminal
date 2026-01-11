import { useState, useMemo } from 'react';
import { Search, X, Building2, ChevronDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCompanies: string[];
  onCompaniesChange: (value: string[]) => void;
  selectedScope: string;
  onScopeChange: (value: string) => void;
  companies: string[];
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  selectedCompanies,
  onCompaniesChange,
  selectedScope,
  onScopeChange,
  companies,
}: SearchBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter companies based on search query - only show matches when searching
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return []; // Don't show any companies until user types
    const terms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    return companies.filter(company => 
      terms.some(term => company.toLowerCase().includes(term))
    );
  }, [companies, searchQuery]);

  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      onCompaniesChange(selectedCompanies.filter(c => c !== company));
    } else {
      onCompaniesChange([...selectedCompanies, company]);
    }
  };

  const clearAll = () => {
    onCompaniesChange([]);
    onSearchChange('');
  };

  const selectAllFiltered = () => {
    const newSelection = [...new Set([...selectedCompanies, ...filteredCompanies])];
    onCompaniesChange(newSelection);
  };

  // Add company from search (when pressing Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredCompanies.length > 0) {
      e.preventDefault();
      // Select all filtered companies
      const newSelection = [...new Set([...selectedCompanies, ...filteredCompanies])];
      onCompaniesChange(newSelection);
      onSearchChange('');
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
      {/* Main Search Container */}
      <div className="flex flex-col gap-3">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input with Dropdown */}
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search: adani, tata, jsw... (press Enter to select all matches)"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={handleKeyDown}
                className="pl-11 pr-10 h-11 font-mono text-sm bg-muted/50 border-border/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
              <ChevronDown 
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-transform cursor-pointer ${isDropdownOpen ? 'rotate-180' : ''}`} 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden">
                  {/* Search Hint */}
                  {searchQuery && (
                    <div className="px-3 py-2 bg-primary/5 border-b border-border/50">
                      <p className="font-mono text-xs text-muted-foreground">
                        💡 Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-primary">Enter</kbd> to select all {filteredCompanies.length} matching companies
                      </p>
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="p-2 border-b border-border/50 flex gap-2 bg-muted/30">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 font-mono text-xs h-8 hover:bg-primary/10 hover:text-primary"
                      onClick={() => {
                        selectAllFiltered();
                        onSearchChange('');
                      }}
                    >
                      Select All {filteredCompanies.length > 0 && `(${filteredCompanies.length})`}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 font-mono text-xs h-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={clearAll}
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  {/* Companies List - Only show filtered companies */}
                  <ScrollArea className="max-h-[240px]">
                    <div className="p-2 space-y-0.5">
                      {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company) => {
                          const isSelected = selectedCompanies.includes(company);
                          return (
                            <button
                              key={company}
                              onClick={() => toggleCompany(company)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                                isSelected 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'hover:bg-muted/50 text-foreground'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                isSelected 
                                  ? 'bg-primary border-primary' 
                                  : 'border-border bg-background'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              <span className="font-mono text-sm flex-1">{company}</span>
                              {isSelected && (
                                <span className="font-mono text-xs text-primary">Selected</span>
                              )}
                            </button>
                          );
                        })
                      ) : searchQuery.trim() ? (
                        <div className="px-3 py-6 text-center text-muted-foreground font-mono text-sm">
                          No companies match "{searchQuery}"
                        </div>
                      ) : (
                        <div className="px-3 py-6 text-center text-muted-foreground font-mono text-sm">
                          Type to search companies
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </div>

          {/* Scope Filter */}
          <Select value={selectedScope} onValueChange={onScopeChange}>
            <SelectTrigger className="w-full sm:w-[160px] h-11 font-mono text-sm bg-muted/50 border-border/50 rounded-xl">
              <SelectValue placeholder="All Scopes" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50 rounded-xl">
              <SelectItem value="all" className="font-mono text-sm">All Scopes</SelectItem>
              <SelectItem value="Scope 1" className="font-mono text-sm">Scope 1</SelectItem>
              <SelectItem value="Scope 2" className="font-mono text-sm">Scope 2</SelectItem>
              <SelectItem value="Scope 3" className="font-mono text-sm">Scope 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selected Companies Pills */}
        {(selectedCompanies.length > 0 || selectedScope !== 'all') && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Filters ({selectedCompanies.length + (selectedScope !== 'all' ? 1 : 0)}):
            </span>
            
            {selectedCompanies.map(company => (
              <Badge 
                key={company}
                variant="secondary"
                className="pl-3 pr-1.5 py-1.5 bg-primary/10 text-primary border-primary/20 font-mono text-xs cursor-pointer hover:bg-primary/20 transition-all rounded-full flex items-center gap-1.5"
              >
                <Building2 className="w-3 h-3" />
                {company}
                <button 
                  onClick={() => toggleCompany(company)} 
                  className="ml-1 p-0.5 hover:bg-primary/30 rounded-full transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            
            {selectedScope !== 'all' && (
              <Badge 
                variant="secondary"
                className="pl-3 pr-1.5 py-1.5 bg-terminal-green/10 text-terminal-green border-terminal-green/20 font-mono text-xs cursor-pointer hover:bg-terminal-green/20 transition-all rounded-full flex items-center gap-1.5"
              >
                {selectedScope}
                <button 
                  onClick={() => onScopeChange('all')} 
                  className="ml-1 p-0.5 hover:bg-terminal-green/30 rounded-full transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}

            <button 
              onClick={clearAll}
              className="font-mono text-xs text-muted-foreground hover:text-destructive transition-colors ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
