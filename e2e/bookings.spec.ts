import { expect, test } from "@playwright/test";
import { BookingsPage } from "./pages/bookings.page";
import {
    freeCancellation, invalidCases, lateCancellation, priceCases,
    ratesUnavailableMessage, ratesUrl, savedBooking, today
} from "./test-data/booking-data";

test.describe("cat sitting bookings", () => {
    test.beforeEach(async ({ page }) => {
        await page.clock.setFixedTime(today);
    });

    for (const { name, booking, nights, total, discount } of priceCases) {
        test(`quotes ${name}`, async ({ page }) => {
            const bookings = new BookingsPage(page);
            await bookings.open();

            await bookings.fillBooking(booking);

            await expect(bookings.quoteValue("Nights")).toHaveText(nights);
            await expect(bookings.quoteValue("Total")).toHaveText(total);
            if (discount) {
                await expect(bookings.quoteValue("Long-stay discount")).toHaveText(discount);
            } else {
                await expect(bookings.quoteRow("Long-stay discount")).toHaveCount(0);
            }
        });
    }

    for (const { name, booking, message } of invalidCases) {
        test(`rejects ${name}`, async ({ page }) => {
            const bookings = new BookingsPage(page);
            await bookings.open();

            await bookings.book(booking);

            await expect(bookings.message).toHaveText(message);
            await expect(bookings.bookings).toHaveCount(0);
        });
    }

    test("cancels for free 2 or more days before check-in", async ({ page }) => {
        const bookings = new BookingsPage(page);
        await bookings.open();
        await bookings.book(freeCancellation.booking);
        await expect(bookings.bookings).toHaveCount(1);

        await bookings.cancelButton(freeCancellation.checkInLabel).click();

        await expect(bookings.message).toHaveText(freeCancellation.message);
        await expect(bookings.bookings).toHaveCount(0);
    });

    test("charges 50% for a late cancellation", async ({ page }) => {
        const bookings = new BookingsPage(page);
        await bookings.open();
        await bookings.book(lateCancellation.booking);

        await bookings.cancelButton(lateCancellation.checkInLabel).click();

        await expect(bookings.message).toHaveText(lateCancellation.message);
    });

    test("keeps bookings after a reload", async ({ page }) => {
        const bookings = new BookingsPage(page);
        await bookings.open();
        await bookings.book(savedBooking.booking);

        await page.reload();

        await expect(bookings.bookings).toHaveText([new RegExp(savedBooking.summary)]);
    });

    const brokenPrices = [
        { name: "the server returns an error", status: 500, body: "Server error" },
        { name: "the prices have the wrong shape", status: 200, body: JSON.stringify({ nightlyRatePence: "25" }) }
    ];
    for (const { name, status, body } of brokenPrices) {
        test(`blocks booking when ${name}`, async ({ page }) => {
            await page.route(ratesUrl, (route) =>
                route.fulfill({ status, body, contentType: "application/json" }));
            const bookings = new BookingsPage(page);

            await bookings.open();

            await expect(bookings.pricesStatus).toHaveText(ratesUnavailableMessage);
            await expect(bookings.bookButton).toBeDisabled();
        });
    }
});
