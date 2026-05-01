// src/utils/fixtures.ts
// ─── Custom test fixtures ───────────────────────────────────────────────────
// Import `test` and `expect` from here instead of '@playwright/test' so
// every spec automatically has all page objects available.

import { test as base, expect } from '@playwright/test';
import {
  HomePage,
  AuthPage,
  ProductsPage,
  CartPage,
  CheckoutPage,
  ContactPage,
} from '../pages';

type Pages = {
  homePage: HomePage;
  authPage: AuthPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  contactPage: ContactPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});

export { expect };
