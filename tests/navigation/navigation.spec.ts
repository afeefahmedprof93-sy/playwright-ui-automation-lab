// tests/navigation/navigation.spec.ts
// TC25 – Verify Scroll Up using 'Arrow' button and Scroll Down functionality
// TC26 – Verify Scroll Up without 'Arrow' button and Scroll Down functionality

import { test, expect } from '../../src/utils/fixtures';

test.describe('TC25 – Scroll Up with Arrow button', () => {
  test('should scroll down to footer and scroll back up via arrow button', async ({
    page,
    homePage,
  }) => {
    await homePage.open();
    await homePage.assertHomePageVisible();

    // Scroll down to footer
    await homePage.scrollToFooter();
    const subscriptionHeading = page.locator('h2', { hasText: 'Subscription' });
    await expect(subscriptionHeading).toBeVisible();

    // Click the scroll-up arrow
    await expect(homePage.scrollUpArrow).toBeVisible();
    await homePage.scrollUpViaArrow();

    // Hero text should be visible again at top
    await homePage.assertScrolledToTop();
  });
});

test.describe('TC26 – Scroll Up without Arrow button', () => {
  test('should scroll down to footer and scroll back up via page scroll', async ({
    page,
    homePage,
  }) => {
    await homePage.open();
    await homePage.assertHomePageVisible();

    // Scroll down to footer
    await homePage.scrollToFooter();
    const subscriptionHeading = page.locator('h2', { hasText: 'Subscription' });
    await expect(subscriptionHeading).toBeVisible();

    // Scroll up using keyboard / JS (no arrow button)
    await homePage.scrollUpViaKeyboard();

    // Give the page time to scroll
    await page.waitForTimeout(600);

    // Hero text should be visible again
    await homePage.assertScrolledToTop();
  });
});
