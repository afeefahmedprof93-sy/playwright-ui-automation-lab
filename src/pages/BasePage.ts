// src/pages/BasePage.ts
// ─── Base Page Object ───────────────────────────────────────────────────────

import { type Page, type Locator, expect } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.dismissAdIfPresent();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Advert handling ─────────────────────────────────────────────────────────
  // automationexercise.com injects Google Ad iframes that overlay buttons.
  // Tries every known pattern and silently continues if no ad is found.
  async dismissAdIfPresent(): Promise<void> {
    // Give the ad a moment to inject
    await this.page.waitForTimeout(1500);

    // Pattern 1: full-page overlay div — remove from DOM entirely
    try {
      const overlay = this.page.locator('div[id^="google_ads"]').first();
      if (await overlay.isVisible({ timeout: 1000 })) {
        await overlay.evaluate((el: Element) => el.remove());
      }
    } catch { /* not present */ }

    // Pattern 2: close button inside aswift iframe (floating video/banner ad)
    try {
      const frame = this.page.frameLocator('iframe[id^="aswift"]').first();
      const closeBtn = frame.locator(
        '[id="dismiss-button"], [title="Close ad"], [aria-label="Close ad"]'
      );
      if (await closeBtn.isVisible({ timeout: 1500 })) {
        await closeBtn.click({ timeout: 1500 });
      }
    } catch { /* not present */ }

    // Pattern 3: top-level close button rendered outside any iframe
    try {
      const closeBtn = this.page
        .locator('[class*="adsbygoogle"], [id*="ad-close"], [class*="ad-close"]')
        .first();
      if (await closeBtn.isVisible({ timeout: 1000 })) {
        await closeBtn.click({ timeout: 1000 });
      }
    } catch { /* not present */ }
  }

  // Safe click: dismisses ad overlays before clicking the real target
  async safeClick(locator: Locator): Promise<void> {
    await this.dismissAdIfPresent();
    await locator.waitFor({ state: 'visible' });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  // ── Shared nav bar locators ──────────────────────────────────────────────────
  get navHome(): Locator {
    return this.page.locator('a[href="/"]').first();
  }

  get navProducts(): Locator {
    return this.page.locator('a[href="/products"]');
  }

  get navCart(): Locator {
    return this.page.locator('a[href="/view_cart"]');
  }

  get navSignupLogin(): Locator {
    return this.page.locator('a[href="/login"]');
  }

  get navLoggedInAs(): Locator {
    return this.page.locator('li a b');
  }

  get navDeleteAccount(): Locator {
    return this.page.locator('a[href="/delete_account"]');
  }

  get navLogout(): Locator {
    return this.page.locator('a[href="/logout"]');
  }

  get navContactUs(): Locator {
    return this.page.locator('a[href="/contact_us"]');
  }

  get navTestCases(): Locator {
    return this.page.locator('a[href="/test_cases"]');
  }

  // ── Assertion helpers ────────────────────────────────────────────────────────
  async assertLoggedIn(username: string): Promise<void> {
    await expect(this.navLoggedInAs).toContainText(username);
  }

  async assertUrl(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }
}