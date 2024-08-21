import {type Page } from "@playwright/test";

export const launchGame = async (page: Page, gameName) => {
    await page.getByText('Search for games...').click();
    await new Promise((r) => setTimeout(r, 2000));
    await page.getByPlaceholder('Search for games...').fill(gameName);
    await new Promise((r) => setTimeout(r, 2000));
    await page.locator('.tile-footer-wrapper').first().click();
};
