import React from 'react';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/common/Hero';
import { Services } from '../components/common/Services';
import { Features } from '../components/common/Features';
import { Testimonials } from '../components/common/Testimonials';
import { CTA } from '../components/common/CTA';
import { Footer } from '../components/layout/Footer';
import { AuthModal } from '../components/common/AuthModal';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};