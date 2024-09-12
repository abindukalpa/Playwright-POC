import { test, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    firstSpin,
    spin,
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

        test.skip('realityCheck', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            await firstSpin(page, consoleMessages);

            // Wait 60s so the reality check timer kicks in
            await page.waitForTimeout(60000);

            await spin(page, consoleMessages);

            await validateConsoleMessages(
                ExpectedMessage.REALITY_CHECK,
                consoleMessages,
                true,
                [65_000, 70_000, 75_000],
                120_000
            );
        });
    });
});
