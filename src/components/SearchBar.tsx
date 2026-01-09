import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      onCompaniesChange(selectedCompanies.filter(c => c !== company));
    } else {
      onCompaniesChange([...selectedCompanies, company]);
    }
  };

  const clearCompanies = () => {
    onCompaniesChange([]);
  };

  const selectAllCompanies = () => {
    onCompaniesChange([...companies]);
  };

  return (
    <div className="p-4 border-b border-border bg-card">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies (e.g., adani, tata, jsw)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 font-mono text-sm bg-muted border-border focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          {/* Multi-select Company Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full sm:w-[200px] font-mono text-sm bg-muted border-border justify-start"
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedCompanies.length === 0 
                  ? 'Select Companies' 
                  : `${selectedCompanies.length} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0 bg-popover border-border" align="start">
              <div className="p-2 border-b border-border flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 font-mono text-xs h-7"
                  onClick={selectAllCompanies}
                >
                  Select All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 font-mono text-xs h-7"
                  onClick={clearCompanies}
                >
                  Clear
                </Button>
              </div>
              <div className="max-h-[200px] overflow-auto p-2 space-y-1">
                {companies.map((company) => (
                  <label
                    key={company}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedCompanies.includes(company)}
                      onCheckedChange={() => toggleCompany(company)}
                    />
                    <span className="font-mono text-sm">{company}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Select value={selectedScope} onValueChange={onScopeChange}>
            <SelectTrigger className="w-full sm:w-[140px] font-mono text-sm bg-muted border-border">
              <SelectValue placeholder="All Scopes" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="font-mono text-sm">All Scopes</SelectItem>
              <SelectItem value="Scope 1" className="font-mono text-sm">Scope 1</SelectItem>
              <SelectItem value="Scope 2" className="font-mono text-sm">Scope 2</SelectItem>
              <SelectItem value="Scope 3" className="font-mono text-sm">Scope 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCompanies.length > 0 || selectedScope !== 'all' || searchQuery) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchQuery && (
            <span className="px-2 py-1 bg-primary/20 text-primary font-mono text-xs border border-primary/30 flex items-center gap-1">
              Search: "{searchQuery}"
              <button onClick={() => onSearchChange('')} className="hover:text-primary-foreground">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCompanies.map(company => (
            <span 
              key={company}
              className="px-2 py-1 bg-terminal-blue/20 text-terminal-blue font-mono text-xs border border-terminal-blue/30 flex items-center gap-1"
            >
              {company}
              <button onClick={() => toggleCompany(company)} className="hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedScope !== 'all' && (
            <span className="px-2 py-1 bg-terminal-green/20 text-terminal-green font-mono text-xs border border-terminal-green/30 flex items-center gap-1">
              {selectedScope}
              <button onClick={() => onScopeChange('all')} className="hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
