import { test, expect } from '@playwright/test';

test('Homepage visual test', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');
    // wait for the page to load
    await page.waitForSelector('text=Mine afdelinger');
    await expect(page).toHaveScreenshot({ fullPage: true});
});