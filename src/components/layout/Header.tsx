import React from 'react';
import { Bus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store';
const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#features', label: 'Features' },
  { href: '#contact', label: 'Contact' },
];

export const Header: React.FC = () => {
  const { openModal } = useAppStore();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">SwiftBus</span>
          </div>
          
          <ul className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a 
                  href={link.href} 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="secondary" 
              onClick={() => openModal('login')}
              className="hidden sm:block"
            >
              Login
            </Button>
            <Button 
              variant="primary" 
              onClick={() => openModal('signup')}
              className="hidden sm:block"
            >
              Sign Up
            </Button>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
                <span className="block w-6 h-0.5 bg-gray-800 mb-1"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};