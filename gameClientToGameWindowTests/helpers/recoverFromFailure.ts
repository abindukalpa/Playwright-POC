import { Page, expect } from '@playwright/test';
import { messageExists } from '.';
import { ExpectedMessage } from '../../types';

export const recoverFromFreeSpins = async (
    page: Page,
    consoleMessages: string[]
): Promise<void> => {
    const shouldInitiateRecover: boolean = consoleMessages.some(
        (_) =>
            _.includes(ExpectedMessage.PLAYER_ATTENTION_REQUIRED) ||
            _.includes(ExpectedMessage.BONUS_ROUND_MODE_UPDATE) ||
            _.includes(ExpectedMessage.FREE_SPIN_PLAY_MODE_UPDATE)
    );

    if (shouldInitiateRecover) {
        console.info('Attempting to recover from free spin or bonus round...');
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
            intervals: [1_000, 5_000, 10_000],
            timeout: 60_000,
        });
    }
};
