// tests/checkout/checkout.spec.ts
// TC14 – Place Order: Register while Checkout
// TC15 – Place Order: Register before Checkout
// TC16 – Place Order: Login before Checkout
// TC23 – Verify address details in checkout page
// TC24 – Download Invoice after purchase order

import { test, expect } from '../../src/utils/fixtures';
import { DEFAULT_USER, DEFAULT_PAYMENT, generateEmail } from '../../src/data/testData';

const makeUser = () => ({ ...DEFAULT_USER, email: generateEmail() });

// ── Shared helper: adds a product and navigates to checkout ──────────────────
async function addProductAndGoToCheckout(
  productsPage: any,
  cartPage: any,
): Promise<void> {
  await productsPage.open();
  await productsPage.hoverAndAddToCart(0);
  await cartPage.viewCart();
  await cartPage.assertCartHasItems();
  await cartPage.proceedToCheckout();
}

test.describe('TC14 – Place Order: Register while Checkout', () => {
  test('should register mid-checkout and complete the order', async ({
    page,
    homePage,
    authPage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = makeUser();

    await homePage.open();
    await addProductAndGoToCheckout(productsPage, cartPage);

    // Modal – click Register / Login
    await page.locator('a[href="/login"]', { hasText: 'Register / Login' }).click();

    // Register new user
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();

    // Now logged in – proceed to checkout
    await homePage.navCart.click();
    await cartPage.proceedToCheckout();

    await checkoutPage.assertCheckoutPage();
    await checkoutPage.addComment('Please deliver ASAP.');
    await checkoutPage.clickPlaceOrder();
    await checkoutPage.fillPaymentDetails(DEFAULT_PAYMENT);
    await checkoutPage.confirmPayment();
    await checkoutPage.assertOrderPlaced();

    // Cleanup
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});

test.describe('TC15 – Place Order: Register before Checkout', () => {
  test('should register first, add products, and complete the order', async ({
    homePage,
    authPage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = makeUser();

    // Step 1: Register
    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();
    await authPage.assertLoggedIn(user.name);

    // Step 2: Add to cart
    await addProductAndGoToCheckout(productsPage, cartPage);

    // Step 3: Checkout
    await checkoutPage.assertCheckoutPage();
    await checkoutPage.addComment('Registered before checkout.');
    await checkoutPage.clickPlaceOrder();
    await checkoutPage.fillPaymentDetails(DEFAULT_PAYMENT);
    await checkoutPage.confirmPayment();
    await checkoutPage.assertOrderPlaced();

    // Cleanup
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});

test.describe('TC16 – Place Order: Login before Checkout', () => {
  test('should login first, add products, and complete the order', async ({
    homePage,
    authPage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = makeUser();

    // Register then logout so we can log in fresh
    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();
    await homePage.navLogout.click();

    // Login
    await authPage.login(user.email, user.password);
    await authPage.assertLoggedIn(user.name);

    // Add to cart and checkout
    await addProductAndGoToCheckout(productsPage, cartPage);

    await checkoutPage.assertCheckoutPage();
    await checkoutPage.addComment('Logged in before checkout.');
    await checkoutPage.clickPlaceOrder();
    await checkoutPage.fillPaymentDetails(DEFAULT_PAYMENT);
    await checkoutPage.confirmPayment();
    await checkoutPage.assertOrderPlaced();

    // Cleanup
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});

test.describe('TC23 – Verify address details in checkout page', () => {
  test('should display correct delivery and billing address after registration', async ({
    homePage,
    authPage,
    productsPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    const user = makeUser();

    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();

    await addProductAndGoToCheckout(productsPage, cartPage);

    await checkoutPage.assertCheckoutPage();

    // Verify name and address visible in delivery section
    const deliverySection = page.locator('#address_delivery');
    await expect(deliverySection).toContainText(user.firstName);
    await expect(deliverySection).toContainText(user.address1);
    await expect(deliverySection).toContainText(user.city);

    // Cleanup
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});

test.describe('TC24 – Download Invoice after purchase order', () => {
  test('should download invoice PDF after placing order', async ({
    homePage,
    authPage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = makeUser();

    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();

    await addProductAndGoToCheckout(productsPage, cartPage);

    await checkoutPage.assertCheckoutPage();
    await checkoutPage.addComment('TC24 – invoice download test.');
    await checkoutPage.clickPlaceOrder();
    await checkoutPage.fillPaymentDetails(DEFAULT_PAYMENT);
    await checkoutPage.confirmPayment();
    await checkoutPage.assertOrderPlaced();

    // Download invoice
    await checkoutPage.downloadInvoice();

    await checkoutPage.clickContinue();

    // Cleanup
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});
