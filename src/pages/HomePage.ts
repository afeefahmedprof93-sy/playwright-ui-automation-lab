// src/pages/HomePage.ts
import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────────
  get logo(): Locator {
    return this.page.locator('#header .logo img');
  }

  get subscriptionSection(): Locator {
    return this.page.locator('#footer');
  }

  get subscriptionHeading(): Locator {
    return this.page.locator('h2', { hasText: 'Subscription' });
  }

  get subscriptionEmailInput(): Locator {
    return this.page.locator('#susbscribe_email');
  }

  get subscriptionSubmitBtn(): Locator {
    return this.page.locator('#subscribe');
  }

  get subscriptionSuccessAlert(): Locator {
    return this.page.locator('#success-subscribe .alert-success');
  }

  get scrollUpArrow(): Locator {
    return this.page.locator('#scrollUp');
  }

  get heroText(): Locator {
    return this.page.locator('.item.active h2');
  }

  get recommendedItemsSection(): Locator {
    return this.page.locator('.recommended_items');
  }

  get recommendedProducts(): Locator {
    return this.page.locator('.recommended_items .product-image-wrapper');
  }

  get recommendedAddToCartBtns(): Locator {
    return this.page.locator('.recommended_items a[data-product-id]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────────
  async open(): Promise<void> {
    await this.goto('/');
  }

  async assertHomePageVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
    await expect(this.logo).toBeVisible();
  }

  async scrollToFooter(): Promise<void> {
    await this.subscriptionSection.scrollIntoViewIfNeeded();
  }

  async subscribeWithEmail(email: string): Promise<void> {
    await this.scrollToFooter();
    await expect(this.subscriptionHeading).toBeVisible();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitBtn.click();
    await expect(this.subscriptionSuccessAlert).toContainText(
      'You have been successfully subscribed!',
    );
  }

  async scrollUpViaArrow(): Promise<void> {
    await this.scrollUpArrow.click();
  }

  async scrollUpViaKeyboard(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  async assertScrolledToTop(): Promise<void> {
    await expect(this.heroText).toContainText('Full-Fledged practice website for Automation Engineers');
  }

  async addRecommendedProductToCart(index = 0): Promise<void> {
    const buttons = this.recommendedAddToCartBtns;
    await buttons.nth(index).click();
  }
}
