import { expect, type Page } from '@playwright/test';
import { currencyStringToNumber } from '.';

export const getBalanceGameWindow = async (page: Page): Promise<number> => {
    const locatorTextContent = page
        .frameLocator('#root iframe')
        .locator('em.value.main-wallet')
        .textContent();

    expect(
        await locatorTextContent,
        `Checking if the balance in the game window is populated`
    ).toBeDefined();
    return currencyStringToNumber(await locatorTextContent);
};

export const getStakeAmountGameWindow = async (page: Page): Promise<number> => {
    const locatorTextContent = page
        .frameLocator('#root iframe')
        .locator('em.value.stake-wallet')
        .textContent();

    expect(
        await locatorTextContent,
        `Checking if the stake amount in the game window is populated`
    ).toBeDefined();
    return currencyStringToNumber(await locatorTextContent);
};

export const getWinAmountGameWindow = async (page: Page): Promise<number> => {
    const locatorTextContent = page
        .frameLocator('#root iframe')
        .locator('em.value.won-wallet')
        .textContent();

    expect(
        await locatorTextContent,
        `Checking if the win amount in the game window is populated`
    ).toBeDefined();

    return currencyStringToNumber(await locatorTextContent);
};

export const getWinLossAmountGameWindow = async (
    page: Page
): Promise<number> => {
    const locatorTextContent = page
        .frameLocator('#root iframe')
        .locator('em.value.gaming-session-profit-and-loss')
        .textContent();

    expect(
        await locatorTextContent,
        `Checking if the win loss amount in the game window is populated`
    ).toBeDefined();

    return currencyStringToNumber(await locatorTextContent);
};
