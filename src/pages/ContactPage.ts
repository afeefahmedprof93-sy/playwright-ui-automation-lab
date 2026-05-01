// src/pages/ContactPage.ts
import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────────
  get getInTouchHeading(): Locator {
    return this.page.locator('h2', { hasText: 'Get In Touch' });
  }

  get nameInput(): Locator {
    return this.page.locator('[data-qa="name"]');
  }

  get emailInput(): Locator {
    return this.page.locator('[data-qa="email"]');
  }

  get subjectInput(): Locator {
    return this.page.locator('[data-qa="subject"]');
  }

  get messageTextarea(): Locator {
    return this.page.locator('[data-qa="message"]');
  }

  get fileUploadInput(): Locator {
    return this.page.locator('input[name="upload_file"]');
  }

  get submitBtn(): Locator {
    return this.page.locator('[data-qa="submit-button"]');
  }

  get successMsg(): Locator {
    return this.page.locator('.status.alert-success');
  }

  get homeBtn(): Locator {
    return this.page.locator('a[href="/"]', { hasText: 'Home' });
  }

  // ── Actions ───────────────────────────────────────────────────────────────────
  async open(): Promise<void> {
    await this.goto('/contact_us');
  }

  async assertGetInTouchVisible(): Promise<void> {
    await expect(this.getInTouchHeading).toBeVisible();
  }

  async fillContactForm(
    name: string,
    email: string,
    subject: string,
    message: string,
    filePath?: string,
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageTextarea.fill(message);

    if (filePath) {
      await this.fileUploadInput.setInputFiles(filePath);
    }
  }

  async submitForm(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.submitBtn.click();
  }

  async assertSubmissionSuccess(): Promise<void> {
    await expect(this.successMsg).toContainText(
      'Success! Your details have been submitted successfully.',
    );
  }

  async returnHome(): Promise<void> {
    await this.homeBtn.click();
    await this.assertUrl('/');
  }
}
