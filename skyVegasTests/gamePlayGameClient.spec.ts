import { test, type Page, expect } from '@playwright/test';
import {
    launchGame,
    login,
    validateConsoleMessages,
    startEventListener,
    makeSpin,
    readGames,
} from './utilities';
import { ExpectedMessage } from '../types/expectedMessage';

// TODO:

// we still need to make it work for a win scenario

// we need to also check the visuals

// refactor to combine the 2 functions, maybe even move them into a helper function

const getRealAmountFromConsoleMessages = (
    consoleMessages: string[],
    param: string = "realAmount"
): number => {
    const realAmountMessage = consoleMessages.find((_) =>
        _.includes('balanceUpdate')
    );

    if (realAmountMessage) {
        const realAmount: RegExpMatchArray | null = realAmountMessage.match(
            /"realAmount":(\d+(\.\d+)?)/
        );
        if (realAmount) {
            return Number(parseFloat(realAmount[1]).toFixed(2));
        }
    }

    return 0;
};

const getStakeAmountFromConsoleMessages = (
    consoleMessages: string[]
): number => {
    const stakeUpdateMessage = consoleMessages.find((_) =>
        _.includes('stakeAmount')
    );

    if (stakeUpdateMessage) {
        const stakeUpdate: RegExpMatchArray | null = stakeUpdateMessage.match(
            /"stakeAmount":(\d+(\.\d+)?)/
        );

        if (stakeUpdate) {
            return Number(parseFloat(stakeUpdate[1]).toFixed(2));
        }
    }

    return 0;
};


const getWinAmountFromConsoleMessages = (
    consoleMessages: string[]
): number => {
    const winUpdateMessage = consoleMessages.find((_) =>
        _.includes('winUpdate')
    );

    if (winUpdateMessage) {
       
        const winUpdate: RegExpMatchArray | null = winUpdateMessage.match(
            /"winAmount":(\d+(\.\d+)?)/
            ///(?<="winAmount":).*(?=\,)/
        );
        

        if (winUpdate) {
            return Number(parseFloat(winUpdate[1]).toFixed(2));
        }
     }

    return 0;
};

let page: Page;
readGames().forEach((game) => {
    let consoleMessages: string[] = [];

    test.describe(`Testing with text: ${game}`, () => {
        test.beforeAll(async ({ browser }) => {
            page = await browser.newPage();
            await login(page);
        });

        test.afterAll(async () => {
            await page.close();
        });

        test('gamePlay', async () => {
            startEventListener(page, consoleMessages);
            await launchGame(page, game, consoleMessages);

            const startBalance =
                getRealAmountFromConsoleMessages(consoleMessages);
            var stakeAmount = getStakeAmountFromConsoleMessages(consoleMessages);
            var totalStakeAmount = stakeAmount;
            console.log(startBalance);
            console.log(totalStakeAmount);

            await makeSpin(page, consoleMessages);


            var reversedConsoleMessages = consoleMessages.slice().reverse();
            
            var winAmount = getWinAmountFromConsoleMessages(reversedConsoleMessages)

            

            while(winAmount == 0) {
                consoleMessages.length = 0
                await makeSpin(page, consoleMessages)
                reversedConsoleMessages = consoleMessages.slice().reverse();

                validateConsoleMessages("balanceUpdate", consoleMessages);
                validateConsoleMessages("winUpdate", consoleMessages);
                
                winAmount = getWinAmountFromConsoleMessages(reversedConsoleMessages)
                console.log('winAmount inside loop: ' + winAmount);

                

                totalStakeAmount += stakeAmount
                console.log('totalStakeAmount inside loop: ' + totalStakeAmount);
                console.log(consoleMessages)
            }

            const consoleEndBalance = getRealAmountFromConsoleMessages(
                reversedConsoleMessages
            );
            var endBalanceCalculated = startBalance - totalStakeAmount + winAmount;


            
            
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

// spins too quickly after a win so win update not read

//total stake amount is doubled