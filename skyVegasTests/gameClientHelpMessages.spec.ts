import { test, expect, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    readGames,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

readGames().forEach((game) => {
    const consoleMessages: string[] = [];
    let page: Page;
    test.describe(`Testing with text: ${game}`, () => {
        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterAll(async () => {
            await page.close();
        });

        test('Test game menu open', async () => {
            startEventListener(page, consoleMessages);
            await launchGame(page, game, consoleMessages);
            await expect(
                page
                    .frameLocator('#root iframe')
                    .getByText('MenuOpen the menu to access')
            ).toBeAttached();
            await page
                .frameLocator('#root iframe')
                .getByText('MenuOpen the menu to access')
                .click();
            await validateConsoleMessages(
                ExpectedMessage.GAME_HELP_MENU_OPEN,
                consoleMessages
            );
        });

        test('Test help menu open', async () => {
            await page
                .frameLocator('#root iframe')
                .getByRole('link', { name: 'Game Help' })
                .waitFor();
            await page
                .frameLocator('#root iframe')
                .getByRole('link', { name: 'Game Help' })
                .click();
            await validateConsoleMessages(
                ExpectedMessage.GAME_HELP,
                consoleMessages
            );
        });

        test('Test game menu closed', async () => {
            await page
                .frameLocator('#root iframe')
                .getByText('MenuOpen the menu to access')
                .click();

            await validateConsoleMessages(
                ExpectedMessage.GAME_HELP_MENU_CLOSE,
                consoleMessages
            );
        });

        test('Test paytable open', async () => {
            await page
                .frameLocator('#root iframe')
                .getByRole('link', { name: 'Game Help' })
                .waitFor();
            await page
                .frameLocator('#root iframe')
                .getByRole('link', { name: 'Paytable' })
                .click();
            await validateConsoleMessages(
                ExpectedMessage.PAY_TABLE,
                consoleMessages
            );
        });
    });
});
