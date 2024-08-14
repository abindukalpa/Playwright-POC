import { test } from '@playwright/test';
import { launchGame, validateConsoleMessages, login } from './utilities';
import * as fs from 'fs';

test('gameLaunch', async ({ page }) => {
    const data = fs.readFileSync('ExpectedSlotConsoleMessages.json', 'utf-8');
    const jsonObject = JSON.parse(data);
    const consoleMessages: string[] = [];
    await login(page);
    page.on('console', (msg) => {
        consoleMessages.push(msg.text());
    });

    await launchGame(page, 'Big Bass Splash');

    await validateConsoleMessages(
        page,
        jsonObject.loadingMessage,
        consoleMessages
    );
});
