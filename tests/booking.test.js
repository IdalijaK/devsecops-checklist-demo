import { describe, test, expect } from "vitest";
import {
    calculatePrice, cancellationFeePence, formatPence, isValidRates,
    nightsBetween, parseBookings, toDayNumber, validateBooking
} from "../src/booking.js";

const rates = {
    nightlyRatePence: 2500, extraCatPence: 800, medicationPence: 300,
    longStayNights: 7, longStayDiscountPercent: 10, maxNights: 28, maxCats: 3,
    freeCancellationDays: 2, lateCancellationPercent: 50
};

describe("nightsBetween", () => {
    test("counts nights, not days", () => {
        expect(nightsBetween("2026-12-01", "2026-12-04")).toBe(3);
    });

    test("is not thrown off by the UK clock change (28 March 2027)", () => {
        expect(nightsBetween("2027-03-27", "2027-03-29")).toBe(2);
    });

    test("crosses a month and a year end", () => {
        expect(nightsBetween("2026-12-30", "2027-01-02")).toBe(3);
    });

    test("handles 29 February in a leap year", () => {
        expect(nightsBetween("2028-02-28", "2028-03-01")).toBe(2);
    });
});

describe("toDayNumber", () => {
    test.each(["2026-02-30", "2026-13-01", "01/12/2026", ""])("rejects %s", (value) => {
        expect(toDayNumber(value)).toBeNaN();
    });
});

describe("calculatePrice", () => {
    test("one cat, no extras", () => {
        expect(calculatePrice({ nights: 3, cats: 1, medication: false }, rates))
            .toEqual({ perNightPence: 2500, subtotalPence: 7500, discountPence: 0, totalPence: 7500 });
    });

    test("extra cats and medication are charged per night", () => {
        expect(calculatePrice({ nights: 2, cats: 3, medication: true }, rates).totalPence).toBe(8800);
    });

    test("no discount at 6 nights", () => {
        expect(calculatePrice({ nights: 6, cats: 1, medication: false }, rates).discountPence).toBe(0);
    });

    test("10% discount from exactly 7 nights", () => {
        expect(calculatePrice({ nights: 7, cats: 1, medication: false }, rates))
            .toMatchObject({ subtotalPence: 17500, discountPence: 1750, totalPence: 15750 });
    });

    test("a discount with half a penny is rounded down", () => {
        const oddRates = { ...rates, nightlyRatePence: 2505 };
        // 7 × 2505 = 17535p; 10% = 1753.5p, rounded down to 1753p
        expect(calculatePrice({ nights: 7, cats: 1, medication: false }, oddRates))
            .toMatchObject({ discountPence: 1753, totalPence: 15782 });
    });
});

describe("validateBooking", () => {
    const today = "2026-11-24";

    test("a valid booking has no errors", () => {
        expect(validateBooking({ checkIn: "2026-11-24", checkOut: "2026-11-25", cats: 1 }, today, rates)).toEqual([]);
    });

    test.each([
        [{ checkIn: "", checkOut: "2026-11-25", cats: 1 }, "Choose a check-in date."],
        [{ checkIn: "2026-11-23", checkOut: "2026-11-25", cats: 1 }, "Check-in can't be in the past."],
        [{ checkIn: "2026-12-01", checkOut: "2026-12-01", cats: 1 }, "Check-out must be after check-in."],
        [{ checkIn: "2026-12-01", checkOut: "2026-12-30", cats: 1 }, "Bookings can be up to 28 nights."],
        [{ checkIn: "2026-12-01", checkOut: "2026-12-02", cats: 4 }, "Choose between 1 and 3 cats."]
    ])("%o is rejected with: %s", (booking, message) => {
        expect(validateBooking(booking, today, rates)).toContain(message);
    });

    test("exactly 28 nights is allowed", () => {
        expect(validateBooking({ checkIn: "2026-12-01", checkOut: "2026-12-29", cats: 1 }, today, rates)).toEqual([]);
    });
});

describe("cancellationFeePence", () => {
    const booking = { checkIn: "2026-11-26", totalPence: 2501 };

    test("free 2 days before check-in", () => {
        expect(cancellationFeePence(booking, "2026-11-24", rates)).toBe(0);
    });

    test("50% the day before, rounded down to the penny", () => {
        expect(cancellationFeePence(booking, "2026-11-25", rates)).toBe(1250);
    });
});

describe("isValidRates", () => {
    test("accepts the real rates", () => {
        expect(isValidRates(rates)).toBe(true);
    });

    test.each([null, {}, { ...rates, nightlyRatePence: "2500" }, { ...rates, maxCats: -1 }, { ...rates, extraCatPence: 8.5 }])(
        "rejects %o", (value) => {
            expect(isValidRates(value)).toBe(false);
        });
});

describe("parseBookings", () => {
    test("nothing saved is an empty list, not an error", () => {
        expect(parseBookings(null)).toEqual({ bookings: [], loadFailed: false });
    });

    test.each(["not json{", "null", "{}", '[{"id":1}]'])("%s is reported as a failure", (saved) => {
        expect(parseBookings(saved)).toEqual({ bookings: [], loadFailed: true });
    });
});

describe("formatPence", () => {
    test("shows pounds and pence", () => {
        expect(formatPence(15750)).toBe("£157.50");
    });
});
