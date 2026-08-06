# Project rules for AI agents

> These instructions must stay consistent with `/AGENTS.md`. If they ever
> diverge, `AGENTS.md` is authoritative.

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
- `tests/` — Spec files, organized by module and test case ID
  (`tests/<module>/<testCaseId>_<shortName>.spec.js`)
- `testcase/` — Excel test data (`.xlsx`), read and updated via
  `utils/ExcelUtils.js`

## Coding conventions

- Import test from `fixtures/base.js`, never from `@playwright/test` directly
- Use `test.describe` per feature area
- One logical assertion group per test
- Use `test.step()` for readability when a flow has more than 3 actions
- File names: kebab-case (`login-test.spec.js`)

## Locator priority (STRICT — do not deviate)

1. `getByRole` with accessible name
2. `getByLabel` for form fields
3. `getByTestId` (attribute is `data-test-id`)
4. `getByText` only for genuinely static UI text
5. CSS / XPath — forbidden unless approved in PR

## Page Object contract

- One class per page
- Constructor takes `page` only
- Declare all locators in the constructor
- Action methods return `Promise<void>` OR the next page object
- No `expect()` calls inside page objects — assertions belong in tests
- No business logic in tests — put it in page objects or helpers

## Assertion rules

- Web-first assertions only (`expect(locator).toBeVisible()`)
- No `page.waitForTimeout` — ever
- No `waitForSelector` — use locator auto-waiting
- Custom timeouts only when justified in a code comment

## Test data

- Load test data from `testcase/` (Excel) using `ExcelUtils.getTestData(...)`
- Never invent missing test data
- Update execution status (Pass/Fail, Start Time, End Time, Actual Result)
  using `ExcelUtils.updateStatus(...)` after every test run
- Use Test Case IDs (example: `TC_LOGIN_01`) when reading and updating Excel

## When adding a new test

- Reuse existing page objects — do not create parallel infra
- Load test data from `testcase/`, not inline
- Tag tests with `@smoke`, `@regression`, or `@critical` as appropriate

## Forbidden

- Do not skip or comment out failing tests to make CI green
- Do not use `page.evaluate` unless there is no MCP tool alternative
- Do not commit `.env`, credentials, `storage-state.json`, or auth tokens
- Do not modify `playwright.config.js` without asking
- Do not add new npm dependencies without asking
- Do not use `page.pause()` in committed code

## When you (the agent) are unsure

- Ask a clarifying question before generating code
- Prefer a smaller, focused change over a big refactor
- If a required file does not exist, ask before creating it