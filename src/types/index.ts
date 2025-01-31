export interface Recipient {
  name: string;
  email: string;
  company: string;
}

export interface EmailState {
  recipients: Recipient[];
  subject: string;
  content: string;
  loading: boolean;
  preview: Recipient | null;
}