import { expect, test } from '@playwright/test';

const imageFixture = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="#9d2b42"/><circle cx="320" cy="210" r="120" fill="#f3ad50"/></svg>`;
const pageErrorsByPage = new WeakMap();
const consoleErrorsByPage = new WeakMap();

test.beforeEach(async ({ page }) => {
  const pageErrors = [];
  const consoleErrors = [];
  pageErrorsByPage.set(page, pageErrors);
  consoleErrorsByPage.set(page, consoleErrors);
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://images.unsplash.com/**', (route) => route.fulfill({
    status: 200,
    contentType: 'image/svg+xml',
    body: imageFixture
  }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

test('renders a WebGL table and adds the selected cut to its ticket', async ({ page }) => {
  const canvas = page.locator('.stage-canvas canvas');
  await expect(canvas).toHaveCount(1, { timeout: 15_000 }).catch(async (error) => {
    console.log('Browser console errors:', consoleErrorsByPage.get(page));
    console.log('3D fallback:', await page.locator('.stage-fallback').textContent().catch(() => 'No fallback message'));
    throw error;
  });
  await expect(page.getByRole('button', { name: /Add Japanese A5 Wagyu Ribeye/ })).toBeVisible();
  await page.getByRole('button', { name: /Add Japanese A5 Wagyu Ribeye/ }).click();
  await expect(page.locator('.ticket-items')).toContainText('Japanese A5 Wagyu Ribeye');
  await expect(page.locator('.ticket-total')).toContainText('€95');
  await expect(page.locator('#ticket-doneness')).toHaveValue('Medium-Rare');
  expect(pageErrorsByPage.get(page)).toEqual([]);
  expect(consoleErrorsByPage.get(page)).toEqual([]);
});

test('flips the image-first menu with its page controls', async ({ page }) => {
  await page.locator('#menu').scrollIntoViewIfNeeded();
  const firstImage = page.locator('.book-page').first().locator('img');
  await expect(firstImage).toBeVisible();
  await expect.poll(() => firstImage.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page.locator('.flipbook-progress')).toContainText('02 /');
  await expect(page.locator('.book-page')).toHaveCount(2);
});

test('lets guests inspect a sauce bowl and the 3D order ticket', async ({ page }) => {
  const canvas = page.locator('.stage-canvas');
  await expect(canvas.locator('canvas')).toHaveCount(1, { timeout: 15_000 });
  const box = await canvas.boundingBox();
  await canvas.click({ position: { x: box.width * 0.64, y: box.height * 0.58 } });
  await expect(page.locator('.toast')).toContainText('Black pepper jus');
  await canvas.click({ position: { x: box.width * 0.31, y: box.height * 0.5 } });
  await expect(page.locator('.toast')).toContainText('ticket is ready');
});

test('opens the AI sommelier and adds a recommendation to the live ticket', async ({ page }) => {
  await page.getByRole('button', { name: /Ask the Sommelier/ }).click();
  await expect(page.getByRole('dialog', { name: 'ÉTOILE AI Sommelier' })).toBeVisible();
  await expect(page.locator('.recommendation-card')).toHaveCount(2);
  await page.locator('.recommendation-card').first().getByRole('button', { name: 'Add to ticket' }).click();
  await expect(page.locator('.ticket-items')).toContainText('Japanese A5 Wagyu Ribeye');
  await page.getByRole('button', { name: 'Pair a cut with a bold red' }).click();
  await expect(page.locator('.msg-assistant').last()).toContainText('Royal Tomahawk Steak');
});

test('allows a mobile swipe to turn the menu page', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile viewport coverage only');
  await page.locator('#menu').scrollIntoViewIfNeeded();
  const spread = page.locator('.flipbook-spread');
  await expect(spread.locator('.book-page').first()).toBeVisible();
  const box = await spread.boundingBox();
  await spread.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', clientX: box.x + box.width * 0.8 });
  await spread.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch', clientX: box.x + box.width * 0.2 });
  await expect(page.locator('.flipbook-progress')).toContainText('02 /');
  await expect(spread.locator('.book-page').first().locator('img')).toBeVisible();
});

test('validates reservation fields before preparing an email', async ({ page }) => {
  await page.locator('#reservations').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Prepare reservation email' }).click();
  await expect(page.getByRole('alert')).toContainText('Please add your name, email, phone number and a date.');
  await expect(page.locator('.schedule-card').filter({ hasText: 'Long lunch' })).toBeVisible();
  await expect(page.locator('.seat-chip', { hasText: 'Grill-side' })).toBeVisible();
});
