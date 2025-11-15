import React from 'react';

export const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl text-blue-100 mb-8">Download our mobile app for exclusive deals and faster booking</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-black text-white px-6 py-4 rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors">
            <div className="text-2xl">📱</div>
            <div className="text-left">
              <div className="text-sm">Get it on</div>
              <div className="font-semibold">Google Play</div>
            </div>
          </button>
          <button className="bg-black text-white px-6 py-4 rounded-lg flex items-center space-x-3 hover:bg-gray-800 transition-colors">
            <div className="text-2xl">🍎</div>
            <div className="text-left">
              <div className="text-sm">Download on the</div>
              <div className="font-semibold">App Store</div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};