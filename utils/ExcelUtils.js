import XLSX from 'xlsx';

export default class ExcelUtils {

  static updateStatus(filePath, sheetName, testCaseId, status, startTime, endTime, actualResult = "", error = "") {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  const duration = ((endTime - startTime) / 1000).toFixed(2);

  data.forEach(row => {
    if (row["Test Case ID"] === testCaseId) {
      row["Result"] = status;
      row["Execution Date"] = new Date().toLocaleString();

      if (status === "Pass") {
        row["Actual Result"] = actualResult || "Automation execution completed successfully";
      } else {
        row["Actual Result"] = error || "Error occurred during execution";
      }

      row["Start Time"] = startTime.toLocaleString();
      row["End Time"]   = endTime.toLocaleString();
      row["Duration(s)"] = duration;
    }
  });

  const headers = [
    "Test Case ID",
    "Test Environment",
    "Test Module",
    "Test Summary",
    "Test Step / Action",
    "Test Data",
    "Test Type",
    "Expected Result",
    "Actual Result",
    "Test Priority",
    "Execution Date",
    "Result",
    "Start Time",
    "End Time",
    "Duration(s)"
  ];

  workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(data, { header: headers });
  XLSX.writeFile(workbook, filePath);
}


static getTestData(filePath, sheetName, testCaseId) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const row = data.find(rows => rows["Test Case ID"] === testCaseId);
    return row ? row["Test Data"] : null;
}



}


