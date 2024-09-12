import {
    validateConsoleMessages,
    numberToTwoDecimalPlaces,
    deletePreviousConsoleMessages,
} from '.';

export const getValueFromConsoleMessages = async (
    consoleMessages: string[],
    valueName: string
): Promise<number> => {
    await validateConsoleMessages(valueName, consoleMessages);
    const valueMessage = consoleMessages.find((_) => _.includes(valueName));

    if (valueMessage) {
        deletePreviousConsoleMessages(valueName, consoleMessages);
        const value: RegExpMatchArray | null =
            valueMessage.match(/(\d+(\.\d+)?)/);
        if (value) {
            return numberToTwoDecimalPlaces(parseFloat(value[0]));
        }
    }

    return 0;
};
