
export type PageView = 'home' | 'about' | 'services' | 'work' | 'contact' | 'booking';

export interface ServiceItem {
  id: string;
  title: string;
  isActive: boolean;
}

export interface ReelItem {
  id: string;
  title: string;
  tags: string[];
  description?: string;
  image: string;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}