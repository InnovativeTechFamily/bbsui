import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { busService, realTimeService } from '../services';
import type { SeatUpdateEvent } from '../services';
import type { Seat, BusDetails, BookingSummary, BoardingPoint, DroppingPoint, SelectedSeat } from '../types/seatSelection';
import { useSearchStore } from './searchStore';

interface SeatSelectionState {
  // Bus and seat data
  busDetails: BusDetails | null;
  seats: Seat[];
  selectedDeck: 'lower' | 'upper';
  
  // Selection state
  selectedSeats: SelectedSeat[];
  selectedBoardingPoint: BoardingPoint | null;
  selectedDroppingPoint: DroppingPoint | null;
  
  // Seat lock state
  lockId: string | null;
  sessionId: string | null;
  lockExpiresAt: string | null;
  remainingSeconds: number;
  isLocking: boolean;
  lockError: string | null;
  
  // Booking summary
  bookingSummary: BookingSummary;
  
  // Loading states
  isLoadingSeats: boolean;
  seatError: string | null;
  
  // Actions
  loadSeatLayout: (busId: string, journeyDate: string) => Promise<void>;
  toggleSeatSelection: (seatId: string) => Promise<void>;
  setSelectedDeck: (deck: 'lower' | 'upper') => void;
  setBoardingPoint: (point: BoardingPoint) => void;
  setDroppingPoint: (point: DroppingPoint) => void;
  lockSelectedSeats: () => Promise<void>;
  extendLock: () => Promise<void>;
  releaseLock: () => Promise<void>;
  updatePassengerDetails: (seatId: string, details: Partial<SelectedSeat>) => void;
  calculateBookingSummary: () => void;
  resetSelection: () => void;
  subscribeToSeatUpdates: (busId: string) => void;
  unsubscribeFromSeatUpdates: () => void;
}

const TAX_RATE = 0.05; // 5% tax
const DISCOUNT_AMOUNT = 100; // ₹100 discount

export const useSeatSelectionStore = create<SeatSelectionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      busDetails: null,
      seats: [],
      selectedDeck: 'lower',
      selectedSeats: [],
      selectedBoardingPoint: null,
      selectedDroppingPoint: null,
      lockId: null,
      sessionId: null,
      lockExpiresAt: null,
      remainingSeconds: 0,
      isLocking: false,
      lockError: null,
      bookingSummary: {
        selectedSeats: [],
        totalAmount: 0,
        baseFare: 0,
        taxes: 0,
        discount: 0,
        passengerCount: 0,
      },
      isLoadingSeats: false,
      seatError: null,

      // Load seat layout from API
      loadSeatLayout: async (busId: string, journeyDate: string) => {
        set({ isLoadingSeats: true, seatError: null });
        
        try {
          // Get both seat layout and bus details
          const [layoutResponse, busResponse] = await Promise.all([
            busService.getSeatLayout(busId, journeyDate),
            busService.getBusDetails(busId)
          ]);
          
          if (layoutResponse.success && layoutResponse.data && busResponse.success && busResponse.data) {
            const layoutData = layoutResponse.data;
            const busData = busResponse.data;
            
            // Map API seat status to our status
            const mapSeatStatus = (apiStatus: string): 'available' | 'selected' | 'booked' | 'ladies-only' => {
              switch (apiStatus) {
                case 'Available':
                  return 'available';
                case 'Booked':
                  return 'booked';
                case 'Locked':
                  return 'booked'; // Treat locked as booked for UI
                default:
                  return 'available';
              }
            };
            
            // Convert API data to our seat format
            const seats: Seat[] = [];
            layoutData.decks.forEach((deck: any) => {
              deck.seats.forEach((seat: any) => {
                seats.push({
                  id: seat.seatId,
                  number: seat.seatNumber,
                  type: seat.deck.toLowerCase() as 'lower' | 'upper',
                  status: mapSeatStatus(seat.status),
                  price: seat.price,
                  isPremium: seat.isPremium || false,
                  row: seat.rowNumber,
                  column: seat.position.side.toLowerCase() as 'left' | 'right',
                });
              });
            });

            // Convert bus details with boarding/dropping points
            const busDetails: BusDetails = {
              id: layoutData.busId,
              name: layoutData.busName,
              type: layoutData.layoutType,
              totalSeats: layoutData.totalSeats,
              availableSeats: layoutData.availableSeats,
              busNumber: busData.busNumber,
              amenities: busData.amenities,
              boardingPoints: busData.boardingPoints,
              droppingPoints: busData.droppingPoints,
            };

            set({
              seats,
              busDetails,
              isLoadingSeats: false,
              seatError: null,
            });
          } else {
            throw new Error(layoutResponse.message || busResponse.message || 'Failed to load seat layout');
          }
        } catch (error: any) {
          set({
            isLoadingSeats: false,
            seatError: error.message || 'Failed to load seat layout',
            seats: [],
            busDetails: null,
          });
        }
      },

      // Toggle seat selection
      toggleSeatSelection: async (seatId: string) => {
        const { seats, selectedSeats } = get();
        const seat = seats.find(s => s.id === seatId);
        
        if (!seat || seat.status === 'booked') {
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

      // Lock selected seats
      lockSelectedSeats: async () => {
        const { selectedSeats, selectedBoardingPoint, selectedDroppingPoint, busDetails } = get();
        const searchStore = useSearchStore.getState();
        
        if (selectedSeats.length === 0 || !selectedBoardingPoint || !selectedDroppingPoint || !busDetails) {
          set({ lockError: 'Please select seats and boarding/dropping points' });
          return;
        }

        set({ isLocking: true, lockError: null });
        
        try {
          const lockRequest: SeatLockRequest = {
            busId: busDetails.id,
            journeyDate: searchStore.searchParams.date,
            seatIds: selectedSeats.map(seat => seat.id),
            boardingPointId: selectedBoardingPoint.id,
            droppingPointId: selectedDroppingPoint.id,
          };

          const response = await busService.lockSeats(lockRequest);
          
          if (response.success && response.data) {
            const lockData = response.data;
            
            set({
              lockId: lockData.lockId,
              sessionId: lockData.sessionId,
              lockExpiresAt: lockData.lockExpiresAt,
              remainingSeconds: lockData.lockDurationSeconds,
              isLocking: false,
              lockError: null,
            });

            // Start lock countdown timer
            get().startLockTimer();
          } else {
            throw new Error(response.message || 'Failed to lock seats');
          }
        } catch (error: any) {
          set({
            isLocking: false,
            lockError: error.message || 'Failed to lock seats',
          });
        }
      },

      // Extend lock
      extendLock: async () => {
        const { lockId, sessionId } = get();
        
        if (!lockId || !sessionId) {
          set({ lockError: 'No active lock to extend' });
          return;
        }

        try {
          const response = await busService.extendSeatLock(lockId, sessionId);
          
          if (response.success && response.data) {
            set({
              lockExpiresAt: response.data.newExpiryTime,
              remainingSeconds: response.data.remainingSeconds,
              lockError: null,
            });
          }
        } catch (error: any) {
          set({ lockError: error.message });
        }
      },

      // Release lock
      releaseLock: async () => {
        const { lockId, sessionId } = get();
        
        if (!lockId || !sessionId) {
          return;
        }

        try {
          await busService.releaseSeatLock(lockId, sessionId);
          
          set({
            lockId: null,
            sessionId: null,
            lockExpiresAt: null,
            remainingSeconds: 0,
            lockError: null,
          });
        } catch (error) {
          console.error('Failed to release lock:', error);
        }
      },

      // Start lock countdown timer
      startLockTimer: () => {
        const interval = setInterval(() => {
          const { remainingSeconds } = get();
          
          if (remainingSeconds > 0) {
            set({ remainingSeconds: remainingSeconds - 1 });
          } else {
            // Lock expired
            clearInterval(interval);
            set({
              lockId: null,
              sessionId: null,
              lockExpiresAt: null,
              remainingSeconds: 0,
              lockError: 'Seat lock has expired. Please select seats again.',
            });
            
            // Reset seat selections
            const { seats } = get();
            const updatedSeats = seats.map(seat => 
              seat.status === 'selected' ? { ...seat, status: 'available' as const } : seat
            );
            set({ 
              seats: updatedSeats,
              selectedSeats: [] 
            });
            get().calculateBookingSummary();
          }
        }, 1000);
        
        // Store interval ID for cleanup
        (get() as any).lockTimerInterval = interval;
      },

      updatePassengerDetails: (seatId: string, details: Partial<SelectedSeat>) => {
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
        lockId: null,
        sessionId: null,
        lockExpiresAt: null,
        remainingSeconds: 0,
        isLocking: false,
        lockError: null,
        bookingSummary: {
          selectedSeats: [],
          totalAmount: 0,
          baseFare: 0,
          taxes: 0,
          discount: 0,
          passengerCount: 0,
        },
      }),

      // Subscribe to real-time seat updates
      subscribeToSeatUpdates: (busId: string) => {
        // Handle seat update events
        const handleSeatUpdate = (event: SeatUpdateEvent) => {
          const { seats, selectedSeats } = get();
          
          // Update seat status in real-time
          const updatedSeats = seats.map(seat => {
            if (seat.id === event.seatId) {
              // Don't update if seat is currently selected by user
              const isUserSelected = selectedSeats.some(s => s.id === seat.id);
              if (isUserSelected) {
                return seat; // Keep user's selection
              }
              
              return {
                ...seat,
                status: event.status.toLowerCase() as 'available' | 'booked' | 'selected' | 'ladies-only',
              };
            }
            return seat;
          });
          
          set({ seats: updatedSeats });
        };

        // Subscribe to real-time events
        realTimeService.on('seat-update', handleSeatUpdate);
        realTimeService.subscribeToBus(busId);

        // Store cleanup function for later use
        (get() as any).cleanupSeatUpdates = () => {
          realTimeService.off('seat-update', handleSeatUpdate);
          realTimeService.unsubscribeFromBus(busId);
        };
      },

      // Unsubscribe from real-time seat updates
      unsubscribeFromSeatUpdates: () => {
        const cleanup = (get() as any).cleanupSeatUpdates;
        if (cleanup) {
          cleanup();
          (get() as any).cleanupSeatUpdates = null;
        }
      },
    }),
    {
      name: 'seat-selection-store',
    }
  )
);