import { test, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    firstSpin,
    readGames,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';
import { config } from '../config/config';

let page: Page;
readGames().forEach((game) => {
    test.describe(`Testing with text: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
            await login(
                page,
                config.getRealityCheckUserName(),
                config.getRealityCheckPassword()
            );
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('realityCheck', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            await firstSpin(page, consoleMessages);

            // Wait 60s so the reality check timer kicks in
            await page.waitForTimeout(61000);

            await page.keyboard.press(' ', { delay: 500 });

            await validateConsoleMessages(
                ExpectedMessage.REALITY_CHECK,
                consoleMessages,
                [65_000, 70_000, 75_000],
                90_000
            );
        });
    });
});
