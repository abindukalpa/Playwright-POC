import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    readGames,
    deletePreviousConsoleMessages,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

let page: Page;
readGames().forEach((game) => {
    const ICON_MUTED_CLASS = 'muted';

    test.describe(`Testing with text: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('Test sound toggle', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);
            await launchGame(page, game, consoleMessages);
            const soundToggleIcon = page
                .frameLocator('#root iframe')
                .locator('i.icon-volume');

            if (
                !(await soundToggleIcon.getAttribute('class'))?.includes(
                    ICON_MUTED_CLASS
                )
            ) {
                //If sound is on, turn it off
                await soundToggleIcon.click();
            }
            consoleMessages.length = 0;

            // turn sound on
            await soundToggleIcon.click();
            expect(await soundToggleIcon.getAttribute('class')).not.toContain(
                ICON_MUTED_CLASS
            );
            await validateConsoleMessages(
                ExpectedMessage.SOUND_CHECK_GAME_ON,
                consoleMessages
            );
            deletePreviousConsoleMessages(
                ExpectedMessage.SOUND_CHECK_GAME_ON,
                consoleMessages
            );

            // turn sound off
            await soundToggleIcon.click();
            expect(await soundToggleIcon.getAttribute('class')).toContain(
                ICON_MUTED_CLASS
            );
            await validateConsoleMessages(
                ExpectedMessage.SOUND_CHECK_GAME_OFF,
                consoleMessages
            );
        });
    });
});
