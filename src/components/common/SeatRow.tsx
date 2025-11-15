import React from 'react';
import type { Seat as SeatType } from '../../types/seatSelection';
import { Seat } from './Seat';

interface SeatRowProps {
  seats: SeatType[];
  rowNumber?: number;
  isLastRow?: boolean;
}

export const SeatRow: React.FC<SeatRowProps> = ({ seats, isLastRow = false }) => {
  const leftSeats = seats.filter(seat => seat.column === 'left');
  const rightSeats = seats.filter(seat => seat.column === 'right');

  return (
    <div className={`flex items-center gap-4 ${isLastRow ? 'justify-center' : ''}`}>
      {/* Left side seats */}
      <div className={`flex gap-2 ${isLastRow ? 'gap-3' : ''}`}>
        {leftSeats.map(seat => (
          <Seat key={seat.id} seat={seat} />
        ))}
      </div>
      
      {/* Aisle */}
      <div className="w-8 h-1 bg-gray-300 rounded"></div>
      
      {/* Right side seats */}
      <div className={`flex gap-2 ${isLastRow ? 'gap-3' : ''}`}>
        {rightSeats.map(seat => (
          <Seat key={seat.id} seat={seat} />
        ))}
      </div>
    </div>
  );
};