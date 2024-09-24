import { test, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    readGames,
} from './helpers';
import { Account, ExpectedMessage } from '../types';
import { config } from '../config/config';

let page: Page;
readGames().forEach((game: string) => {
    test.describe(`Testing with game: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            const workerNumber = test.info().parallelIndex;
            const account: Account = config.getAccounts()[workerNumber];
            page = await browser.newPage();
            await login(page, account.username, account.password);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('game launch', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);
            await launchGame(page, game, consoleMessages);
            await validateConsoleMessages(
                ExpectedMessage.GAME_LOAD_COMPLETE,
                consoleMessages
            );
        });
    });
});
