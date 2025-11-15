export interface SearchFilters {
  departureTime: string[];
  busType: string[];
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  rating: number | null;
}

export interface BusRoute {
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

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}