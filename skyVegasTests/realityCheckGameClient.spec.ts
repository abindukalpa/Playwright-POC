import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";
import { startEventListener } from "./utilities/starteventListenerHelper";
import { makeSpin } from "./utilities/makeSpinHelper";

test("realityCheck", async ({ page }) => {
    const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
    const expectedMessages = JSON.parse(data);
    let consoleMessages: string[] = [];

    await login(page);

    startEventListener(page, consoleMessages);

    await launchGame(page, "Big Bass: Hold & Spinner", consoleMessages);

    await makeSpin(page, expectedMessages.startSpin, consoleMessages);

    await page.waitForTimeout(60000)

    await makeSpin(page, expectedMessages.startSpin, consoleMessages);

    await validateConsoleMessages(
        expectedMessages.realityCheckMessage,
        consoleMessages
    )

    await page.close();
});