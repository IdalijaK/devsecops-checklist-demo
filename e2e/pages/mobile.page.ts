import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class MobilePage extends BasePage {
    readonly phone: Locator;
    readonly rotateButton: Locator;
    readonly status: Locator;

    constructor(page: Page) {
        super(page);
        this.phone = page.locator("#phone");
        this.rotateButton = page.getByRole("button", { name: "Rotate phone" });
        this.status = page.locator("#phone-status");
    }

    async open() {
        await this.goto("/mobile.html");
    }

    async rotate() {
        await this.rotateButton.click();
    }
}
