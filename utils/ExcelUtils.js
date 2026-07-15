import XLSX from 'xlsx';

export default class ExcelUtils {

    static updateStatus(filePath, sheetName, testCaseId, status, startTime, endTime, error = "") {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const duration = ((new Date(endTime) - new Date(startTime)) / 1000).toFixed(2);

    data.forEach(row => {
        if (row["Test Case ID"] === testCaseId) {
            row["Result"] = status;
            row["Execution Date"] = new Date().toLocaleString();
            row["Comments"] = error || "Automation execution completed successfully";
            row["Start Time"] = new Date(startTime).toLocaleString();   // ✅ formatted
            row["End Time"]   = new Date(endTime).toLocaleString();     // ✅ formatted
            row["Duration(s)"] = duration;
        }
    });

    // Explicit header order
    const headers = [
        "Test Case ID",
        "Test Environment",
        "Test Module",
        "Test Summary",
        "Test Step / Action",
        "Test Data",          // ✅ keep Test Data here
        "Test Type",
        "Expected Result",
        "Test Priority",
        "Execution Date",
        "Result",
        "Comments",
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


