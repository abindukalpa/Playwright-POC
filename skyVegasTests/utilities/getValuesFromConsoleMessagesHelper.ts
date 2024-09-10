import { messageExists } from './messageExistsHelper';
import {
    deletePreviousConsoleMessages,
    validateConsoleMessages,
} from './validateConsoleMessagesHelper';

export const currencyStringToNumber = (
    currencyString: string | null
): number => {
    if (currencyString == null) {
        return 0;
    }
    // Remove any non-digit characters except for the decimal point
    const cleanedString = currencyString.replace(/[^\d.-]/g, '');
    // Convert the cleaned string to a number
    const numberValue = parseFloat(cleanedString);
    return Number(numberValue.toFixed(2));
};

export const getValueFromConsoleMessages = async (
    consoleMessages: string[],
    valueName: string
): Promise<number> => {
    await validateConsoleMessages(valueName, consoleMessages);
    const valueMessage = consoleMessages.find((_) => _.includes(valueName));

    if (valueMessage) {
        deletePreviousConsoleMessages(
            consoleMessages,
            messageExists(consoleMessages, valueName)
        );
        const value: RegExpMatchArray | null =
            valueMessage.match(/(\d+(\.\d+)?)/);
        if (value) {
            return Number(parseFloat(value[0]).toFixed(2));
        }
    }

    return 0;
};
