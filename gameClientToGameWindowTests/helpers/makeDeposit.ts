import { Browser } from '@playwright/test';
import { config } from '../../config/config';

export const makeDeposit = async (browser: Browser) => {
    const userCreationPage = await browser.newPage();
    await userCreationPage.goto('https://uct.dev.betfair/');
    await userCreationPage.getByRole('link', { name: 'Make Deposit' }).click();
    await userCreationPage.getByRole('combobox').selectOption('SKYBET');
    await userCreationPage
        .getByRole('row', { name: 'Account ID' })
        .getByRole('textbox')
        .fill(config.getAccountID());
    await userCreationPage
        .getByRole('row', { name: 'Amount' })
        .getByRole('textbox')
        .fill('10');
    await userCreationPage.getByRole('button', { name: 'Deposit' }).click();
    await userCreationPage.close();
};
