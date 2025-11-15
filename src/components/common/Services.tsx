import React from 'react';
import { Bus, Car, Users, Ticket } from 'lucide-react';
const services = [
  {
    id: '1',
    title: 'Luxury Buses',
    description: 'Travel in style with our premium AC buses featuring reclining seats and entertainment systems.',
    icon: 'bus',
  },
  {
    id: '2',
    title: 'Private Cabs',
    description: 'Book private cars and cabs for personalized door-to-door service at competitive rates.',
    icon: 'car',
  },
  {
    id: '3',
    title: 'Group Travel',
    description: 'Special packages for corporate groups, tours, and family events with customized routes.',
    icon: 'users',
  },
  {
    id: '4',
    title: 'Easy Booking',
    description: 'Book your tickets in minutes with our user-friendly platform and instant confirmation.',
    icon: 'ticket',
  },
];

const iconMap = {
  bus: Bus,
  car: Car,
  users: Users,
  ticket: Ticket,
};

export const Services: React.FC = () => {
  return (
    <section className="py-20 bg-white" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600">Choose from our wide range of premium transportation options</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap];
            return (
              <div key={service.id} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 rounded-full p-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};