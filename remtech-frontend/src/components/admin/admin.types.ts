export interface Stats {
  courses: number;
  users: number;
  orders: number;
  contacts: number;
  revenue: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Module {
  id?: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id?: number;
  title: string;
  type: 'VIDEO' | 'PDF' | 'TEXT';
  file?: File;
  url?: string;
  duration?: string;
  order: number;
}