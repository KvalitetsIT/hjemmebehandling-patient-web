import { test, expect } from '@playwright/test';

test('Homepage visual test', async ({ page }) => {
    await page.goto('http://localhost:3000/questionnaire/answered/');
    // wait for the page to load
    await page.waitForSelector('text=Besvar igen');
    await expect(page).toHaveScreenshot({ fullPage: true});
});