import { type Page } from "@playwright/test";
import { validateConsoleMessages } from "./validateConsoleMessagesHelper";

export const makeSpin = async (page:Page, expectedMessage:string, consoleMessages:string[]) => {
    await page.mouse.click(300,300 , { delay: 10 })
    await page.keyboard.press("Enter", { delay: 1500 });
    await page.keyboard.press("Enter", { delay: 10 });
    await validateConsoleMessages(
        expectedMessage,
        consoleMessages
    )
  };