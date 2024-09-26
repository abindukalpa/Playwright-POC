import { expect } from '@playwright/test';
import { messageExists, getIndexOfExpectedMessage } from '.';

export const validateConsoleMessages = async (
    expectedMessage: string,
    consoleMessages: string[]
) => {
    await expect(async (): Promise<void> => {
        expect(
            messageExists(consoleMessages, expectedMessage),
            `Expected message ${expectedMessage} was not found in the console messages`
        ).toBeTruthy();
    }).toPass({
        intervals: [1_000, 5_000, 10_000],
        timeout: 60_000,
    });
};

export const deletePreviousConsoleMessages = (
    expectedMessage: string,
    consoleMessages: string[]
): void => {
    const index = getIndexOfExpectedMessage(consoleMessages, expectedMessage);
    consoleMessages.splice(0, index + 1);
};
