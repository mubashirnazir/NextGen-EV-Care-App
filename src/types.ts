export type ServiceCategory = 'doorstep' | 'diagnostics' | 'motor-controller' | 'maintenance' | 'battery' | 'conversions';

export interface PortfolioItem {
  id: string;
  title: string;
  category: ServiceCategory;
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
  completedDate: string;
  clientFeedback?: string;
  highlights: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'battery-tech' | 'diagnostics' | 'maintenance' | 'retrofitting';
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
  featured?: boolean;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleModel: string;
  serviceType: string;
  message: string;
  preferredDate: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Scheduled' | 'Resolved';
}

export type ActiveTab = 'home' | 'calculator' | 'portfolio' | 'blog' | 'about' | 'faq' | 'contact' | 'admin' | 'privacy';

export type ThemeMode = 'dark' | 'light';
