import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { busService } from '../services';
import type { BusSearchRequest, BusDetails } from '../services';

interface SearchState {
  // Search parameters
  searchParams: {
    from: string;
    to: string;
    date: string;
    passengers: number;
  };
  
  // Search results
  searchResults: BusDetails[];
  filteredRoutes: BusDetails[];
  isSearching: boolean;
  searchError: string | null;
  totalBuses: number;
  searchId: string | null;
  
  // Filters
  filters: {
    departureTime: string[];
    busType: string[];
    priceRange: [number, number];
    amenities: string[];
    rating: number;
  };
  
  // Sorting
  sortBy: string;
  
  // Actions
  setSearchParams: (params: Partial<SearchState['searchParams']>) => void;
  searchBuses: () => Promise<void>;
  setFilters: (filters: Partial<SearchState['filters']>) => void;
  setSortBy: (sortBy: string) => void;
  clearSearchError: () => void;
  filterRoutes: () => void;
  sortRoutes: () => void;
}

const initialFilters = {
  departureTime: [],
  busType: [],
  priceRange: [0, 5000],
  amenities: [],
  rating: 0,
};

export const useSearchStore = create<SearchState>()(
  devtools(
    (set, get) => ({
      searchParams: {
        from: 'Mumbai',
        to: 'Pune',
        date: '2025-11-06',
        passengers: 2,
      },
      searchResults: [],
      filteredRoutes: [],
      isSearching: false,
      searchError: null,
      totalBuses: 0,
      searchId: null,
      filters: initialFilters,
      sortBy: 'recommended',

      // Set search parameters
      setSearchParams: (params) => {
        set((state) => ({
          searchParams: { ...state.searchParams, ...params },
        }));
      },

      // Search buses using API
      searchBuses: async () => {
        const { searchParams } = get();
        
        set({ isSearching: true, searchError: null });
        
        try {
          // Convert city names to IDs (this would need a city mapping service)
          const cityIdMap: Record<string, string> = {
            'Mumbai': 'CITY_MUM_001',
            'Pune': 'CITY_PUN_002',
            'Delhi': 'CITY_DEL_001',
            'Bangalore': 'CITY_BLR_001',
            'Hyderabad': 'CITY_HYD_001',
          };

          const searchRequest: BusSearchRequest = {
            fromCityId: cityIdMap[searchParams.from] || 'CITY_MUM_001',
            toCityId: cityIdMap[searchParams.to] || 'CITY_PUN_002',
            journeyDate: searchParams.date,
            passengerCount: searchParams.passengers,
          };

          const response = await busService.searchBuses(searchRequest);
          
          if (response.success && response.data) {
            set({
              searchResults: response.data.buses,
              totalBuses: response.data.totalBuses,
              searchId: response.data.searchId,
              isSearching: false,
              searchError: null,
            });
          } else {
            throw new Error(response.message || 'Search failed');
          }
        } catch (error: any) {
          set({
            isSearching: false,
            searchError: error.message || 'Failed to search buses. Please try again.',
            searchResults: [],
            totalBuses: 0,
            searchId: null,
          });
        }
      },

      // Set filters
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      // Set sort by
      setSortBy: (sortBy) => {
        set({ sortBy });
      },

      // Clear search error
      clearSearchError: () => {
        set({ searchError: null });
      },
    }),
    {
      name: 'search-store',
    }
  )
);