// Basic province list (without wards)
import provinces from "./json_data/provinces.json";

// All wards across Vietnam
import wards from "./json_data/wards.json";

// Province + wards in a tree structure
import tree from "./json_data/tree.json";

import type { Province, Ward } from "./types/types";

// =============================
// Library Functions
// =============================

// Get all provinces (without wards)
export function getProvinces(): Omit<Province, "wards">[] {
  // provinces.json only contains code, name, unit
  return provinces as Omit<Province, "wards">[];
}

// Get all wards nationwide
export function getWards(): Ward[] {
  return wards as Ward[];
}

// Get provinces with full details (including wards)
export function getProvincesWithDetail(): Province[] {
  return tree as Province[];
}

// Get wards by a specific province code
export function getWardsByProvince(provinceCode: string): Ward[] {
  const provinces = tree as Province[];
  const province = provinces.find((p) => p.code === provinceCode);
  if (!province) return [];
  return Object.values(province.wards);
}

// Default export for convenience
export default {
  getProvinces,
  getWards,
  getProvincesWithDetail,
  getWardsByProvince,
};
