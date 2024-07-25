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
  await page.goto("https://skyvegas.com.nxt.ppbdev.com/");
  await page.getByRole("link", { name: "Log In" }).click();
  await page.getByLabel("Username").fill("rgsSBGbNTPp");
  await page.getByLabel("PIN").fill("964459");
  await page.getByRole("button", { name: "I Accept" }).click();
  page.getByRole("button", { name: "Log in" }).focus;

  try {
    await page.getByRole("button", { name: "Log in" }).click();
  } catch (error) {
    await page.screenshot({ path: "loginfailure.png" });
  }

  await expect(page).toHaveURL("https://skyvegas.com.nxt.ppbdev.com/");
  await expect(page).toHaveTitle(
    "Online Vegas Games | 50 Free Spins | SBG Vegas"
  );
  await expect(
    page.getByText("CONGRATULATIONS TO OUR LUCKY WINNER")
  ).toBeVisible();
  await page.goto("https://skyvegas.com.nxt.ppbdev.com/c/pragmatic-games/");
  const linksCount = await page
    .getByRole("link", { name: "Real Play" })
    .count();
  expect(linksCount).toBe(11);

  for (let i = 0; i < linksCount; i++) {
    var link = await page.getByRole("link", { name: "Real Play" }).nth(i);
    const consoleMessages: string[] = [];
    await link.click();
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
