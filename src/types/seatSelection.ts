export interface Seat {
  id: string;
  number: string;
  type: 'lower' | 'upper';
  status: 'available' | 'selected' | 'booked' | 'ladies-only';
  price: number;
  isPremium?: boolean;
  row: number;
  column: 'left' | 'right';
}

export interface BoardingPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  isSelected?: boolean;
}

export interface DroppingPoint {
  id: string;
  name: string;
  address: string;
  time: string;
  isSelected?: boolean;
}

export interface BusDetails {
  id: string;
  name: string;
  type: string;
  totalSeats: number;
  availableSeats: number;
  busNumber: string;
  amenities: string[];
  boardingPoints: BoardingPoint[];
  droppingPoints: DroppingPoint[];
}

export interface SelectedSeat extends Seat {
  passengerName?: string;
  passengerAge?: number;
  passengerGender?: 'male' | 'female';
}

export interface BookingSummary {
  selectedSeats: SelectedSeat[];
  totalAmount: number;
  baseFare: number;
  taxes: number;
  discount: number;
  passengerCount: number;
  selectedBoardingPoint?: BoardingPoint;
  selectedDroppingPoint?: DroppingPoint;
}

export interface CancellationPolicy {
  hoursBefore: number;
  refundPercentage: number;
  cancellationFee: number;
  description: string;
}