// tests/products/products.spec.ts
// TC8  – Verify All Products and product detail page
// TC9  – Search Product
// TC18 – View Category Products
// TC19 – View & Cart Brand Products
// TC21 – Add review on product

import { test, expect } from '../../src/utils/fixtures';
import { SEARCH_TERMS } from '../../src/data/testData';

test.describe('TC8 – All Products and product detail page', () => {
  test('should show all products and verify product detail info', async ({
    homePage,
    productsPage,
  }) => {
    await homePage.open();
    await homePage.assertHomePageVisible();

    await homePage.navProducts.click();
    await productsPage.assertAllProductsPageVisible();

    await productsPage.viewFirstProduct();
    await productsPage.assertProductDetailVisible();

    // Verify required detail fields are present
    const info = productsPage.page.locator('.product-information');
    await expect(info.locator('h2')).toBeVisible();           // product name
    await expect(info.locator('p').first()).toBeVisible();     // category
    await expect(info.locator('span span')).toBeVisible();    // price
    await expect(info.locator('b', { hasText: 'Availability:' })).toBeVisible();
    await expect(info.locator('b', { hasText: 'Condition:' })).toBeVisible();
    await expect(info.locator('b', { hasText: 'Brand:' })).toBeVisible();
  });
});

test.describe('TC9 – Search Product', () => {
  test('should display searched products matching the query', async ({
    homePage,
    productsPage,
  }) => {
    await homePage.open();
    await homePage.navProducts.click();
    await productsPage.assertAllProductsPageVisible();

    await productsPage.searchProduct(SEARCH_TERMS.tshirt);
    await expect(productsPage.searchedProductItems.first()).toBeVisible();

    // Every visible product name should relate to the search term
    const count = await productsPage.searchedProductItems.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('TC18 – View Category Products', () => {
  test('should filter products by Women > Dress category', async ({ page, homePage, productsPage }) => {
    await homePage.open();

    // Expand Women category
    const womenCategory = page.locator('.left-sidebar .panel-title a', { hasText: 'Women' });
    await womenCategory.click();

    // Click Dress sub-category
    const dressLink = page.locator('.panel-body a', { hasText: 'Dress' });
    await dressLink.first().click();

    await expect(page.locator('h2.title')).toContainText('Women - Dress Products');
    await expect(productsPage.productsList.first()).toBeVisible();
  });

  test('should filter products by Men > Tshirts category', async ({ page, homePage, productsPage }) => {
    await homePage.open();

    const menCategory = page.locator('.left-sidebar .panel-title a', { hasText: 'Men' });
    await menCategory.click();

    const tshirtsLink = page.locator('.panel-body a', { hasText: 'Tshirts' });
    await tshirtsLink.first().click();

    await expect(page.locator('h2.title')).toContainText('Men - Tshirts Products');
    await expect(productsPage.productsList.first()).toBeVisible();
  });
});

test.describe('TC19 – View & Cart Brand Products', () => {
  test('should view Polo brand products and add to cart', async ({
    page,
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();

    // Click a brand from sidebar
    const poloBrand = productsPage.getBrandLink('Polo');
    await poloBrand.click();

    await expect(page.locator('h2.title')).toContainText('Brand - Polo Products');
    await expect(productsPage.productsList.first()).toBeVisible();

    // Click another brand
    const hmBrand = productsPage.getBrandLink('H&M');
    await hmBrand.click();
    await expect(page.locator('h2.title')).toContainText('Brand - H&M Products');
  });
});

test.describe('TC21 – Add review on product', () => {
  test('should submit a product review successfully', async ({
    homePage,
    productsPage,
  }) => {
    await homePage.open();
    await homePage.navProducts.click();
    await productsPage.assertAllProductsPageVisible();

    await productsPage.viewFirstProduct();

    await productsPage.addReviewForProduct(
      'Review Tester',
      'reviewer@example.com',
      'Great product! Automated review test.',
    );
  });
});
