import { type Page } from "@playwright/test";

export const startEventListener = (page:Page, consoleMessages:string[]) => {
    page.on("console", (msg) => {
        consoleMessages.push(msg.text());
    });
}


