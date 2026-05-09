// tests/auth/auth.spec.ts
// TC1  – Register User
// TC2  – Login User with correct email and password
// TC3  – Login User with incorrect email and password
// TC4  – Logout User
// TC5  – Register User with existing email

import { test, expect } from '../../src/utils/fixtures';
import { DEFAULT_USER, DEFAULT_PASSWORD, generateEmail } from '../../src/data/testData';

// Each test gets its own unique email to allow parallel execution
const makeUser = () => ({ ...DEFAULT_USER, email: generateEmail() });

test.describe('TC1 – Register User', () => {
  test('should register a new user and delete the account', async ({
    page,
    homePage,
    authPage,
  }) => {
    const user = makeUser();

    await homePage.open();
    await homePage.assertHomePageVisible();

    await homePage.navSignupLogin.click();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();

    await authPage.assertLoggedIn(user.name);

    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});

test.describe('TC2 – Login with correct credentials', () => {
  test('should login and verify username in nav', async ({ page, homePage, authPage }) => {
    // Use the pre-seeded account defined in testData (or create one first via API in CI)
    const user = makeUser();

    // First register so we have a valid account
    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();
    await homePage.navLogout.click();

    // Now log in
    await authPage.login(user.email, user.password);
    await authPage.assertLoggedIn(user.name);

    // Cleanup
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});

test.describe('TC3 – Login with incorrect credentials', () => {
  test('should display an error for wrong email/password', async ({ authPage }) => {
    await authPage.open();
    await authPage.login('invalid@email.com', 'wrongpassword');
    await expect(authPage.loginErrorMsg).toBeVisible();
  });
});

test.describe('TC4 – Logout User', () => {
  test('should log out and redirect to login page', async ({ homePage, authPage }) => {
    const user = makeUser();

    // Register → logged in
    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();

    // Logout
    await homePage.navLogout.click();
    await expect(authPage.loginHeading).toBeVisible();
    await authPage.assertUrl('/login');

    // Cleanup: login and delete
    await authPage.login(user.email, user.password);
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});

test.describe('TC5 – Register with existing email', () => {
  test('should show error when email is already registered', async ({ homePage, authPage }) => {
    const user = makeUser();

    // Register once
    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();
    await homePage.navLogout.click();

    // Try to register again with the same email
    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await expect(authPage.signupExistingEmailError).toBeVisible();

    // Cleanup
    await authPage.login(user.email, user.password);
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});
