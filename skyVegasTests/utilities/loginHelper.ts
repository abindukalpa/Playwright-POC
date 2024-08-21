import { type Page } from "@playwright/test";
import { config } from "../../config/config";

export const login = async (page:Page) => {
    await page.goto(config.getURL());
    await page.getByRole("link", { name: "Log In" }).click();
    await page.getByLabel("Username").fill(config.getUserName());
    await page.getByLabel("PIN").fill(config.getPassword());
    await page.getByRole("button", { name: "I Accept" }).click();
    await page.getByRole("button", { name: "Log in" }).click();
  };
  