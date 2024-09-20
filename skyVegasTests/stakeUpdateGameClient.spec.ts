import { test, expect, type Page } from '@playwright/test';
import {
    launchGame,
    login,
    startEventListener,
    readGames,
    getValueFromConsoleMessages,
    getStakeAmountGameWindow,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

let page: Page;
readGames().forEach((game) => {
    test.describe(`Testing with text: ${game}`, async () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('stakeUpdateIncrease', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const stakeAmountGameWindowStart =
                await getStakeAmountGameWindow(page);
            const stakeUpdateConsoleStart = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );

            await page.mouse.click(300, 300, { delay: 10 });

            await page.keyboard.press('ArrowRight', { delay: 500 });

            await expect(async () => {
                const lastMessageFromConsoleMessages =
                    consoleMessages[consoleMessages.length - 1];

                expect(lastMessageFromConsoleMessages).toContain(
                    ExpectedMessage.STAKE_UPDATE
                );

                const stakeAmountGameWindowEnd =
                    await getStakeAmountGameWindow(page);
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages(
                    [lastMessageFromConsoleMessages],
                    ExpectedMessage.STAKE_UPDATE
                );

                expect(
                    stakeUpdateConsoleEnd - stakeUpdateConsoleStart
                ).toBeGreaterThan(0);
                expect(
                    stakeAmountGameWindowEnd - stakeAmountGameWindowStart
                ).toBeGreaterThan(0);
                expect(stakeAmountGameWindowStart).toEqual(
                    stakeUpdateConsoleStart
                );
                expect(stakeAmountGameWindowEnd).toEqual(stakeUpdateConsoleEnd);
            }).toPass();
        });

        test('stakeUpdateDecrease', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const stakeAmountGameWindowStart =
                await getStakeAmountGameWindow(page);
            const stakeUpdateConsoleStart = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );

            await page.mouse.click(300, 300, { delay: 10 });

            await page.keyboard.press('ArrowRight', { delay: 500 });

            await page.keyboard.press('ArrowLeft', { delay: 500 });

            await expect(async () => {
                const lastMessageFromConsoleMessages =
                    consoleMessages[consoleMessages.length - 1];

                expect(lastMessageFromConsoleMessages).toContain(
                    ExpectedMessage.STAKE_UPDATE
                );

                const stakeAmountGameWindowEnd =
                    await getStakeAmountGameWindow(page);
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages(
                    [lastMessageFromConsoleMessages],
                    ExpectedMessage.STAKE_UPDATE
                );

                expect(stakeUpdateConsoleEnd).toEqual(stakeUpdateConsoleStart);

                expect(stakeAmountGameWindowEnd).toEqual(
                    stakeAmountGameWindowStart
                );

                expect(stakeAmountGameWindowStart).toEqual(
                    stakeUpdateConsoleStart
                );

                expect(stakeAmountGameWindowEnd).toEqual(stakeUpdateConsoleEnd);
            }).toPass();
        });

        test('stakeMaxLimit', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            await page.mouse.click(300, 300, { delay: 10 });

            for (let i = 0; i < 150; i++) {
                await page.keyboard.press('ArrowRight', { delay: 50 });
            }

            await expect(async () => {
                const lastMessageFromConsoleMessages =
                    consoleMessages[consoleMessages.length - 1];

                expect(lastMessageFromConsoleMessages).toContain(
                    ExpectedMessage.STAKE_UPDATE
                );

                const stakeAmountGameWindowEnd =
                    await getStakeAmountGameWindow(page);
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages(
                    [lastMessageFromConsoleMessages],
                    ExpectedMessage.STAKE_UPDATE
                );

                expect(stakeUpdateConsoleEnd).toBeLessThanOrEqual(10);
                expect(stakeAmountGameWindowEnd).toBeLessThanOrEqual(10);
            }).toPass();
        });
    });
});
