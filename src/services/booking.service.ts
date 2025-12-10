import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from './api.config';

// Booking Types
export interface CreateBookingRequest {
  lockId: string;
  sessionId: string;
  passengers: Passenger[];
  contactDetails: ContactDetails;
  gstDetails?: GSTDetails;
}

export interface Passenger {
  seatId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phoneNumber: string;
  idProofType: 'Aadhaar' | 'PAN' | 'Passport' | 'DrivingLicense' | 'VoterID';
  idProofNumber: string;
}

export interface ContactDetails {
  email: string;
  phoneNumber: string;
  alternatePhone?: string;
}

export interface GSTDetails {
  isGstRequired: boolean;
  gstNumber?: string;
  companyName?: string;
}

export interface BookingResponse {
  bookingId: string;
  pnr: string;
  status: 'PaymentPending' | 'Confirmed' | 'Cancelled' | 'Expired';
  busDetails: {
    busId: string;
    busName: string;
    busNumber: string;
    journeyDate: string;
    departureTime: string;
    arrivalTime: string;
  };
  routeDetails: {
    from: string;
    to: string;
    boardingPoint: string;
    droppingPoint: string;
  };
  passengers: {
    passengerId: string;
    seatNumber: string;
    name: string;
    age: number;
    gender: string;
  }[];
  pricing: {
    baseFare: number;
    taxes: number;
    serviceFee: number;
    discount: number;
    totalAmount: number;
    currency: string;
  };
  paymentDetails: {
    paymentId?: string;
    paymentStatus: 'Pending' | 'Success' | 'Failed' | 'Refunded';
    paymentDeadline?: string;
  };
  createdAt: string;
  expiresAt?: string;
}

export interface BookingDetails extends BookingResponse {
  cancellationPolicy: {
    isRefundable: boolean;
    refundRules: {
      timeBeforeDeparture: string;
      refundPercentage: number;
      cancellationFee: number;
    }[];
  };
  ticketUrl: string;
  qrCode: string;
}

export interface PaginatedBookings {
  totalBookings: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  bookings: BookingSummary[];
}

export interface BookingSummary {
  bookingId: string;
  pnr: string;
  status: 'PaymentPending' | 'Confirmed' | 'Cancelled' | 'Expired';
  journeyDate: string;
  busName: string;
  route: string;
  seatNumbers: string[];
  totalAmount: number;
  bookedAt: string;
}

export interface CancelBookingRequest {
  cancellationReason: string;
  refundMode: 'OriginalSource' | 'BankTransfer' | 'Wallet';
}

export interface CancelBookingResponse {
  bookingId: string;
  pnr: string;
  status: 'Cancelled';
  cancelledAt: string;
  refundDetails: {
    refundAmount: number;
    cancellationFee: number;
    refundStatus: 'Processing' | 'Completed' | 'Failed';
    estimatedRefundDate: string;
    refundMode: string;
  };
}

export class BookingService extends ApiService {
  // Create booking
  async createBooking(bookingData: CreateBookingRequest): Promise<ApiResponse<BookingResponse>> {
    try {
      return await this.post<BookingResponse>(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);
    } catch (error) {
      throw this.handleBookingError(error);
    }
  }

  // Get booking details
  async getBookingDetails(bookingId: string): Promise<ApiResponse<BookingDetails>> {
    try {
      return await this.get<BookingDetails>(API_ENDPOINTS.BOOKINGS.GET_BY_ID(bookingId));
    } catch (error) {
      throw this.handleBookingError(error);
    }
  }

  // Get user's bookings
  async getMyBookings(
    status?: string,
    page: number = 1,
    size: number = 10
  ): Promise<ApiResponse<PaginatedBookings>> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('size', size.toString());

      const url = `${API_ENDPOINTS.BOOKINGS.MY_BOOKINGS}?${params.toString()}`;
      return await this.get<PaginatedBookings>(url);
    } catch (error) {
      throw this.handleBookingError(error);
    }
  }

  // Cancel booking
  async cancelBooking(
    bookingId: string,
    cancelData: CancelBookingRequest
  ): Promise<ApiResponse<CancelBookingResponse>> {
    try {
      return await this.post<CancelBookingResponse>(
        API_ENDPOINTS.BOOKINGS.CANCEL(bookingId),
        cancelData
      );
    } catch (error: any) {
      if (error.statusCode === 400) {
        throw new Error('This booking cannot be cancelled. Please check the cancellation policy.');
      }
      if (error.statusCode === 404) {
        throw new Error('Booking not found.');
      }
      throw this.handleBookingError(error);
    }
  }

  // Handle booking-related errors
  private handleBookingError(error: any): Error {
    if (error.statusCode === 409) {
      return new Error('Booking conflict. The selected seats are no longer available.');
    }
    
    if (error.statusCode === 410) {
      return new Error('The booking session has expired. Please start over.');
    }
    
    if (error.errors && error.errors.length > 0) {
      return new Error(error.errors[0].message);
    }
    
    return new Error('Failed to process booking. Please try again.');
  }
}

// Create singleton instance
export const bookingService = new BookingService();