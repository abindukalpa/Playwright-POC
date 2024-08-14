import { test, type Page } from '@playwright/test';
import { launchGame, validateConsoleMessages, login } from './utilities';
import * as fs from 'fs';

test.describe.configure({ mode: 'serial' });
const consoleMessages: string[] = [];
let expectedMessages;
let page: Page;
const games = JSON.parse(fs.readFileSync('games.json', 'utf-8'));
games.forEach((game) => {
    test.describe(`Testing with text: ${game}`, () => {
        test.beforeAll(async ({ browser }) => {
            const data = fs.readFileSync(
                'ExpectedSlotConsoleMessages.json',
                'utf-8'
            );
            expectedMessages = JSON.parse(data);
            page = await browser.newPage();
            await login(page);
        });

        test.afterAll(async () => {
            await page.close();
        });

        /* eslint-disable-next-line no-empty-pattern */
        test('Test sound toggle', async ({}) => {
            /* eslint-enable-next-line no-empty-pattern */
            page.on('console', (msg) => {
                consoleMessages.push(msg.text());
            });
            await launchGame(page, game);
            if (expectedMessages.soundCheckMessageToolBarOn) {
                await page
                    .frameLocator('#root iframe')
                    .locator('i')
                    .nth(2)
                    .click();
                validateConsoleMessages(
                    page,
                    expectedMessages.soundCheckMessageToolBarOff,
                    consoleMessages
                );
            } else if (expectedMessages.soundCheckMessageToolBarOff) {
                await page
                    .frameLocator('#root iframe')
                    .locator('i')
                    .nth(2)
                    .click();
                validateConsoleMessages(
                    page,
                    expectedMessages.soundCheckMessageToolBarOn,
                    consoleMessages
                );
            }
        });
    });
});
