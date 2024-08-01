import { test, expect, type Page } from "@playwright/test";

let launchGame = async (page: Page, gameName) => {
    await page.getByText('Search for games...').click();
    await page.getByPlaceholder('Search for games...').fill(gameName);
    await new Promise(r => setTimeout(r, 2000));
    await page.locator('.tile-footer-wrapper').first().click();
  }

  export {launchGame}
