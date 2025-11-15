import React from 'react';
import type { Seat as SeatType } from '../../types/seatSelection';
import { useSeatSelectionStore } from '../../store/seatSelectionStore';

interface SeatProps {
  seat: SeatType;
}

export const Seat: React.FC<SeatProps> = ({ seat }) => {
  const { toggleSeatSelection } = useSeatSelectionStore();

  const getSeatStyles = () => {
    const baseStyles = 'w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-semibold cursor-pointer transition-all duration-200 hover:scale-105';
    
    switch (seat.status) {
      case 'available':
        return `${baseStyles} bg-green-50 border-green-300 text-green-700 hover:bg-green-100`;
      case 'selected':
        return `${baseStyles} bg-blue-500 border-blue-600 text-white hover:bg-blue-600`;
      case 'booked':
        return `${baseStyles} bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed`;
      case 'ladies-only':
        return `${baseStyles} bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100`;
      default:
        return `${baseStyles} bg-gray-100 border-gray-300 text-gray-600`;
    }
  };

  const handleSeatClick = () => {
    if (seat.status === 'available' || seat.status === 'selected' || seat.status === 'ladies-only') {
      toggleSeatSelection(seat.id);
    }
  };

  return (
    <div 
      className={getSeatStyles()}
      onClick={handleSeatClick}
      title={`Seat ${seat.number} - ₹${seat.price}${seat.isPremium ? ' (Premium)' : ''}`}
    >
      <span className="text-xs font-bold">{seat.number}</span>
      {seat.isPremium && (
        <span className="text-[8px] text-yellow-600">👑</span>
      )}
    </div>
  );
};