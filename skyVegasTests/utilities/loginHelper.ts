import { test, expect, type Page } from "@playwright/test";

export let login = async (page:Page) => {
    const userName = process.env.USERNAME!;
    const password = process.env.PASSWORD!;
    const url = process.env.URL!;
    await page.goto(url!);
    await page.getByRole("link", { name: "Log In" }).click();
    await page.getByLabel("Username").fill(userName);
    await page.getByLabel("PIN").fill(password);
    await page.getByRole("button", { name: "I Accept" }).click();
    await page.getByRole("button", { name: "Log in" }).click();
  };
  