© 2026 Ida. All rights reserved. Shared as a portfolio piece; please don't reuse without permission.

[![CI](https://github.com/IdalijaK/devsecops-checklist-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/IdalijaK/devsecops-checklist-demo/actions/workflows/ci.yml)
[![CodeQL](https://github.com/IdalijaK/devsecops-checklist-demo/actions/workflows/codeql.yml/badge.svg)](https://github.com/IdalijaK/devsecops-checklist-demo/actions/workflows/codeql.yml)

A small HTML/CSS/JavaScript checklist site I built from scratch while learning JavaScript.
Used to demonstrate DevSecOps: security checks that run automatically on every change.

**Live site:** https://idalijak.github.io/devsecops-checklist-demo/

## Run it locally

Requires Node.js 24 and Python 3.

    npm ci
    npm test
    py -m http.server 8000 --bind 127.0.0.1

Then open http://localhost:8000

`npm ci` installs exactly what's in `package-lock.json`, the same as the pipeline.

## Browser tests

Install the Playwright browser once, then run the end-to-end tests:

    npx playwright install chromium
    npm run test:e2e

The Playwright configuration starts the local site server automatically.
To step through tests visually: `npx playwright test --ui`.
To see the last report, with traces for failed tests: `npx playwright show-report`.

The browser suite separates responsibilities:

- `e2e/*.spec.ts` contains test scenarios.
- `e2e/pages/*.page.ts` contains UI page objects. All locators live here.
- `e2e/api/*.api.ts` contains HTTP API clients.
- `e2e/test-data/*.ts` contains test data.

The app code is split the same way:

- `src/checklist.js` contains pure logic with no DOM, covered by the unit tests in `tests/`.
- `src/home.js`, `contact.js`, `about.js` and `mobile.js` connect that logic to each page.

## How the tests are written

- Elements are found by role and label, the way users find them, so tests survive layout changes.
- No fixed waits: Playwright waits for elements, and its assertions retry.
- Every test runs in a fresh browser, so tests can run in any order and in parallel.
- Each feature is broken on purpose once, to prove its test goes red.

## Security checks in this repo

| Check | What it does | Standard |
|---|---|---|
| Unit tests (Vitest) | Checks the logic works on every pull request | NCSC 1.3 |
| Playwright tests (UI + API) | Checks user journeys in a browser and that every page and file responds correctly | NCSC 1.3 |
| Dependency scan (`npm audit`) | Fails on high or critical known vulnerabilities in packages | NCSC 1.2, 3.3 · OWASP A03:2025 |
| Package signatures (`npm audit signatures`) | Checks packages were signed by the npm registry | NCSC 1.2 |
| Dependency review | Blocks pull requests that add a vulnerable package | NCSC 1.2 |
| CodeQL | Scans my own code for bugs like cross-site scripting | NCSC 1.4 · OWASP A05:2025 |
| Secret scanning | Blocks pushes that contain passwords or tokens | NCSC 2.1 |
| Dependabot | Opens weekly update pull requests, with a 7-day cooldown | NCSC 3.3 |
| Content Security Policy | Pages only run scripts from this site | OWASP A05:2025 |
| Protected `main` branch | No direct pushes; checks must pass before merging | NCSC 2.1 |

NCSC = the UK [Software Security Code of Practice](https://www.gov.uk/government/publications/software-security-code-of-practice/software-security-code-of-practice) (May 2025).
OWASP = [Top 10:2025](https://owasp.org/Top10/2025/0x00_2025-Introduction).

## What the pipeline has caught

- **A package it couldn't verify:** a Dependabot update failed the signature check because the
  pipeline used an old npm. Moving to Node 24 fixed it, and the update then passed all tests.
- **A typo:** the first pull request after protecting `main` had a typo. Playwright went red and
  the Merge button stayed locked until it was fixed.
- **Bad saved data:** saved tasks that weren't a valid list emptied the checklist.
  I reproduced it with a failing test first, then fixed it.

## Next steps

- [ ] Pin GitHub Actions to full commit SHAs
- [ ] Export a software bill of materials (SBOM) from the pipeline
- [ ] Type-check the TypeScript in the pipeline
- [ ] Automated accessibility check on each page

## Reporting a security issue

See [SECURITY.md](SECURITY.md).
