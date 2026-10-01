# Project rules for AI agents

You are working in a Playwright JavaScript automation project.
Follow these rules for every code change.

This file (`AGENTS.md`) is the single source of truth for this project.
`.github/copilot-instructions.md` exists only as a pointer to this file for
GitHub Copilot — it has no rules of its own. If any other document
(including the individual `.agent.md` files) conflicts with this file,
**this file wins.**

## Stack

- Playwright 1.56+ with JavaScript (not TypeScript)
- Node 20+
- Test runner: @playwright/test
- Reporter: Allure + built-in HTML
- CI: GitHub Actions, sharded

## Folder structure

- `pages/` — Page Object classes (one file per page)
- `fixtures/` — Custom fixtures extending base test (`fixtures/base.js`)
- `utils/` — Pure helpers, no test logic (includes `utils/ExcelUtils.js`)
- `tests/` — Spec files, organized as `tests/<module>/<testCaseId>_<shortName>.spec.js`
- `testcase/` — Excel test data (e.g. `testcase/Commerce_Hub_AI_Test_cases.xlsx`),
  read and written via `utils/ExcelUtils.js`. This is the only test-data format
  used in this project — do not introduce JSON/CSV test-data files.

The Planner agent writes test scenarios directly into the `testcase/*.xlsx`
workbook. It does not produce Markdown plans, and there is no `specs/` folder
in this project.

## Coding conventions

- Import test from `fixtures/base.js`, never from `@playwright/test` directly
- Use `test.describe` per feature area
- One logical assertion group per test
- Use `test.step()` for readability whenever a flow has more than 3 user actions
- File names: kebab-case (`login-test.spec.js`)
- File type: `.js` only — this project does not use `.ts`

## Locator priority (STRICT — do not deviate)

1. `getByRole` with accessible name
2. `getByLabel` for form fields
3. `getByTestId` (attribute is `data-test-id`)
4. `getByText` only for genuinely static UI text
5. CSS / XPath — forbidden unless explicitly approved

If no unique semantic locator exists, stop and ask the user rather than
inventing a CSS/XPath selector.

## Page Object contract

- One class per page
- Constructor accepts only `page`
- Declare all locators inside the page object (constructor or class fields)
- Action methods return `Promise<void>` or the next page object
- No `expect()` calls inside page objects — assertions belong in tests
- No business logic in test files — put it in page objects or helpers
- All interactions go through `AllPageObjects` (`pages/all_objects.js`) —
  never call `page.locator(...)` directly inside a spec file
- Do not duplicate existing page object functionality — reuse what exists

## Assertion rules

- Use web-first assertions only (`expect(locator).toBeVisible()`,
  `toHaveText()`, `toContainText()`, `toHaveCount()`, `toHaveURL()`, `toHaveTitle()`)
- Never use `page.waitForTimeout()`
- Never use `page.waitForSelector()`
- Use Playwright's auto-waiting instead
- Custom timeouts only when justified in a code comment
- Keep URL/title expected values and other assertion test data in a JSON
  file and reference them from the test, rather than hardcoding

## Test data

- Load test data from `testcase/` (Excel), via `utils/ExcelUtils.js`
- Never hardcode URL, username, password, or environment — always retrieve
  them through `ExcelUtils.js`
- Never invent missing test data — if a value isn't in the sheet, ask
- Update execution status (Pass/Fail, start/end time, actual result) using
  `utils/ExcelUtils.js`
- Use Test Case IDs (example: `TC_LOGIN_01`) when reading and updating Excel

## When adding a new test

- Reuse existing page objects — do not create parallel infrastructure
- Do not create duplicate page objects
- Tag every test title with one of `@smoke`, `@regression`, `@critical`, `@flaky-risk`
- Generate roughly two meaningful assertions per test unless the test case
  requires more

## Forbidden

- Do not skip or comment out failing tests, or use `test.skip`/`test.fixme`
  to force CI green
- Do not use `page.evaluate()` unless there is no MCP tool alternative
- Do not commit `.env`, credentials, `storage-state.json`, or auth tokens
- Do not modify `playwright.config.js` without asking
- Do not add new npm dependencies without asking
- Do not use `page.pause()` in committed code
- Do not weaken assertions to make a test pass
- Do not mark a test Pass in Excel without a successful assertion run

## When unsure

- Ask a clarifying question before generating code
- Prefer a small, focused change over a large refactor
- Do not create new files unless requested
- If a required file does not exist, ask before creating it
