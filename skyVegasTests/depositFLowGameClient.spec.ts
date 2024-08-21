import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";
import { config } from "../config/config";
import { startEventListener } from "./utilities/starteventListenerHelper";

test.describe.configure({ mode: "serial" });
const consoleMessages: string[] = [];
let expectedMessages;
let page: Page;
const games = JSON.parse(fs.readFileSync("games.json", "utf-8"));
games.forEach((game) => {
  test.describe(`Testing with text: ${game}`, () => {
    test.beforeAll(async ({ browser }) => {
      const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
      expectedMessages = JSON.parse(data);
      page = await browser.newPage();
      await login(page);
    });

    test.afterAll(async () => {
      await page.close();
    });

    test("Test deposit flow", async ({browser}) => {
        startEventListener(page, consoleMessages);
        await launchGame(page, game, consoleMessages);
        await page
        .frameLocator('#root iframe')
        .getByRole('button', { name: 'Deposit' })
        .click();
        const userCreationPage = await browser.newPage();
        await userCreationPage.goto("https://uct.dev.betfair/");
        await userCreationPage
        .getByRole('link', { name: 'Make Deposit' })
        .click();
        await userCreationPage
        .getByRole('combobox')
        .selectOption("SKYBET");
        await userCreationPage
        .getByRole('row', { name: 'Account ID' })
        .getByRole('textbox')
        .fill(config.getAccountID());
        await userCreationPage
        .getByRole('row', { name: 'Amount' })
        .getByRole('textbox')
        .fill("10");
        await userCreationPage
        .getByRole('button', { name: 'Deposit' })
        .click()
        await userCreationPage.close()
        await page
        .frameLocator('#root iframe')
        .locator('.sprite')
        .click();
        await validateConsoleMessages(
            expectedMessages.depositMessage,
            consoleMessages
        );
    });
  });
});
