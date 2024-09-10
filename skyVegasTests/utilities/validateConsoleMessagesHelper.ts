import { expect } from '@playwright/test';
import { messageExists } from '../utilities';

export const validateConsoleMessages = async (
    expectedMessage: string,
    consoleMessages: string[],
    deleteMessages = false,
    intervals: number[] = [5_000, 10_000, 15_000, 20_000],
    timeout = 60_000
) => {
    await expect(async (): Promise<void> => {
        const index = messageExists(consoleMessages, expectedMessage);
        const isValidated = index !== -1;
        if (isValidated && deleteMessages) {
            deletePreviousConsoleMessages(consoleMessages, index);
        }
        expect(isValidated).toBeTruthy();
    }).toPass({
        intervals: intervals,
        timeout: timeout,
    });
};

export const deletePreviousConsoleMessages = (
    consoleMessages: string[],
    index: number
): void => {
    consoleMessages.splice(0, index + 1);
};
