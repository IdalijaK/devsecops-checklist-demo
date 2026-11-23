import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ChecklistPage extends BasePage {
    readonly heading: Locator;
    readonly taskInput: Locator;
    readonly addTaskButton: Locator;
    readonly taskItems: Locator;
    readonly progress: Locator;
    readonly taskStatus: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole("heading", { name: "My Cat Checklist" });
        this.taskInput = page.getByLabel("Add a task:");
        this.addTaskButton = page.getByRole("button", { name: "Add task" });
        this.taskItems = page.getByRole("list", { name: "Cat care tasks" }).getByRole("listitem");
        this.progress = page.getByRole("status");
        this.taskStatus = page.locator("#task-status"); // live region without a role, so the ID is the stable hook
    }

    async open() {
        await this.goto("/");
        await this.page.evaluate(() => localStorage.removeItem("cat-checklist-tasks"));
        await this.page.reload();
    }

    /** Puts raw text into localStorage before the page loads, to simulate old or corrupted saved data. */
    async seedSavedTasks(rawValue: string) {
        await this.page.addInitScript(([key, value]) => {
            localStorage.setItem(key, value);
        }, ["cat-checklist-tasks", rawValue] as const);
    }

    async addTask(text: string) {
        await this.taskInput.fill(text);
        await this.addTaskButton.click();
    }

    taskCheckbox(text: string) {
        return this.page.getByRole("checkbox", { name: text });
    }

    async removeTask(text: string) {
        await this.page.getByRole("button", { name: `Remove ${text}` }).click();
    }
}
