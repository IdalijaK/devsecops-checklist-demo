// application logic (no DOM), imported by index.html, contact.html & Vitest tests.

export function calculateProgress(completed, total) {
    if (total === 0) return 0; // guard: 0 / 0 would be NaN
    return Math.round((completed / total) * 100);
}

export function isComplete(completed, total) {
    return total > 0 && completed === total;
}

export function removeTask(tasks, index) {
    if (tasks[index]?.isDefault) return tasks;
    return tasks.filter((_, taskIndex) => taskIndex !== index);
}

export function isValidEmail(email) {
    if (typeof email !== "string") return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

// Saved data comes from outside the app (localStorage), so check it before trusting it.
export function parseTasks(savedJson, defaultTasks) {
    const freshDefaults = () => defaultTasks.map((task) => ({ ...task }));
    if (savedJson === null) return { tasks: freshDefaults(), loadFailed: false };

    try {
        const parsed = JSON.parse(savedJson);
        const isValid = Array.isArray(parsed) && parsed.every((task) =>
            task !== null &&
            typeof task === "object" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean");
        return isValid
            ? { tasks: parsed, loadFailed: false }
            : { tasks: freshDefaults(), loadFailed: true };
    } catch {
        return { tasks: freshDefaults(), loadFailed: true };
    }
}
