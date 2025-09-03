// =============================
// Type Definitions
// =============================

// A Ward represents the smallest administrative unit
export interface Ward {
  code: string; // Unique ward code
  name: string; // Ward name
  unit: string; // Administrative unit type (e.g. Ward, Commune, Town)
  province_code: string; // Code of the parent province
  province_name: string; // Name of the parent province
  full_name: string; // Full name: "Ward/Commune, Province"
}

// A Province contains basic info + a collection of wards
export interface Province {
  code: string; // Unique province code
  name: string; // Province name
  unit: string; // Administrative unit type (e.g. Province/City)
  wards: Record<string, Ward>; // Wards under this province
}
