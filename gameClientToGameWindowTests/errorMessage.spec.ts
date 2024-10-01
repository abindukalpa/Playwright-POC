import { test, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    makeDeposit,
    readGames,
    spin,
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

        test('error message', async ({ browser }) => {
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
                ExpectedMessage.ERROR_DISPLAYED,
                consoleMessages
            );

            await validateConsoleMessages(
                ExpectedMessage.ERROR_DISMISSED,
                consoleMessages
            );
        });

        test('reality check', async () => {
            // set a 3 minute timeout for this test
            test.setTimeout(300_000);
            await login(
                page,
                config.getRealityCheckUserName(),
                config.getRealityCheckPassword()
            );

            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            await spin(page, consoleMessages);

            // Wait 121s so the reality check timer kicks in
            await page.waitForTimeout(121_000);

            await page.keyboard.press(' ', { delay: 500 });

            await validateConsoleMessages(
                ExpectedMessage.REALITY_CHECK,
                consoleMessages
            );
        });
    });
});
