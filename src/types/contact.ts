// Contact-related types

export interface Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  whatsappNumber?: string;
  company?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  source?: ContactSource;
  notes?: string;
  optedOutSms: boolean;
  optedOutWhatsapp: boolean;
  optedOutEmail: boolean;
  lastContactedAt?: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactSource = 'sms' | 'whatsapp' | 'email' | 'voice' | 'booking' | 'campaign' | 'import' | 'manual';

export interface CreateContactData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  whatsappNumber?: string;
  company?: string;
  tags?: string[];
  source?: ContactSource;
  notes?: string;
}

export interface UpdateContactData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  company?: string;
  tags?: string[];
  notes?: string;
  optedOutSms?: boolean;
  optedOutWhatsapp?: boolean;
  optedOutEmail?: boolean;
}

export interface ContactFilters {
  search?: string;
  tags?: string[];
  source?: ContactSource;
  optedOut?: boolean;
}

export interface ImportContactsData {
  contacts: CreateContactData[];
  source?: ContactSource;
  tags?: string[];
}

export interface ImportContactsResult {
  imported: number;
  skipped: number;
  errors: Array<{ row: number; error: string }>;
}
