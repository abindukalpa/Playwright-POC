import { test, expect, type Page } from '@playwright/test';
import {
    launchGame,
    login,
    startEventListener,
    readGames,
    getValueFromConsoleMessages,
    getStakeAmountGameWindow,
} from './helpers';
import { Account, ExpectedMessage } from '../types';
import { config } from '../config/config';

let page: Page;
const accounts: Account[] = config.getAccounts();
readGames().forEach((game: string) => {
    test.describe(`Testing with game: ${game}`, async () => {
        test.beforeEach(async ({ browser }) => {
            const workerNumber = test.info().parallelIndex;
            const account: Account = accounts[workerNumber];
            page = await browser.newPage();
            await login(page, account.username, account.password);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('increase stake', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const stakeAmountGameWindowStart =
                await getStakeAmountGameWindow(page);
            const stakeUpdateConsoleStart = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );

            await page.mouse.click(300, 300, { delay: 1000 });

            await page.keyboard.press('ArrowRight', { delay: 1000 });

            await expect(async () => {
                const filteredStakeUpdateMessages = consoleMessages.filter(
                    (_) => _.includes(ExpectedMessage.STAKE_UPDATE)
                );

                const lastStakeUpdateMessage =
                    filteredStakeUpdateMessages[
                        filteredStakeUpdateMessages.length - 1
                    ];

                const stakeAmountGameWindowEnd =
                    await getStakeAmountGameWindow(page);
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages(
                    [lastStakeUpdateMessage],
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
            }).toPass({ intervals: [2_000, 5_000, 10_000] });
        });

        test('decrease stake', async () => {
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

            await page.keyboard.press('ArrowRight', { delay: 1000 });

            await page.keyboard.press('ArrowLeft', { delay: 1000 });

            await expect(async () => {
                const filteredStakeUpdateMessages = consoleMessages.filter(
                    (_) => _.includes(ExpectedMessage.STAKE_UPDATE)
                );

                const lastStakeUpdateMessage =
                    filteredStakeUpdateMessages[
                        filteredStakeUpdateMessages.length - 1
                    ];

                const stakeAmountGameWindowEnd =
                    await getStakeAmountGameWindow(page);
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages(
                    [lastStakeUpdateMessage],
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
            }).toPass({ intervals: [2_000, 5_000, 10_000] });
        });

        test('max stake', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            await page.mouse.click(300, 300, { delay: 1000 });

            for (let i = 0; i < 150; i++) {
                await page.keyboard.press('ArrowRight', { delay: 10 });
            }

            await expect(async () => {
                const filteredStakeUpdateMessages = consoleMessages.filter(
                    (_) => _.includes(ExpectedMessage.STAKE_UPDATE)
                );

                const lastStakeUpdateMessage =
                    filteredStakeUpdateMessages[
                        filteredStakeUpdateMessages.length - 1
                    ];

                const stakeAmountGameWindowEnd =
                    await getStakeAmountGameWindow(page);
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages(
                    [lastStakeUpdateMessage],
                    ExpectedMessage.STAKE_UPDATE
                );

                expect(stakeUpdateConsoleEnd).toBeLessThanOrEqual(10);
                expect(stakeAmountGameWindowEnd).toBeLessThanOrEqual(10);
            }).toPass({ intervals: [2_000, 5_000, 10_000] });
        });
    });
});
