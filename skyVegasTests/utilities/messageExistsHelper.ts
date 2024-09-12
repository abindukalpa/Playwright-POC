export const messageExists = (
    consoleMessages: string[],
    expectedMessage: string
): boolean =>
    consoleMessages.some((message: string) =>
        message.includes(expectedMessage)
    );

export const getIndexOfExpectedMessage = (
    consoleMessages: string[],
    expectedMessage: string
): number =>
    consoleMessages.findIndex((message: string) =>
        message.includes(expectedMessage)
    );
