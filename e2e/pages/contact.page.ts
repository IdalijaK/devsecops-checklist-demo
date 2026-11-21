import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ContactPage extends BasePage {
    readonly email: Locator;
    readonly sendButton: Locator;
    readonly formMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.email = page.getByLabel("Email:");
        this.sendButton = page.getByRole("button", { name: "Send" });
        this.formMessage = page.locator("#form-message");
    }

    async open() {
        await this.goto("/contact.html");
    }

    async submitEmail(email: string) {
        await this.email.fill(email);
        await this.sendButton.click();
    }
}
