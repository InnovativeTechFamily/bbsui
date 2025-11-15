import React from 'react';
import { useSeatSelectionStore } from '../../store/seatSelectionStore';
import { Lock, ArrowRight } from 'lucide-react';

export const BookingSummary: React.FC = () => {
  const { bookingSummary, selectedSeats } = useSeatSelectionStore();

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return;
    // Navigate to payment page
    console.log('Proceeding to payment with:', bookingSummary);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>

      {/* Selected Seats */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Selected Seats:</span>
          <span className="text-sm font-medium text-gray-800">
            {selectedSeats.length > 0 
              ? selectedSeats.map(seat => seat.number).join(', ')
              : 'None'
            }
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Fare</span>
          <span className="font-medium">₹{bookingSummary.baseFare}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes & Fees</span>
          <span className="font-medium">₹{bookingSummary.taxes}</span>
        </div>
        {bookingSummary.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center space-x-1">
              <span>🎫</span>
              <span>Discount</span>
            </span>
            <span className="font-medium">-₹{bookingSummary.discount}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Total Amount</span>
            <span className="font-bold text-lg text-blue-600">₹{bookingSummary.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Passenger Count */}
      <div className="mb-6">
        <label className="block text-sm text-gray-600 mb-2">Number of Passengers:</label>
        <div className="flex items-center justify-center space-x-4">
          <span className="text-2xl font-bold text-blue-600">{selectedSeats.length}</span>
          <span className="text-sm text-gray-500">passenger{selectedSeats.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceedToPayment}
        disabled={selectedSeats.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
          selectedSeats.length > 0
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <span>Proceed to Payment</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Safe Payment */}
      <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-gray-500">
        <Lock className="w-4 h-4" />
        <span>100% Safe & Secure Payment</span>
      </div>
    </div>
  );
};