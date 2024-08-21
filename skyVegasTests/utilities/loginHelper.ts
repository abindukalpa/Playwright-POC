import { type Page } from '@playwright/test';
const userName = String(process.env.USERNAME);
const password = String(process.env.PASSWORD);
const url = String(process.env.URL);

export const login = async (page: Page) => {
    await page.goto(url);
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Username').fill(userName);
    await page.getByLabel('PIN').fill(password);
    await page.getByRole('button', { name: 'I Accept' }).click();
    await page.getByRole('button', { name: 'Log in' }).click();
};
