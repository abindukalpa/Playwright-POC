export const messageExists = (
    consoleMessages: string[],
    expectedMessage: string
): boolean => consoleMessages.some((msg) => msg.includes(expectedMessage));
