import { expect, test } from "@playwright/test";
import { ChecklistPage } from "./pages/checklist.page";
import { checklistData } from "./test-data/site-data";

test.describe("cat checklist", () => {
    test("shows the checklist percentage as tasks are completed", async ({ page }) => {
        const checklist = new ChecklistPage(page);

        await checklist.open();

        await expect(checklist.progress).toHaveText(checklistData.initialProgress);

        const defaultTasks = [
            "Feed the cat",
            "Change the cat's water",
            "Play with the cat",
            "Brush the cat's teeth"
        ];
        const progressValues = [
            checklistData.quarterProgress,
            checklistData.halfProgress,
            checklistData.threeQuarterProgress,
            checklistData.fullyCompleteProgress
        ];

        for (let index = 0; index < defaultTasks.length; index++) {
            await checklist.taskCheckbox(defaultTasks[index]).check();
            await expect(checklist.progress).toHaveText(progressValues[index]);
        }
    });

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
