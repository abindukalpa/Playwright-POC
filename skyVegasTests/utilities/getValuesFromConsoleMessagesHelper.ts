import { messageExists } from './messageExistsHelper';
import {
    deletePreviousConsoleMessages,
    validateConsoleMessages,
} from './validateConsoleMessagesHelper';

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
