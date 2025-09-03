# 🇻🇳 Vietnam Provinces & Wards

A lightweight **Node.js + TypeScript** library for working with **Vietnam's administrative divisions** (provinces, districts, and wards). The data is sourced from official 2025 updates.

---

## ✨ Features

- Get all provinces (code, name, unit).
- Get all wards nationwide.
- Get full provinces with their wards in a tree structure.
- Get wards by a specific province code.

---

## 📦 Installation

Install the package using either **npm** or **yarn**:

```bash
# With npm
npm install vn-provinces-wards

# With yarn
yarn add vn-provinces-wards
```

## 🚀 Usage

First, import the functions you need from the package:

```
import {
  getProvinces,
  getWards,
  getProvincesWithDetail,
  getWardsByProvince,
} from "vn-provinces-wards";
```

#### 1. Get All Provinces

```
console.log(getProvinces());
```

Example output:

```
[
  { "code": "01", "name": "Thành phố Hà Nội", "unit": "Thành phố" },
  { "code": "02", "name": "Tỉnh Hà Giang", "unit": "Tỉnh" }
]
```

#### 2. Get All Wards

```
console.log(getWards());
```

Example output:

```
[
  {
    "code": "10105001",
    "name": "Phường Hoàn Kiếm",
    "unit": "Phường",
    "province_code": "01",
    "province_name": "Thành phố Hà Nội",
    "full_name": "Phường Hoàn Kiếm, Thành phố Hà Nội"
  }
]
```

#### 3. Get Provinces with Wards

```
console.log(getProvincesWithDetail());
```

Example output:

```
[
  {
    "code": "10",
    "name": "Tỉnh Thái Nguyên",
    "unit": "Tỉnh",
    "wards": {
      "20701078": {
        "code": "20701078",
        "name": "Xã Phong Quang",
        "unit": "Xã",
        "province_code": "10",
        "province_name": "Tỉnh Thái Nguyên",
        "full_name": "Xã Phong Quang, Tỉnh Thái Nguyên"
      }
    }
  }
]
```

### Types

```
export interface Ward {
  code: string;
  name: string;
  unit: string;
  province_code: string;
  province_name: string;
  full_name: string;
}

export interface Province {
  code: string;
  name: string;
  unit: string;
  wards: Record<string, Ward>;
}
```

---

### 📜 License & Copyright

This project is licensed under the MIT License.

**Copyright belongs to Khuong Viet Tai**. For any inquiries or contributions, please contact **khuongviettai@outlook.com**.
