// About page: one button that changes the message (no inline onclick, so a strict CSP allows it).
document.getElementById("surprise-button").addEventListener("click", () => {
    document.getElementById("message").textContent = "WHAT HAVE YOU DONE!";
});
