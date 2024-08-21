import { test, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";

test.describe.configure({ mode: "serial" });
const consoleMessages: string[] = [];
let jsonObject;
let page: Page;
const games = JSON.parse(fs.readFileSync("games.json", "utf-8"));
games.forEach((game) => {
  test.describe(`Testing with text: ${game}`, () => {
    test.beforeAll(async ({ browser }) => {
      const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
      jsonObject = JSON.parse(data);
      page = await browser.newPage();
      await login(page);
      
    });

    test.afterAll(async () => {
      await page.close();
    });

    test("makeSpin", async () => {
      page.on("console", (msg) => {
        consoleMessages.push(msg.text());
      });
    
    await launchGame(page, game, consoleMessages);

    await page.mouse.click(300,300 , { delay: 10 })

    await page.keyboard.press("Enter", { delay: 1500 });

    await page.keyboard.press("Enter", { delay: 10 });

    console.log(consoleMessages.slice(-20))
    await validateConsoleMessages(
        jsonObject.endSpin,
        consoleMessages
    )
    });
  });
});
