export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'STUDENT' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { courses: number };
}

export interface CourseMedia {
  id: number;
  url: string;
  publicId: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF';
  isPrimary: boolean;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  duration: string;
  objectives: string[];
  prerequisites: string[];
  program: { title: string; lessons: string[] }[];
  status: 'BROUILLON' | 'PUBLIE' | 'ARCHIVE';
  metaTitle?: string;
  metaDescription?: string;
  categoryId: number;
  category?: Category;
  media?: CourseMedia[];
  createdAt: string;
  updatedAt: string;
  _count?: { enrollments: number; reviews: number };
}

export interface Order {
  id: number;
  userId: number;
  courseId: number;
  amount: number;
  status: 'EN_ATTENTE' | 'PAYE' | 'ECHOUE' | 'REMBOURSE';
  paymentRef?: string;
  chariowRef?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
  course?: Course;
  payment?: Payment;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  currency: string;
  provider: string;
  reference: string;
  paidAt: string;
}

export interface Review {
  id: number;
  userId: number;
  courseId: number;
  rating: number;
  comment: string;
  isVisible: boolean;
  reply?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; avatar?: string };
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  reply?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}