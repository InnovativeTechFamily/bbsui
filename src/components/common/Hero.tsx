import React from 'react';
import { MapPin, Calendar, Users, Bus, Users as UsersIcon, Map } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store';
import type { BookingFormData } from '../../store/appStore';

export const Hero: React.FC = () => {
  const { bookingForm, setBookingForm } = useAppStore();

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setBookingForm({ [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching buses with:', bookingForm);
    // Add search logic here
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                Travel Comfortably, <span className="text-blue-600">Book Instantly</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience hassle-free bus booking with real-time availability, instant confirmation, and the best fares across multiple routes.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Bus className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">500+</h3>
                  <p className="text-gray-600">Daily Trips</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <UsersIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">50K+</h3>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Map className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">100+</h3>
                  <p className="text-gray-600">Destinations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <MapPin className="h-5 w-5" />
                  <span>From</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter departure city"
                  value={bookingForm.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 font-medium">
                  <MapPin className="h-5 w-5" />
                  <span>To</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter destination city"
                  value={bookingForm.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-700 font-medium">
                    <Calendar className="h-5 w-5" />
                    <span>Date</span>
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-gray-700 font-medium">
                    <Users className="h-5 w-5" />
                    <span>Passengers</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingForm.passengers}
                    onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="book">
                Search Buses
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};