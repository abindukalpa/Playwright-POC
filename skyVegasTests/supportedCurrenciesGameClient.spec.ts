import { test } from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities";
import * as fs from "fs";
import { startEventListener } from "./utilities/starteventListenerHelper";

test("supportedCurrencies", async ({ page }) => {
  const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
  const jsonObject = JSON.parse(data);
  const consoleMessages: string[] = [];
  await login(page);
  startEventListener(page, consoleMessages);
  await launchGame(page, "Big Bass Splash", consoleMessages);
  
  await validateConsoleMessages(
    jsonObject.currencyMessageGbp,
    consoleMessages
  );
  });
