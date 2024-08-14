import { expect, type Page } from '@playwright/test';

export const validateConsoleMessages = async (
    page: Page,
    expectedMessage: string,
    consoleMessages: string[]
) => {
    if (expectedMessage === undefined) {
        throw new Error('expected message is null');
    }
    await expect(async () => {
        const messageExists = consoleMessages.some((msg) =>
            msg.includes(expectedMessage)
        );
        expect(messageExists).toBe(true);
    }).toPass({
        intervals: [5_000, 10_000, 15_000],
        timeout: 60_000,
    });
};
