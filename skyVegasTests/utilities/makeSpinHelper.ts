import { type Page } from '@playwright/test';
import { validateConsoleMessages } from './validateConsoleMessagesHelper';
import { ExpectedMessage } from '../../types/expectedMessage';

export const firstSpin = async (page: Page, consoleMessages: string[]) => {
    await page.mouse.click(300, 300);

    await page.keyboard.press(' ', { delay: 500 });

    await page.keyboard.press(' ', { delay: 500 });

    await validateConsoleMessages(
        ExpectedMessage.END_SPIN,
        consoleMessages,
        true
    );
};

export const spin = async (page: Page, consoleMessages: string[]) => {
    await page.keyboard.press(' ', { delay: 500 });
    await validateConsoleMessages(
        ExpectedMessage.END_SPIN,
        consoleMessages,
        true
    );
};
