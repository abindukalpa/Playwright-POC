import { type Page } from '@playwright/test';
import { validateConsoleMessages } from './validateConsoleMessagesHelper';
import { ExpectedMessage } from '../../types/expectedMessage';

export const makeSpin = async (page: Page, consoleMessages: string[]) => {
    await page.mouse.click(300, 300, { delay: 1000 });
    await page.keyboard.down('Enter');
    await page.waitForTimeout(2000)
    await page.keyboard.up('Enter');
    await page.waitForTimeout(2000)
    await page.keyboard.down('Enter');
    await page.waitForTimeout(2000)
    await page.keyboard.up('Enter');
    await validateConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);
    console.log("messages inside make spin")
    console.log(consoleMessages)
};


// make spin from main screen

// make spin while in the game