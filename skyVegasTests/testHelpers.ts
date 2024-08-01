import { test, expect, type Page } from "@playwright/test";
import * as fs from "fs";


let validateConsoleMessages = async (page: Page, expectedMessage: string) => {
    const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
    const jsonObject = JSON.parse(data);
    const consoleMessages: string[] = [];
      page.on("console", (msg) => {
        consoleMessages.push(msg.text());
      });

      const messageExists = await new Promise<boolean>(async (resolve) => {
        const timeout = 60_000;
        const interval = 100;
    
        const startTime = Date.now();
    
        const checkMessages = async () => {
          if (consoleMessages.some((msg) => msg.includes(expectedMessage))) {
            resolve(true);
          } else if (Date.now() - startTime > timeout) {
            resolve(false);
          } else {
            setTimeout(checkMessages, interval);
          }
        };
    
        checkMessages();
      });
      expect(messageExists).toBe(true);
    };

  let login = async (page:Page) => {
    const userName = process.env.USERNAME!;
    const password = process.env.PASSWORD!;
    const url = process.env.URL!;
    await page.goto(url!);
    await page.getByRole("link", { name: "Log In" }).click();
    await page.getByLabel("Username").fill(userName);
    await page.getByLabel("PIN").fill(password);
    await page.getByRole("button", { name: "I Accept" }).click();
    await page.getByRole("button", { name: "Log in" }).click();
  };

  let launchGame = async (page: Page, gameName) => {
    await page.getByText('Search for games...').click();
    await page.getByPlaceholder('Search for games...').fill(gameName);
    await new Promise(r => setTimeout(r, 2000));
    await page.locator('.tile-footer-wrapper').first().click();
  }
  
  export {validateConsoleMessages, login, launchGame};
