import { create } from 'zustand';

// Define types directly in this file to avoid import issues
interface BookingFormData {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

type ModalType = 'login' | 'signup' | null;

interface AppState {
  bookingForm: BookingFormData;
  modal: {
    isOpen: boolean;
    type: ModalType;
  };
  setBookingForm: (data: Partial<BookingFormData>) => void;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  bookingForm: {
    from: '',
    to: '',
    date: '',
    passengers: 1,
  },
  modal: {
    isOpen: false,
    type: null,
  },
  setBookingForm: (data) => 
    set((state) => ({
      bookingForm: { ...state.bookingForm, ...data },
    })),
  openModal: (type) => 
    set({
      modal: { isOpen: true, type },
    }),
  closeModal: () => 
    set({
      modal: { isOpen: false, type: null },
    }),
}));

// Export types for use in other components
export type { BookingFormData, ModalType };