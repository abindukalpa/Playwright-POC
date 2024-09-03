export const messageExists = (
    consoleMessages: string[],
    expectedMessage: string
): number => consoleMessages.findIndex((msg) => msg.includes(expectedMessage));
