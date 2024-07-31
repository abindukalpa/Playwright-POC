import { test, expect, type Page } from "@playwright/test";
import * as fs from "fs";

// TODO: Need to do win is added to balance, Need to do deposit flow payload message

test("Test login works", async ({ page }) => {
  const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
  const jsonObject = JSON.parse(data);
  const expectedMessage = '"loadingPercent":100';
  const userName = process.env.USERNAME!;
  const password = process.env.PASSWORD!;
  const url = process.env.URL!;
  await page.goto(url!);
  await page.getByRole("link", { name: "Log In" }).click();
  await page.getByLabel("Username").fill(userName);
  await page.getByLabel("PIN").fill(password);
  page.getByRole("button", { name: "Log in" }).focus;

  if (process.env.NODE_ENV == "live") {
    await page.getByRole("button", { name: "Log in" }).click();
    await page.getByText("I don't want to change it").click();
  } else {
    await page.getByRole("button", { name: "I Accept" }).click();
    await page.getByRole("button", { name: "Log in" }).click();
  }
  await page.getByText('Search for games...').click();
  await page.getByPlaceholder('Search for games...').fill("Big Bass Splash");
  jsonObject.SlotMessages.forEach((expectedMessage) => {
    validateConsoleMessages(page, expectedMessage);
});

});

let validateConsoleMessages = async (page, expectedMessage) => {
  const consoleMessages: string[] = [];
    page.on("console", (msg) => {
      consoleMessages.push(msg.text());
    });
  try {
    await expect(async () => {
      const messageExists = consoleMessages.some(
        (msg) =>
          msg.includes(expectedMessage)
      );
      expect(messageExists).toBe(true);
    }).toPass({
      intervals: [5_000, 10_000, 15_000],
      timeout: 60_000,
    });
  } catch (error) {
   await page.screenshot({ path: "failure_gamenumber.png" });
  }
}