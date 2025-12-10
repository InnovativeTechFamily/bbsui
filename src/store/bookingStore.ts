import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { bookingService } from '../services';
import type { CreateBookingRequest, BookingResponse, BookingDetails } from '../services';
import type { SelectedSeat } from '../types/seatSelection';

interface BookingState {
  // Current booking
  currentBooking: BookingResponse | null;
  bookingDetails: BookingDetails | null;
  
  // Booking creation state
  isCreatingBooking: boolean;
  bookingError: string | null;
  
  // Passenger details
  passengers: PassengerFormData[];
  contactDetails: ContactFormData;
  gstDetails?: GSTFormData;
  
  // Booking history
  myBookings: BookingSummary[];
  isLoadingBookings: boolean;
  bookingsError: string | null;
  
  // Actions
  createBooking: (lockId: string, sessionId: string) => Promise<BookingResponse | null>;
  getBookingDetails: (bookingId: string) => Promise<BookingDetails | null>;
  getMyBookings: () => Promise<void>;
  updatePassengerDetails: (index: number, details: Partial<PassengerFormData>) => void;
  updateContactDetails: (details: ContactFormData) => void;
  updateGSTDetails: (details: GSTFormData) => void;
  initializePassengers: (selectedSeats: SelectedSeat[]) => void;
  resetBooking: () => void;
}

export interface PassengerFormData {
  seatId: string;
  seatNumber: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phoneNumber: string;
  idProofType: 'Aadhaar' | 'PAN' | 'Passport' | 'DrivingLicense' | 'VoterID';
  idProofNumber: string;
}

export interface ContactFormData {
  email: string;
  phoneNumber: string;
  alternatePhone?: string;
}

export interface GSTFormData {
  isGstRequired: boolean;
  gstNumber?: string;
  companyName?: string;
}

interface BookingSummary {
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

const initialState = {
  currentBooking: null,
  bookingDetails: null,
  isCreatingBooking: false,
  bookingError: null,
  passengers: [],
  contactDetails: {
    email: '',
    phoneNumber: '',
    alternatePhone: '',
  },
  gstDetails: {
    isGstRequired: false,
    gstNumber: '',
    companyName: '',
  },
  myBookings: [],
  isLoadingBookings: false,
  bookingsError: null,
};

export const useBookingStore = create<BookingState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Initialize passengers based on selected seats
      initializePassengers: (selectedSeats: SelectedSeat[]) => {
        const passengers: PassengerFormData[] = selectedSeats.map(seat => ({
          seatId: seat.id,
          seatNumber: seat.number,
          name: '',
          age: 0,
          gender: 'Male',
          email: '',
          phoneNumber: '',
          idProofType: 'Aadhaar',
          idProofNumber: '',
        }));
        
        set({ passengers });
      },

      // Update passenger details
      updatePassengerDetails: (index: number, details: Partial<PassengerFormData>) => {
        const { passengers } = get();
        const updatedPassengers = passengers.map((passenger, i) => 
          i === index ? { ...passenger, ...details } : passenger
        );
        set({ passengers: updatedPassengers });
      },

      // Update contact details
      updateContactDetails: (details: ContactFormData) => {
        set({ contactDetails: details });
      },

      // Update GST details
      updateGSTDetails: (details: GSTFormData) => {
        set({ gstDetails: details });
      },

      // Create booking
      createBooking: async (lockId: string, sessionId: string) => {
        const { passengers, contactDetails, gstDetails } = get();
        
        // Validate passenger details
        const isValidPassengers = passengers.every(p => 
          p.name.trim() && 
          p.age > 0 && 
          p.email.trim() && 
          p.phoneNumber.trim() && 
          p.idProofNumber.trim()
        );
        
        if (!isValidPassengers) {
          set({ bookingError: 'Please fill in all passenger details' });
          return null;
        }
        
        // Validate contact details
        if (!contactDetails.email.trim() || !contactDetails.phoneNumber.trim()) {
          set({ bookingError: 'Please fill in contact details' });
          return null;
        }

        set({ isCreatingBooking: true, bookingError: null });
        
        try {
          const bookingRequest: CreateBookingRequest = {
            lockId,
            sessionId,
            passengers: passengers.map(p => ({
              seatId: p.seatId,
              name: p.name.trim(),
              age: p.age,
              gender: p.gender,
              email: p.email.trim(),
              phoneNumber: p.phoneNumber.trim(),
              idProofType: p.idProofType,
              idProofNumber: p.idProofNumber.trim(),
            })),
            contactDetails: {
              email: contactDetails.email.trim(),
              phoneNumber: contactDetails.phoneNumber.trim(),
              alternatePhone: contactDetails.alternatePhone?.trim(),
            },
            gstDetails: gstDetails?.isGstRequired ? {
              isGstRequired: true,
              gstNumber: gstDetails.gstNumber?.trim(),
              companyName: gstDetails.companyName?.trim(),
            } : undefined,
          };

          const response = await bookingService.createBooking(bookingRequest);
          
          if (response.success && response.data) {
            set({
              currentBooking: response.data,
              isCreatingBooking: false,
              bookingError: null,
            });
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to create booking');
          }
        } catch (error: any) {
          set({
            isCreatingBooking: false,
            bookingError: error.message || 'Failed to create booking',
          });
          return null;
        }
      },

      // Get booking details
      getBookingDetails: async (bookingId: string) => {
        set({ isLoadingBookings: true, bookingsError: null });
        
        try {
          const response = await bookingService.getBookingDetails(bookingId);
          
          if (response.success && response.data) {
            set({
              bookingDetails: response.data,
              isLoadingBookings: false,
              bookingsError: null,
            });
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to get booking details');
          }
        } catch (error: any) {
          set({
            isLoadingBookings: false,
            bookingsError: error.message || 'Failed to get booking details',
          });
          return null;
        }
      },

      // Get my bookings
      getMyBookings: async () => {
        set({ isLoadingBookings: true, bookingsError: null });
        
        try {
          const response = await bookingService.getMyBookings();
          
          if (response.success && response.data) {
            set({
              myBookings: response.data.bookings,
              isLoadingBookings: false,
              bookingsError: null,
            });
          } else {
            throw new Error(response.message || 'Failed to get bookings');
          }
        } catch (error: any) {
          set({
            isLoadingBookings: false,
            bookingsError: error.message || 'Failed to get bookings',
            myBookings: [],
          });
        }
      },

      // Reset booking state
      resetBooking: () => set({ ...initialState }),
    }),
    {
      name: 'booking-store',
    }
  )
);