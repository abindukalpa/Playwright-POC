import { type Page } from '@playwright/test';
import { validateConsoleMessages } from './validateConsoleMessagesHelper';
import { ExpectedMessage } from '../../types/expectedMessage';

export const makeSpin = async (page: Page, consoleMessages: string[]) => {
    await page.mouse.click(300, 300, { delay: 10 });
    await page.keyboard.press('Enter', { delay: 2000 });
    await page.keyboard.press('Enter', { delay: 10 });
    await validateConsoleMessages(ExpectedMessage.START_SPIN, consoleMessages);
};
