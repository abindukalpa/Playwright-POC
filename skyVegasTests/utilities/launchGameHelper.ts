import { type Page } from '@playwright/test';
import { validateConsoleMessages } from './validateConsoleMessagesHelper';
import { ExpectedMessage } from '../../types/expectedMessage';

export const launchGame = async (
    page: Page,
    gameName,
    consoleMessages: string[]
) => {
    await page.getByText('Search for games...').click();
    await new Promise((r) => setTimeout(r, 2000));
    await page.getByPlaceholder('Search for games...').fill(gameName);
    await new Promise((r) => setTimeout(r, 2000));
    await page.locator('.tile-footer-wrapper').first().click();
    await validateConsoleMessages(
        ExpectedMessage.GAME_LOAD_COMPLETE,
        consoleMessages,
        true,
        [4_000, 6_000, 8_000, 15_000]
    );
};
