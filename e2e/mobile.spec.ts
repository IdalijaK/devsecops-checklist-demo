import { expect, test } from "@playwright/test";
import { MobilePage } from "./pages/mobile.page";
import { mobileData } from "./test-data/site-data";

test("mobile page toggles between portrait and landscape", async ({ page }) => {
    const mobile = new MobilePage(page);
    await mobile.open();

    await mobile.rotate();
    await expect(mobile.phone).toHaveClass(/landscape/);
    await expect(mobile.status).toHaveText(mobileData.landscapeStatus);

    await mobile.rotate();
    await expect(mobile.phone).not.toHaveClass(/landscape/);
    await expect(mobile.status).toHaveText(mobileData.portraitStatus);
});
