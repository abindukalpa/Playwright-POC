import { type Page } from '@playwright/test';
import { currencyStringToNumber } from "./getValuesFromConsoleMessagesHelper";


export const getBalanceGameWindow = async (page: Page): Promise<number> => {
    return currencyStringToNumber(
        await page
            .frameLocator('#root iframe')
            .locator('em.value.main-wallet')
            .textContent()
    );
}

export const getStakeAmountGameWindow = async (page: Page): Promise<number> => {
    return currencyStringToNumber(
        await page
            .frameLocator('#root iframe')
            .locator('em.value.stake-wallet')
            .textContent()
    );
}

export const getWinAmountGameWindow = async (page: Page): Promise<number> => {
    return currencyStringToNumber(
        await page
            .frameLocator('#root iframe')
            .locator('em.value.won-wallet')
            .textContent()
    );
}

export const getWinLossAmountGameWindow = async (page: Page): Promise<number> => {
    return currencyStringToNumber(
        await page
            .frameLocator('#root iframe')
            .locator('em.value.gaming-session-profit-and-loss')
            .textContent()
    );
}
