import { defineConfig, devices } from "@playwright/test";

const serverCommand = process.platform === "win32"
    ? "py -m http.server 8000 --bind 127.0.0.1"
    : "python3 -m http.server 8000 --bind 127.0.0.1";

export default defineConfig({
    testDir: "./e2e",
    testMatch: "**/*.spec.ts",
    retries: process.env.CI ? 2 : 0,

    outputDir: "test-results",          // where evidence goes (this is the default)

    reporter: [
        ["list"],                                          // readable output in the terminal
        ["html", { outputFolder: "playwright-report", open: "never" }]
    ],

/*     use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:8000",
        launchOptions: { slowMo: 1500 },                              // pause 0.5 s after each action so it's watchable
        screenshot: "only-on-failure",                               // picture of the page when a test fails
        video: { mode: "on", size: { width: 1280, height: 720 } },   // record every test in HD
        trace: "on"                                                  // step-by-step recording of every test
    },
 */

        use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:8000",
        screenshot: "only-on-failure",   // picture of the page when a test fails
        video: "off",                    // the trace covers debugging
        trace: "retain-on-failure"       // step-by-step recording, kept only for failed tests
    },

      webServer: {
        command: serverCommand,
        url: "http://127.0.0.1:8000",
        reuseExistingServer: !process.env.CI,
        timeout: 10_000
    }
});