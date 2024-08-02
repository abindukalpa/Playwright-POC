import { test, expect, type Page } from "@playwright/test";
import * as fs from "fs";


export let validateConsoleMessages = async (page: Page, expectedMessage: string) => {
    const data = fs.readFileSync("ExpectedSlotConsoleMessages.json", "utf-8");
    const jsonObject = JSON.parse(data);
    const consoleMessages: string[] = [];
      page.on("console", (msg) => {
        consoleMessages.push(msg.text());
      });

      const messageExists = await new Promise<boolean>(async (resolve) => {
        const timeout = 60_000;
        const interval = 100;
    
        const startTime = Date.now();
    
        const checkMessages = async () => {
          if (consoleMessages.some((msg) => msg.includes(expectedMessage))) {
            resolve(true);
          } else if (Date.now() - startTime > timeout) {
            resolve(false);
          } else {
            setTimeout(checkMessages, interval);
          }
        };
    
        checkMessages();
      });
      expect(messageExists).toBe(true);
    };
