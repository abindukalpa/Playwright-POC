import { test, type Page } from "@playwright/test";
import { launchGame, login, validateConsoleMessages } from "./utilities";
import * as fs from "fs";
import { makeSpin } from "./utilities/makeSpinHelper";
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

    test("gamePlay", async () => {
      startEventListener(page, consoleMessages);
      await launchGame(page, game, consoleMessages);
      await makeSpin(page, expectedMessages.startSpin, consoleMessages);
      await validateConsoleMessages(expectedMessages.endSpin, consoleMessages);
    });
  });
});
