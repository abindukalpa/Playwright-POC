import { test, expect, type Page } from "@playwright/test";
import { assert, log } from "console";

test("Page OK", async ({ page }) => {
  await page.goto("https://skyvegas.com.nxt.ppbdev.com/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(
    "Online Vegas Games | 50 Free Spins | SBG Vegas"
  );
});

let login = async (page) => {

  await page.goto("https://skyvegas.com.nxt.ppbdev.com/");
  await page.getByRole("link", { name: "Log In" }).click();
  await page.getByLabel("Username").fill("rgsSBGbNTPp");
  await page.getByLabel("PIN").fill("964459");
  await page.getByRole("button", { name: "I Accept" }).click();
  page.getByRole("button", { name: "Log in" }).focus;
  await page.getByRole("button", { name: "Log in" }).click();
};

test("login", async ({page}) => {
  await login(page)
  await expect(page).toHaveURL("https://skyvegas.com.nxt.ppbdev.com/");
  await expect(page).toHaveTitle(
    "Online Vegas Games | 50 Free Spins | SBG Vegas"
  );
  await expect(
    page.getByText("CONGRATULATIONS TO OUR LUCKY WINNER")
  ).toBeVisible();
  await page.goto("https://skyvegas.com.nxt.ppbdev.com/c/pragmatic-games");
});

test("launchGame", async ({page}) => {
  await login(page)
  await page.goto("https://skyvegas.com.nxt.ppbdev.com/c/pragmatic-games/");
  const linksCount = await page
    .getByRole("link", { name: "Real Play" })
    .count();
  expect(linksCount).toBe(11);
} )




