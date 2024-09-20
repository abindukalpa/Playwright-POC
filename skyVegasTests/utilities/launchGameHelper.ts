import { expect, type Page } from '@playwright/test';

import { ExpectedMessage } from '../../types/expectedMessage';
import { validateConsoleMessages, recoverFromFreeSpins } from '.';

export const launchGame = async (
    page: Page,
    gameName,
    consoleMessages: string[]
) => {
    await expect(async () => {
        const accountFundsInfo = await page
            .locator('table.ssc-wldw tbody')
            .textContent();
        const numberRegex = /[\d,]+\.\d{2}/g;
        const numericValues = accountFundsInfo?.match(numberRegex);
        expect(numericValues?.length).toEqual(2); //expect 2 numbers Main and Bonus
    }).toPass({
        intervals: [5_000, 10_000, 15_000],
        timeout: 60_000,
    });

    await page.locator('.search-bar-container').click();
    await page.locator('#search-field').fill(gameName);
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

    await getPastGameSplashMenu(page, consoleMessages);
    //get round the menu here -> then you realise if you're in normal game mode or not

    await recoverFromFreeSpins(page, consoleMessages);
};

export const getPastGameSplashMenu = async (
    page: Page,
    consoleMessages: string[]
) => {
    await page.mouse.click(300, 300);

    await page.keyboard.press(' ', { delay: 500 });

    await validateConsoleMessages(
        ExpectedMessage.PLAY_MODE_UPDATE,
        consoleMessages
    );
};
