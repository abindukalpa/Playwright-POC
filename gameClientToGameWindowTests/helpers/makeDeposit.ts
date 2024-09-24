import { Browser } from '@playwright/test';
import { config } from '../../config/config';

export const makeDeposit = async (browser: Browser, accountId: string) => {
    console.log('AccountId: ' + accountId);
    const userCreationPage = await browser.newPage();
    await userCreationPage.goto(config.getUserCreationToolURL());
    await userCreationPage.getByRole('link', { name: 'Make Deposit' }).click();
    await userCreationPage.getByRole('combobox').selectOption('SKYBET');
    await userCreationPage
        .getByRole('row', { name: 'Account ID' })
        .getByRole('textbox')
        .fill(accountId);
    await userCreationPage
        .getByRole('row', { name: 'Amount' })
        .getByRole('textbox')
        .fill('10');
    await userCreationPage.getByRole('button', { name: 'Deposit' }).click();
    await userCreationPage.close();
};
