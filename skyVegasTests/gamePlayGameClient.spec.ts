import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    login,
    startEventListener,
    firstSpin,
    readGames,
    getBalanceFromConsoleMessages,
    getStakeAmountFromConsoleMessages,
    getWinAmountFromConsoleMessages,
    spin,
} from './utilities';

// TODO:

// we need to also check the visuals

// refactor to combine the 2 functions, maybe even move them into a helper function

let page: Page;
readGames().forEach((game) => {
    test.describe(`Testing with text: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterEach(async () => {
            await page.close();
        });

        test('gamePlayForLoss', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const startBalance =
                await getBalanceFromConsoleMessages(consoleMessages);
            const stakeAmount =
                await getStakeAmountFromConsoleMessages(consoleMessages);
            let totalStakeAmount = stakeAmount;
            console.log('startBalance: ' + startBalance);
            console.log('totalStakeAmount at the start: ' + totalStakeAmount);
            console.log('/n');

            await firstSpin(page, consoleMessages);

            let totalWinAmount = 0;
            let winAmount =
                await getWinAmountFromConsoleMessages(consoleMessages);
            totalWinAmount += winAmount;

            while (winAmount > 0) {
                await spin(page, consoleMessages);

                winAmount =
                    await getWinAmountFromConsoleMessages(consoleMessages);
                totalWinAmount += winAmount;

                console.log('winAmount inside loop: ' + winAmount);

                totalStakeAmount += stakeAmount;

                console.log(
                    'totalStakeAmount inside loop: ' + totalStakeAmount
                );

                console.log(consoleMessages);
            }

            const consoleEndBalance =
                await getBalanceFromConsoleMessages(consoleMessages);

            const endBalanceCalculated = Number(
                (startBalance - totalStakeAmount + totalWinAmount).toFixed(2)
            );

            console.log('startBalance: ' + startBalance);
            console.log('stakeAmount: ' + totalStakeAmount);
            console.log('consoleEndBalance: ' + consoleEndBalance);
            console.log('winAmount: ' + totalWinAmount);
            console.log('endBalanceCalculated: ' + endBalanceCalculated);

            expect(endBalanceCalculated).toEqual(consoleEndBalance);
        });

        test('gamePlayForWin', async () => {
            const consoleMessages: string[] = [];
            let counter = 0;
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const startBalance =
                await getBalanceFromConsoleMessages(consoleMessages);
            const stakeAmount =
                await getStakeAmountFromConsoleMessages(consoleMessages);
            let totalStakeAmount = stakeAmount;
            console.log('startBalance: ' + startBalance);
            console.log('totalStakeAmount at the start: ' + totalStakeAmount);

            counter++;
            console.log('spin ' + counter);
            console.log('console ' + consoleMessages);
            await firstSpin(page, consoleMessages);

            let winAmount =
                await getWinAmountFromConsoleMessages(consoleMessages);

            while (winAmount === 0) {
                counter++;
                console.log('spin ' + counter);
                await spin(page, consoleMessages);

                winAmount =
                    await getWinAmountFromConsoleMessages(consoleMessages);

                totalStakeAmount += stakeAmount;

                if (winAmount === 0) {
                    console.log('Spin one more time!');
                } else {
                    console.log('Stop spinning!');
                }
            }

            const consoleEndBalance =
                await getBalanceFromConsoleMessages(consoleMessages);

            const endBalanceCalculated = Number(
                (startBalance - totalStakeAmount + winAmount).toFixed(2)
            );

            console.log('startBalance: ' + startBalance);
            console.log('totalStakeAmount: ' + totalStakeAmount);
            console.log('consoleEndBalance: ' + consoleEndBalance);
            console.log('winAmount: ' + winAmount);
            console.log('endBalanceCalculated: ' + endBalanceCalculated);

            expect(endBalanceCalculated).toEqual(consoleEndBalance);
        });
    });
});

// Test timeout a problem
