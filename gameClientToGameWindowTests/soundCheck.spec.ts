import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    readGames,
    deletePreviousConsoleMessages,
} from './helpers';
import { Account, ExpectedMessage, Game } from '../types';
import { config } from '../config/config';

let page: Page;
const accounts: Account[] = config.getAccounts();
readGames().forEach((game: Game) => {
    const ICON_MUTED_CLASS = 'muted';

    test.describe(`Testing with ${game.provider} game: ${game.name}`, () => {
        test.beforeEach(async ({ browser }) => {
            const workerNumber = test.info().parallelIndex;
            const account: Account = accounts[workerNumber];
            page = await browser.newPage();
            await login(page, account.username, account.password);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('sound toggle', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);
            await launchGame(page, game.name, consoleMessages);
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
