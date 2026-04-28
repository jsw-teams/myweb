export type ContactLink = {
  type: 'email' | 'github' | 'telegram' | 'other';
  label: string;
  href: string;
  note?: string;
};

export const contactLinks: ContactLink[] = [];
