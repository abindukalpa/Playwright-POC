import { test, type Page} from "@playwright/test";
import { launchGame, validateConsoleMessages, login } from "./utilities"

test("supportedCurrencies", async ({page}) => {
    await login(page)
    await launchGame(page, "Big Bass Splash")
    await validateConsoleMessages(page, '"currency":"GBP"')
})