import React from 'react';
import { Sun, Cloud, Moon, Star, Wifi, BatteryCharging, Bed, Droplets, Tv } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';

const departureTimes = [
  { id: 'morning', label: 'Morning', time: '6 AM - 12 PM', icon: Sun },
  { id: 'afternoon', label: 'Afternoon', time: '12 PM - 6 PM', icon: Cloud },
  { id: 'evening', label: 'Evening', time: '6 PM - 12 AM', icon: Moon },
  { id: 'night', label: 'Night', time: '12 AM - 6 AM', icon: Star },
];

const busTypes = [
  { id: 'ac', label: 'AC', count: 15 },
  { id: 'nonac', label: 'Non-AC', count: 8 },
  { id: 'sleeper', label: 'Sleeper', count: 12 },
  { id: 'seater', label: 'Seater', count: 18 },
  { id: 'luxury', label: 'Luxury', count: 6 },
];

const amenities = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'charging', label: 'Charging Point', icon: BatteryCharging },
  { id: 'blanket', label: 'Blanket', icon: Bed },
  { id: 'water', label: 'Water Bottle', icon: Droplets },
  { id: 'tv', label: 'TV', icon: Tv },
];

const ratings = [
  { value: 4, label: '4★ & above' },
  { value: 3, label: '3★ & above' },
];

export const FilterSidebar: React.FC = () => {
  const { filters, setFilters, filterRoutes } = useSearchStore();

  const handleDepartureTimeChange = (timeId: string) => {
    const newTimes = filters.departureTime.includes(timeId)
      ? filters.departureTime.filter(t => t !== timeId)
      : [...filters.departureTime, timeId];
    
    setFilters({ departureTime: newTimes });
    setTimeout(filterRoutes, 0);
  };

  const handleBusTypeChange = (typeId: string) => {
    const newTypes = filters.busType.includes(typeId)
      ? filters.busType.filter(t => t !== typeId)
      : [...filters.busType, typeId];
    
    setFilters({ busType: newTypes });
    setTimeout(filterRoutes, 0);
  };

  const handleAmenityChange = (amenityId: string) => {
    const newAmenities = filters.amenities.includes(amenityId)
      ? filters.amenities.filter(a => a !== amenityId)
      : [...filters.amenities, amenityId];
    
    setFilters({ amenities: newAmenities });
    setTimeout(filterRoutes, 0);
  };

  const handleRatingChange = (rating: number) => {
    const newRating = filters.rating === rating ? null : rating;
    setFilters({ rating: newRating });
    setTimeout(filterRoutes, 0);
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setFilters({ 
      priceRange: { 
        ...filters.priceRange, 
        [type]: value 
      } 
    });
    setTimeout(filterRoutes, 0);
  };

  const clearAllFilters = () => {
    setFilters({
      departureTime: [],
      busType: [],
      amenities: [],
      rating: null,
      priceRange: { min: 300, max: 2000 },
    });
    setTimeout(filterRoutes, 0);
  };

  return (
    <aside className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button 
          onClick={clearAllFilters}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Departure Time Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Departure Time</h4>
        <div className="grid grid-cols-2 gap-2">
          {departureTimes.map((time) => {
            const IconComponent = time.icon;
            return (
              <label key={time.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.departureTime.includes(time.id)}
                  onChange={() => handleDepartureTimeChange(time.id)}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                  filters.departureTime.includes(time.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <IconComponent className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">{time.label}</div>
                  <div className="text-xs text-gray-500">{time.time}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bus Type Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Bus Type</h4>
        <div className="space-y-2">
          {busTypes.map((type) => (
            <label key={type.id} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters.busType.includes(type.id)}
                  onChange={() => handleBusTypeChange(type.id)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{type.label}</span>
              </div>
              <span className="text-sm text-gray-500">({type.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Price Range</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>₹{filters.priceRange.min}</span>
            <span>₹{filters.priceRange.max}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="300"
              max="2000"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <input
              type="range"
              min="300"
              max="2000"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb mt-2"
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            Average price: ₹850
          </div>
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Amenities</h4>
        <div className="space-y-2">
          {amenities.map((amenity) => {
            const IconComponent = amenity.icon;
            return (
              <label key={amenity.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity.id)}
                  onChange={() => handleAmenityChange(amenity.id)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <IconComponent className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">{amenity.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Rating</h4>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <label key={rating.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating.value}
                onChange={() => handleRatingChange(rating.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-1">
                {[...Array(rating.value)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-700 ml-1">{rating.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};