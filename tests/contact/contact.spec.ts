// tests/contact/contact.spec.ts
// TC6 – Contact Us Form
// TC7 – Verify Test Cases Page

import { test, expect } from '../../src/utils/fixtures';
import { CONTACT_FORM } from '../../src/data/testData';
import path from 'path';

test.describe('TC6 – Contact Us Form', () => {
  test('should submit contact form successfully and return home', async ({
    homePage,
    contactPage,
  }) => {
    await homePage.open();
    await homePage.assertHomePageVisible();

    await homePage.navContactUs.click();
    await contactPage.assertGetInTouchVisible();

    await contactPage.fillContactForm(
      CONTACT_FORM.name,
      CONTACT_FORM.email,
      CONTACT_FORM.subject,
      CONTACT_FORM.message,
      // Use a small fixture file bundled in the project
      //path.join(__dirname, '..', 'fixtures', 'sample-upload.txt'),
    );

    await contactPage.submitForm();
    await contactPage.assertSubmissionSuccess();

    await contactPage.returnHome();
    await homePage.assertHomePageVisible();
  });
});

test.describe('TC7 – Verify Test Cases Page', () => {
  test('should navigate to the Test Cases page', async ({ page, homePage }) => {
    await homePage.open();
    await homePage.assertHomePageVisible();

    await homePage.navTestCases.click();
    await expect(page).toHaveURL(/\/test_cases/);
    // The page has a heading with the test case list
    await expect(page.locator('h2.title b', { hasText: 'Test Cases' })).toBeVisible();
  });
});
