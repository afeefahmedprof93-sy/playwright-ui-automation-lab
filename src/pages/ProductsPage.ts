// src/pages/ProductsPage.ts
import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────────
  get allProductsHeading(): Locator {
    return this.page.locator('h2.title', { hasText: 'All Products' });
  }

  get productsList(): Locator {
    return this.page.locator('.features_items .product-image-wrapper');
  }

  get searchInput(): Locator {
    return this.page.locator('#search_product');
  }

  get searchBtn(): Locator {
    return this.page.locator('#submit_search');
  }

  get searchedProductsHeading(): Locator {
    return this.page.locator('h2.title', { hasText: 'Searched Products' });
  }

  get searchedProductItems(): Locator {
    return this.page.locator('.features_items .productinfo');
  }

  get firstViewProductLink(): Locator {
    return this.page.locator('a[href^="/product_details/"]').first();
  }

  // ── Brand sidebar ─────────────────────────────────────────────────────────────
  get brandsSection(): Locator {
    return this.page.locator('.brands_products');
  }

  getBrandLink(brandName: string): Locator {
    return this.page.locator('.brands_products .brands-name a', { hasText: brandName });
  }

  // ── Category sidebar ─────────────────────────────────────────────────────────
  getCategoryLink(category: string): Locator {
    return this.page.locator('.left-sidebar .panel-title a', { hasText: category });
  }

  getSubCategoryLink(subCategory: string): Locator {
    return this.page.locator('.panel-body a', { hasText: subCategory });
  }

  // ── Add-to-cart hover overlay ─────────────────────────────────────────────────
  getAddToCartBtnForProduct(index: number): Locator {
    return this.page.locator('.features_items .productinfo a.add-to-cart').nth(index);
  }

  // ── Review section (product detail) ──────────────────────────────────────────
  get reviewNameInput(): Locator {
    return this.page.locator('#name');
  }

  get reviewEmailInput(): Locator {
    return this.page.locator('#email');
  }

  get reviewTextArea(): Locator {
    return this.page.locator('#review');
  }

  get reviewSubmitBtn(): Locator {
    return this.page.locator('#button-review');
  }

  get reviewSuccessMsg(): Locator {
    return this.page.locator('.alert-success span', { hasText: 'Thank you for your review.' });
  }

  // ── Actions ───────────────────────────────────────────────────────────────────
  async open(): Promise<void> {
    await this.goto('/products');
  }

  async assertAllProductsPageVisible(): Promise<void> {
    await expect(this.allProductsHeading).toBeVisible();
    await expect(this.productsList.first()).toBeVisible();
  }

  async searchProduct(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchBtn.click();
    await expect(this.searchedProductsHeading).toBeVisible();
  }

  async viewFirstProduct(): Promise<void> {
    await this.firstViewProductLink.click();
  }

  async assertProductDetailVisible(): Promise<void> {
    await this.assertUrl('/product_details/');
    await expect(this.page.locator('.product-information h2')).toBeVisible();
    await expect(this.page.locator('.product-information p').first()).toBeVisible();
  }

  async hoverAndAddToCart(index: number): Promise<void> {
    const product = this.productsList.nth(index);
    await product.hover();
    await product.locator('a.add-to-cart').first().click();
  }

  async addReviewForProduct(name: string, email: string, review: string): Promise<void> {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextArea.fill(review);
    await this.reviewSubmitBtn.click();
    await expect(this.reviewSuccessMsg).toBeVisible();
  }
}
