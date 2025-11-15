import { Service, Feature, Testimonial, NavLink } from '../types';

export const navLinks: NavLink[] = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#features', label: 'Features' },
  { href: '#contact', label: 'Contact' },
];

export const services: Service[] = [
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

export const features: Feature[] = [
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

export const testimonials: Testimonial[] = [
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