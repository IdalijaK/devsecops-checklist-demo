// Wires the bookings page to the DOM. Prices and rules live in booking.js (unit tested).
import {
    calculatePrice, cancellationFeePence, formatDate, formatPence, isValidRates,
    nightsBetween, parseBookings, toIsoDate, validateBooking
} from "./booking.js";

const storageKey = "cat-sitting-bookings";
const form = document.getElementById("booking-form");
const checkIn = document.getElementById("check-in");
const checkOut = document.getElementById("check-out");
const cats = document.getElementById("cats");
const medication = document.getElementById("medication");
const quoteRows = document.getElementById("quote-rows");
const bookButton = document.getElementById("book-button");
const message = document.getElementById("booking-message");
const pricesStatus = document.getElementById("prices-status");
const bookingsList = document.getElementById("bookings-list");
const bookingsHeading = document.getElementById("bookings-heading");
const noBookings = document.getElementById("no-bookings");
const priceRules = document.getElementById("price-rules");

let rates = null;
let bookings = loadBookings();

const today = () => toIsoDate(new Date());

function readForm() {
    return {
        checkIn: checkIn.value,
        checkOut: checkOut.value,
        cats: Number(cats.value),
        medication: medication.checked
    };
}

function setMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("is-error", isError);
}

function addRow(label, value) {
    const row = document.createElement("tr");
    const heading = document.createElement("th");
    heading.scope = "row";
    heading.textContent = label;
    const cell = document.createElement("td");
    cell.textContent = value;
    row.append(heading, cell);
    quoteRows.append(row);
}

function renderQuote() {
    quoteRows.replaceChildren();
    if (!rates) return;
    const booking = readForm();
    if (validateBooking(booking, today(), rates).length > 0) {
        addRow("Total", "Choose valid dates to see a price");
        return;
    }
    const nights = nightsBetween(booking.checkIn, booking.checkOut);
    const price = calculatePrice({ ...booking, nights }, rates);
    addRow("Nights", String(nights));
    addRow("Per night", formatPence(price.perNightPence));
    addRow("Subtotal", formatPence(price.subtotalPence));
    if (price.discountPence > 0) {
        addRow("Long-stay discount", `−${formatPence(price.discountPence)}`);
    }
    addRow("Total", formatPence(price.totalPence));
}

function loadBookings() {
    let saved = null;
    try {
        saved = localStorage.getItem(storageKey);
    } catch (error) {
        console.error("Could not read saved bookings.", error);
    }
    const result = parseBookings(saved);
    if (result.loadFailed) setMessage("Could not load your saved bookings.", true);
    return result.bookings;
}

function saveBookings() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(bookings));
    } catch (error) {
        console.error("Could not save bookings.", error);
        setMessage("Could not save bookings in this browser.", true);
    }
}

function describe(booking) {
    const nights = nightsBetween(booking.checkIn, booking.checkOut);
    const catWord = booking.cats === 1 ? "cat" : "cats";
    return `${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}: `
        + `${nights} ${nights === 1 ? "night" : "nights"}, ${booking.cats} ${catWord}, ${formatPence(booking.totalPence)}`;
}

function renderBookings() {
    bookingsList.replaceChildren();
    noBookings.hidden = bookings.length > 0;
    for (const booking of bookings) {
        const item = document.createElement("li");
        const text = document.createElement("span");
        text.textContent = describe(booking);
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = "Cancel";
        cancel.setAttribute("aria-label", `Cancel booking from ${formatDate(booking.checkIn)}`);
        cancel.disabled = !rates;
        cancel.addEventListener("click", () => cancelBooking(booking.id));
        item.append(text, cancel);
        bookingsList.append(item);
    }
}

function cancelBooking(id) {
    const booking = bookings.find((b) => b.id === id);
    if (!booking || !rates) return;
    const fee = cancellationFeePence(booking, today(), rates);
    bookings = bookings.filter((b) => b.id !== id);
    saveBookings();
    renderBookings();
    setMessage(fee === 0
        ? "Booking cancelled. No fee."
        : `Booking cancelled. Late cancellation fee: ${formatPence(fee)}.`);
    bookingsHeading.focus(); // the button is gone, so keep keyboard users in a sensible place
}

form.addEventListener("input", () => {
    setMessage("");
    renderQuote();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!rates) return;
    const booking = readForm();
    const errors = validateBooking(booking, today(), rates);
    if (errors.length > 0) {
        setMessage(errors[0], true);
        return;
    }
    const nights = nightsBetween(booking.checkIn, booking.checkOut);
    const { totalPence } = calculatePrice({ ...booking, nights }, rates);
    const saved = { id: crypto.randomUUID(), ...booking, totalPence };
    bookings = [...bookings, saved].sort((a, b) => a.checkIn.localeCompare(b.checkIn));
    saveBookings();
    renderBookings();
    setMessage(`Booked: ${describe(saved)}.`);
    form.reset();
    renderQuote();
});

function renderRules() {
    const rules = [
        `${formatPence(rates.nightlyRatePence)} a night for one cat`,
        `${formatPence(rates.extraCatPence)} a night for each extra cat (up to ${rates.maxCats})`,
        `${formatPence(rates.medicationPence)} a night if your cat needs medication`,
        `${rates.longStayDiscountPercent}% off stays of ${rates.longStayNights} nights or more`,
        `Free cancellation up to ${rates.freeCancellationDays} days before check-in; `
            + `after that, ${rates.lateCancellationPercent}% of the total`
    ];
    priceRules.replaceChildren(...rules.map((rule) => {
        const item = document.createElement("li");
        item.textContent = rule;
        return item;
    }));
}

async function loadRates() {
    form.setAttribute("aria-busy", "true");
    try {
        const response = await fetch("data/rates.json");
        if (!response.ok) throw new Error(`Prices request failed: ${response.status}`);
        const data = await response.json();
        if (!isValidRates(data)) throw new Error("Prices were in an unexpected format.");
        rates = data;
        pricesStatus.textContent = "Prices loaded.";
        checkIn.min = today();
        bookButton.disabled = false;
        renderRules();
    } catch (error) {
        console.error(error);
        pricesStatus.textContent = "Prices could not be loaded. Please try again later.";
        pricesStatus.classList.add("is-error");
    } finally {
        form.removeAttribute("aria-busy");
        renderQuote();
        renderBookings();
    }
}

renderBookings();
loadRates();
