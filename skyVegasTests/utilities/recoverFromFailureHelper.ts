import { Page } from '@playwright/test';
import { validateConsoleMessages } from '.';
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

    if (isFreeSpinModeOn) {
        // click on the canvas to start the free spins, they will start auto-playing
        // sometimes there are multiple rounds so the test will need to click again to start the next round, this will be done upon test retry
        await page.mouse.click(300, 300, { delay: 200 });
        await validateConsoleMessages(
            ExpectedMessage.NORMAL_PLAY_MODE_UPDATE,
            consoleMessages
        );
    }
};
