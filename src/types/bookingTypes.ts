export interface BookingFormData {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export type ModalType = 'login' | 'signup' | null;