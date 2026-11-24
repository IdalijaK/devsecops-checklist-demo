// Cat-sitting booking rules. Pure functions with no DOM, so they can be unit tested.
// Money is always whole pence (integers): never pounds as decimals.
// Dates are "YYYY-MM-DD" strings, counted in UTC days so clock changes never add or lose a night.

const MS_PER_DAY = 86_400_000;

/** "2026-12-02" -> whole days since 1 Jan 1970, or NaN if the date is invalid. */
export function toDayNumber(isoDate) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate));
    if (!match) return NaN;
    const [year, month, day] = match.slice(1).map(Number);
    const ms = Date.UTC(year, month - 1, day);
    const date = new Date(ms);
    const isRealDate = date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
    return isRealDate ? ms / MS_PER_DAY : NaN;
}

/** The local calendar date of a moment, as "YYYY-MM-DD". */
export function toIsoDate(moment) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${moment.getFullYear()}-${pad(moment.getMonth() + 1)}-${pad(moment.getDate())}`;
}

export function nightsBetween(checkIn, checkOut) {
    return toDayNumber(checkOut) - toDayNumber(checkIn);
}

/** Checks rates loaded from the server before trusting them. */
export function isValidRates(value) {
    if (value === null || typeof value !== "object") return false;
    const fields = [
        "nightlyRatePence", "extraCatPence", "medicationPence", "longStayNights",
        "longStayDiscountPercent", "maxNights", "maxCats", "freeCancellationDays",
        "lateCancellationPercent"
    ];
    return fields.every((field) => Number.isInteger(value[field]) && value[field] >= 0);
}

/** Returns a list of problems; an empty list means the booking is valid. */
export function validateBooking({ checkIn, checkOut, cats }, today, rates) {
    if (Number.isNaN(toDayNumber(checkIn))) return ["Choose a check-in date."];
    if (Number.isNaN(toDayNumber(checkOut))) return ["Choose a check-out date."];

    const errors = [];
    if (toDayNumber(checkIn) < toDayNumber(today)) {
        errors.push("Check-in can't be in the past.");
    }
    const nights = nightsBetween(checkIn, checkOut);
    if (nights < 1) {
        errors.push("Check-out must be after check-in.");
    } else if (nights > rates.maxNights) {
        errors.push(`Bookings can be up to ${rates.maxNights} nights.`);
    }
    if (!Number.isInteger(cats) || cats < 1 || cats > rates.maxCats) {
        errors.push(`Choose between 1 and ${rates.maxCats} cats.`);
    }
    return errors;
}

/** Price breakdown in pence. The long-stay discount is rounded down to a whole penny. */
export function calculatePrice({ nights, cats, medication }, rates) {
    const perNightPence = rates.nightlyRatePence
        + (cats - 1) * rates.extraCatPence
        + (medication ? rates.medicationPence : 0);
    const subtotalPence = nights * perNightPence;
    const discountPence = nights >= rates.longStayNights
        ? Math.floor((subtotalPence * rates.longStayDiscountPercent) / 100)
        : 0;
    return { perNightPence, subtotalPence, discountPence, totalPence: subtotalPence - discountPence };
}

/** Free if cancelled at least `freeCancellationDays` before check-in; otherwise a percentage, rounded down. */
export function cancellationFeePence(booking, today, rates) {
    const daysBeforeCheckIn = toDayNumber(booking.checkIn) - toDayNumber(today);
    if (daysBeforeCheckIn >= rates.freeCancellationDays) return 0;
    return Math.floor((booking.totalPence * rates.lateCancellationPercent) / 100);
}

/** Saved bookings come from localStorage, so check them before trusting them. */
export function parseBookings(savedJson) {
    if (savedJson === null) return { bookings: [], loadFailed: false };
    try {
        const parsed = JSON.parse(savedJson);
        const isValid = Array.isArray(parsed) && parsed.every((b) =>
            b !== null && typeof b === "object" &&
            typeof b.id === "string" &&
            !Number.isNaN(toDayNumber(b.checkIn)) &&
            !Number.isNaN(toDayNumber(b.checkOut)) &&
            Number.isInteger(b.cats) &&
            typeof b.medication === "boolean" &&
            Number.isInteger(b.totalPence));
        return isValid ? { bookings: parsed, loadFailed: false } : { bookings: [], loadFailed: true };
    } catch {
        return { bookings: [], loadFailed: true };
    }
}

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
export function formatPence(pence) {
    return gbp.format(pence / 100);
}

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
export function formatDate(isoDate) {
    return longDate.format(new Date(toDayNumber(isoDate) * MS_PER_DAY));
}
