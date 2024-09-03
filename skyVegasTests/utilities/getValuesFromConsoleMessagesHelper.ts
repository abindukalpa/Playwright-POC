import { messageExists } from './messageExistsHelper';
import {
    deletePreviousConsoleMessages,
    validateConsoleMessages,
} from './validateConsoleMessagesHelper';

export const getBalanceFromConsoleMessages = async (
    consoleMessages: string[]
): Promise<number> => {
    await validateConsoleMessages('balanceUpdate', consoleMessages);
    const realAmountMessage = consoleMessages.find((_) =>
        _.includes('balanceUpdate')
    );

    if (realAmountMessage) {
        // delete realAmountMessage messages here
        deletePreviousConsoleMessages(
            consoleMessages,
            messageExists(consoleMessages, 'balanceUpdate')
        );
        const realAmount: RegExpMatchArray | null = realAmountMessage.match(
            /"realAmount":(\d+(\.\d+)?)/
        );
        if (realAmount) {
            return Number(parseFloat(realAmount[1]).toFixed(2));
        }
    }

    return 0;
};

export const getStakeAmountFromConsoleMessages = async (
    consoleMessages: string[]
): Promise<number> => {
    await validateConsoleMessages('stakeAmount', consoleMessages);
    const stakeUpdateMessage = consoleMessages.find((_) =>
        _.includes('stakeAmount')
    );

    if (stakeUpdateMessage) {
        deletePreviousConsoleMessages(
            consoleMessages,
            messageExists(consoleMessages, 'stakeAmount')
        );
        const stakeUpdate: RegExpMatchArray | null = stakeUpdateMessage.match(
            /"stakeAmount":(\d+(\.\d+)?)/
        );

        if (stakeUpdate) {
            return Number(parseFloat(stakeUpdate[1]).toFixed(2));
        }
    }

    return 0;
};

export const getWinAmountFromConsoleMessages = async (
    consoleMessages: string[]
): Promise<number> => {
    await validateConsoleMessages('winUpdate', consoleMessages);
    const winUpdateMessage = consoleMessages.find((_) =>
        _.includes('winUpdate')
    );

    if (winUpdateMessage) {
        deletePreviousConsoleMessages(
            consoleMessages,
            messageExists(consoleMessages, 'winUpdate')
        );
        const winUpdate: RegExpMatchArray | null = winUpdateMessage.match(
            /"winAmount":(\d+(\.\d+)?)/
            ///(?<="winAmount":).*(?=\,)/
        );

        if (winUpdate) {
            return Number(parseFloat(winUpdate[1]).toFixed(2));
        }
    }

    return 0;
};
