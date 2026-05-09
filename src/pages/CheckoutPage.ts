// src/pages/CheckoutPage.ts
import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { PaymentData } from '../data/testData';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────────
  // Checkout step
  get deliveryAddressSection(): Locator {
    return this.page.locator('#address_delivery');
  }

  get billingAddressSection(): Locator {
    return this.page.locator('#address_invoice');
  }

  get orderCommentTextarea(): Locator {
    return this.page.locator('textarea[name="message"]');
  }

  get placeOrderBtn(): Locator {
    return this.page.locator('a.btn.btn-default.check_out', { hasText: 'Place Order' });
  }

  get loginRegisterLink(): Locator {
    return this.page.locator('a[href="/login"]', { hasText: 'Register / Login' });
  }

  // Payment step
  get nameOnCardInput(): Locator {
    return this.page.locator('[data-qa="name-on-card"]');
  }

  get cardNumberInput(): Locator {
    return this.page.locator('[data-qa="card-number"]');
  }

  get cvcInput(): Locator {
    return this.page.locator('[data-qa="cvc"]');
  }

  get expiryMonthInput(): Locator {
    return this.page.locator('[data-qa="expiry-month"]');
  }

  get expiryYearInput(): Locator {
    return this.page.locator('[data-qa="expiry-year"]');
  }

  get payAndConfirmBtn(): Locator {
    return this.page.locator('[data-qa="pay-button"]');
  }

  get orderSuccessMsg(): Locator {
    return this.page.locator('p', { hasText: 'Congratulations! Your order has been confirmed!' });
  }

  get orderSuccessAlert(): Locator {
    return this.page.locator('.alert-success');
  }

  get downloadInvoiceBtn(): Locator {
    return this.page.locator('a.btn', { hasText: 'Download Invoice' });
  }

  get continueBtn(): Locator {
    return this.page.locator('[data-qa="continue-button"]');
  }

  // ── Address detail helpers ────────────────────────────────────────────────────
  getDeliveryName(): Locator {
    return this.deliveryAddressSection.locator('.address_firstname.address_lastname');
  }

  getDeliveryAddress(): Locator {
    return this.deliveryAddressSection.locator('.address_address1.address_address2').first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────────
  async assertCheckoutPage(): Promise<void> {
    await this.assertUrl('/checkout');
    await expect(this.deliveryAddressSection).toBeVisible();
  }

  async addComment(comment: string): Promise<void> {
    await this.orderCommentTextarea.fill(comment);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderBtn.click();
  }

  async fillPaymentDetails(payment: PaymentData): Promise<void> {
    await this.nameOnCardInput.fill(payment.nameOnCard);
    await this.cardNumberInput.fill(payment.cardNumber);
    await this.cvcInput.fill(payment.cvc);
    await this.expiryMonthInput.fill(payment.expiryMonth);
    await this.expiryYearInput.fill(payment.expiryYear);
  }

  async confirmPayment(): Promise<void> {
    await this.payAndConfirmBtn.click();
  }

  async assertOrderPlaced(): Promise<void> {
    await expect(
      this.orderSuccessMsg
    ).toBeVisible({ timeout: 15_000 });
  }

  async downloadInvoice(): Promise<void> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadInvoiceBtn.click(),
    ]);
    // Verify the download started (filename is not empty)
    expect(download.suggestedFilename()).toBeTruthy();
  }

  async clickContinue(): Promise<void> {
    await this.continueBtn.click();
  }

  async goToLoginFromCheckout(): Promise<void> {
    await this.loginRegisterLink.click();
  }
}
