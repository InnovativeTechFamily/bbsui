import React from 'react';
import { useSearchStore } from '../../store/searchStore';

export const SearchResultsHeader: React.FC = () => {
  const { filteredRoutes, sortBy, setSortBy, sortRoutes } = useSearchStore();

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setTimeout(sortRoutes, 0);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Available Buses</h2>
        <p className="text-gray-600">
          <span className="text-blue-600 font-semibold">{filteredRoutes.length} buses</span> found
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="recommended">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="departure">Departure Time</option>
          <option value="duration">Duration</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
};