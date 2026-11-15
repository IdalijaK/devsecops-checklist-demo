import { describe, test, expect } from "vitest";
import {
    calculateProgress,
    isComplete,
    isValidEmail,
    removeTask
} from "../src/checklist.js";

describe("calculateProgress", () => {
    test("nothing ticked is 0%", () => {
        expect(calculateProgress(0, 4)).toBe(0);
    });

    test("all ticked is 100%", () => {
        expect(calculateProgress(4, 4)).toBe(100);
    });

    test("1 out of 3 rounds down to 33%", () => {
        expect(calculateProgress(1, 3)).toBe(33);
    });

    test("2 out of 3 rounds up to 67%", () => {
        expect(calculateProgress(2, 3)).toBe(67);
    });

    test("5 out of 7 rounds to 71%", () => {
        expect(calculateProgress(5, 7)).toBe(71);
    });

    // // delete the guard in src/checklist.js to see this go red
    test("empty checklist is 0%, not NaN", () => {
        expect(calculateProgress(0, 0)).toBe(0);
    });
});

describe("isComplete", () => {
    test("all ticked is complete", () => {
        expect(isComplete(4, 4)).toBe(true);
    });

    test("some ticked is not complete", () => {
        expect(isComplete(2, 4)).toBe(false);
    });

    test("an empty checklist is not complete", () => {
        expect(isComplete(0, 0)).toBe(false);
    });
});

describe("removeTask", () => {
    const defaults = [
        { text: "Feed the cat", completed: false, isDefault: true },
        { text: "Change the cat's water", completed: false, isDefault: true }
    ];

    test("does not remove a default task", () => {
        expect(removeTask([...defaults], 0)).toEqual(defaults);
    });

    test("removes a custom task while keeping defaults", () => {
        const tasks = [
            ...defaults,
            { text: "Buy cat food", completed: false, isDefault: false }
        ];

        expect(removeTask(tasks, 2)).toEqual(defaults);
    });
});

describe("isValidEmail", () => {
    // happy paths
    test("accepts a normal address", () => {
        expect(isValidEmail("john@example.com")).toBe(true);
    });

    test("ignores spaces around the address", () => {
        expect(isValidEmail("  john@example.com  ")).toBe(true);
    });

    // unhappy paths
    test("only @ fails", () => {
        expect(isValidEmail("@")).toBe(false);
    });

    test("missing domain fails", () => {
        expect(isValidEmail("john@")).toBe(false);
    });

    test("space inside the address fails", () => {
        expect(isValidEmail("jo hn@example.com")).toBe(false);
    });

    test("non-string input fails", () => {
        expect(isValidEmail(null)).toBe(false);
        expect(isValidEmail(123)).toBe(false);
    });
});
