export const staticServerEndpoints = [
    { path: "/", contentType: "text/html" },
    { path: "/contact.html", contentType: "text/html" },
    { path: "/mobile.html", contentType: "text/html" },
    { path: "/src/checklist.js", contentType: "text/javascript" },
    { path: "/css/theme.css", contentType: "text/css" }
] as const;

export const missingEndpoint = "/does-not-exist";
