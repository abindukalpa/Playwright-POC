import { test, expect, type Page } from "@playwright/test";
import * as fs from "fs";
import { validateConsoleMessages } from "./utils/consoleMessageValidator";

test.describe.configure({ mode: "serial" });
const consoleMessages: string[] = [];
let page: Page;

test.beforeAll(async ({ browser }) => {
  const userName = process.env.USERNAME!;
  const password = process.env.PASSWORD!;
  const url = process.env.URL!;
  page = await browser.newPage();
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
});

test.afterAll(async () => {
  await page.close();
});

test("Test game menu open", async ({}) => {
  await page.getByText("Search for games...").click();
  await new Promise((r) => setTimeout(r, 2000));
  await page
    .getByPlaceholder("Search for games...")
    .waitFor({ state: "attached" });
  await page.getByPlaceholder("Search for games...").fill("Big Bass Splash");
  await page.locator(".tile-footer-wrapper").first().waitFor();
  await new Promise((r) => setTimeout(r, 2000));
  await page.locator(".tile-footer-wrapper").first().click();

  page.on("console", (msg) => {
    consoleMessages.push(msg.text());
  });
  await expect(
    page.frameLocator("#root iframe").getByText("MenuOpen the menu to access")
  ).toBeAttached();
  await page
    .frameLocator("#root iframe")
    .getByText("MenuOpen the menu to access")
    .click();
  validateConsoleMessages(
    page,
    '[Game Window -> Game Client] send notification: "menuOpened"',
    consoleMessages
  );
});

test("Test game help menu open", async ({}) => {
  await page
    .frameLocator("#root iframe")
    .getByRole("link", { name: "Game Help" })
    .waitFor();
  await page
    .frameLocator("#root iframe")
    .getByRole("link", { name: "Game Help" })
    .click();
  validateConsoleMessages(
    page,
    '[Game Window -> Game Client] send notification: "gameHelp"',
    consoleMessages
  );
});

test("Test game menu closed", async ({}) => {
  await page
    .frameLocator("#root iframe")
    .getByText("MenuOpen the menu to access")
    .click();

  validateConsoleMessages(
    page,
    '[Game Window -> Game Client] send notification: "menuClosed"',
    consoleMessages
  );
});
