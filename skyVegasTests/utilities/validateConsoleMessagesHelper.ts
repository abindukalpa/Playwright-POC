import { expect } from "@playwright/test";
export const messageExists = (consoleMessages: string[], expectedMessage: string):boolean => consoleMessages.some((msg) => msg.includes(expectedMessage));

export const validateConsoleMessages = async (
  expectedMessage: string,
  consoleMessages: string[]
) => {
  if (expectedMessage === undefined){
    throw new Error("expected message is null")
  }
  await expect(async () => {
    expect(messageExists(consoleMessages, expectedMessage)).toBe(true);
  }).toPass({
    intervals: [5_000, 10_000, 15_000, 60_000, 70_000, 75_000, 85_000, 95_000],
    timeout: 120_000,
  });
  
};
