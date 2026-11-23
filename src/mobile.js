// Mobile page: the phone frame, rotate and home buttons, and the status-bar clock.
// If this page is loaded inside the phone's iframe, don't draw another phone
if (window.self !== window.top) {
    document.body.classList.add("inside-phone");
    document.getElementById("inception").hidden = false;
}

const phone = document.getElementById("phone");
const frame = document.getElementById("phone-frame");
const status = document.getElementById("phone-status");
const clock = document.getElementById("clock");

document.getElementById("rotate-button").addEventListener("click", () => {
    const landscape = phone.classList.toggle("landscape");
    status.textContent = landscape
        ? "Landscape: 480 × 320. Accelerometer engaged."
        : "Portrait: 320 × 480. Back to normal.";
});

document.getElementById("home-button").addEventListener("click", () => {
    frame.src = "index.html";
    status.textContent = "Home button pressed. Very satisfying click.";
});

function updateClock() {
    clock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
updateClock();
setInterval(updateClock, 30000);
