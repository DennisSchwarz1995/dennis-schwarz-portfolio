export type SupportedLang = 'de' | 'en';

export interface ProjectItem {
  id: number;
  indexLabel: string;
  title: string;
  descriptionKey: string;
  technologies: string[];
  previewImage: string;
  githubUrl: string;
  liveUrl: string;
  subdomainLabel: string;
}

export interface SkillItem {
  name: string;
  icon: string;
  category: 'core' | 'exploring';
}

export interface TestimonialItem {
  id: number;
  quoteKey: string;
  author: string;
  roleKey: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  privacyAccepted: boolean;
  website?: string;
}

