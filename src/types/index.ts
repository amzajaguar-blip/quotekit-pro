export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

export interface QuoteItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteInput {
  clientId: string;
  quoteNo: string;
  title?: string;
  status: QuoteStatus;
  issueDate: string;
  validUntil?: string;
  notes?: string;
  terms?: string;
  taxRate: number;
  discount: number;
  currency: Currency;
  items: QuoteItemInput[];
}

export interface ClientInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}
