import { create } from 'zustand';
import type { Seat, BusDetails, BookingSummary, BoardingPoint, DroppingPoint, SelectedSeat } from '../types/seatSelection';

interface SeatSelectionState {
  // Bus and seat data
  busDetails: BusDetails | null;
  seats: Seat[];
  selectedDeck: 'lower' | 'upper';
  
  // Selection state
  selectedSeats: SelectedSeat[];
  selectedBoardingPoint: BoardingPoint | null;
  selectedDroppingPoint: DroppingPoint | null;
  
  // Booking summary
  bookingSummary: BookingSummary;
  
  // Actions
  setBusDetails: (busDetails: BusDetails) => void;
  setSeats: (seats: Seat[]) => void;
  toggleSeatSelection: (seatId: string) => void;
  setSelectedDeck: (deck: 'lower' | 'upper') => void;
  setBoardingPoint: (point: BoardingPoint) => void;
  setDroppingPoint: (point: DroppingPoint) => void;
  updatePassengerDetails: (seatId: string, details: Partial<SelectedSeat>) => void;
  calculateBookingSummary: () => void;
  resetSelection: () => void;
}

const TAX_RATE = 0.05; // 5% tax
const DISCOUNT_AMOUNT = 100; // ₹100 discount

export const useSeatSelectionStore = create<SeatSelectionState>((set, get) => ({
  busDetails: null,
  seats: [],
  selectedDeck: 'lower',
  selectedSeats: [],
  selectedBoardingPoint: null,
  selectedDroppingPoint: null,
  bookingSummary: {
    selectedSeats: [],
    totalAmount: 0,
    baseFare: 0,
    taxes: 0,
    discount: 0,
    passengerCount: 0,
  },

  setBusDetails: (busDetails) => set({ busDetails }),

  setSeats: (seats) => set({ seats }),

  toggleSeatSelection: (seatId) => {
    const { seats, selectedSeats } = get();
    const seat = seats.find(s => s.id === seatId);
    
    if (!seat || seat.status === 'booked' || seat.status === 'ladies-only') {
      return;
    }

    const isSelected = selectedSeats.some(s => s.id === seatId);
    
    if (isSelected) {
      // Remove from selection
      const newSelectedSeats = selectedSeats.filter(s => s.id !== seatId);
      set({ selectedSeats: newSelectedSeats });
      
      // Update seat status
      const updatedSeats = seats.map(s => 
        s.id === seatId ? { ...s, status: 'available' as const } : s
      );
      set({ seats: updatedSeats });
    } else {
      // Add to selection
      const newSelectedSeat: SelectedSeat = {
        ...seat,
        status: 'selected' as const,
      };
      const newSelectedSeats = [...selectedSeats, newSelectedSeat];
      set({ selectedSeats: newSelectedSeats });
      
      // Update seat status
      const updatedSeats = seats.map(s => 
        s.id === seatId ? { ...s, status: 'selected' as const } : s
      );
      set({ seats: updatedSeats });
    }
    
    // Recalculate booking summary
    get().calculateBookingSummary();
  },

  setSelectedDeck: (deck) => set({ selectedDeck: deck }),

  setBoardingPoint: (point) => {
    set({ selectedBoardingPoint: point });
    get().calculateBookingSummary();
  },

  setDroppingPoint: (point) => {
    set({ selectedDroppingPoint: point });
    get().calculateBookingSummary();
  },

  updatePassengerDetails: (seatId, details) => {
    const { selectedSeats } = get();
    const updatedSeats = selectedSeats.map(seat => 
      seat.id === seatId ? { ...seat, ...details } : seat
    );
    set({ selectedSeats: updatedSeats });
  },

  calculateBookingSummary: () => {
    const { selectedSeats, selectedBoardingPoint, selectedDroppingPoint } = get();
    
    const baseFare = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const taxes = Math.round(baseFare * TAX_RATE);
    const discount = selectedSeats.length > 0 ? DISCOUNT_AMOUNT : 0;
    const totalAmount = baseFare + taxes - discount;

    const bookingSummary: BookingSummary = {
      selectedSeats,
      totalAmount,
      baseFare,
      taxes,
      discount,
      passengerCount: selectedSeats.length,
      selectedBoardingPoint: selectedBoardingPoint || undefined,
      selectedDroppingPoint: selectedDroppingPoint || undefined,
    };

    set({ bookingSummary });
  },

  resetSelection: () => set({
    selectedSeats: [],
    selectedBoardingPoint: null,
    selectedDroppingPoint: null,
    bookingSummary: {
      selectedSeats: [],
      totalAmount: 0,
      baseFare: 0,
      taxes: 0,
      discount: 0,
      passengerCount: 0,
    },
  }),
}));