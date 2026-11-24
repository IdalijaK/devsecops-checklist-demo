import { type Locator, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export type BookingInput = {
    checkIn: string;     // "YYYY-MM-DD"
    checkOut: string;    // "YYYY-MM-DD"
    cats?: number;
    medication?: boolean;
};

export class BookingsPage extends BasePage {
    readonly pricesStatus: Locator;
    readonly checkIn: Locator;
    readonly checkOut: Locator;
    readonly cats: Locator;
    readonly medication: Locator;
    readonly quote: Locator;
    readonly bookButton: Locator;
    readonly message: Locator;
    readonly bookings: Locator;

    constructor(page: Page) {
        super(page);
        this.pricesStatus = page.getByRole("status");
        this.checkIn = page.getByLabel("Check-in date");
        this.checkOut = page.getByLabel("Check-out date");
        this.cats = page.getByLabel("Number of cats");
        this.medication = page.getByLabel("Needs medication");
        this.quote = page.getByRole("table", { name: "Your quote" });
        this.bookButton = page.getByRole("button", { name: "Book" });
        this.message = page.locator("#booking-message"); // live region without a role; the status role is used by the prices message
        this.bookings = page.getByRole("list", { name: "My bookings" }).getByRole("listitem");
    }

    async open() {
        await this.goto("/bookings.html");
    }

    /** The value cell of a quote row, for example "Total" or "Long-stay discount". */
    quoteValue(rowLabel: string) {
        return this.quoteRow(rowLabel).getByRole("cell");
    }

    /** Matches from the start of the row, so "Total" doesn't also match "Subtotal". */
    quoteRow(rowLabel: string) {
        return this.quote.getByRole("row", { name: new RegExp(`^${rowLabel}\\b`) });
    }

    async fillBooking({ checkIn, checkOut, cats = 1, medication = false }: BookingInput) {
        await this.checkIn.fill(checkIn);
        await this.checkOut.fill(checkOut);
        await this.cats.selectOption(String(cats));
        await this.medication.setChecked(medication);
    }

    async book(booking: BookingInput) {
        await this.fillBooking(booking);
        await this.bookButton.click();
    }

    cancelButton(checkInLabel: string) {
        return this.page.getByRole("button", { name: `Cancel booking from ${checkInLabel}` });
    }
}
