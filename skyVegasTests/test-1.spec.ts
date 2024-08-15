import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://uct.dev.betfair/');
  await page.getByRole('link', { name: 'Make Deposit' }).click();
  await page.getByRole('combobox').selectOption('SKYBET');
});