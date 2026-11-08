import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  category: string;
  description: string;
  tools_used: string[];
  image_url: string | null;
  project_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  twitter: string | null;
  linkedin: string | null;
  github: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  company: string | null;
  quote: string;
  rating: number;
  avatar_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  brand_name: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
  about_mission: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  twitter_url: string;
  linkedin_url: string;
  github_url: string;
  instagram_url: string;
  stat_projects: number;
  stat_clients: number;
  stat_team: number;
  stat_years: number;
  logo_url: string;
  logo_icon: string;
  color_primary: string;
  color_accent: string;
  color_bg: string;
  font_heading: string;
  font_body: string;
  created_at: string;
  updated_at: string;
};

export type MediaFile = {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  alt_text: string;
  category: string;
  created_at: string;
};

export type PageContent = {
  id: string;
  page_key: string;
  hero_image_url: string;
  hero_title: string;
  hero_subtitle: string;
  body_content: Record<string, unknown>;
  section_services_image: string;
  section_about_image: string;
  section_contact_image: string;
  section_hero_image: string;
  created_at: string;
  updated_at: string;
};

export type HeroCarouselImage = {
  url: string;
  alt: string;
};

export type Integration = {
  id: string;
  name: string;
  type: string;
  provider: string;
  endpoint_url: string;
  api_key_ref: string;
  webhook_url: string;
  config: Record<string, string>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type Plugin = {
  id: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  author: string;
  config: Record<string, string>;
  enabled: boolean;
  installed_at: string;
  updated_at: string;
};
