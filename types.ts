
export type Language = 'bn' | 'en';
export type UserRole = 'ADMIN' | 'ENTREPRENEUR' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  userRole?: UserRole;
}

export type DashboardSection = 'cattle' | 'production' | 'orders' | 'settings';

export interface GalleryItem {
  id: number;
  title: { bn: string; en: string };
  url: string;
}

export interface ProductionItem {
  id: string;
  date: string;
  yield: string;
  status: { bn: string; en: string };
}
