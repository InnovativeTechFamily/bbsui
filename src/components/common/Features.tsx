import React from 'react';
import { Shield, Clock, Smartphone, Tag, RotateCcw, Star } from 'lucide-react';
const features = [
  {
    id: '1',
    title: 'Safe & Secure',
    description: 'SSL encrypted payment gateway and verified operators for your safety.',
    icon: 'shield',
  },
  {
    id: '2',
    title: '24/7 Support',
    description: 'Round-the-clock customer service to assist you at every step.',
    icon: 'clock',
  },
  {
    id: '3',
    title: 'Real-Time Tracking',
    description: 'Track your bus location in real-time with GPS-enabled tracking.',
    icon: 'mobile',
  },
  {
    id: '4',
    title: 'Best Prices',
    description: 'Get the most competitive fares with exclusive deals and offers.',
    icon: 'tag',
  },
  {
    id: '5',
    title: 'Easy Cancellation',
    description: 'Flexible cancellation policy with quick refunds to your account.',
    icon: 'redo',
  },
  {
    id: '6',
    title: 'Verified Reviews',
    description: 'Read authentic reviews from fellow travelers before booking.',
    icon: 'star',
  },
];

const iconMap = {
  shield: Shield,
  clock: Clock,
  mobile: Smartphone,
  tag: Tag,
  redo: RotateCcw,
  star: Star,
};

export const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600">Experience the difference with our customer-first approach</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div key={feature.id} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};