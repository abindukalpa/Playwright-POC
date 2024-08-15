import { test, expect, type Page } from "@playwright/test";

export let saferGamblingPage = async (sgPage:Page) => {
    const sgUrl = process.env.SGURL!;
    await sgPage.goto(sgUrl);
}