# Project rules for AI agents

You are working in a Playwright JavaScript automation project.
Follow these rules for every code change.

## Stack

- Playwright 1.56+ with JavaScript
- Node 20+
- Test runner: @playwright/test
- Reporter: Allure + built-in HTML
- CI: GitHub Actions, sharded

## Folder structure

- `pages/` — Page Object classes (one file per page)
- `fixtures/` — Custom fixtures extending base test
- `utils/` — Pure helpers, no test logic
- `tests/` — Spec files
- `testcase/` — Excel test data

## Coding conventions

- Import test from `fixtures/base.js`, never from `@playwright/test` directly
- Use `test.describe` per feature area
- One logical assertion group per test
- File names: kebab-case (`login-test.spec.js`)

## Locator priority (STRICT — do not deviate)

1. `getByRole` with accessible name
2. `getByLabel` for form fields
3. `getByTestId` (attribute is `data-test-id`)
4. `getByText` only for genuinely static UI text
5. CSS / XPath — forbidden unless approved

## Page Object contract

- One class per page
- Constructor accepts only `page`
- Keep all locators inside the page object
- Action methods return `Promise<void>` or the next page object
- No `expect()` calls inside page objects
- No business logic in test files

## Assertion rules

- Use web-first assertions (`expect(locator).toBeVisible()`)
- Never use `page.waitForTimeout()`
- Never use `page.waitForSelector()`
- Use Playwright auto-waiting

## Test data

- Load test data from `testcase/` (Excel) or `testdata/` (JSON/CSV)
- Update execution status using `utils/ExcelUtils.js`
- Use Test Case IDs (example: `TC_LOGIN_01`) when reading and updating Excel

## When adding a new test

- Reuse existing page objects
- Do not create duplicate page objects
- Tag tests with `@smoke`, `@regression`, or `@critical`

## Forbidden

- Do not skip or comment out failing tests
- Do not use `page.evaluate()` unless absolutely necessary
- Do not commit `.env`, credentials, `storage-state.json`, or auth tokens
- Do not modify `playwright.config.js` without asking
- Do not add new npm dependencies without asking
- Do not use `page.pause()` in committed code

## When unsure

- Ask a clarifying question before generating code
- Prefer a small focused change over a large refactor
- Do not create new files unless requested