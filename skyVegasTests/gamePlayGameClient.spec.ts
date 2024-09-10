import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    login,
    startEventListener,
    firstSpin,
    readGames,
    spin,
    getValueFromConsoleMessages,
    currencyStringToNumber,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

let page: Page;
readGames().forEach((game) => {
    test.describe(`Testing with text: ${game}`, () => {
        test.beforeEach(async ({ browser }) => {
            test.setTimeout(300000);
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
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.main-wallet')
                    .textContent()
            );

            const stakeAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );

            const stakeAmountScreen = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.stake-wallet')
                    .textContent()
            );

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
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.won-wallet')
                    .textContent()
            );
            totalWinAmountScreen += winAmountScreen;

            while (winAmountConsole > 0 && winAmountScreen > 0) {
                await spin(page, consoleMessages);
                numberOfSpins++;

                winAmountConsole = await getValueFromConsoleMessages(
                    consoleMessages,
                    ExpectedMessage.WIN_UPDATE
                );
                totalWinAmountConsole += winAmountConsole;

                winAmountScreen = currencyStringToNumber(
                    await page
                        .frameLocator('#root iframe')
                        .locator('em.value.won-wallet')
                        .textContent()
                );
                totalWinAmountScreen += winAmountScreen;
            }

            const endBalanceConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );

            const endBalanceScreen = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.main-wallet')
                    .textContent()
            );

            const endWinLossAmountScreen = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.gaming-session-profit-and-loss')
                    .textContent()
            );

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

            expect(endBalanceScreenCalculated).toEqual(
                endBalanceConsoleCalculated
            );
        });

        test('gamePlayForWin', async () => {
            const consoleMessages: string[] = [];
            let numberOfSpins = 0;
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);

            const startBalanceConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );
            const startBallanceScreen = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.main-wallet')
                    .textContent()
            );

            const stakeAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );
            const stakeAmountScreen = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.stake-wallet')
                    .textContent()
            );

            await firstSpin(page, consoleMessages);
            numberOfSpins++;

            let winAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.WIN_UPDATE
            );
            let winAmountScreen = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.won-wallet')
                    .textContent()
            );

            while (winAmountConsole === 0 && winAmountScreen === 0) {
                await spin(page, consoleMessages);
                numberOfSpins++;

                winAmountConsole = await getValueFromConsoleMessages(
                    consoleMessages,
                    ExpectedMessage.WIN_UPDATE
                );

                winAmountScreen = currencyStringToNumber(
                    await page
                        .frameLocator('#root iframe')
                        .locator('em.value.won-wallet')
                        .textContent()
                );
            }

            const endBalanceConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );
            const endBalanceScreen = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.main-wallet')
                    .textContent()
            );

            const endBalanceConsoleCalculated = Number(
                (
                    startBalanceConsole -
                    stakeAmountConsole * numberOfSpins +
                    winAmountConsole
                ).toFixed(2)
            );
            const endBalanceScreenCalculated = Number(
                (
                    startBallanceScreen -
                    stakeAmountScreen * numberOfSpins +
                    winAmountScreen
                ).toFixed(2)
            );

            const endWinLossAmountConsole = Number(
                (winAmountConsole - stakeAmountConsole * numberOfSpins).toFixed(
                    2
                )
            );
            const endWinLossAmountScreen = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.gaming-session-profit-and-loss')
                    .textContent()
            );

            expect(endWinLossAmountConsole).toEqual(endWinLossAmountScreen);

            expect(endBalanceConsoleCalculated).toEqual(endBalanceConsole);

            expect(endBalanceScreenCalculated).toEqual(endBalanceScreen);

            expect(endBalanceScreenCalculated).toEqual(
                endBalanceConsoleCalculated
            );
        });
    });
});
