import { test, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    makeDeposit,
    readGames,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

let page: Page;
readGames().forEach((game) => {
    test.describe(`Testing with text: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('error message', async ({ browser }) => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);
            await launchGame(page, game, consoleMessages);

            await page
                .frameLocator('#root iframe')
                .getByRole('button', { name: 'Deposit' })
                .click();

            await makeDeposit(browser);
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
    });
});
