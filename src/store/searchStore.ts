import { create } from 'zustand';

// Define types directly in this file to avoid import issues
interface SearchFilters {
  departureTime: string[];
  busType: string[];
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  rating: number | null;
}

interface BusRoute {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: string;
  operator: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  seatsAvailable: number;
  isPremium?: boolean;
  isBestPrice?: boolean;
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

interface SearchState {
  searchParams: SearchParams;
  filters: SearchFilters;
  busRoutes: BusRoute[];
  filteredRoutes: BusRoute[];
  sortBy: string;
  setSearchParams: (params: Partial<SearchParams>) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setSortBy: (sortBy: string) => void;
  filterRoutes: () => void;
  sortRoutes: () => void;
}

const mockBusRoutes: BusRoute[] = [
  {
    id: '1',
    from: 'Mumbai Central',
    to: 'Pune Station',
    departureTime: '06:30',
    arrivalTime: '10:00',
    duration: '3h 30m',
    price: 1899,
    busType: 'AC Sleeper',
    operator: 'Royal Luxury Express',
    rating: 4.8,
    reviewCount: 245,
    amenities: ['WiFi', 'Charging', 'Blanket', 'Entertainment', 'Water'],
    seatsAvailable: 8,
    isPremium: true,
  },
  {
    id: '2',
    from: 'Dadar West',
    to: 'Shivaji Nagar',
    departureTime: '08:15',
    arrivalTime: '12:30',
    duration: '4h 15m',
    price: 899,
    busType: 'AC Seater',
    operator: 'SwiftBus Travels',
    rating: 4.5,
    reviewCount: 182,
    amenities: ['WiFi', 'Charging', 'Water'],
    seatsAvailable: 15,
  },
  {
    id: '3',
    from: 'Andheri East',
    to: 'Kothrud',
    departureTime: '09:00',
    arrivalTime: '13:45',
    duration: '4h 45m',
    price: 549,
    busType: 'Non-AC Seater',
    operator: 'Express Shuttle Service',
    rating: 4.2,
    reviewCount: 96,
    amenities: ['Charging', 'Water'],
    seatsAvailable: 22,
    isBestPrice: true,
  },
  {
    id: '4',
    from: 'Bandra Terminus',
    to: 'Hinjewadi',
    departureTime: '14:00',
    arrivalTime: '17:15',
    duration: '3h 15m',
    price: 2199,
    busType: 'Volvo Multi-Axle',
    operator: 'VIP Luxury Liner',
    rating: 4.9,
    reviewCount: 312,
    amenities: ['WiFi', 'Charging', 'Blanket', 'Entertainment', 'Water', 'Snacks'],
    seatsAvailable: 5,
    isPremium: true,
  },
];

const initialFilters: SearchFilters = {
  departureTime: [],
  busType: [],
  priceRange: { min: 300, max: 2000 },
  amenities: [],
  rating: null,
};

const useSearchStore = create<SearchState>((set, get) => ({
  searchParams: {
    from: 'Mumbai',
    to: 'Pune',
    date: '2025-11-06',
    passengers: 2,
  },
  filters: initialFilters,
  busRoutes: mockBusRoutes,
  filteredRoutes: mockBusRoutes,
  sortBy: 'recommended',
  
  setSearchParams: (params) => 
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),
  
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  
  setSortBy: (sortBy) =>
    set({ sortBy }),
  
  filterRoutes: () => {
    const { busRoutes, filters } = get();
    let filtered = busRoutes.filter(route => {
      // Price filter
      if (route.price < filters.priceRange.min || route.price > filters.priceRange.max) {
        return false;
      }
      
      // Rating filter
      if (filters.rating && route.rating < filters.rating) {
        return false;
      }
      
      // Bus type filter
      if (filters.busType.length > 0) {
        const routeBusType = route.busType.toLowerCase();
        const matchesBusType = filters.busType.some(type => {
          if (type === 'ac') return routeBusType.includes('ac');
          if (type === 'nonac') return !routeBusType.includes('ac');
          if (type === 'sleeper') return routeBusType.includes('sleeper');
          if (type === 'seater') return routeBusType.includes('seater');
          if (type === 'luxury') return route.rating >= 4.8;
          return true;
        });
        if (!matchesBusType) return false;
      }
      
      // Departure time filter
      if (filters.departureTime.length > 0) {
        const hour = parseInt(route.departureTime.split(':')[0]);
        const matchesTime = filters.departureTime.some(time => {
          if (time === 'morning') return hour >= 6 && hour < 12;
          if (time === 'afternoon') return hour >= 12 && hour < 18;
          if (time === 'evening') return hour >= 18 && hour < 24;
          if (time === 'night') return hour >= 0 && hour < 6;
          return true;
        });
        if (!matchesTime) return false;
      }
      
      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          route.amenities.some(routeAmenity => 
            routeAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) return false;
      }
      
      return true;
    });
    
    set({ filteredRoutes: filtered });
  },
  
  sortRoutes: () => {
    const { filteredRoutes, sortBy } = get();
    let sorted = [...filteredRoutes];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'departure':
        sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      case 'duration':
        sorted.sort((a, b) => {
          const durationA = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].replace('m', ''));
          const durationB = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].replace('m', ''));
          return durationA - durationB;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default: // recommended
        sorted.sort((a, b) => {
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          if (a.rating !== b.rating) return b.rating - a.rating;
          return a.price - b.price;
        });
    }
    
    set({ filteredRoutes: sorted });
  },
}));

export { useSearchStore };
export type { SearchFilters, BusRoute, SearchParams };