// src/pages/AuthPage.ts
import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { UserData } from '../data/testData';

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Login section ─────────────────────────────────────────────────────────────
  get loginHeading(): Locator {
    return this.page.locator('h2', { hasText: 'Login to your account' });
  }

  get loginEmailInput(): Locator {
    return this.page.locator('[data-qa="login-email"]');
  }

  get loginPasswordInput(): Locator {
    return this.page.locator('[data-qa="login-password"]');
  }

  get loginBtn(): Locator {
    return this.page.locator('[data-qa="login-button"]');
  }

  get loginErrorMsg(): Locator {
    return this.page.locator('p', { hasText: 'Your email or password is incorrect!' });
  }

  // ── Signup section ────────────────────────────────────────────────────────────
  get signupHeading(): Locator {
    return this.page.locator('h2', { hasText: 'New User Signup!' });
  }

  get signupNameInput(): Locator {
    return this.page.locator('[data-qa="signup-name"]');
  }

  get signupEmailInput(): Locator {
    return this.page.locator('[data-qa="signup-email"]');
  }

  get signupBtn(): Locator {
    return this.page.locator('[data-qa="signup-button"]');
  }

  get signupExistingEmailError(): Locator {
    return this.page.locator('p', { hasText: 'Email Address already exist!' });
  }

  // ── Account info (step 2 of signup) ─────────────────────────────────────────
  get accountInfoHeading(): Locator {
    return this.page.locator('h2.title b', { hasText: 'Enter Account Information' });
  }

  get titleMrRadio(): Locator {
    return this.page.locator('#id_gender1');
  }

  get titleMrsRadio(): Locator {
    return this.page.locator('#id_gender2');
  }

  get passwordInput(): Locator {
    return this.page.locator('[data-qa="password"]');
  }

  get dobDaySelect(): Locator {
    return this.page.locator('[data-qa="days"]');
  }

  get dobMonthSelect(): Locator {
    return this.page.locator('[data-qa="months"]');
  }

  get dobYearSelect(): Locator {
    return this.page.locator('[data-qa="years"]');
  }

  get firstNameInput(): Locator {
    return this.page.locator('[data-qa="first_name"]');
  }

  get lastNameInput(): Locator {
    return this.page.locator('[data-qa="last_name"]');
  }

  get companyInput(): Locator {
    return this.page.locator('[data-qa="company"]');
  }

  get address1Input(): Locator {
    return this.page.locator('[data-qa="address"]');
  }

  get address2Input(): Locator {
    return this.page.locator('[data-qa="address2"]');
  }

  get countrySelect(): Locator {
    return this.page.locator('[data-qa="country"]');
  }

  get stateInput(): Locator {
    return this.page.locator('[data-qa="state"]');
  }

  get cityInput(): Locator {
    return this.page.locator('[data-qa="city"]');
  }

  get zipcodeInput(): Locator {
    return this.page.locator('[data-qa="zipcode"]');
  }

  get mobileNumberInput(): Locator {
    return this.page.locator('[data-qa="mobile_number"]');
  }

  get createAccountBtn(): Locator {
    return this.page.locator('[data-qa="create-account"]');
  }

  // ── Success / delete messages ─────────────────────────────────────────────────
  get accountCreatedMsg(): Locator {
    return this.page.locator('h2[data-qa="account-created"]');
  }

  get accountDeletedMsg(): Locator {
    return this.page.locator('h2[data-qa="account-deleted"]');
  }

  get continueBtn(): Locator {
    return this.page.locator('[data-qa="continue-button"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────────
  async open(): Promise<void> {
    await this.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginBtn.click();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await expect(this.signupHeading).toBeVisible();
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupBtn.click();
  }

  async fillAccountDetails(user: UserData): Promise<void> {
    await expect(this.accountInfoHeading).toBeVisible();

    // Title
    if (user.title === 'Mr') {
      await this.titleMrRadio.check();
    } else {
      await this.titleMrsRadio.check();
    }

    // Password
    await this.passwordInput.fill(user.password);

    // Date of birth
    await this.dobDaySelect.selectOption(user.dob.day);
    await this.dobMonthSelect.selectOption(user.dob.month);
    await this.dobYearSelect.selectOption(user.dob.year);

    // Address
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobileNumber);

    await this.createAccountBtn.click();
  }

  async assertAccountCreated(): Promise<void> {
    await expect(this.accountCreatedMsg).toContainText('Account Created!', { ignoreCase: true });
    await this.continueBtn.click();
  }

  async assertAccountDeleted(): Promise<void> {
    await expect(this.accountDeletedMsg).toContainText('Account Deleted!', { ignoreCase: true });
  }

  /** Full registration flow in one call. */
  async registerNewUser(user: UserData): Promise<void> {
    await this.open();
    await this.startSignup(user.name, user.email);
    await this.fillAccountDetails(user);
    await this.assertAccountCreated();
  }
}