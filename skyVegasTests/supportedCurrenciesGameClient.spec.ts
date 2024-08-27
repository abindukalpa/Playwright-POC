import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login, startEventListener, readGames } from "./utilities";
import { ExpectedMessage } from "../types/expectedMessage";

let page: Page;
  readGames().forEach((game) => {
    const consoleMessages: string[] = [];
    
    test.describe(`Testing with text: ${game}`, () => {
      test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await login(page);
      });
  
      test.afterAll(async () => {
        await page.close();
      });
  
      test("supportedCurrencies", async () => {
          startEventListener(page, consoleMessages);
          await launchGame(page, game, consoleMessages);
          await validateConsoleMessages(ExpectedMessage.CURRENCY_GBP, consoleMessages);
      })
    });
  });