import { test, expect, type Page } from '@playwright/test';
const userName = String(process.env.USERNAME);
const password = String(process.env.PASSWORD);
const url = String(process.env.URL);

test('Test login works', async ({ page }) => {
    await login(page);
    if (process.env.NODE_ENV == 'live') {
        await page.getByRole('button', { name: 'Log in' }).click();
        await page.getByText("I don't want to change it").click();
    } else {
        await page.getByRole('button', { name: 'I Accept' }).click();
        await page.getByRole('button', { name: 'Log in' }).click();
        await page
            .locator('a')
            .filter({ hasText: 'My Account' })
            .first()
            .click();
        await expect(page.getByText(userName)).toBeVisible();
    }
});

const login = async (page: Page) => {
    await page.goto(url);
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Username').fill(userName);
    await page.getByLabel('PIN').fill(password);
    page.getByRole('button', { name: 'Log in' }).focus();
};
