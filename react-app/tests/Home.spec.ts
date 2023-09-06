import { test, expect } from '@playwright/test';

test('Homepage visual test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    // wait for the page to load
    await page.waitForSelector('text=Cool questionnaire');
    await expect(page).toHaveScreenshot({ fullPage: true});
});