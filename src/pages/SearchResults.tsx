import React, { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../components/common/SearchBar';
import { FilterSidebar } from '../components/common/FilterSidebar';
import { SearchResultsHeader } from '../components/common/SearchResultsHeader';
import { BusCard } from '../components/common/BusCard';
import { Footer } from '../components/layout/Footer';
import { useSearchStore } from '../store/searchStore';

export const SearchResults: React.FC = () => {
  const { filteredRoutes, filterRoutes, sortRoutes } = useSearchStore();

  useEffect(() => {
    filterRoutes();
    sortRoutes();
  }, [filterRoutes, sortRoutes]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchBar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <FilterSidebar />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <SearchResultsHeader />
            
            {/* Bus Listings */}
            <div className="space-y-6">
              {filteredRoutes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🚌</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No buses found</h3>
                  <p className="text-gray-600">Try adjusting your filters to see more options</p>
                </div>
              ) : (
                filteredRoutes.map((route) => (
                  <BusCard key={route.id} route={route} />
                ))
              )}
            </div>

            {/* Load More Button */}
            {filteredRoutes.length > 0 && (
              <div className="text-center mt-8">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto">
                  <span>Load More Buses</span>
                  <span>↓</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};