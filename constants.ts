
import { GalleryItem, ProductionItem, UserRole } from './types';

export const COLORS = {
  primary: '#2563eb', // Blue-600
  secondary: '#0f172a', // Slate-900
  background: '#f8fafc', // Slate-50
  card: '#ffffff'
};

export const MOCK_USERS = [
  { id: '1', name: 'Rafi Nahiyan', email: 'admin@ecodairy.farm', role: 'ADMIN' as UserRole, status: 'Active' },
  { id: '2', name: 'Md. Muktarul Huq', email: 'muktarul@gmail.com', role: 'ENTREPRENEUR' as UserRole, status: 'Active' },
  { id: '3', name: 'Rahim Ahmed', email: 'rahim@example.com', role: 'CUSTOMER' as UserRole, status: 'Active' },
  { id: '4', name: 'Karim Ullah', email: 'karim@business.com', role: 'ENTREPRENEUR' as UserRole, status: 'Inactive' },
];

export const TRANSLATIONS: Record<string, any> = {
  bn: {
    nav: { 
      home: 'হোম', 
      about: 'আমাদের সম্পর্কে', 
      gallery: 'গ্যালারি', 
      contact: 'যোগাযোগ', 
      dashboard: 'ড্যাশবোর্ড', 
      logout: 'লগআউট', 
      login: 'লগইন',
      roles: {
        admin: 'এডমিন',
        entrepreneur: 'উদ্যোক্তা',
        customer: 'গ্রাহক'
      }
    },
    hero: {
      badge: '১০০% বিশুদ্ধ ও প্রাকৃতিক',
      title: 'Directly Pure Milk সরাসরি আপনার টেবিলে।',
      subtitle: 'আমরা সাভারের নিজস্ব খামারে উৎপাদিত বিষমুক্ত ও স্বাস্থ্যকর দুধ সরাসরি গ্রাহকদের কাছে পৌঁছে দিই।',
      cta_primary: 'শুরু করুন',
      cta_secondary: 'গ্যালারি দেখুন',
      stat_title: 'সন্তুষ্ট গ্রাহক',
      stat_value: '৫০০+'
    },
    features: {
      title: 'কেন আমাদের বেছে নেবেন?',
      subtitle: 'আমরা মানের ব্যাপারে কোনো আপোষ করি না।',
      items: [
        { title: 'প্রাকৃতিক ঘাস', desc: 'আমাদের গাভীরা শুধুমাত্র প্রাকৃতিক সবুজ ঘাস ও পুষ্টিকর খাবার খায়।' },
        { title: 'স্বাস্থ্য পরীক্ষা', desc: 'প্রতিদিন গাভীদের স্বাস্থ্য পরীক্ষা ও দুধের মান যাচাই করা হয়।' },
        { title: 'দ্রুত ডেলিভারি', desc: 'অর্ডারের অল্প সময়ের মধ্যেই আমরা তাজা দুধ পৌঁছে দিই।' }
      ]
    },
    dashboard: {
      sidebar: {
        cattle: 'গবাদি পশু',
        production: 'উৎপাদন',
        orders: 'অর্ডার',
        settings: 'সেটিংস'
      },
      welcome: 'স্বাগতম',
      subtitle: 'আপনার খামারের হালনাগাদ তথ্য এখানে দেখুন।',
      ai_title: 'AI বিশেষজ্ঞের পরামর্শ',
      ai_loading: 'পরামর্শ লোড হচ্ছে...',
      cattle_stats: {
        healthy: 'সুস্থ',
        pregnant: 'গর্ভবতী',
        medical: 'চিকিৎসাধীন',
        add: 'নতুন পশু যুক্ত করুন'
      },
      prod_table: {
        date: 'তারিখ',
        yield: 'পরিমাণ',
        status: 'অবস্থা',
        action: 'অ্যাকশন',
        details: 'বিস্তারিত'
      },
      orders: {
        empty: 'কোনো অর্ডার নেই',
        subtitle: 'নতুন অর্ডার আসলে এখানে দেখা যাবে।',
        summary: 'অর্ডার সারসংক্ষেপ',
        today: 'আজকের চাহিদা',
        monthly: 'মাসিক আয়'
      }
    }
  },
  en: {
    nav: { 
      home: 'Home', 
      about: 'About', 
      gallery: 'Gallery', 
      contact: 'Contact', 
      dashboard: 'Dashboard', 
      logout: 'Logout', 
      login: 'Login',
      roles: {
        admin: 'Admin',
        entrepreneur: 'Entrepreneur',
        customer: 'Customer'
      }
    },
    hero: {
      badge: '100% Pure & Natural',
      title: 'Directly Pure Milk to your table.',
      subtitle: 'We deliver toxin-free and healthy milk produced in our own farm in Savar directly to customers.',
      cta_primary: 'Get Started',
      cta_secondary: 'View Gallery',
      stat_title: 'Happy Customers',
      stat_value: '500+'
    },
    features: {
      title: 'Why Choose Us?',
      subtitle: 'We never compromise on quality.',
      items: [
        { title: 'Natural Grass', desc: 'Our cows eat only natural green grass and nutritious food.' },
        { title: 'Health Check', desc: 'Cows are checked daily for health and milk quality is verified.' },
        { title: 'Fast Delivery', desc: 'We deliver fresh milk shortly after the order is placed.' }
      ]
    },
    dashboard: {
      sidebar: {
        cattle: 'Cattle',
        production: 'Production',
        orders: 'Orders',
        settings: 'Settings'
      },
      welcome: 'Welcome',
      subtitle: 'Check your farm updates here.',
      ai_title: 'AI Expert Tip',
      ai_loading: 'Loading tips...',
      cattle_stats: {
        healthy: 'Healthy',
        pregnant: 'Pregnant',
        medical: 'Medical',
        add: 'Add New Cattle'
      },
      prod_table: {
        date: 'Date',
        yield: 'Yield',
        status: 'Status',
        action: 'Action',
        details: 'Details'
      },
      orders: {
        empty: 'No orders yet',
        subtitle: 'New orders will appear here.',
        summary: 'Order Summary',
        today: 'Today\'s Demand',
        monthly: 'Monthly Income'
      }
    }
  }
};

export const PUBLIC_GALLERY: GalleryItem[] = [
  { id: 1, title: { bn: 'সুস্থ গাভী ও সবুজ ঘাস', en: 'Healthy Cows & Green Grass' }, url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=800&h=600&fit=crop' },
  { id: 2, title: { bn: 'তাজা দুধের সংগ্রহ', en: 'Fresh Milk Collection' }, url: 'https://images.unsplash.com/photo-1550583724-1255818c0533?q=80&w=800&h=600&fit=crop' },
  { id: 3, title: { bn: 'আধুনিক মিল্কিং সিস্টেম', en: 'Modern Milking System' }, url: 'https://images.unsplash.com/photo-1527334919514-3c979b370431?q=80&w=800&h=600&fit=crop' },
  { id: 4, title: { bn: 'খামারের প্রাকৃতিক পরিবেশ', en: 'Farm Environment' }, url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&h=600&fit=crop' },
];

export const PRIVATE_GALLERY: GalleryItem[] = [
  { id: 101, title: { bn: 'ব্যাচ ৪২৪: স্বাস্থ্য পরীক্ষা', en: 'Batch 424: Health Check' }, url: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=800&h=600&fit=crop' },
];

export const PRODUCTION_LOGS: ProductionItem[] = [
  { id: 'p1', date: '2023-10-20', yield: '450 L', status: { bn: 'সম্পন্ন', en: 'Completed' } },
  { id: 'p2', date: '2023-10-21', yield: '475 L', status: { bn: 'সম্পন্ন', en: 'Completed' } },
  { id: 'p3', date: '2023-10-22', yield: '460 L', status: { bn: 'চলমান', en: 'In Progress' } },
];
