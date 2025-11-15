import React from 'react';
import { MapPin, Calendar, Users, Edit3 } from 'lucide-react';
import { useSearchStore } from '../../store/searchStore';

export const SearchBar: React.FC = () => {
  const { searchParams, setSearchParams } = useSearchStore();

  return (
    <div className="sticky top-16 bg-white shadow-lg border-b border-gray-200 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto lg:flex-1">
            {/* From */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchParams.from}
                onChange={(e) => setSearchParams({ from: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="From"
              />
            </div>

            {/* To */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchParams.to}
                onChange={(e) => setSearchParams({ to: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="To"
              />
            </div>

            {/* Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Passengers */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                min="1"
                max="10"
                value={searchParams.passengers}
                onChange={(e) => setSearchParams({ passengers: parseInt(e.target.value) })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Passengers"
              />
            </div>
          </div>

          <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Edit3 className="h-5 w-5" />
            <span>Modify Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};