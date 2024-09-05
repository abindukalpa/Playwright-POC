import { expect, type Page } from '@playwright/test';
import { validateConsoleMessages } from './validateConsoleMessagesHelper';
import { ExpectedMessage } from '../../types/expectedMessage';

export const launchGame = async (
    page: Page,
    gameName,
    consoleMessages: string[]
) => {
    const searchForGamesText = 'Search for games...'
    await expect(page.locator('table.ssc-wldw tbody')).not.toContainText("Loading...");
    await page.getByText(searchForGamesText).click();
    await page.getByPlaceholder(searchForGamesText).fill(gameName);
    await expect(page.locator('.search-box .game-tile-from-search-component .tile-container').first()).toBeAttached()
    await page.locator('.search-box .game-tile-from-search-component .tile-container').first().click();

    await validateConsoleMessages(
        ExpectedMessage.GAME_LOAD_COMPLETE,
        consoleMessages,
    );
};
