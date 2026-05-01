// src/pages/CartPage.ts
import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────────
  get cartTable(): Locator {
    return this.page.locator('#cart_info_table');
  }

  get cartItems(): Locator {
    return this.page.locator('tbody tr');
  }

  get proceedToCheckoutBtn(): Locator {
    return this.page.locator('.btn.btn-default.check_out');
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

  getDeleteBtn(productId: string): Locator {
    return this.page.locator(`a.cart_quantity_delete[data-product-id="${productId}"]`);
  }

  getProductRow(productName: string): Locator {
    return this.page.locator('tr', { has: this.page.locator('h4 a', { hasText: productName }) });
  }

  getProductQuantity(rowLocator: Locator): Locator {
    return rowLocator.locator('.cart_quantity button');
  }

  // ── Modal after add-to-cart ───────────────────────────────────────────────────
  get modalContinueShoppingBtn(): Locator {
    return this.page.locator('.modal-footer button', { hasText: 'Continue Shopping' });
  }

  get modalViewCartLink(): Locator {
    return this.page.locator('u', { hasText: 'View Cart' });
  }

  // ── Actions ───────────────────────────────────────────────────────────────────
  async open(): Promise<void> {
    await this.goto('/view_cart');
  }

  async assertCartHasItems(): Promise<void> {
    await expect(this.cartTable).toBeVisible();
    await expect(this.cartItems.first()).toBeVisible();
  }

  async continueShopping(): Promise<void> {
    await this.modalContinueShoppingBtn.click();
  }

  async viewCart(): Promise<void> {
    await this.modalViewCartLink.click();
  }

  async removeProduct(productId: string): Promise<void> {
    await this.getDeleteBtn(productId).click();
  }

  async assertProductRemoved(productId: string): Promise<void> {
    await expect(this.getDeleteBtn(productId)).not.toBeVisible();
  }

  async assertProductQuantity(productName: string, expectedQty: string): Promise<void> {
    const row = this.getProductRow(productName);
    const qty = this.getProductQuantity(row);
    await expect(qty).toContainText(expectedQty);
  }

  async subscribeInCart(email: string): Promise<void> {
    await this.page.locator('#footer').scrollIntoViewIfNeeded();
    await expect(this.subscriptionHeading).toBeVisible();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitBtn.click();
    await expect(this.subscriptionSuccessAlert).toContainText(
      'You have been successfully subscribed!',
    );
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutBtn.click();
  }
}
