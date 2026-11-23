// Contact form behaviour. isValidEmail is unit tested in tests/checklist.test.js.
import { isValidEmail } from "./checklist.js";

const form = document.getElementById("contact-form");
const message = document.getElementById("form-message");
const emailInput = document.getElementById("email");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // practice site: nothing is actually sent
    const validEmail = isValidEmail(emailInput.value);
    emailInput.setAttribute("aria-invalid", String(!validEmail));
    message.classList.toggle("is-error", !validEmail);
    message.textContent = validEmail
        ? "Thanks! This is a demo form, so nothing was sent."
        : "Please enter a valid email address.";
});

emailInput.addEventListener("input", () => {
    if (emailInput.getAttribute("aria-invalid") === "true" && isValidEmail(emailInput.value)) {
        emailInput.setAttribute("aria-invalid", "false");
        message.classList.remove("is-error");
        message.textContent = "";
    }
});
