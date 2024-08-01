import { test, expect, type Page } from "@playwright/test";

export let validateConsoleMessages = async (
  page,
  expectedMessage,
  consoleMessages
) => {
  const messageExists = consoleMessages.some((msg) =>
    msg.includes(expectedMessage)
  );
  expect(messageExists, "Could not validate " + expectedMessage).toBe(true);
};
