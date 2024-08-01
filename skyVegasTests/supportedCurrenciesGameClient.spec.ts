import { test, type Page} from "@playwright/test";
import { validateConsoleMessages, login, launchGame } from "./testHelpers";

test("supportedCurrencies", async ({page}) => {
    await login(page)
    await launchGame(page, "Big Bass Splash")
    await validateConsoleMessages(page, '"currency":"GBP"')


})