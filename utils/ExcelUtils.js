/**
 * ExcelUtilsFormatted.js
 * 
 * A drop-in alternative to ExcelUtils.js that PRESERVES all Excel formatting 
 * (cell widths, colors, fonts, borders, fills, merged cells, etc.) when 
 * updating test results.
 * 
 * Uses `exceljs` instead of `xlsx` for write operations, because:
 * - `xlsx` (SheetJS) is data-only - it strips ALL formatting on write
 * - `exceljs` preserves the full Excel model including styles
 * 
 * ─── IMPORTANT ───
 * updateStatus() is ASYNC — callers must use `await`:
 *   await ExcelUtilsFormatted.updateStatus(filePath, sheetName, tc, 'Pass', startTime, endTime, ...);
 * 
 * getTestData() remains synchronous (read-only, no formatting impact).
 */

import ExcelJS from 'exceljs';
import XLSX from 'xlsx';

export default class ExcelUtils {

  /**
   * Updates test execution status in Excel while preserving ALL formatting.
   * 
   * @param {string} filePath   - Absolute path to the .xlsx file
   * @param {string} sheetName  - Sheet name
   * @param {string} testCaseId - Test Case ID to update
   * @param {string} status     - 'Pass' or 'Fail'
   * @param {Date}   startTime  - Test start time
   * @param {Date}   endTime    - Test end time
   * @param {string} actualResult - Optional actual result message
   * @param {string} error      - Optional error message (on failure)
   */
  static async updateStatus(filePath, sheetName, testCaseId, status, startTime, endTime, actualResult = "", error = "") {
    const maxRetries = 2;
    const delayMs = 500;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // ── Load workbook with full formatting model ──
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(sheetName);

        if (!worksheet) {
          throw new Error(`Sheet '${sheetName}' not found.`);
        }

        const duration = ((endTime - startTime) / 1000).toFixed(2);

        // ── Find the target row by matching Test Case ID (column A = index 1) ──
        let targetRowNumber = null;

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row
          const cellValue = row.getCell(1).value; // Column A = "Test Case ID"
          if (cellValue && String(cellValue).trim() === testCaseId) {
            targetRowNumber = rowNumber;
          }
        });

        if (!targetRowNumber) {
          throw new Error(`Test case '${testCaseId}' not found in sheet '${sheetName}'.`);
        }

        const row = worksheet.getRow(targetRowNumber);

        // ── Column mapping (1-indexed, A=1, B=2, ...) ──
        // A(1)=Test Case ID   B(2)=Test Environment    C(3)=Test Module
        // D(4)=Test Summary   E(5)=Test Step/Action    F(6)=Test Data
        // G(7)=Test Type      H(8)=Expected Result      I(9)=Actual Result
        // J(10)=Test Priority K(11)=Execution Date      L(12)=Result
        // M(13)=Start Time    N(14)=End Time            O(15)=Duration(s)

        // Update ONLY the result columns — every other cell is untouched
        row.getCell(12).value = status;                          // L = Result
        row.getCell(11).value = new Date().toLocaleString();     // K = Execution Date
        row.getCell(13).value = startTime.toLocaleString();      // M = Start Time
        row.getCell(14).value = endTime.toLocaleString();        // N = End Time
        row.getCell(15).value = Number(duration);                // O = Duration(s) as number

        if (status === "Pass") {
          row.getCell(9).value = actualResult || "Automation execution completed successfully";
        } else {
          row.getCell(9).value = error || "Error occurred during execution";
        }

        // Commit the row changes to the worksheet
        row.commit();

        // ── Save — writes full workbook including all original styles ──
        await workbook.xlsx.writeFile(filePath);

        break; // Success — exit retry loop

      } catch (e) {
        if (attempt === maxRetries) {
          console.warn(`Warning: Could not update Excel status after ${maxRetries} attempts: ${e.message}`);
        } else {
          const delay = delayMs * attempt;
          console.log(`Retry attempt ${attempt}/${maxRetries}, waiting ${delay}ms...`);
          const now = Date.now();
          while (Date.now() - now < delay) { }
        }
      }
    }
  }


  /**
   * Reads test data from Excel (read-only — no formatting impact).
   * Remains synchronous using `xlsx`.
   * 
   * @param {string} filePath   - Absolute path to the .xlsx file
   * @param {string} sheetName  - Sheet name
   * @param {string} testCaseId - Test Case ID to look up
   * @returns {object} Key-value pairs parsed from "Test Data" column
   */
  static getTestData(filePath, sheetName, testCaseId) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const row = data.find(r => r["Test Case ID"] === testCaseId);

    if (!row) {
      throw new Error(`Test case '${testCaseId}' not found.`);
    }

    const testData = row["Test Data"];
    const values = {};

    testData.split(",").forEach(item => {
      const [key, value] = item.split(":");
      values[key.trim()] = value.trim();
    });

    return values;
  }
}

