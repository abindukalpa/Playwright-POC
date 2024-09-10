import { test,expect, type Page } from '@playwright/test';
import {
    launchGame,
    login,
    startEventListener,
    readGames,
    getValueFromConsoleMessages,
    currencyStringToNumber
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

            const stakeAmountScreenStart = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.stake-wallet')
                    .textContent()
            );
            const stakeUpdateConsoleStart = await getValueFromConsoleMessages(consoleMessages, ExpectedMessage.STAKE_UPDATE)

            await page.mouse.click(300, 300, { delay: 10 });

            await page.keyboard.press('Enter', { delay: 500 });
            
            await page.keyboard.press('ArrowRight', { delay: 500 });
    
            await expect(async () => {
                const lastMessageFromConsoleMessages = consoleMessages[consoleMessages.length - 1]
                expect(lastMessageFromConsoleMessages).toContain(ExpectedMessage.STAKE_UPDATE)
                const stakeAmountScreenEnd = currencyStringToNumber(
                    await page
                        .frameLocator('#root iframe')
                        .locator('em.value.stake-wallet')
                        .textContent()
                );
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages([lastMessageFromConsoleMessages], ExpectedMessage.STAKE_UPDATE)
                expect(stakeUpdateConsoleEnd - stakeUpdateConsoleStart).toBeGreaterThan(0)
                expect(stakeAmountScreenEnd - stakeAmountScreenStart).toBeGreaterThan(0)
                expect(stakeAmountScreenStart).toEqual(stakeUpdateConsoleStart)
                expect(stakeAmountScreenEnd).toEqual(stakeUpdateConsoleEnd)
            }).toPass();
        });

        test('stakeUpdateDecrease', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);
            
            const stakeAmountScreenStart = currencyStringToNumber(
                await page
                    .frameLocator('#root iframe')
                    .locator('em.value.stake-wallet')
                    .textContent()
            );
            const stakeUpdateConsoleStart = await getValueFromConsoleMessages(consoleMessages, ExpectedMessage.STAKE_UPDATE)

            await page.mouse.click(300, 300, { delay: 10 });

            await page.keyboard.press('Enter', { delay: 500 });
            
            await page.keyboard.press('ArrowRight', { delay: 500 });
            
            await page.keyboard.press('ArrowLeft', { delay: 500 });
    

            await expect(async () => {
                const lastMessageFromConsoleMessages = consoleMessages[consoleMessages.length - 1]
                expect(lastMessageFromConsoleMessages).toContain(ExpectedMessage.STAKE_UPDATE)
                const stakeAmountScreenEnd = currencyStringToNumber(
                    await page
                        .frameLocator('#root iframe')
                        .locator('em.value.stake-wallet')
                        .textContent()
                );
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages([lastMessageFromConsoleMessages], ExpectedMessage.STAKE_UPDATE)
                expect(stakeUpdateConsoleEnd - stakeUpdateConsoleStart).toBe(0)
                expect(stakeAmountScreenEnd - stakeAmountScreenStart).toBe(0)
                expect(stakeAmountScreenStart).toEqual(stakeUpdateConsoleStart)
                expect(stakeAmountScreenEnd).toEqual(stakeUpdateConsoleEnd)
            }).toPass();
        });

        test('stakeMaxLimit', async () => {
            const consoleMessages: string[] = [];
            startEventListener(page, consoleMessages);

            await launchGame(page, game, consoleMessages);
        
            await page.mouse.click(300, 300, { delay: 10 });

            await page.keyboard.press('Enter', { delay: 500 });
            
            for (let i = 0; i<150; i++) {
                await page.keyboard.press('ArrowRight', { delay: 50 })
            }

            await expect(async () => {
                const lastMessageFromConsoleMessages = consoleMessages[consoleMessages.length - 1]
                expect(lastMessageFromConsoleMessages).toContain(ExpectedMessage.STAKE_UPDATE)
                const stakeAmountScreenEnd = currencyStringToNumber(
                    await page
                        .frameLocator('#root iframe')
                        .locator('em.value.stake-wallet')
                        .textContent()
                );
                const stakeUpdateConsoleEnd = await getValueFromConsoleMessages([lastMessageFromConsoleMessages], ExpectedMessage.STAKE_UPDATE)

                console.log("stakeUpdateConsoleEnd " + stakeUpdateConsoleEnd)
                console.log("stakeAmountScreenEnd " + stakeAmountScreenEnd)
                expect(stakeUpdateConsoleEnd).toBeLessThanOrEqual(10)
                expect(stakeAmountScreenEnd).toBeLessThanOrEqual(10)
            }).toPass();
        });
    });
});