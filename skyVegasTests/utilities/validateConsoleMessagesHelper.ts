import { expect } from '@playwright/test';
import { messageExists } from '../utilities';

export const validateConsoleMessages = async (
    expectedMessage: string,
    consoleMessages: string[],
    intervals: number[] = [...Array(60).map(_ => (_+1) * 1000)],
    timeout = 60_000
) => {
    await expect(async () => {
        console.log(consoleMessages.length)
        expect(messageExists(consoleMessages, expectedMessage)).toBe(true);
    }).toPass({
        intervals: intervals,
        timeout: timeout,
    });
};
