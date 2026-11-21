import { expect, test } from "@playwright/test";
import { ChecklistPage } from "./pages/checklist.page";
import { checklistData } from "./test-data/site-data";

test.describe("cat checklist", () => {
    test("adds a task, persists its completion, and removes it", async ({ page }) => {
        const checklist = new ChecklistPage(page);

        await checklist.open();

        await expect(checklist.heading).toBeVisible();
        await expect(checklist.taskItems).toHaveCount(checklistData.defaultTaskCount);
        await expect(checklist.progress).toHaveText(checklistData.initialProgress);

        await checklist.addTask(checklistData.customTask);
        const customTask = checklist.taskCheckbox(checklistData.customTask);
        await customTask.check();
        await expect(checklist.progress).toHaveText(checklistData.completedProgress);

        await page.reload();
        await expect(checklist.taskCheckbox(checklistData.customTask)).toBeChecked();
        await expect(checklist.progress).toHaveText(checklistData.completedProgress);

        await checklist.removeTask(checklistData.customTask);
        await expect(checklist.taskItems).toHaveCount(checklistData.defaultTaskCount);
        await expect(page.getByRole("checkbox", { name: "Feed the cat" })).toBeVisible();

        await page.reload();
        await expect(checklist.taskCheckbox(checklistData.customTask)).toHaveCount(0);
    });
});
