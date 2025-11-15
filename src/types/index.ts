export interface BookingFormData {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  rating: number;
  text: string;
  author: string;
  role: string;
  avatar: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export type ModalType = 'login' | 'signup' | null;