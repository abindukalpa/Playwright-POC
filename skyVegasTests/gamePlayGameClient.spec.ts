import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    login,
    validateConsoleMessages,
    startEventListener,
    makeSpin,
    readGames,
    getBalanceFromConsoleMessages,
    getStakeAmountFromConsoleMessages,
    getWinAmountFromConsoleMessages
} from './utilities';

// TODO:

// we need to also check the visuals

// refactor to combine the 2 functions, maybe even move them into a helper function

let page: Page;
readGames().forEach((game) => {

    test.describe(`Testing with text: ${game}`, () => {
        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterAll(async () => {
            await page.close();
        });

        test.skip('gamePlayForLoss', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);
            await launchGame(page, game, consoleMessages);

            const startBalance = getBalanceFromConsoleMessages(consoleMessages);
            const stakeAmount =
                getStakeAmountFromConsoleMessages(consoleMessages);

            let totalStakeAmount = stakeAmount;

            console.log(startBalance);
            console.log(totalStakeAmount);

            await makeSpin(page, consoleMessages);

            let reversedConsoleMessages = consoleMessages.slice().reverse();

            let winAmount = getWinAmountFromConsoleMessages(
                reversedConsoleMessages
            );

            while (winAmount > 0) {
                consoleMessages.length = 0;
                await makeSpin(page, consoleMessages);
                reversedConsoleMessages = consoleMessages.slice().reverse();

                validateConsoleMessages('balanceUpdate', consoleMessages);
                validateConsoleMessages('winUpdate', consoleMessages);

                winAmount = getWinAmountFromConsoleMessages(
                    reversedConsoleMessages
                );
                console.log('winAmount inside loop: ' + winAmount);

                totalStakeAmount += stakeAmount;
                console.log(
                    'totalStakeAmount inside loop: ' + totalStakeAmount
                );
                console.log(consoleMessages);
            }

            const consoleEndBalance = getBalanceFromConsoleMessages(
                reversedConsoleMessages
            );
            const endBalanceCalculated =
                startBalance - totalStakeAmount + winAmount;

            console.log('startBalance: ' + startBalance);
            console.log('stakeAmount: ' + totalStakeAmount);
            console.log('consoleEndBalance: ' + consoleEndBalance);
            console.log('winAmount: ' + winAmount);
            console.log('endBalanceCalculated: ' + endBalanceCalculated);

            expect(endBalanceCalculated).toEqual(consoleEndBalance);
        });

        test('gamePlayForWin', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const startBalance = getBalanceFromConsoleMessages(consoleMessages);
            const stakeAmount =
                getStakeAmountFromConsoleMessages(consoleMessages);
            let totalStakeAmount = stakeAmount;
            console.log(startBalance);
            console.log(totalStakeAmount);

            await makeSpin(page, consoleMessages);

            let reversedConsoleMessages = consoleMessages.slice().reverse();

            let winAmount = getWinAmountFromConsoleMessages(
                reversedConsoleMessages
            );

            while (winAmount == 0) {
                consoleMessages.length = 0;
                await makeSpin(page, consoleMessages);
                //doesn't work past here
                reversedConsoleMessages = consoleMessages.slice().reverse();

                winAmount = getWinAmountFromConsoleMessages(
                    reversedConsoleMessages
                );
                console.log('winAmount inside loop: ' + winAmount);

                totalStakeAmount += stakeAmount;
                console.log(
                    'totalStakeAmount inside loop: ' + totalStakeAmount
                );
                console.log(consoleMessages);
            }

            const consoleEndBalance = getBalanceFromConsoleMessages(
                reversedConsoleMessages
            );
            const endBalanceCalculated =
                startBalance - totalStakeAmount + winAmount;

            console.log('startBalance: ' + startBalance);
            console.log('stakeAmount: ' + totalStakeAmount);
            console.log('consoleEndBalance: ' + consoleEndBalance);
            console.log('winAmount: ' + winAmount);
            console.log('endBalanceCalculated: ' + endBalanceCalculated);

            expect(endBalanceCalculated).toEqual(consoleEndBalance);
        });
    });
});

// Test timeout a problem
