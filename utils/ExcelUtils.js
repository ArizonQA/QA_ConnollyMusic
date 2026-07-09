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

}