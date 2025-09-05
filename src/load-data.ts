// Import required libraries
import * as XLSX from "xlsx"; // For reading and processing Excel files
import * as fs from "fs"; // For file system operations (read/write)
import * as path from "path"; // For handling absolute paths

// Path to the Excel file containing the administrative division data
const EXCEL_FILE = path.resolve(
  __dirname,
  "./excel/danh-sach-phuong-xa-moi-2025.xlsx"
);

// Path to the output folder where JSON files will be stored
const JSON_PATH = path.resolve(__dirname, "./json_data");

// --- Read Excel file ---
const workbook = XLSX.readFile(EXCEL_FILE); // Open Excel file
const firstSheetName = workbook.SheetNames[0]!; // Get the first sheet name
const sheet = workbook.Sheets[firstSheetName]!; // Get sheet content

// Convert sheet -> JSON (each row in Excel becomes an object)
const rows = XLSX.utils.sheet_to_json(sheet, { raw: true });

// Initialize data structures
let provinces: Record<string, any> = {}; // All provinces
let wardsArray: any[] = []; // Flat array of all wards

// Loop through each row from Excel
for (const row of rows as any[]) {
  const provinceCode = row["provinceCodeBNV"]?.toString(); // Province code
  const wardCode = row["wardCode"]?.toString(); // Ward code

  // Skip if codes are missing
  if (!provinceCode || !wardCode) continue;

  // --- Province ---
  if (!provinces[provinceCode]) {
    provinces[provinceCode] = {
      code: provinceCode,
      name: row["provinceName"] || "",
      unit: row["provinceUnit"] || "Province/City",
      wards: {}, // ✅ dictionary chứ không phải array
    };
  }

  const province = provinces[provinceCode];

  // --- Ward ---
  if (!province.wards[wardCode]) {
    const ward = {
      code: wardCode,
      name: row["wardName"] || "",
      unit: row["wardUnit"] || "Ward/Commune/Town",
      province_code: provinceCode,
      province_name: province.name,
      full_name: `${row["wardName"]}, ${province.name}`,
    };

    province.wards[wardCode] = ward;
    wardsArray.push(ward);
  }
}

// --- Sorting ---
// Sort provinces alphabetically by name
let sortedProvinces = Object.values(provinces).sort((a: any, b: any) =>
  a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
);

// Sort wards alphabetically inside each province (convert -> sort -> back to object)
for (const province of sortedProvinces) {
  const sortedWards = Object.entries(province.wards)
    .sort(([, a]: any, [, b]: any) =>
      a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
    )
    .reduce((acc: Record<string, any>, [code, ward]) => {
      acc[code] = ward;
      return acc;
    }, {});
  province.wards = sortedWards;
}

// Sort flat wards array (optional)
wardsArray.sort((a, b) =>
  a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
);

// --- Create JSON folder if it does not exist ---
if (!fs.existsSync(JSON_PATH)) {
  fs.mkdirSync(JSON_PATH, { recursive: true });
}

// --- Write JSON output files ---

// Save tree structure (province -> wards as dictionary)
fs.writeFileSync(
  path.join(JSON_PATH, "tree.json"),
  JSON.stringify(sortedProvinces, null, 2),
  "utf-8"
);

// Save provinces list (code, name, unit)
fs.writeFileSync(
  path.join(JSON_PATH, "provinces.json"),
  JSON.stringify(
    sortedProvinces.map((p: any) => ({
      code: p.code,
      name: p.name,
      unit: p.unit,
    })),
    null,
    2
  ),
  "utf-8"
);

// Save all wards as a flat list (optional)
fs.writeFileSync(
  path.join(JSON_PATH, "wards.json"),
  JSON.stringify(wardsArray, null, 2),
  "utf-8"
);
