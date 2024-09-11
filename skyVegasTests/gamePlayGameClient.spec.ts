import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    login,
    startEventListener,
    firstSpin,
    readGames,
    spin,
    getValueFromConsoleMessages,
    getBalanceGameWindow,
    getStakeAmountGameWindow,
    getWinAmountGameWindow,
    getWinLossAmountGameWindow,
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
            
            const startBalanceGameWindow = await getBalanceGameWindow(page)

            const stakeAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );

            const stakeAmountGameWindow = await getStakeAmountGameWindow(page)

            await firstSpin(page, consoleMessages);
            numberOfSpins++;

            let totalWinAmountConsole = 0;
            let winAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.WIN_UPDATE
            );
            totalWinAmountConsole += winAmountConsole;

            let totalWinAmountGameWindow = 0;
            let winAmountGameWindow = await getWinAmountGameWindow(page) 
            
            totalWinAmountGameWindow += winAmountGameWindow;

            while (winAmountConsole > 0 && winAmountGameWindow > 0) {
                await spin(page, consoleMessages);
                numberOfSpins++;

                winAmountConsole = await getValueFromConsoleMessages(
                    consoleMessages,
                    ExpectedMessage.WIN_UPDATE
                );
                totalWinAmountConsole += winAmountConsole;

                winAmountGameWindow = await getWinAmountGameWindow(page)
            
                totalWinAmountGameWindow += winAmountGameWindow;
            }

            const endBalanceConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );

            const endBalanceGameWindow = await getBalanceGameWindow(page) 

            const endWinLossAmountGameWindow = await getWinLossAmountGameWindow(page)

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

            const endBalanceGameWindowCalculated = Number(
                (
                    startBalanceGameWindow -
                    stakeAmountGameWindow * numberOfSpins +
                    totalWinAmountGameWindow
                ).toFixed(2)
            );

            expect(endBalanceConsoleCalculated).toEqual(
                endBalanceGameWindowCalculated
            );

            expect(endWinLossAmountConsole).toEqual(endWinLossAmountGameWindow);

            expect(endBalanceConsoleCalculated).toEqual(endBalanceConsole);

            expect(endBalanceGameWindowCalculated).toEqual(endBalanceGameWindow);

            expect(endBalanceGameWindowCalculated).toEqual(
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

            const startBalanceGameWindow = await getBalanceGameWindow(page)

            const stakeAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.STAKE_UPDATE
            );

            const stakeAmountGameWindow = await getStakeAmountGameWindow(page)

            await firstSpin(page, consoleMessages);
            numberOfSpins++;

            let winAmountConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.WIN_UPDATE
            );
            let winAmountGameWindow = await getWinAmountGameWindow(page)

            while (winAmountConsole === 0 && winAmountGameWindow === 0) {
                await spin(page, consoleMessages);
                numberOfSpins++;

                winAmountConsole = await getValueFromConsoleMessages(
                    consoleMessages,
                    ExpectedMessage.WIN_UPDATE
                );

                winAmountGameWindow = await getWinAmountGameWindow(page)
                
            }

            const endBalanceConsole = await getValueFromConsoleMessages(
                consoleMessages,
                ExpectedMessage.BALANCE_UPDATE
            );

            const endBalanceGameWindow = await getBalanceGameWindow(page)

            const endBalanceConsoleCalculated = Number(
                (
                    startBalanceConsole -
                    stakeAmountConsole * numberOfSpins +
                    winAmountConsole
                ).toFixed(2)
            );

            const endBalanceGameWindowCalculated = Number(
                (
                    startBalanceGameWindow -
                    stakeAmountGameWindow * numberOfSpins +
                    winAmountGameWindow
                ).toFixed(2)
            );

            const endWinLossAmountConsole = Number(
                (winAmountConsole - stakeAmountConsole * numberOfSpins).toFixed(
                    2
                )
            );
            const endWinLossAmountGameWindow = await getWinLossAmountGameWindow(page)

            expect(endWinLossAmountConsole).toEqual(endWinLossAmountGameWindow);

            expect(endBalanceConsoleCalculated).toEqual(endBalanceConsole);

            expect(endBalanceGameWindowCalculated).toEqual(endBalanceGameWindow);

            expect(endBalanceGameWindowCalculated).toEqual(
                endBalanceConsoleCalculated
            );
        });
    });
});
