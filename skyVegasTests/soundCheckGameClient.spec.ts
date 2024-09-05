import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    readGames,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

readGames().forEach((game) => {
    let page: Page;
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
            await soundToggleIcon.click();

            expect(
                (await soundToggleIcon.getAttribute('class'))?.includes(
                    ICON_MUTED_CLASS
                )
            ).toBeFalsy;
            await validateConsoleMessages(
                ExpectedMessage.SOUND_CHECK_GAME_ON,
                consoleMessages,
                true
            );

            await soundToggleIcon.click();
            expect(await soundToggleIcon.getAttribute('class')).toContain(
                ICON_MUTED_CLASS
            );
            await validateConsoleMessages(
                ExpectedMessage.SOUND_CHECK_GAME_OFF,
                consoleMessages,
                true
            );
        });
    });
});
