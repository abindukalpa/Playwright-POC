import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://skyvegas.com.nxt.ppbdev.com/');
});