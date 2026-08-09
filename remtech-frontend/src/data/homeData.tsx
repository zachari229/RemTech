import {
  Code,
  TrendingUp,
  Palette,
  BarChart2,
  Globe,
  Download,
} from 'lucide-react';
import type { ReactNode } from 'react';

export interface DemoCourse {
  id: number;
  title: string;
  description: string;
  price: number;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  rating: number;
  students: number;
  image: string;
  category: string;
  badge?: string;
}

export interface DemoCategory {
  id: number;
  label: string;
  icon: ReactNode;
  count: number;
  color: string;
}

export interface DemoTestimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  course: string;
}

export const CATEGORIES: DemoCategory[] = [
  { id: 1, label: 'Développement Web', icon: <Code size={24} />, count: 12, color: '#3B82F6' },
  { id: 2, label: 'Marketing Digital', icon: <TrendingUp size={24} />, count: 8, color: '#F97316' },
  { id: 3, label: 'Design UI/UX', icon: <Palette size={24} />, count: 6, color: '#8B5CF6' },
  { id: 4, label: 'Business & Finances', icon: <BarChart2 size={24} />, count: 9, color: '#10B981' },
  { id: 5, label: 'Langues & Communication', icon: <Globe size={24} />, count: 5, color: '#F59E0B' },
  { id: 6, label: 'Ebooks & Ressources', icon: <Download size={24} />, count: 14, color: '#EC4899' },
];

export const FEATURED_COURSES: DemoCourse[] = [
  {
    id: 1,
    title: 'Maîtriser React & TypeScript en 2025',
    description: 'De zéro à développeur React professionnel. Projets réels, best practices et architecture scalable.',
    price: 29000,
    level: 'Intermédiaire',
    duration: '24h',
    rating: 4.9,
    students: 342,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
    category: 'Développement Web',
    badge: 'Bestseller',
  },
  {
    id: 2,
    title: 'Growth Marketing pour Entrepreneurs Africains',
    description: 'Stratégies concrètes pour acquérir vos premiers 1000 clients avec un budget limité.',
    price: 19500,
    level: 'Débutant',
    duration: '12h',
    rating: 4.8,
    students: 518,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    category: 'Marketing Digital',
    badge: 'Nouveau',
  },
  {
    id: 3,
    title: 'Figma Pro : Design de produits digitaux',
    description: 'Concevez des interfaces modernes et vendables. Du wireframe au prototype interactif.',
    price: 15000,
    level: 'Débutant',
    duration: '10h',
    rating: 4.7,
    students: 271,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    category: 'Design UI/UX',
  },
  {
    id: 4,
    title: 'NestJS & Prisma : API REST Complète',
    description: 'Construisez une API production-ready avec NestJS, Prisma, JWT, RBAC et MySQL.',
    price: 34000,
    level: 'Avancé',
    duration: '30h',
    rating: 5.0,
    students: 189,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    category: 'Développement Web',
    badge: 'Premium',
  },
];

export const TESTIMONIALS: DemoTestimonial[] = [
  {
    id: 1,
    name: 'Fatima Diallo',
    role: 'Développeuse Freelance',
    avatar: 'FD',
    text: "Grâce à RemTech, j'ai décroché mes trois premiers clients en moins de 2 mois. La qualité des cours est incomparable.",
    rating: 5,
    course: 'React & TypeScript',
  },
  {
    id: 2,
    name: 'Kouassi Mensah',
    role: 'Entrepreneur Digital',
    avatar: 'KM',
    text: 'Le cours Growth Marketing a totalement changé ma façon de penser la croissance. ROI immédiat sur mes campagnes.',
    rating: 5,
    course: 'Growth Marketing',
  },
  {
    id: 3,
    name: 'Aminata Traoré',
    role: 'Designer UI/UX',
    avatar: 'AT',
    text: "Contenu dense, structuré, et surtout applicable. J'ai redesigné le site de mon agence dès la fin de la formation.",
    rating: 5,
    course: 'Figma Pro',
  },
];

export const levelColors: Record<DemoCourse['level'], string> = {
  Débutant: '#10B981',
  Intermédiaire: '#F97316',
  Avancé: '#EF4444',
};

export const badgeColors: Record<string, string> = {
  Bestseller: '#F97316',
  Nouveau: '#10B981',
  Premium: '#8B5CF6',
};