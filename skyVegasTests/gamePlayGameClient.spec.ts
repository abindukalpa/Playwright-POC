import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    login,
    startEventListener,
    firstSpin,
    readGames,
    spin,
    getValueFromConsoleMessages,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

const currencyStringToNumber = (currencyString: string): number => {
    // Remove any non-digit characters except for the decimal point
    const cleanedString = currencyString.replace(/[^\d.-]/g, '');
    // Convert the cleaned string to a number
    const numberValue = parseFloat(cleanedString);
    return numberValue;
};

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
            let numberOfSpins = 0;
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const startBalanceConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );

            const startBallanceScreen = currencyStringToNumber(
                (await page
                    .frameLocator('#root iframe')
                    .locator('em.value.main-wallet')
                    .textContent())!
            );

            const stakeAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );

            const stakeAmountScreen = currencyStringToNumber(
                (await page
                    .frameLocator('#root iframe')
                    .locator('em.value.stake-wallet')
                    .textContent())!
            );
            console.log('stakeAmountScreen ' + stakeAmountScreen);

            await firstSpin(page, consoleMessages);
            numberOfSpins++;

            let totalWinAmountConsole = 0;
            let winAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.WIN_UPDATE
            );
            totalWinAmountConsole += winAmountConsole;

            let totalWinAmountScreen = 0;
            let winAmountScreen = currencyStringToNumber(
                (await page
                    .frameLocator('#root iframe')
                    .locator('em.value.won-wallet')
                    .textContent())!
            );
            totalWinAmountScreen += winAmountScreen;

            while (winAmountConsole > 0) {
                await spin(page, consoleMessages);
                numberOfSpins++;

                winAmountConsole = await getValueFromConsoleMessages(
                    consoleMessages,
                    ExpectedMessage.WIN_UPDATE
                );
                totalWinAmountConsole += winAmountConsole;

                winAmountScreen = currencyStringToNumber(
                    (await page
                        .frameLocator('#root iframe')
                        .locator('em.value.won-wallet')
                        .textContent())!
                );
                totalWinAmountScreen += winAmountScreen;
            }

            const endBalanceConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );

            const endBalanceScreen = currencyStringToNumber(
                (await page
                    .frameLocator('#root iframe')
                    .locator('em.value.main-wallet')
                    .textContent())!
            );

            const endWinAmountScreen = currencyStringToNumber(
                (await page
                    .frameLocator('#root iframe')
                    .locator('em.value.won-wallet')
                    .textContent())!
            );
            console.log('endWinAmountScreen ' + endWinAmountScreen);

            const endWinLossAmountScreen = currencyStringToNumber(
                (await page
                    .frameLocator('#root iframe')
                    .locator('em.value.gaming-session-profit-and-loss')
                    .textContent())!
            );
            console.log('endWinLossAmountScreen ' + endWinLossAmountScreen);

            const endWinLossAmountConsole = Number(
                (
                    totalWinAmountConsole -
                    stakeAmountConsole * numberOfSpins
                ).toFixed(2)
            );

            const endBalanceConsoleCalculated = Number(
                (
                    startBalanceConsole -
                    stakeAmountConsole * numberOfSpins +
                    totalWinAmountConsole
                ).toFixed(2)
            );

            const endBalanceScreenCalculated = Number(
                (
                    startBallanceScreen -
                    stakeAmountScreen * numberOfSpins +
                    totalWinAmountScreen
                ).toFixed(2)
            );

            expect(endBalanceConsoleCalculated).toEqual(
                endBalanceScreenCalculated
            );

            expect(endWinLossAmountConsole).toEqual(endWinLossAmountScreen);

            expect(endBalanceConsoleCalculated).toEqual(endBalanceConsole);

            expect(endBalanceScreenCalculated).toEqual(endBalanceScreen);
        });

        test('gamePlayForWin', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const startBalance = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );
            const stakeAmount = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );
            let totalStakeAmount = stakeAmount;

            await firstSpin(page, consoleMessages);

            let winAmount = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.WIN_UPDATE
            );

            while (winAmount === 0) {
                await spin(page, consoleMessages);

                winAmount = await getValueFromConsoleMessages(
                    consoleMessages,
                    ExpectedMessage.WIN_UPDATE
                );

                totalStakeAmount += stakeAmount;
            }

            const consoleEndBalance = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );

            const endBalanceCalculated = Number(
                (startBalance - totalStakeAmount + winAmount).toFixed(2)
            );
            expect(endBalanceCalculated).toEqual(consoleEndBalance);
        });
    });
});
