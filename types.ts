
export type Language = 'english' | 'tamil' | 'sinhala';

export interface Quote {
  id: string;
  quote: string;
  language: Language;
  author?: string;
}

export type ThemeType = 'cute' | 'romantic' | 'funny' | 'minimal';

export interface Proposal {
  id: string;
  crushName?: string;
  message: string;
  theme: ThemeType;
  revealOption: 'after_yes' | 'never' | 'countdown';
  senderName?: string;
  countdownDate?: string;
  response?: 'yes' | 'no' | 'maybe';
  createdAt: number;
}

export interface FoodOption {
  name: string;
  image: string;
  category: string;
}

export interface DessertOption {
  name: string;
  image: string;
  description?: string;
}

export interface VenueRecommendation {
  name: string;
  address: string;
  rating: number;
  url: string;
}

export interface DatePlanData {
  id: string;
  creatorName?: string;
  creatorMessage?: string;
  date: string;
  time: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  postalCode?: string;
  country: string;
  latitude: number;
  longitude: number;
  venues: VenueRecommendation[];
  recipientPhone?: string;
  response?: 'yes' | 'no' | 'maybe';
  responseReceivedAt?: number;
  createdAt: number;
}

export interface ShareLink {
  unique_id: string;
  plan_data: DatePlanData;
  created_at: number;
}

// ============================================
// SHARE LINK GENERATOR SYSTEM TYPES
// ============================================

export interface ShareFormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  message: string;
  password?: string; // Optional password protection
}

export interface ShareLinkResponse {
  id: string;
  url: string;
  expiresAt: number;
  createdAt: number;
}

export interface ShareLinkData {
  id: string;
  data: ShareFormData;
  passwordHash?: string; // bcrypt hashed password
  expiresAt: number;
  createdAt: number;
  accessCount: number;
  lastAccessedAt?: number;
}

export interface ShareVerifyRequest {
  id: string;
  password?: string;
}

export interface ShareVerifyResponse {
  valid: boolean;
  data?: ShareFormData;
  error?: string;
}
