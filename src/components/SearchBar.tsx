import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  selectedCompany: string;
  onCompanyChange: (value: string) => void;
  selectedScope: string;
  onScopeChange: (value: string) => void;
  companies: string[];
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  selectedCompany,
  onCompanyChange,
  selectedScope,
  onScopeChange,
  companies,
}: SearchBarProps) => {
  return (
    <div className="p-4 border-b border-border bg-card">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search facilities, companies, or locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 font-mono text-sm bg-muted border-border focus:border-primary focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Select value={selectedCompany} onValueChange={onCompanyChange}>
            <SelectTrigger className="w-full sm:w-[180px] font-mono text-sm bg-muted border-border">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="font-mono text-sm">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company} className="font-mono text-sm">
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          <Button variant="outline" className="font-mono text-sm border-border hover:bg-primary hover:text-primary-foreground">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCompany !== 'all' || selectedScope !== 'all' || searchQuery) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchQuery && (
            <span className="px-2 py-1 bg-primary/20 text-primary font-mono text-xs border border-primary/30">
              Search: "{searchQuery}"
            </span>
          )}
          {selectedCompany !== 'all' && (
            <span className="px-2 py-1 bg-terminal-blue/20 text-terminal-blue font-mono text-xs border border-terminal-blue/30">
              Company: {selectedCompany}
            </span>
          )}
          {selectedScope !== 'all' && (
            <span className="px-2 py-1 bg-terminal-green/20 text-terminal-green font-mono text-xs border border-terminal-green/30">
              {selectedScope}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
