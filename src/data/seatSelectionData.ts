import type { BusDetails, Seat, BoardingPoint, DroppingPoint, CancellationPolicy } from '../types/seatSelection';

export const mockSeats: Seat[] = [
  // Lower Deck Seats
  { id: 'L1', number: 'L1', type: 'lower', status: 'available', price: 1899, row: 1, column: 'left', isPremium: false },
  { id: 'L2', number: 'L2', type: 'lower', status: 'available', price: 1899, row: 1, column: 'left', isPremium: false },
  { id: 'L3', number: 'L3', type: 'lower', status: 'ladies-only', price: 1899, row: 1, column: 'right', isPremium: false },
  
  { id: 'L4', number: 'L4', type: 'lower', status: 'booked', price: 1899, row: 2, column: 'left', isPremium: false },
  { id: 'L5', number: 'L5', type: 'lower', status: 'available', price: 1899, row: 2, column: 'left', isPremium: false },
  { id: 'L6', number: 'L6', type: 'lower', status: 'ladies-only', price: 1899, row: 2, column: 'right', isPremium: false },
  
  { id: 'L7', number: 'L7', type: 'lower', status: 'available', price: 1899, row: 3, column: 'left', isPremium: false },
  { id: 'L8', number: 'L8', type: 'lower', status: 'booked', price: 1899, row: 3, column: 'left', isPremium: false },
  { id: 'L9', number: 'L9', type: 'lower', status: 'available', price: 1899, row: 3, column: 'right', isPremium: false },
  
  { id: 'L10', number: 'L10', type: 'lower', status: 'booked', price: 1899, row: 4, column: 'left', isPremium: false },
  { id: 'L11', number: 'L11', type: 'lower', status: 'available', price: 1899, row: 4, column: 'left', isPremium: false },
  { id: 'L12', number: 'L12', type: 'lower', status: 'available', price: 1899, row: 4, column: 'right', isPremium: false },
  
  { id: 'L13', number: 'L13', type: 'lower', status: 'available', price: 1899, row: 5, column: 'left', isPremium: false },
  { id: 'L14', number: 'L14', type: 'lower', status: 'booked', price: 1899, row: 5, column: 'left', isPremium: false },
  { id: 'L15', number: 'L15', type: 'lower', status: 'booked', price: 1899, row: 5, column: 'right', isPremium: false },
  
  // Last row - 5 seats
  { id: 'L16', number: 'L16', type: 'lower', status: 'available', price: 1699, row: 6, column: 'left', isPremium: false },
  { id: 'L17', number: 'L17', type: 'lower', status: 'booked', price: 1699, row: 6, column: 'left', isPremium: false },
  { id: 'L18', number: 'L18', type: 'lower', status: 'available', price: 1699, row: 6, column: 'left', isPremium: false },
  { id: 'L19', number: 'L19', type: 'lower', status: 'available', price: 1699, row: 6, column: 'left', isPremium: false },
  { id: 'L20', number: 'L20', type: 'lower', status: 'booked', price: 1699, row: 6, column: 'left', isPremium: false },

  // Upper Deck Seats (Premium)
  { id: 'U1', number: 'U1', type: 'upper', status: 'available', price: 2199, row: 1, column: 'left', isPremium: true },
  { id: 'U2', number: 'U2', type: 'upper', status: 'booked', price: 2199, row: 1, column: 'left', isPremium: false },
  { id: 'U3', number: 'U3', type: 'upper', status: 'available', price: 2199, row: 1, column: 'right', isPremium: true },
  
  { id: 'U4', number: 'U4', type: 'upper', status: 'available', price: 2199, row: 2, column: 'left', isPremium: true },
  { id: 'U5', number: 'U5', type: 'upper', status: 'booked', price: 2199, row: 2, column: 'left', isPremium: false },
  { id: 'U6', number: 'U6', type: 'upper', status: 'available', price: 2199, row: 2, column: 'right', isPremium: true },
  
  { id: 'U7', number: 'U7', type: 'upper', status: 'booked', price: 2199, row: 3, column: 'left', isPremium: false },
  { id: 'U8', number: 'U8', type: 'upper', status: 'available', price: 2199, row: 3, column: 'left', isPremium: true },
  { id: 'U9', number: 'U9', type: 'upper', status: 'booked', price: 2199, row: 3, column: 'right', isPremium: false },
  
  { id: 'U10', number: 'U10', type: 'upper', status: 'available', price: 2199, row: 4, column: 'left', isPremium: true },
  { id: 'U11', number: 'U11', type: 'upper', status: 'available', price: 2199, row: 4, column: 'left', isPremium: true },
  { id: 'U12', number: 'U12', type: 'upper', status: 'available', price: 2199, row: 4, column: 'right', isPremium: true },
];

export const mockBusDetails: BusDetails = {
  id: 'bus-001',
  name: 'Royal Luxury Express',
  type: 'AC Sleeper (2+1)',
  totalSeats: 32,
  availableSeats: 16,
  busNumber: 'MH-01-AB-1234',
  amenities: ['Free WiFi', 'USB Charging', 'Blankets', 'Entertainment', 'Water Bottle', 'Snacks', 'AC', 'GPS Tracking'],
  boardingPoints: [
    { id: 'board-1', name: 'Mumbai Central Station', address: 'Platform 2, Mumbai Central Railway Station', time: '06:30 AM', isSelected: true },
    { id: 'board-2', name: 'Dadar West', address: 'Near Shivaji Park, Dadar West', time: '06:50 AM' },
  ],
  droppingPoints: [
    { id: 'drop-1', name: 'Pune Railway Station', address: 'Main Entrance, Pune Junction', time: '10:00 AM', isSelected: true },
    { id: 'drop-2', name: 'Hinjewadi IT Park', address: 'Phase 1, Rajiv Gandhi Infotech Park', time: '10:30 AM' },
  ],
};

export const mockBoardingPoints: BoardingPoint[] = [
  { id: 'board-1', name: 'Mumbai Central Station', address: 'Platform 2, Mumbai Central Railway Station', time: '06:30 AM', isSelected: true },
  { id: 'board-2', name: 'Dadar West', address: 'Near Shivaji Park, Dadar West', time: '06:50 AM' },
];

export const mockDroppingPoints: DroppingPoint[] = [
  { id: 'drop-1', name: 'Pune Railway Station', address: 'Main Entrance, Pune Junction', time: '10:00 AM', isSelected: true },
  { id: 'drop-2', name: 'Hinjewadi IT Park', address: 'Phase 1, Rajiv Gandhi Infotech Park', time: '10:30 AM' },
];

export const cancellationPolicies: CancellationPolicy[] = [
  { hoursBefore: 24, refundPercentage: 100, cancellationFee: 0, description: 'Before 24 hours: 100% refund (No cancellation fee)' },
  { hoursBefore: 12, refundPercentage: 75, cancellationFee: 25, description: '12-24 hours before: 75% refund (25% cancellation fee)' },
  { hoursBefore: 0, refundPercentage: 0, cancellationFee: 100, description: 'Less than 12 hours: No refund' },
];