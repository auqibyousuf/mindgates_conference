export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  hero: {
    badge: string;
    titleLine1: string;
    titleItalic: string;
    titleLine2: string;
    description: string;
    image: string;
    primaryButton: { label: string; link: string };
    secondaryButton: { label: string; link: string };
  };
  directorMessage: string;
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  socials: {
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  notifications: string[];
}

export interface Conference {
  id: string;
  title: string;
  type: string;
  date: string;
  venue: string;
  status: 'Upcoming' | 'Past';
  brochureUrl?: string;
  proceedingsUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  image?: string;
}

export interface Award {
  id: string;
  authorName: string;
  title: string;
  eventName: string;
  eventDate: string;
  awardName: string;
  eventVenue?: string;
}

export interface Editor {
  id: string;
  name: string;
  role: string;
  institution: string;
  image: string;
  category: string;
  email: string;
  contact: string;
}
