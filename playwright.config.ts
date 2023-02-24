import { PlaywrightTestConfig, devices, ViewportSize } from '@playwright/test';

const mobileViewport: ViewportSize = { width: 600, height: 1280 };
const tabletViewport: ViewportSize = { width: 800, height: 1280 };
const dekstopViewport: ViewportSize = { width: 1200, height: 1280 };

const config: PlaywrightTestConfig = {
    testDir: './',
    testMatch: ['**/*.spec.ts'],
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    // workers: 1, // disable parallelism
    use: {
        baseURL: 'http://localhost:3000',
        // launchOptions: {
        //     slowMo: 200,
        // }
    },
    projects: [
        {
            name: 'chromium desktop',
            use: {
                ...devices['Desktop Chrome'],
                viewport: dekstopViewport
            },
        },
        {
            name: 'chromium tablet',
            use: {
                ...devices['Desktop Chrome'],
                viewport: tabletViewport
            },
        },
        {
            name: 'chromium mobile',
            use: {
                ...devices['Desktop Chrome'],
                viewport: mobileViewport
            },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                viewport: dekstopViewport
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                viewport: dekstopViewport
            },
        },
    ],
};
export default config;