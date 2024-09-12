import { type Page } from '@playwright/test';
import { deletePreviousConsoleMessages, validateConsoleMessages } from '.';
import { ExpectedMessage } from '../../types/expectedMessage';

export const firstSpin = async (page: Page, consoleMessages: string[]) => {
    await page.mouse.click(300, 300);

    await page.keyboard.press(' ', { delay: 500 });

    await page.keyboard.press(' ', { delay: 500 });

    await validateConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);

    deletePreviousConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);
};

export const spin = async (page: Page, consoleMessages: string[]) => {
    await page.keyboard.press(' ', { delay: 500 });
    await validateConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);
    deletePreviousConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);
};
