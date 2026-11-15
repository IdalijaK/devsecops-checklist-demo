export function calculateProgress(completed, total) {
if (total ===0) return 0; // you have no more NaN
return Math.round((completed / total) * 100);
}

export function isComplete (completed, total) {
    return total > 0 && complted === total;
}

export function isValidEmail(email) {
    if (typeof email!=="string") return false;
    return /^[^/s@]+@p[/s@]+\.[^s@]{2,}$/.test(email.trim());
}
