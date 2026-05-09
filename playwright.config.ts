import { secretConfig } from '@config/env';
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const rawTimeStamp = new Date().toISOString();
const cleanedTimeStamp = rawTimeStamp.replace('T','_T').replace('Z','').replace(/[:.]/g,'-');
const reportFolder = path.join('playwright-report',`report-${cleanedTimeStamp}`);

export default defineConfig({
  // ─── Test discovery ──────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  // ─── Parallelism ─────────────────────────────────────────────────────────────
  fullyParallel: true,          // run tests within a file in parallel
  workers: process.env.CI ? 4 : '50%', // half your CPUs locally; 4 in CI

  // ─── Retry policy ────────────────────────────────────────────────────────────
  retries: 2,

  // ─── Reporter ────────────────────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: reportFolder, open: 'always' }],
  ],

  // ─── Global options applied to every test ────────────────────────────────────
  use: {
    baseURL: secretConfig.baseURL,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
    // Block ads / analytics to keep tests stable
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
  },

  // ─── Projects (browsers) ─────────────────────────────────────────────────────
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // ─── Output ──────────────────────────────────────────────────────────────────
  outputDir: 'test-results/',
});
