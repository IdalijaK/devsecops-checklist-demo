import { expect, test } from "@playwright/test";
import { ChecklistPage } from "./pages/checklist.page";

test("seed: checklist page is ready", async ({ page }) => {
    const checklist = new ChecklistPage(page);
    await checklist.open();
    await expect(checklist.heading).toBeVisible();
});