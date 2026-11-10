export type ServiceCategory = 'doorstep' | 'diagnostics' | 'motor-controller' | 'maintenance' | 'battery' | 'conversions' | string;

export interface SubcategoryItem {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  subcategories: SubcategoryItem[];
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  sizeFormatted?: string;
  sizeBytes?: number;
  type?: string;
  source: 'preset' | 'upload' | 'url';
  width?: number;
  height?: number;
  uploadedAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: ServiceCategory;
  subcategory?: string;
  vehicleModel: string;
  description: string;
  technicalSpecs: {
    voltage: string;
    capacity: string;
    motor?: string;
    rangeGain?: string;
    bms?: string;
  };
  status: 'Completed' | 'In Progress' | 'Coming Soon' | 'R&D Benchmark';
  isComingSoon?: boolean;
  metrics: {
    label: string;
    value: string;
  };
  image: string;
  images?: string[];
  videoUrl?: string;
  videoPlatform?: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'direct' | 'unknown' | 'other';
  completedDate: string;
  clientFeedback?: string;
  highlights: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'battery-tech' | 'diagnostics' | 'maintenance' | 'retrofitting' | string;
  subcategory?: string;
  excerpt: string;
  content: string[];
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  image?: string;
  images?: string[];
  videoUrl?: string;
  videoPlatform?: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'direct' | 'unknown' | 'other';
  featured?: boolean;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleModel: string;
  serviceType: string;
  subcategory?: string;
  image?: string;
  images?: string[];
  message: string;
  preferredDate: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Scheduled' | 'Resolved';
}

export type ActiveTab = 'home' | 'calculator' | 'portfolio' | 'blog' | 'about' | 'faq' | 'contact' | 'admin' | 'privacy';

export type ThemeMode = 'dark' | 'light' | 'system';
