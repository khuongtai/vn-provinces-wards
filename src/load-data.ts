// Import required libraries
import * as XLSX from "xlsx"; // for reading and processing Excel files
import * as fs from "fs"; // for file system operations (read/write)
import * as path from "path"; // for handling absolute paths

// Path to the Excel file containing the administrative division data
const EXCEL_FILE = path.resolve(
  __dirname,
  "./excel/danh-sach-phuong-xa-moi-2025.xlsx"
);

// Path to the output folder where JSON files will be stored
const JSON_PATH = path.resolve(__dirname, "./json_data");

// --- Read Excel file ---
const workbook = XLSX.readFile(EXCEL_FILE); // open Excel file
const firstSheetName = workbook.SheetNames[0]!; // get the first sheet name
const sheet = workbook.Sheets[firstSheetName]!; // get sheet content

// Convert sheet -> JSON (each row in Excel becomes an object)
const rows = XLSX.utils.sheet_to_json(sheet, { raw: true });

// Initialize data structures
let provinces: Record<string, any> = {}; // object containing all provinces
let wardsArray: any[] = []; // array containing all wards

// Loop through each row from Excel
for (const row of rows as any[]) {
  const provinceCode = row["provinceCodeBNV"]?.toString(); // province code
  const wardCode = row["wardCode"]?.toString(); // ward code

  // Skip if codes are missing
  if (!provinceCode || !wardCode) continue;

  // ---- Province ----
  // If this province doesn’t exist yet, create it
  if (!provinces[provinceCode]) {
    provinces[provinceCode] = {
      code: provinceCode, // province code
      name: row["provinceName"] || "", // province name
      unit: row["provinceUnit"] || "Province/City", // administrative unit
      wards: {}, // wards under this province
    };
  }

  const province = provinces[provinceCode]; // current province

  // ---- Ward ----
  // If this ward doesn’t exist yet, create it
  if (!province.wards[wardCode]) {
    const ward = {
      code: wardCode, // ward code
      name: row["wardName"] || "", // ward name
      unit: row["wardUnit"] || "Ward/Commune/Town", // administrative unit
      province_code: provinceCode, // link to province code
      province_name: province.name, // link to province name
      full_name: `${row["wardName"]}, ${province.name}`, // full formatted name
    };

    province.wards[wardCode] = ward; // add ward to province
    wardsArray.push(ward); // also add to global ward array
  }
}

// Create JSON folder if it does not exist
if (!fs.existsSync(JSON_PATH)) {
  fs.mkdirSync(JSON_PATH, { recursive: true });
}

// --- Write JSON output files ---

// Save tree structure: province containing its wards
fs.writeFileSync(
  path.join(JSON_PATH, "tree.json"),
  JSON.stringify(provinces, null, 2), // pretty-print JSON
  "utf-8"
);

// Save only provinces list (code, name, unit)
fs.writeFileSync(
  path.join(JSON_PATH, "provinces.json"),
  JSON.stringify(
    Object.values(provinces).map((p: any) => ({
      code: p.code,
      name: p.name,
      unit: p.unit,
    })),
    null,
    2
  ),
  "utf-8"
);

// ⚠️ WARNING: This overwrites tree.json again
// This time it saves provinces as an array instead of object
fs.writeFileSync(
  path.join(JSON_PATH, "tree.json"),
  JSON.stringify(Object.values(provinces), null, 2),
  "utf-8"
);
