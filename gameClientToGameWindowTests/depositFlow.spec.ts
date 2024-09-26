import { test, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    makeDeposit,
    readGames,
} from './helpers';
import { ExpectedMessage, Account } from '../types';
import { config } from '../config/config';

let page: Page;
const accounts: Account[] = config.getAccounts();
readGames().forEach((game: string) => {
    test.describe(`Testing with game: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('deposit flow', async ({ browser }) => {
            const workerNumber = test.info().parallelIndex;
            const account: Account = accounts[workerNumber];

            await login(page, account.username, account.password);

            const consoleMessages: string[] = [];

            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);
            await page
                .frameLocator('#root iframe')
                .getByRole('button', { name: 'Deposit' })
                .click();
            await makeDeposit(browser, account.accountId);
            await page.frameLocator('#root iframe').locator('.sprite').click();
            await validateConsoleMessages(
                ExpectedMessage.DEPOSIT,
                consoleMessages
            );
        });
    });
});
