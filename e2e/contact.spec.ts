import { expect, test } from "@playwright/test";
import { ContactPage } from "./pages/contact.page";
import { contactData } from "./test-data/site-data";

test("contact form reports invalid and valid email addresses", async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.open();

    await contact.submitEmail(contactData.invalidEmail);
    await expect(contact.formMessage).toHaveText(contactData.invalidMessage);
    await expect(contact.email).toHaveAttribute("aria-invalid", "true");

    await contact.submitEmail(contactData.validEmail);
    await expect(contact.formMessage).toHaveText(contactData.validMessage);
    await expect(contact.email).toHaveAttribute("aria-invalid", "false");
});
