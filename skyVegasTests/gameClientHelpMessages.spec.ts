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
    let page: Page;
    test.describe(`Testing with text: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test.skip('Test game menu open', async () => {
            const consoleMessages: string[] = [];
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

        test.skip('Test help menu open', async () => {
            const consoleMessages: string[] = [];
            await page
                .frameLocator('#root iframe')
                .getByRole('link', { name: 'Game Help' })
                .waitFor({ state: 'attached' });
            await page
                .frameLocator('#root iframe')
                .getByRole('link', { name: 'Game Help' })
                .click();
            await validateConsoleMessages(
                ExpectedMessage.GAME_HELP,
                consoleMessages
            );
        });

        test.skip('Test game menu closed', async () => {
            const consoleMessages: string[] = [];
            await page
                .frameLocator('#root iframe')
                .getByText('MenuOpen the menu to access')
                .click();

            await validateConsoleMessages(
                ExpectedMessage.GAME_HELP_MENU_CLOSE,
                consoleMessages
            );
        });

        test.skip('Test paytable open', async () => {
            const consoleMessages: string[] = [];
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
