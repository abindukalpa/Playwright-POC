import { expect } from '@playwright/test';
import { messageExists, getIndexOfExpectedMessage } from '.';

export const validateConsoleMessages = async (
    expectedMessage: string,
    consoleMessages: string[],
    intervals: number[] = [5_000, 10_000, 15_000, 20_000],
    timeout = 60_000
) => {
    await expect(async (): Promise<void> => {
        expect(
            messageExists(consoleMessages, expectedMessage),
            `Expected message ${expectedMessage} was not found in the console messages`
        ).toBeTruthy();
    }).toPass({
        intervals: intervals,
        timeout: timeout,
    });
};

export const deletePreviousConsoleMessages = (
    expectedMessage: string,
    consoleMessages: string[]
): void => {
    const index = getIndexOfExpectedMessage(consoleMessages, expectedMessage);
    consoleMessages.splice(0, index + 1);
};
