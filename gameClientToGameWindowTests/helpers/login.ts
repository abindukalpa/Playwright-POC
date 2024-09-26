import { type Page } from '@playwright/test';
import { config } from '../../config/config';

export const login = async (page: Page, username: string, password: string) => {
    await page.goto(config.getURL());
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('PIN').fill(password);
    await page.getByRole('button', { name: 'I Accept' }).click();
    await page.getByRole('button', { name: 'Log in' }).click();
};
