import { test, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    readGames,
} from './helpers';
import { Account, ExpectedMessage, Game } from '../types';
import { config } from '../config/config';

let page: Page;
const accounts: Account[] = config.getAccounts();
readGames().forEach((game: Game) => {
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

        test('supported currencies', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);
            await launchGame(page, game.name, consoleMessages);
            await validateConsoleMessages(
                ExpectedMessage.CURRENCY_GBP,
                consoleMessages
            );
        });
    });
});
