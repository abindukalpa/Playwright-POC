import { Page, expect } from '@playwright/test';
import { messageExists } from '.';
import { ExpectedMessage } from '../../types/expectedMessage';

export const recoverFromFreeSpins = async (
    page: Page,
    consoleMessages: string[]
) => {
    const playModeUpdateConsoleMessages: string[] = consoleMessages.filter(
        (_) => _.includes(ExpectedMessage.PLAY_MODE_UPDATE)
    );
    const isFreeSpinModeOn: boolean = playModeUpdateConsoleMessages.some((_) =>
        _.includes(ExpectedMessage.FREE_SPIN_PLAY_MODE_UPDATE)
    );
    console.log(isFreeSpinModeOn);
    if (isFreeSpinModeOn) {
        // click on the canvas to start the free spins, they will start auto-playing
        // sometimes there are multiple rounds so the test will need to click again to start the next round, this will be done upon test retry
        await expect(async (): Promise<void> => {
            await page.mouse.click(300, 300);
            console.log('clicking again');
            expect(
                messageExists(
                    consoleMessages,
                    ExpectedMessage.NORMAL_PLAY_MODE_UPDATE
                ),
                `Expected message ${ExpectedMessage.NORMAL_PLAY_MODE_UPDATE} was not found in the console messages`
            ).toBeTruthy();
        }).toPass({
            intervals: [10_000, 20_000, 30_000, 45_000],
            timeout: 60_000,
        });
    }
};
