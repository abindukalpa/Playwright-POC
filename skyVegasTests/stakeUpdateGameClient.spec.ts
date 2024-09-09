import { test, type Page } from '@playwright/test';
import {
    launchGame,
    login,
    validateConsoleMessages,
    startEventListener,
    readGames,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

let page: Page;
readGames().forEach((game) => {
    const consoleMessages: string[] = [];

    test.describe(`Testing with text: ${game}`, async () => {
        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterAll(async () => {
            await page.close();
        });

        test('stakeUpdate', async () => {
            startEventListener(page, consoleMessages);
            await launchGame(page, game, consoleMessages);

            await page.mouse.click(300, 300, { delay: 10 });
            await page.keyboard.press('Enter', { delay: 2000 });
            await page.mouse.click(300, 300, { delay: 10 });
            await page.keyboard.press('ArrowRight', { delay: 2000 });
            await validateConsoleMessages(
                ExpectedMessage.STAKE_UPDATE,
                consoleMessages
            );
            const lastMessage = consoleMessages[consoleMessages.length - 1];
            test.expect(lastMessage).toContain(ExpectedMessage.STAKE_UPDATE);
        });
    });
});