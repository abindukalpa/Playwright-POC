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

const getRealAmountFromConsoleMessages = (consoleMessages: string[]) : number => {
    const realAmountMessage = consoleMessages.find(_ => _.includes("realAmount"))
    
    if (realAmountMessage) {
        const realAmount: RegExpMatchArray | null = realAmountMessage.match(/"realAmount":(\d+(\.\d+)?)/);

        if (realAmount) {
            return parseFloat(realAmount[1]);
        } 
    }

    return 0
}

const getStakeAmountFromConsoleMessages = (consoleMessages: string[]) : number => {
    const stakeUpdateMessage = consoleMessages.find(_ => _.includes("stakeAmount"))
    
    if (stakeUpdateMessage) {
        const stakeUpdate: RegExpMatchArray | null = stakeUpdateMessage.match(/"stakeAmount":(\d+(\.\d+)?)/);

        if (stakeUpdate) {
            return parseFloat(stakeUpdate[1]);
        } 
    }

    return 0
}


let page: Page;
readGames().forEach((game) => {
    const consoleMessages: string[] = [];

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

            const startBalance = getRealAmountFromConsoleMessages(consoleMessages)
            const stakeAmount = getStakeAmountFromConsoleMessages(consoleMessages)
            console.log(startBalance)
            console.log(stakeAmount)

            await makeSpin(page, consoleMessages);

            await validateConsoleMessages(
                ExpectedMessage.END_SPIN,
                consoleMessages
            );

            const reversedConsoleMessages = consoleMessages.slice().reverse();
            const endBalance = getRealAmountFromConsoleMessages(reversedConsoleMessages)
            const endBalanceCalculated = startBalance - stakeAmount 


               
                console.log("startBalance: " + startBalance)
                console.log("stakeAmount: " + stakeAmount)
                console.log("endBalance: " + endBalance)
                console.log("endBalanceCalculated: " + endBalanceCalculated)
                
            expect(endBalanceCalculated).toEqual(endBalance)
        });
    });
});
