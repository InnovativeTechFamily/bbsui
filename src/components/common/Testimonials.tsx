import React from 'react';
import { Star } from 'lucide-react';
const testimonials = [
  {
    id: '1',
    rating: 5,
    text: 'Excellent service! The booking process was smooth and the bus was clean and comfortable. Highly recommended!',
    author: 'Rajesh Kumar',
    role: 'Business Traveler',
    avatar: 'RK',
  },
  {
    id: '2',
    rating: 5,
    text: 'Great experience! The real-time tracking feature gave me peace of mind. Customer support was very helpful.',
    author: 'Priya Sharma',
    role: 'Regular Commuter',
    avatar: 'PS',
  },
  {
    id: '3',
    rating: 5,
    text: 'Best bus booking platform I\'ve used. Competitive prices and reliable service every time. Won\'t go anywhere else!',
    author: 'Amit Mehta',
    role: 'Frequent Traveler',
    avatar: 'AM',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Join thousands of satisfied travelers</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <span className="text-gray-600 text-sm">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};