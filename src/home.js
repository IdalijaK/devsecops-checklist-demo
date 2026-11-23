// Wires the checklist page to the DOM. Logic lives in checklist.js (unit tested).
import { calculateProgress, isComplete, parseTasks, removeTask } from "./checklist.js";

const storageKey = "cat-checklist-tasks";
const defaultTasks = [
    { text: "Feed the cat", completed: false, isDefault: true },
    { text: "Change the cat's water", completed: false, isDefault: true },
    { text: "Play with the cat", completed: false, isDefault: true },
    { text: "Brush the cat's teeth", completed: false, isDefault: true }
];
const checklist = document.getElementById("checklist");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskStatus = document.getElementById("task-status");
const progress = document.getElementById("progress");
function loadTasks() {
    let saved = null;
    try {
        saved = localStorage.getItem(storageKey);
    } catch (error) {
        console.error("Could not read saved tasks.", error);
    }
    const { tasks: loaded, loadFailed } = parseTasks(saved, defaultTasks);
    if (loadFailed) {
        taskStatus.textContent = "Could not load your saved tasks, so the default list is shown.";
    }
    return loaded;
}

let tasks = loadTasks();

function saveTasks() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        taskStatus.textContent = "";
    } catch (error) {
        console.error("Could not save tasks.", error);
        taskStatus.textContent = "Could not save tasks in this browser.";
    }
}

function updateProgress() {
    const done = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    progress.textContent = isComplete(done, total)
        ? "100% done - all finished!"
        : `${calculateProgress(done, total)}% done`;
}

function renderTasks() {
    checklist.textContent = "";

    tasks.forEach((task, index) => {
        const item = document.createElement("li");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            updateProgress();
        });

        label.append(checkbox, ` ${task.text}`);

        item.append(label);
        if (!task.isDefault) {
            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "Remove";
            removeButton.setAttribute("aria-label", `Remove ${task.text}`);
            removeButton.addEventListener("click", () => {
                tasks = removeTask(tasks, index);
                saveTasks();
                renderTasks();
                taskStatus.textContent = `Removed "${task.text}".`;
                taskInput.focus(); // the button no longer exists, so keep keyboard users in a sensible place
            });
            item.append(removeButton);
        }
        checklist.append(item);
    });

    updateProgress();
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text) {
        taskStatus.textContent = "Enter a task before adding it.";
        return;
    }

    tasks.push({ text, completed: false, isDefault: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
});

renderTasks();
