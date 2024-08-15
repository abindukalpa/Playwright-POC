import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://uct.dev.betfair/');
  await page
  .getByRole('link', { name: 'Make Deposit' })
  .click();
  await page
  .getByRole('combobox')
  .selectOption('SKYBET');
  await page
  .getByRole('row', { name: 'Account ID' })
  .getByRole('textbox')
  .fill("");
  await page
  .getByRole('row', { name: 'Amount' })
  .getByRole('textbox')
  .fill("10");
  await page
  .
});