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
import { ExpectedMessage } from '../types/expectedMessage';
import { config } from '../config/config';

let page: Page;
readGames().forEach((game: string) => {
    test.describe(`Testing with game: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('error message', async ({ browser }) => {
            await login(page);
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

        test('reality check', async () => {
            await login(
                page,
                config.getRealityCheckUserName(),
                config.getRealityCheckPassword()
            );

            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            await spin(page, consoleMessages);

            // Wait 61s so the reality check timer kicks in
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
