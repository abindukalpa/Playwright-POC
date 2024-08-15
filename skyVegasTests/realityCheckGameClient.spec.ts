import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";
import { saferGamblingPage } from "./utilities/saferGamblingHelper";

test("realityCheck", async ({ page }) => {
    const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
    const jsonObject = JSON.parse(data);
    let consoleMessages: string[] = [];

    await login(page);

    await (page
        .getByText('My Account rgsSBGbNTPp My')
        .click());

    await (page
        .getByRole('link', { name: 'Safer Gambling Tools', exact: true })
        .click());

    await saferGamblingPage(page);

    await (page
        .getByRole('button', { name: 'Set your Reality Check' })
        .click());

    await (page
        .getByLabel('Player Protection Modal').locator('svg')
        .click());

    await (page
        .getByText('10 minutes', { exact: true })
        .click());

    await (page
        .getByText('Set Reality Check')
        .click());

    await (page
        .getByText('Confirm Reality Check')
        .click());

    await (page
        .getByText('Close', { exact: true })
        .click());

    await (page
        .getByRole('link', { name: 'Sky Vegas' })
        .click());

    page.on("console", (msg) => {
        consoleMessages.push(msg.text());
    });

    await launchGame(page, "Big Bass Splash");

    await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000)); // Wait for 10 minutes

    await validateConsoleMessages(
        page,
        jsonObject.realityCheckMessage,
        consoleMessages
    )

    await (page
        .frameLocator('#root iframe')
        .getByText('Exit GameExit the game & play')
        .click());

    await (page
        .getByRole('button', { name: 'Edit Reality Check' })
        .click());

    await (page
        .getByLabel('Player Protection Modal')
        .locator('svg')
        .click());

    await (page
        .getByText('No Reality Check', { exact: true })
        .click());

    await (page
        .getByText('Set Reality Check')
        .click());
    
    await (page
        .getByText('Remove Reality Check')
        .click());
    
    await (page
        .getByText('Close', { exact: true })
        .click());

    await (page
        .getByRole('button', { name: 'Log out' })
        .click());
})