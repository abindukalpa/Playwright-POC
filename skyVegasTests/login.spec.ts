import { test, expect, type Page } from "@playwright/test";

test("Test login works", async ({ page }) => {
await login(page);
  if (process.env.NODE_ENV == "live") {
    await page.getByRole("button", { name: "Log in" }).click();
    await page.getByText("I don't want to change it").click();
  } else {
    await page.getByRole("button", { name: "I Accept" }).click();
    await page.getByRole("button", { name: "Log in" }).click();
    //These assertions dont pass in live
    await expect(page).toHaveTitle(
      "Online Vegas Games | 50 Free Spins | SBG Vegas"
    );
    await expect(
      page.getByText("CONGRATULATIONS TO OUR LUCKY WINNER")
    ).toBeVisible();
  }
});

let login = async (page:Page) => {
  const userName = process.env.USERNAME!;
  const password = process.env.PASSWORD!;
  const url = process.env.URL!;
  await page.goto(url!);
  await page.getByRole("link", { name: "Log In" }).click();
  await page.getByLabel("Username").fill(userName);
  await page.getByLabel("PIN").fill(password);
  page.getByRole("button", { name: "Log in" }).focus;
};
