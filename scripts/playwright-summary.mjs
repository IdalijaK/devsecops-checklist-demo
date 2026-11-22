// Turns Playwright's JSON results into a table on the GitHub run's Summary page.
import { readFileSync, appendFileSync } from "node:fs";

const results = JSON.parse(readFileSync("playwright-results.json", "utf8"));
const icons = { expected: "● PASS", unexpected: "▲ FAIL", flaky: "◆ FLAKY", skipped: "○ SKIP" };
const rows = [];

function walk(suite, parents = []) {
    const path = suite.title ? [...parents, suite.title] : parents;
    for (const spec of suite.specs ?? []) {
        for (const test of spec.tests) {
            const icon = icons[test.status] ?? test.status;
            rows.push(`| ${icon} | ${[...path, spec.title].join(" › ")} |`);
        }
    }
    for (const child of suite.suites ?? []) walk(child, path);
}
results.suites.forEach((suite) => walk(suite));

const s = results.stats;
const markdown = [
    "## Playwright Test Report",
    "",
    `● ${s.expected} passed · ▲ ${s.unexpected} failed · ◆ ${s.flaky} flaky · ○ ${s.skipped} skipped`,
    "",
    "| Result | Test |",
    "|---|---|",
    ...rows,
    ""
].join("\n");

// On GitHub, write to the Summary page; locally, print it.
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
else console.log(markdown);