export const staticServerEndpoints = [
    { path: "/", contentType: "text/html" },
    { path: "/contact.html", contentType: "text/html" },
    { path: "/mobile.html", contentType: "text/html" },
    { path: "/src/checklist.js", contentType: "text/javascript" },
    { path: "/css/theme.css", contentType: "text/css" },
    { path: "/bookings.html", contentType: "text/html" },
    { path: "/data/rates.json", contentType: "application/json" }
] as const;

export const missingEndpoint = "/does-not-exist";
