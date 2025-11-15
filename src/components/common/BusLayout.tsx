import React from 'react';
import type { Seat as SeatType } from '../../types/seatSelection';
import { useSeatSelectionStore } from '../../store/seatSelectionStore';
import { SeatRow } from './SeatRow';
import { DoorOpen, Crown } from 'lucide-react';

interface BusLayoutProps {
  seats: SeatType[];
}

export const BusLayout: React.FC<BusLayoutProps> = ({ seats }) => {
  const { selectedDeck, setSelectedDeck } = useSeatSelectionStore();

  const lowerDeckSeats = seats.filter(seat => seat.type === 'lower');
  const upperDeckSeats = seats.filter(seat => seat.type === 'upper');

  const renderDeck = (deckSeats: SeatType[], deckName: 'lower' | 'upper') => {
    const rows = [...new Set(deckSeats.map(seat => seat.row))].sort((a, b) => a - b);
    
    return (
      <div className={`space-y-4 ${selectedDeck === deckName ? 'block' : 'hidden'}`}>
        {/* Bus Front */}
      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🚗</span>
          <span className="text-sm font-medium text-gray-600">Driver</span>
        </div>
        <div className="flex items-center space-x-2">
          <DoorOpen className="w-6 h-6 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Entry</span>
        </div>
      </div>

        {/* Seat Rows */}
        {rows.map((row, index) => {
          const rowSeats = deckSeats.filter(seat => seat.row === row);
          const isLastRow = index === rows.length - 1;
          return (
            <SeatRow 
              key={row} 
              seats={rowSeats} 
              isLastRow={isLastRow}
            />
          );
        })}

        {/* Bus Back */}
        <div className="flex justify-center bg-gray-100 rounded-lg p-3 mt-6">
          <span className="text-sm font-medium text-gray-600">← Back of Bus</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Deck Selector */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Select Your Seats</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedDeck('lower')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedDeck === 'lower'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Lower Deck
          </button>
          <button
            onClick={() => setSelectedDeck('upper')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-1 ${
              selectedDeck === 'upper'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Upper Deck</span>
          </button>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-green-50 border border-green-300 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-pink-50 border border-pink-300 rounded"></div>
          <span className="text-gray-600">Ladies Only</span>
        </div>
      </div>

      {/* Lower Deck */}
      {renderDeck(lowerDeckSeats, 'lower')}
      
      {/* Upper Deck */}
      {renderDeck(upperDeckSeats, 'upper')}
    </div>
  );
};