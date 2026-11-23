export const checklistData = {
    defaultTaskCount: 4,
    customTask: "Buy cat food",
    initialProgress: "0% done",
    completedProgress: "20% done",
    quarterProgress: "25% done",
    halfProgress: "50% done",
    threeQuarterProgress: "75% done",
    fullyCompleteProgress: "100% done - all finished!",
    // Saved values that parse or fail in different ways; each must fall back to the defaults.
    invalidSavedTasks: ["not json{", "null", "{}", "[{\"text\":1}]"],
    loadFailedMessage: "Could not load your saved tasks, so the default list is shown."
};

export const contactData = {
    invalidEmail: "not-an-email",
    invalidMessage: "Please enter a valid email address.",
    validEmail: "cat@example.com",
    validMessage: "Thanks! This is a demo form, so nothing was sent."
};

export const mobileData = {
    landscapeStatus: "Landscape: 480 × 320. Accelerometer engaged.",
    portraitStatus: "Portrait: 320 × 480. Back to normal."
};
