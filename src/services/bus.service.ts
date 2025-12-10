import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from './api.config';

// Bus Search Types
export interface BusSearchRequest {
  fromCityId: string;
  toCityId: string;
  journeyDate: string;
  passengerCount: number;
}

export interface BusSearchResponse {
  searchId: string;
  totalBuses: number;
  buses: BusDetails[];
}

export interface BusDetails {
  busId: string;
  busName: string;
  busNumber: string;
  busType: string;
  operatorId: string;
  operatorName: string;
  rating: number;
  totalReviews: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departureLocation: string;
  arrivalLocation: string;
  totalSeats: number;
  availableSeats: number;
  baseFare: number;
  isPremium: boolean;
  amenities: string[];
  cancellationPolicy: string;
  boardingPoints: BoardingPoint[];
  droppingPoints: DroppingPoint[];
}

export interface BoardingPoint {
  pointId: string;
  name: string;
  address: string;
  time: string;
  landmark: string;
}

export interface DroppingPoint {
  pointId: string;
  name: string;
  address: string;
  time: string;
  landmark: string;
}

// Seat Layout Types
export interface SeatLayoutResponse {
  busId: string;
  busName: string;
  journeyDate: string;
  layoutType: string;
  totalSeats: number;
  availableSeats: number;
  decks: Deck[];
  lastUpdated: string;
}

export interface Deck {
  deckType: 'Lower' | 'Upper';
  totalSeats: number;
  availableSeats: number;
  seats: Seat[];
}

export interface Seat {
  seatId: string;
  seatNumber: string;
  rowNumber: number;
  columnNumber: number;
  deck: 'Lower' | 'Upper';
  seatType: string;
  price: number;
  status: 'Available' | 'Booked' | 'Locked' | 'Selected';
  isLadiesOnly: boolean;
  isWindowSeat: boolean;
  isPremium?: boolean;
  position: {
    row: number;
    column: number;
    side: 'Left' | 'Right';
  };
  lockedBy?: string;
  lockedUntil?: string;
}

// Seat Lock Types
export interface SeatLockRequest {
  busId: string;
  journeyDate: string;
  seatIds: string[];
  boardingPointId: string;
  droppingPointId: string;
}

export interface SeatLockResponse {
  lockId: string;
  sessionId: string;
  busId: string;
  journeyDate: string;
  lockedSeats: LockedSeat[];
  boardingPoint: BoardingPoint;
  droppingPoint: DroppingPoint;
  lockExpiresAt: string;
  lockDurationSeconds: number;
  priceBreakdown: PriceBreakdown;
}

export interface LockedSeat {
  seatId: string;
  seatNumber: string;
  price: number;
}

export interface PriceBreakdown {
  baseFare: number;
  taxes: number;
  serviceFee: number;
  discount: number;
  totalAmount: number;
}

export interface SeatLockStatus {
  lockId: string;
  status: 'Active' | 'Expired' | 'Released';
  lockedSeats: string[];
  expiresAt: string;
  remainingSeconds: number;
  canExtend: boolean;
}

export class BusService extends ApiService {
  // Search buses
  async searchBuses(searchData: BusSearchRequest): Promise<ApiResponse<BusSearchResponse>> {
    try {
      return await this.post<BusSearchResponse>(
        API_ENDPOINTS.BUSES.SEARCH,
        searchData,
        false // No auth required for search
      );
    } catch (error) {
      throw this.handleBusError(error);
    }
  }

  // Get bus details by ID
  async getBusDetails(busId: string): Promise<ApiResponse<BusDetails>> {
    try {
      return await this.get<BusDetails>(API_ENDPOINTS.BUSES.GET_BY_ID(busId));
    } catch (error) {
      throw this.handleBusError(error);
    }
  }

  // Get seat layout
  async getSeatLayout(busId: string, journeyDate: string): Promise<ApiResponse<SeatLayoutResponse>> {
    try {
      return await this.get<SeatLayoutResponse>(
        `${API_ENDPOINTS.BUSES.SEAT_LAYOUT(busId)}?journeyDate=${journeyDate}`
      );
    } catch (error) {
      throw this.handleBusError(error);
    }
  }

  // Lock seats
  async lockSeats(lockData: SeatLockRequest): Promise<ApiResponse<SeatLockResponse>> {
    try {
      return await this.post<SeatLockResponse>(API_ENDPOINTS.SEATS.LOCK, lockData);
    } catch (error: any) {
      if (error.statusCode === 409) {
        // Handle seat already locked conflict
        throw new Error('One or more seats are already locked or booked. Please select different seats.');
      }
      throw this.handleBusError(error);
    }
  }

  // Extend seat lock
  async extendSeatLock(lockId: string, sessionId: string): Promise<ApiResponse<SeatLockStatus>> {
    try {
      return await this.post<SeatLockStatus>(API_ENDPOINTS.SEATS.EXTEND_LOCK, {
        lockId,
        sessionId,
      });
    } catch (error) {
      throw this.handleBusError(error);
    }
  }

  // Release seat lock
  async releaseSeatLock(lockId: string, sessionId: string): Promise<ApiResponse<void>> {
    try {
      return await this.post<void>(API_ENDPOINTS.SEATS.RELEASE_LOCK, {
        lockId,
        sessionId,
      });
    } catch (error) {
      throw this.handleBusError(error);
    }
  }

  // Check lock status
  async getLockStatus(lockId: string): Promise<ApiResponse<SeatLockStatus>> {
    try {
      return await this.get<SeatLockStatus>(API_ENDPOINTS.SEATS.LOCK_STATUS(lockId));
    } catch (error) {
      throw this.handleBusError(error);
    }
  }

  // Handle bus-related errors
  private handleBusError(error: any): Error {
    if (error.statusCode === 404) {
      return new Error('Bus not found. Please try a different bus.');
    }
    
    if (error.statusCode === 410) {
      return new Error('Seat layout has expired. Please refresh the page.');
    }
    
    if (error.errors && error.errors.length > 0) {
      return new Error(error.errors[0].message);
    }
    
    return new Error('Failed to process bus request. Please try again.');
  }
}

// Create singleton instance
export const busService = new BusService();