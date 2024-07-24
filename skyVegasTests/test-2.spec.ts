import { test, expect, type Page } from '@playwright/test';
import { login } from './app.spec';

test('test', async ({ page }) => {
  test.setTimeout(60000)
  await login(page)
  await page.locator('div:nth-child(2) > .tile > .button').first().click();
  await page.frameLocator('iframe').frameLocator('iframe[name="gameClient"]').frameLocator('iframe').locator('canvas').click({
    position: {
      x: 883,
      y: 296
    }
  });
  await page.frameLocator('iframe').frameLocator('iframe[name="gameClient"]').frameLocator('iframe').locator('canvas').click({
    position: {
      x: 831,
      y: 538
    }
  });
  await page.frameLocator('iframe').getByText('Exit GameExit the game & play').click();
  await page.locator('div:nth-child(4) > .tile > .button').first().click();
  await page.frameLocator('iframe').frameLocator('iframe[name="gameClient"]').frameLocator('iframe').locator('canvas').click({
    position: {
      x: 986,
      y: 246
    }
  });
  await page.frameLocator('iframe').frameLocator('iframe[name="gameClient"]').frameLocator('iframe').locator('canvas').click({
    position: {
      x: 832,
      y: 545
    }
  });
  await page.frameLocator('iframe').getByText('Exit GameExit the game & play').click();
});

//need to add expect to these?
//launches 2 games sequentially