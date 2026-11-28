import { expect, test } from "@playwright/test";
import { ChecklistPage } from "./pages/checklist.page";
import { checklistData } from "./test-data/site-data";
import { defaultTasks } from "./test-data/tasks";

test.describe("cat checklist", () => {
    test("shows the checklist percentage as tasks are completed", async ({ page }) => {
        const checklist = new ChecklistPage(page);

        await checklist.open();

        await expect(checklist.progress).toHaveText(checklistData.initialProgress);

        const progressValues = [
            checklistData.quarterProgress,
            checklistData.halfProgress,
            checklistData.threeQuarterProgress,
            checklistData.fullyCompleteProgress
        ];

        for (const [index, task] of defaultTasks.entries()) {
            await checklist.taskCheckbox(task).check();
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
        await expect(checklist.taskCheckbox(defaultTasks[0])).toBeVisible();

        await page.reload();
        await expect(checklist.taskCheckbox(checklistData.customTask)).toHaveCount(0);
    });

    for (const savedValue of checklistData.invalidSavedTasks) {
        test(`falls back to the default tasks when saved data is ${savedValue}`, async ({ page }) => {
            const checklist = new ChecklistPage(page);
            await checklist.seedSavedTasks(savedValue);
            await checklist.open();
            await expect(checklist.taskItems).toHaveCount(checklistData.defaultTaskCount);
            await expect(checklist.taskStatus).toHaveText(checklistData.loadFailedMessage);
        });
    }

    test("keeps keyboard focus in the form after removing a task", async ({ page }) => {
        const checklist = new ChecklistPage(page);
        await checklist.open();
        await checklist.addTask(checklistData.customTask);
        await checklist.removeTask(checklistData.customTask);
        await expect(checklist.taskInput).toBeFocused();
    });
});