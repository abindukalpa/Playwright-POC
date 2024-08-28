import { expect } from '@playwright/test';
import { messageExists } from '../utilities';

export const validateConsoleMessages = async (
    expectedMessage: string,
    consoleMessages: string[],
    intervals?: number[],
    timeout?: number
) => {
    if (expectedMessage === undefined) {
        throw new Error('expected message is null');
    }

    if (intervals === undefined) {
        intervals = [5_000, 10_000, 15_000];
    }

    if (timeout === undefined) {
        timeout = 60_000;
    }

    await expect(async () => {
        expect(messageExists(consoleMessages, expectedMessage)).toBe(true);
    }).toPass({
        intervals: intervals,
        timeout: timeout,
    });
};
