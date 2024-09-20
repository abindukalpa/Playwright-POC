import { type Page } from '@playwright/test';
import {
    deletePreviousConsoleMessages,
    validateConsoleMessages,
    recoverFromFreeSpins,
} from '.';
import { ExpectedMessage } from '../../types/expectedMessage';

export const spin = async (page: Page, consoleMessages: string[]) => {
    await page.keyboard.press(' ', { delay: 500 });

    await validateConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);

    await recoverFromFreeSpins(page, consoleMessages);

    deletePreviousConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);
};
