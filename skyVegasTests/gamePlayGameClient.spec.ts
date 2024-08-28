import { test, type Page } from '@playwright/test';
import {
    launchGame,
    login,
    validateConsoleMessages,
    startEventListener,
    makeSpin,
    readGames,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

let page: Page;
readGames().forEach((game) => {
    const consoleMessages: string[] = [];

    test.describe(`Testing with text: ${game}`, () => {
        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterAll(async () => {
            await page.close();
        });

        test('gamePlay', async () => {
            startEventListener(page, consoleMessages);
            await launchGame(page, game, consoleMessages);
            await makeSpin(page, consoleMessages);
            await validateConsoleMessages(
                ExpectedMessage.END_SPIN,
                consoleMessages
            );
        });
    });
});
