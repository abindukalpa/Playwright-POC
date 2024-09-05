import { expect, type Page } from '@playwright/test';
import { validateConsoleMessages } from './validateConsoleMessagesHelper';
import { ExpectedMessage } from '../../types/expectedMessage';

export const launchGame = async (
    page: Page,
    gameName,
    consoleMessages: string[]
) => {
    const searchForGamesText = 'Search for games...'

// wait for wallet amount to appear, which should ensure the page has loaded correctly
await expect(page.locator('table.ssc-wldw tbody')).toContainText('£');

 // wait for wallet amount to appear, which should ensure the page has loaded correctly
await page.getByText(searchForGamesText).click();

// type the game we are searching for in the text box
await page.getByPlaceholder(searchForGamesText).fill(gameName);

// check that after typing in the search box, the results have appeared
await expect(page.locator('.search-box .game-tile-from-search-component .tile-container').first()).toBeAttached()

// click the first game result in the list
await page.locator('.search-box .game-tile-from-search-component .tile-container').first().click();

await validateConsoleMessages(
    ExpectedMessage.GAME_LOAD_COMPLETE,
    consoleMessages,
);
};
