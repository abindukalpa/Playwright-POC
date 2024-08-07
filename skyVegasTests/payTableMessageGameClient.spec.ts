import { test, type Page, expect } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";

test("payTableMessage", async ({ page }) => {
    const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
    const jsonObject = JSON.parse(data);
    let consoleMessages: string[] = [];
    await login(page);
    page.on("console", (msg) => {
        consoleMessages.push(msg.text());
    });

    await launchGame(page, "Big Bass Splash");

    page.frameLocator('#root iframe').getByText('MenuOpen the menu to access').click();
    page.frameLocator('#root iframe').getByRole('link', { name: 'Paytable' }).click();

    await validateConsoleMessages(
        page, 
        "toggle paytable",
        consoleMessages
    );
});