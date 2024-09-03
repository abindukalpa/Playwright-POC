import { validateConsoleMessages } from "./validateConsoleMessagesHelper";

export const getBalanceFromConsoleMessages = (
    consoleMessages: string[],
): number => {
    validateConsoleMessages('balanceUpdate', consoleMessages);
    const realAmountMessage = consoleMessages.find((_) =>
        _.includes('balanceUpdate')
    );

    if (realAmountMessage) {
        const realAmount: RegExpMatchArray | null = realAmountMessage.match(
            /"realAmount":(\d+(\.\d+)?)/
        );
        if (realAmount) {
            return Number(parseFloat(realAmount[1]).toFixed(2));
        }
    }

    return 0;
};

export const getStakeAmountFromConsoleMessages = (
    consoleMessages: string[]
): number => {
    validateConsoleMessages('stakeAmount', consoleMessages);
    const stakeUpdateMessage = consoleMessages.find((_) =>
        _.includes('stakeAmount')
    );

    if (stakeUpdateMessage) {
        const stakeUpdate: RegExpMatchArray | null = stakeUpdateMessage.match(
            /"stakeAmount":(\d+(\.\d+)?)/
        );

        if (stakeUpdate) {
            return Number(parseFloat(stakeUpdate[1]).toFixed(2));
        }
    }

    return 0;
};

export const getWinAmountFromConsoleMessages = (
    consoleMessages: string[]
): number => {
    validateConsoleMessages('winUpdate', consoleMessages);
    const winUpdateMessage = consoleMessages.find((_) =>
        _.includes('winUpdate')
    );

    if (winUpdateMessage) {
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
