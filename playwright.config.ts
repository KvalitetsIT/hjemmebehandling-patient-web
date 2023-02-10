import { PlaywrightTestConfig, devices, ViewportSize } from '@playwright/test';

const viewport: ViewportSize = { width: 800, height: 1280 };

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
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: viewport
            },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                viewport: viewport
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                viewport: viewport
            },
        },
    ],
};
export default config;