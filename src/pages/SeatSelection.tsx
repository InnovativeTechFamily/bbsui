import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Wifi, Bed, Tv, Droplets, Utensils, Snowflake, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useSeatSelectionStore } from '../store/seatSelectionStore';
import { BusLayout } from '../components/common/BusLayout';
import { BookingSummary } from '../components/common/BookingSummary';
import { PointsSelection } from '../components/common/PointsSelection';
import { mockSeats, mockBusDetails, mockBoardingPoints, mockDroppingPoints } from '../data/seatSelectionData';

export const SeatSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSeats, setBusDetails, resetSelection } = useSeatSelectionStore();

  // Get bus details from navigation state
  const busData = location.state?.bus || {
    from: 'Mumbai Central',
    to: 'Pune Station',
    departureTime: '06:30 AM',
    arrivalTime: '10:00 AM',
    duration: '3h 30m',
    date: 'Nov 6, 2025',
  };

  useEffect(() => {
    // Initialize seat selection data
    setSeats(mockSeats);
    setBusDetails(mockBusDetails);
    
    return () => {
      // Cleanup on unmount
      resetSelection();
    };
  }, [setSeats, setBusDetails, resetSelection]);

  const amenityIcons: Record<string, React.ReactNode> = {
    'Free WiFi': <Wifi className="w-4 h-4" />,
    'USB Charging': <span className="text-sm">🔌</span>,
    'Blankets': <Bed className="w-4 h-4" />,
    'Entertainment': <Tv className="w-4 h-4" />,
    'Water Bottle': <Droplets className="w-4 h-4" />,
    'Snacks': <Utensils className="w-4 h-4" />,
    'AC': <Snowflake className="w-4 h-4" />,
    'GPS Tracking': <Shield className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🚌</span>
                </div>
                <span className="text-xl font-bold text-gray-800">SwiftBus</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Results</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">👤</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Journey Summary Bar */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold">{busData.from}</h3>
                <p className="text-blue-100">{busData.departureTime}</p>
                <p className="text-blue-100 text-sm">{busData.date}</p>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <div className="w-16 h-px bg-blue-300"></div>
                <span className="text-sm">{busData.duration}</span>
                <div className="w-16 h-px bg-blue-300"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{busData.to}</h3>
                <p className="text-blue-100">{busData.arrivalTime}</p>
                <p className="text-blue-100 text-sm">{busData.date}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold">{mockBusDetails.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-blue-500 px-2 py-1 rounded text-xs">🛋️ {mockBusDetails.type}</span>
                <span className="bg-yellow-500 px-2 py-1 rounded text-xs text-yellow-900">⭐ 4.8 (245)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bus Details Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                Bus Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Bus Type</span>
                  <p className="font-medium">{mockBusDetails.type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Seats</span>
                  <p className="font-medium">{mockBusDetails.totalSeats} Seats</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Available</span>
                  <p className="font-medium text-green-600">{mockBusDetails.availableSeats} Seats</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Bus Number</span>
                  <p className="font-medium">{mockBusDetails.busNumber}</p>
                </div>
              </div>
            </div>

            {/* Amenities Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🔔</span>
                Amenities & Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockBusDetails.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                    <span className="text-blue-600">{amenityIcons[amenity]}</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Points Selection */}
            <PointsSelection 
              boardingPoints={mockBoardingPoints}
              droppingPoints={mockDroppingPoints}
            />

            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🔄</span>
                Cancellation Policy
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <strong>Before 24 hours:</strong>
                    <span className="text-gray-600 ml-2">100% refund (No cancellation fee)</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <strong>12-24 hours before:</strong>
                    <span className="text-gray-600 ml-2">75% refund (25% cancellation fee)</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <strong>Less than 12 hours:</strong>
                    <span className="text-gray-600 ml-2">No refund</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Bus Layout */}
            <BusLayout seats={mockSeats} />
            
            {/* Booking Summary */}
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
};