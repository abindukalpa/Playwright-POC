import { test, expect, type Page } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";
import { text } from "stream/consumers";

test.describe.configure({ mode: "serial" });
const consoleMessages: string[] = [];
let jsonObject;
let page: Page;
const textValues = JSON.parse(fs.readFileSync("games.json", "utf-8"));
textValues.forEach((textValue) => {
  test.describe(`Testing with text: ${textValue}`, () => {
    test.beforeAll(async ({ browser }) => {
      const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
      jsonObject = JSON.parse(data);
      page = await browser.newPage();
      await login(page);
    });

    test.afterAll(async () => {
      await page.close();
    });

    test("Test sound toggle", async ({}) => {
      page.on("console", (msg) => {
        consoleMessages.push(msg.text());
      });
      await launchGame(page, textValue);
      if (jsonObject.soundCheckMessageToolBarOn) {
        await(
            page
            .frameLocator('#root iframe').locator('i').nth(2)
            .click());
        validateConsoleMessages(
        page,
        jsonObject.soundCheckMessageToolBarOff,
        consoleMessages
        );
      }
      else if(jsonObject.soundCheckMessageToolBarOff) {
        await(
            page
              .frameLocator('#root iframe').locator('i').nth(2)
              .click());
          validateConsoleMessages(
            page,
            jsonObject.soundCheckMessageToolBarOn,
            consoleMessages
            );
      }
    });
  });
});
