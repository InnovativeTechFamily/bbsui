import React from 'react';
import { Star, Wifi, BatteryCharging, Bed, Droplets, Tv, Users, MapPin, Clock } from 'lucide-react';

interface BusRoute {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: string;
  operator: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  seatsAvailable: number;
  isPremium?: boolean;
  isBestPrice?: boolean;
}

const amenityIcons = {
  wifi: Wifi,
  charging: BatteryCharging,
  blanket: Bed,
  water: Droplets,
  entertainment: Tv,
  tv: Tv,
  snacks: Users,
};

interface BusCardProps {
  route: BusRoute;
}

export const BusCard: React.FC<BusCardProps> = ({ route }) => {
  const getAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity.toLowerCase() as keyof typeof amenityIcons] || MapPin;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className={`bus-card relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${route.isPremium ? 'border-2 border-yellow-400' : ''}`}>
      {route.isPremium && (
        <div className="absolute -top-3 left-6 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
          <span>👑</span>
          <span>PREMIUM</span>
        </div>
      )}
      
      {route.isBestPrice && (
        <div className="absolute -top-3 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
          <span>🏷️</span>
          <span>BEST PRICE</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Bus Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{route.operator}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{route.busType}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{route.rating}</span>
                  <span className="text-gray-500">({route.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">₹{route.price}</div>
              <div className="text-sm text-gray-500">per seat</div>
            </div>
          </div>

          {/* Journey Info */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{route.departureTime}</div>
              <div className="text-sm text-gray-600 flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{route.from}</span>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-xs">
                <div className="h-px bg-gray-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-2 text-sm text-gray-500 flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{route.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{route.arrivalTime}</div>
              <div className="text-sm text-gray-600 flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{route.to}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {route.amenities.map((amenity, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </span>
            ))}
          </div>

          {/* Seats Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{route.seatsAvailable} seats available</span>
              </span>
              {route.isPremium && (
                <span className="text-sm text-green-600 flex items-center space-x-1">
                  <span>📍</span>
                  <span>Live Tracking</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
        <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          View Seats
        </button>
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
};