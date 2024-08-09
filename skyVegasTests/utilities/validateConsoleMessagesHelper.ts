import { test, expect, type Page } from "@playwright/test";
import { error } from "console";
import * as fs from "fs";

export let validateConsoleMessages = async (
  page: Page,
  expectedMessage: string,
  consoleMessages: string[]
) => {
  if (expectedMessage === undefined){
    throw new Error("expected message is null")
  }
  await expect(async () => {
    const messageExists = consoleMessages.some((msg) =>
      msg.includes(expectedMessage)
    );
    expect(messageExists).toBe(true);
  }).toPass({
    intervals: [5_000, 10_000, 15_000],
    timeout: 60_000,
  });
};
