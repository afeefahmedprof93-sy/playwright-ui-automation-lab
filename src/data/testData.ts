// src/data/testData.ts
// ─── Centralised test data ──────────────────────────────────────────────────
// Keep all test fixtures and factory helpers here so they are easy to update.

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  dob: { day: string; month: string; year: string };
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

/** Generates a unique email so tests don't conflict when run in parallel. */
export function generateEmail(prefix = 'testuser'): string {
  const timestamp = Date.now();
  return `${prefix}+${timestamp}@example.com`;
}

export const DEFAULT_PASSWORD = 'Test@12345';

export const DEFAULT_USER: UserData = {
  name: 'John Doe',
  email: generateEmail(),
  password: DEFAULT_PASSWORD,
  title: 'Mr',
  dob: { day: '15', month: '6', year: '1990' },
  firstName: 'John',
  lastName: 'Doe',
  company: 'Test Corp',
  address1: '123 Main Street',
  address2: 'Apt 4B',
  country: 'United States',
  state: 'California',
  city: 'Los Angeles',
  zipcode: '90001',
  mobileNumber: '5551234567',
};

export const DEFAULT_PAYMENT: PaymentData = {
  nameOnCard: 'John Doe',
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2027',
};

export const SEARCH_TERMS = {
  tshirt: 'T-Shirt',
  top: 'top',
  dress: 'dress',
  jean: 'jean',
};

export const CONTACT_FORM = {
  name: 'Jane Tester',
  email: 'jane.tester@example.com',
  subject: 'Test Inquiry',
  message: 'This is an automated test message. Please ignore.',
};
