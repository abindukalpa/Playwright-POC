import { type Page } from '@playwright/test';
import {
    deletePreviousConsoleMessages,
    recoverFromFreeSpins,
    validateConsoleMessages,
} from '.';
import { ExpectedMessage } from '../../types';

export const spin = async (page: Page, consoleMessages: string[]) => {
    recoverFromFreeSpins(page, consoleMessages);

    await page.keyboard.press(' ', { delay: 500 });

    await validateConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);

    deletePreviousConsoleMessages(ExpectedMessage.END_SPIN, consoleMessages);
};
