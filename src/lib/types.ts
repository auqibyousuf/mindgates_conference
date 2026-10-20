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
    aboutImage?: string;
    editorsImage?: string;
    conferencesImage?: string;
    awardsImage?: string;
    booksImage?: string;
    galleryImage?: string;
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
}

export interface Conference {
  id: string;
  title: string;
  type: string;
  date: string;       // Formatted date string for display (e.g., "11 – 13 Nov, 2025")
  startDate: string;  // ISO date (YYYY-MM-DD)
  endDate: string;    // ISO date (YYYY-MM-DD)
  venue: string;
  status: 'Upcoming' | 'Past' | 'Ongoing';
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
  country?: string;
  bio?: string;
}
