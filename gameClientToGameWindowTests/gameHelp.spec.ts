import { test, expect, type Page } from '@playwright/test';
import {
    launchGame,
    validateConsoleMessages,
    login,
    startEventListener,
    readGames,
} from './helpers';
import { config } from '../config/config';
import { Account, ExpectedMessage, Game } from '../types';

let page: Page;
const accounts: Account[] = config.getAccounts();
readGames().forEach((game: Game) => {
    test.describe(`Testing with ${game.provider} game: ${game.name}`, () => {
        test.beforeEach(async ({ browser }) => {
            const workerNumber = test.info().parallelIndex;
            const account: Account = accounts[workerNumber];
            page = await browser.newPage();
            await login(page, account.username, account.password);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('game help', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);
            await launchGame(page, game.name, consoleMessages);

            await expect(
                page
                    .frameLocator('#root iframe')
                    .locator('.topbar-container span.btn-menu-hambg-icon')
            ).toBeAttached();
            await page
                .frameLocator('#root iframe')
                .locator('.topbar-container span.btn-menu-hambg-icon')
                .click();

            await validateConsoleMessages(
                ExpectedMessage.GAME_MENU_OPEN,
                consoleMessages
            );

            await expect(
                page
                    .frameLocator('#root iframe')
                    .locator('.topbar-menu-wrapper li.menu-item.gamehelp')
            ).toBeAttached();
            await page
                .frameLocator('#root iframe')
                .locator('.topbar-menu-wrapper li.menu-item.gamehelp')
                .click();

            await validateConsoleMessages(
                ExpectedMessage.GAME_MENU_CLOSE,
                consoleMessages
            );

            await validateConsoleMessages(
                ExpectedMessage.GAME_HELP,
                consoleMessages
            );
        });

        test('toggle paytable', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);
            await launchGame(page, game.name, consoleMessages);

            await expect(
                page
                    .frameLocator('#root iframe')
                    .locator('.topbar-container span.btn-menu-hambg-icon')
            ).toBeAttached();
            await page
                .frameLocator('#root iframe')
                .locator('.topbar-container span.btn-menu-hambg-icon')
                .click();

            await expect(
                page
                    .frameLocator('#root iframe')
                    .locator('.topbar-menu-wrapper li.menu-item.paytable')
            ).toBeAttached();
            await page
                .frameLocator('#root iframe')
                .locator('.topbar-menu-wrapper li.menu-item.paytable')
                .click();

            await validateConsoleMessages(
                ExpectedMessage.PAY_TABLE,
                consoleMessages
            );
        });
    });
});
