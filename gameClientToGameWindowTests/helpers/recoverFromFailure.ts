import { Page, expect } from '@playwright/test';
import { messageExists } from '.';
import { ExpectedMessage } from '../../types';

export const recoverFromFreeSpins = async (
    page: Page,
    consoleMessages: string[]
): Promise<void> => {
    const playModeUpdateConsoleMessages: string[] = consoleMessages.filter(
        (_) => _.includes(ExpectedMessage.PLAY_MODE_UPDATE)
    );
    const isFreeSpinModeOn: boolean = playModeUpdateConsoleMessages.some((_) =>
        _.includes(ExpectedMessage.FREE_SPIN_PLAY_MODE_UPDATE)
    );

    const isBonusRound: boolean = playModeUpdateConsoleMessages.some((_) =>
        _.includes(ExpectedMessage.BONUS_ROUND_MODE_UPDATE)
    );

    if (isFreeSpinModeOn || isBonusRound) {
        await expect(async (): Promise<void> => {
            await page.mouse.click(300, 300, { delay: 200 });
            await page.keyboard.press(' ', { delay: 200 });

            expect(
                messageExists(
                    consoleMessages,
                    ExpectedMessage.NORMAL_PLAY_MODE_UPDATE
                ),
                `Expected message ${ExpectedMessage.NORMAL_PLAY_MODE_UPDATE} was not found in the console messages`
            ).toBeTruthy();
        }).toPass({
            intervals: [10_000, 30_000, 45_000],
            timeout: 60_000,
        });
    }
};
