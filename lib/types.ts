export interface QuoteItem {
    id: string;
    name: string;
    spec: string;
    quantity: number;
    unitPrice: number;
}

export type QuoteStatus = "draft" | "issued";

export interface Quote {
    id: string;
    quoteNumber: string; // e.g. QUO-2026-000001
    status: QuoteStatus;
    createdAt: string;
    updatedAt: string;

    // Customer Info
    customerName: string;
    honorific: string;

    // Dates
    issueDate: string;
    expiryDate: string;

    // Financials
    items: QuoteItem[];
    taxRate: number;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;

    // Other
    remarks?: string;
}
