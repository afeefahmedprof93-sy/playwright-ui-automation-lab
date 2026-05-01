// tests/cart/cart.spec.ts
// TC10 – Verify Subscription in home page
// TC11 – Verify Subscription in Cart page
// TC12 – Add Products in Cart
// TC13 – Verify Product quantity in Cart
// TC17 – Remove Products From Cart
// TC20 – Search Products and Verify Cart After Login
// TC22 – Add to cart from Recommended items

import { test, expect } from '../../src/utils/fixtures';
import { DEFAULT_USER, generateEmail } from '../../src/data/testData';

const makeUser = () => ({ ...DEFAULT_USER, email: generateEmail() });

test.describe('TC10 – Subscription in Home page', () => {
  test('should subscribe successfully from the home page footer', async ({ homePage }) => {
    await homePage.open();
    await homePage.assertHomePageVisible();
    await homePage.subscribeWithEmail(generateEmail('sub'));
  });
});

test.describe('TC11 – Subscription in Cart page', () => {
  test('should subscribe successfully from the cart page footer', async ({
    homePage,
    cartPage,
  }) => {
    await homePage.open();
    await homePage.navCart.click();
    await expect(cartPage.page).toHaveURL(/\/view_cart/);
    await cartPage.subscribeInCart(generateEmail('cartsub'));
  });
});

test.describe('TC12 – Add Products in Cart', () => {
  test('should add two products to cart and verify they appear', async ({
    homePage,
    productsPage,
    cartPage,
  }) => {
    await homePage.open();
    await homePage.navProducts.click();
    await productsPage.assertAllProductsPageVisible();

    // Add first product
    await productsPage.hoverAndAddToCart(0);
    await cartPage.continueShopping();

    // Add second product
    await productsPage.hoverAndAddToCart(1);
    await cartPage.viewCart();

    await cartPage.assertCartHasItems();
    // Both products should be in the table
    const rows = await cartPage.cartItems.count();
    expect(rows).toBeGreaterThanOrEqual(2);
  });
});

test.describe('TC13 – Verify Product quantity in Cart', () => {
  test('should add product with quantity 4 and verify in cart', async ({
    page,
    homePage,
    productsPage,
    cartPage,
  }) => {
    await homePage.open();
    await homePage.navProducts.click();
    await productsPage.viewFirstProduct();

    // Set quantity to 4
    const qtyInput = page.locator('input#quantity');
    await qtyInput.fill('4');

    // Add to cart
    await page.locator('button.cart', { hasText: 'Add to cart' }).click();
    await cartPage.viewCart();

    // Verify quantity = 4
    const qtyCell = page.locator('tbody tr').first().locator('.cart_quantity button');
    await expect(qtyCell).toHaveText('4');
  });
});

test.describe('TC17 – Remove Products From Cart', () => {
  test('should remove a product from cart and verify cart is empty/updated', async ({
    homePage,
    productsPage,
    cartPage,
    page,
  }) => {
    await homePage.open();
    await homePage.navProducts.click();
    await productsPage.hoverAndAddToCart(0);
    await cartPage.viewCart();
    await cartPage.assertCartHasItems();

    // Delete the item using the × button
    const deleteBtn = page.locator('a.cart_quantity_delete').first();
    await deleteBtn.click();

    // Row should disappear
    await expect(page.locator('#empty_cart')).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('TC20 – Search Products and Verify Cart After Login', () => {
  test('should retain searched products in cart after login', async ({
    page,
    homePage,
    authPage,
    productsPage,
    cartPage,
  }) => {
    const user = makeUser();

    // Register first
    await authPage.open();
    await authPage.startSignup(user.name, user.email);
    await authPage.fillAccountDetails(user);
    await authPage.assertAccountCreated();
    await homePage.navLogout.click();

    // Search and add to cart while logged out
    await homePage.navProducts.click();
    await productsPage.searchProduct('dress');
    const count = await productsPage.searchedProductItems.count();
    expect(count).toBeGreaterThan(0);

    await productsPage.hoverAndAddToCart(0);
    await cartPage.viewCart();
    await cartPage.assertCartHasItems();

    // Login from cart checkout prompt
    await cartPage.proceedToCheckout();
    // Modal appears - click Register / Login
    await page.locator('a[href="/login"]', { hasText: 'Register / Login' }).click();

    await authPage.login(user.email, user.password);

    // Navigate back to cart
    await homePage.navCart.click();
    await cartPage.assertCartHasItems();

    // Cleanup
    await homePage.navDeleteAccount.click();
    await authPage.assertAccountDeleted();
  });
});

test.describe('TC22 – Add to cart from Recommended items', () => {
  test('should add a recommended item to cart and verify', async ({
    page,
    homePage,
    cartPage,
  }) => {
    await homePage.open();

    // Scroll to recommended items section
    await homePage.recommendedItemsSection.scrollIntoViewIfNeeded();
    await expect(page.locator('h2', { hasText: 'recommended items' })).toBeVisible();

    // Add first recommended product
    const addBtn = page.locator('.recommended_items a[data-product-id]').first();
    await addBtn.click();

    await cartPage.viewCart();
    await cartPage.assertCartHasItems();
  });
});
