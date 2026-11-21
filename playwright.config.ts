import { defineConfig, devices } from "@playwright/test";

const serverCommand = process.platform === "win32"
    ? "py -m http.server 8000 --bind 127.0.0.1"
    : "python3 -m http.server 8000 --bind 127.0.0.1";

export default defineConfig({
    testDir: "./e2e",
    testMatch: "**/*.spec.ts",
    retries: process.env.CI ? 2 : 0,
    use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:8000"
    },
    webServer: {
        command: serverCommand,
        url: "http://127.0.0.1:8000",
        reuseExistingServer: !process.env.CI,
        timeout: 10_000
    }
});
