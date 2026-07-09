import XLSX from 'xlsx';

export default class ExcelUtils {

    static getWorksheet(filePath, sheetName) {
        const workbook = XLSX.readFile(filePath);
        return workbook.Sheets[sheetName];
    }

    // Read a single cell (Example: A2)
    static getCellValue(filePath, sheetName, cellAddress) {
        const sheet = this.getWorksheet(filePath, sheetName);
        return sheet[cellAddress]?.v;
    }

    // Read all rows
    static getAllData(filePath, sheetName) {

    const workbook = XLSX.readFile(filePath);

    console.log("Available Sheets:", workbook.SheetNames);

    const worksheet = workbook.Sheets[sheetName];

    console.log("Worksheet:", worksheet);

    return XLSX.utils.sheet_to_json(worksheet);
}

    // Read a specific row
    static getRow(filePath, sheetName, rowNumber) {

        const data = this.getAllData(filePath, sheetName);

        return data[rowNumber - 2];

    }

    // Read a value using column name
    static getValue(filePath, sheetName, rowNumber, columnName) {

        const row = this.getRow(filePath, sheetName, rowNumber);

        return row[columnName];

    }

    
    static updateStatus(filePath, sheetName, testCaseId, status, startTime, endTime, error = "") {

        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet);

        const duration =
            ((new Date(endTime) - new Date(startTime)) / 1000).toFixed(2);

        data.forEach(row => {

            if (row.TestcaseID === testCaseId) {

                row.Status = status;
                row["Start Time"] = startTime;
                row["End Time"] = endTime;
                row["Duration(s)"] = duration;
                row["Error"] = error;   

            }

        });

        workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(data);

        XLSX.writeFile(workbook, filePath);

    }

}