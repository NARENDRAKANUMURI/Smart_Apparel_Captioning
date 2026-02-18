import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { genders, masterCategories, seasons, colors } from '@/data/fashionDataset';

export interface FilterState {
  search: string;
  gender: string;
  category: string;
  season: string;
  color: string;
}

interface DatasetFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}

export const DatasetFilters = ({ filters, onFilterChange, resultCount }: DatasetFiltersProps) => {
  const activeFiltersCount = [filters.gender, filters.category, filters.season, filters.color]
    .filter(f => f && f !== 'all').length + (filters.search ? 1 : 0);

  const clearFilters = () => {
    onFilterChange({
      search: '',
      gender: 'all',
      category: 'all',
      season: 'all',
      color: 'all',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3">
          <Select
            value={filters.gender}
            onValueChange={(value) => onFilterChange({ ...filters, gender: value })}
          >
            <SelectTrigger className="w-[130px] bg-secondary/50 border-border/50">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              {genders.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange({ ...filters, category: value })}
          >
            <SelectTrigger className="w-[150px] bg-secondary/50 border-border/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {masterCategories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.season}
            onValueChange={(value) => onFilterChange({ ...filters, season: value })}
          >
            <SelectTrigger className="w-[130px] bg-secondary/50 border-border/50">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons</SelectItem>
              {seasons.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.color}
            onValueChange={(value) => onFilterChange({ ...filters, color: value })}
          >
            <SelectTrigger className="w-[130px] bg-secondary/50 border-border/50">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {colors.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters & Results */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Filter className="w-3 h-3" />
            {resultCount} results
          </Badge>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
              Clear filters ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
