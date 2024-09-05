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

readGames().forEach((game) => {
    let page: Page;
    test.describe(`Testing with text: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('Test deposit flow', async ({ browser }) => {
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
                ExpectedMessage.DEPOSIT,
                consoleMessages
            );
        });
    });
});
