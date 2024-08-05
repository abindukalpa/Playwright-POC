import { test, type Page, expect } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";

test("supportedCurrencies", async ({ page }) => {
  const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
  const jsonObject = JSON.parse(data);
  let consoleMessages: string[] = [];
  await login(page);
  await launchGame(page, "Big Bass Splash");
  page.on("console", (msg) => {
    consoleMessages.push(msg.text());
  });

  await validateConsoleMessages(
    page,
    //jsonObject.currencyMessageGbp,
    '"currency":"GBP"',
    consoleMessages
  );
});
