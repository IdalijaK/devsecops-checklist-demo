# prototype_v3.7

A small HTML/CSS/JavaScript checklist site I built from scratch while learning JavaScript.
I use it to demonstrate DevSecOps: security checks that run automatically on every change.

## Run it locally

    npm install
    npm test
    py -m http.server 8000 --bind 127.0.0.1

Then open http://localhost:8000

## Security checks in this repo

| Check | What it does | Standard |
|---|---|---|
| Unit tests (Vitest) | Checks the logic works on every pull request | NCSC 1.3 |
| Dependency scan (`npm audit`) | Fails on high or critical known vulnerabilities in packages | NCSC 1.2, 3.3 · OWASP A03:2025 |
| Dependency review | Blocks pull requests that add a vulnerable package | NCSC 1.2 |
| CodeQL | Scans my own code for bugs like cross-site scripting | NCSC 1.4 · OWASP A05:2025 |
| Secret scanning | Blocks pushes that contain passwords or tokens | NCSC 2.1 |
| Dependabot | Opens weekly update pull requests, with a 7-day cooldown | NCSC 3.3 |

NCSC = the UK [Software Security Code of Practice](https://www.gov.uk/government/publications/software-security-code-of-practice/software-security-code-of-practice) (May 2025).
OWASP = [Top 10:2025](https://owasp.org/Top10/2025/0x00_2025-Introduction).

## Reporting a security issue

See [SECURITY.md](SECURITY.md).