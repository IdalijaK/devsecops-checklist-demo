// Prices come from data/rates.json: £25.00 a night, £8.00 per extra cat per night,
// £3.00 medication per night, 10% off 7+ nights. Expected values are worked out by hand.

// Every booking test runs on this fixed "today", so results never depend on the real date.
export const today = new Date("2026-11-24T10:00:00");

export const priceCases = [
    {
        name: "a standard stay: 3 nights × £25.00",
        booking: { checkIn: "2026-12-01", checkOut: "2026-12-04" },
        nights: "3", total: "£75.00", discount: null
    },
    {
        name: "the night before the discount starts: 6 nights × £25.00",
        booking: { checkIn: "2026-12-01", checkOut: "2026-12-07" },
        nights: "6", total: "£150.00", discount: null
    },
    {
        name: "the first night with the discount: 7 × £25.00 = £175.00, minus 10%",
        booking: { checkIn: "2026-12-01", checkOut: "2026-12-08" },
        nights: "7", total: "£157.50", discount: "−£17.50"
    },
    {
        name: "3 cats with medication: 2 × (£25.00 + 2 × £8.00 + £3.00)",
        booking: { checkIn: "2026-12-01", checkOut: "2026-12-03", cats: 3, medication: true },
        nights: "2", total: "£88.00", discount: null
    },
    {
        name: "across the UK clock change on 28 March 2027: still 2 nights",
        booking: { checkIn: "2027-03-27", checkOut: "2027-03-29" },
        nights: "2", total: "£50.00", discount: null
    }
] as const;

export const invalidCases = [
    {
        name: "check-in in the past",
        booking: { checkIn: "2026-11-23", checkOut: "2026-11-26" },
        message: "Check-in can't be in the past."
    },
    {
        name: "check-out on the same day as check-in",
        booking: { checkIn: "2026-12-01", checkOut: "2026-12-01" },
        message: "Check-out must be after check-in."
    },
    {
        name: "a stay longer than 28 nights",
        booking: { checkIn: "2026-12-01", checkOut: "2026-12-30" },
        message: "Bookings can be up to 28 nights."
    }
] as const;

export const freeCancellation = {
    booking: { checkIn: "2026-11-26", checkOut: "2026-11-28" },   // 2 days ahead: free
    checkInLabel: "26 November 2026",
    message: "Booking cancelled. No fee."
};

export const lateCancellation = {
    booking: { checkIn: "2026-11-25", checkOut: "2026-11-26" },   // tomorrow: 50% of £25.00
    checkInLabel: "25 November 2026",
    message: "Booking cancelled. Late cancellation fee: £12.50."
};

export const savedBooking = {
    booking: { checkIn: "2026-12-10", checkOut: "2026-12-12", cats: 2 },
    summary: "10 December 2026 to 12 December 2026: 2 nights, 2 cats, £66.00"
};

export const ratesUnavailableMessage = "Prices could not be loaded. Please try again later.";
export const ratesUrl = "**/data/rates.json";
