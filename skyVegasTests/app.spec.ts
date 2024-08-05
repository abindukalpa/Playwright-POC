import { test, expect, type Page } from "@playwright/test";
import { assert, log } from "console";

test("Page OK", async ({ page }) => {
  await page.goto("https://skyvegas.com.nxt.ppbdev.com/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(
    "Online Vegas Games | 50 Free Spins | SBG Vegas"
  );
});

test("PragGames", async ({ page }) => {
  const userName = process.env.USERNAME!;
  const password = process.env.PASSWORD!;
  const url = process.env.URL!;
  await page.goto(url);
  await page.getByRole("link", { name: "Log In" }).click();
  await page.getByLabel("Username").fill(userName);
  await page.getByLabel("PIN").fill(password);
  await page.getByRole("button", { name: "I Accept" }).click();
  page.getByRole("button", { name: "Log in" }).focus;

  try {
    await page.getByRole("button", { name: "Log in" }).click();
  } catch (error) {
    await page.screenshot({ path: "loginfailure.png" });
  }

  await page.locator("a").filter({ hasText: "My Account" }).first().click(); 
  await expect(page.getByText(userName)).toBeVisible();
  
  await page.goto("https://skyvegas.com.nxt.ppbdev.com/c/pragmatic-games/"); //wip
  const linksCount = await page
    .getByRole("link", { name: "Real Play" })
    .count();
  expect(linksCount).toBe(11);

  for (let i = 0; i < linksCount; i++) {
    const consoleMessages: string[] = [];
    await page.getByRole("link", { name: "Real Play" }).nth(i).click();
    page.on("console", (msg) => {
      consoleMessages.push(msg.text());
    });

    const expectedMessage = '"loadingPercent":100';
    const expectedMessageLiveGames = "gameLoadComplete";
    try {
      await expect(async () => {
        const messageExists = consoleMessages.some(
          (msg) =>
            msg.includes(expectedMessage) ||
            msg.includes(expectedMessageLiveGames)
        );
        expect(messageExists).toBe(true);
      }).toPass({
        intervals: [5_000, 10_000, 15_000],
        timeout: 60_000,
      });
    } catch (error) {
      await page.screenshot({ path: "failure_gamenumber[" + i + "].png" });
    }

    //expect(page).toHaveScreenshot();
    await page.goto("https://skyvegas.com.nxt.ppbdev.com/c/pragmatic-games/");
  }
});
