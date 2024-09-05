import { expect, type Page } from '@playwright/test';

import { validateConsoleMessages } from './validateConsoleMessagesHelper';
import { ExpectedMessage } from '../../types/expectedMessage';

export const launchGame = async (
    page: Page,
    gameName,
    consoleMessages: string[]
) => {
    const searchForGamesText = 'SystemSearchSearch for games';
    const placeholderText = 'Search for games...';

    await expect(async () => {
        let amount = await page.locator('table.ssc-wldw tbody').textContent();
        const numberRegex = /[\d,]+\.\d{2}/g;
        const numbers = amount?.match(numberRegex);
        expect(numbers?.length).toEqual(2); //expect 2 numbers Main and Bonus
    }).toPass({
        intervals: [5_000, 10_000, 15_000],
        timeout: 60_000,
    });

    await page.getByText(searchForGamesText).click();

    await page.getByPlaceholder(placeholderText).fill(gameName);
    await expect(
        page
            .locator(
                '.search-box .game-tile-from-search-component .tile-container'
            )
            .first()
    ).toBeAttached();
    await page
        .locator('.search-box .game-tile-from-search-component .tile-container')
        .first()
        .click();

    await validateConsoleMessages(
        ExpectedMessage.GAME_LOAD_COMPLETE,
        consoleMessages
    );
};
