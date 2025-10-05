# Uganda Location Selector

A comprehensive JavaScript library for hierarchical location selection in Uganda, built from official Uganda Electoral Commission data.

**Author:** Allan Tumuhimbise  
**Version:** 1.0.5  
**License:** MIT

## Dataset Statistics

- **222 Districts** (complete coverage)
- **427 Constituencies** 
- **1,881 Sub-counties**
- **3,454 Electoral Areas**
- **Data Source:** Uganda Electoral Commission Official Boundaries

## Installation

```bash
npm install @qa-green-coder/uganda-location-selector
```

## Quick Start

```javascript
import UgandaLocationSelector from '@qa-green-coder/uganda-location-selector';

// Initialize the selector
const selector = new UgandaLocationSelector();
await selector.init();

// Get all districts
const districts = selector.getDistricts();
console.log(`Total districts: ${districts.length}`); // 222

// Get constituencies for Mbarara district
const constituencies = selector.getConstituencies('027');
console.log(constituencies);
// Returns: [
//   { name: "KASHARI NORTH COUNTY", code: "140" },
//   { name: "KASHARI SOUTH COUNTY", code: "259" }
// ]

// Get sub-counties for a constituency
const subCounties = selector.getSubCounties('027', '140');
console.log(subCounties);
// Returns: [
//   { name: "NYABISIRIRA TOWN COUNCIL", code: "01" },
//   { name: "KAGONGI", code: "03" },
//   { name: "KASHARE", code: "05" },
//   { name: "RUBINDI", code: "07" },
//   { name: "RUBINDI-RUHUMBA TOWN COUNCIL", code: "12" }
// ]

// Get electoral areas for a sub-county
const areas = selector.getElectoralAreas('027', '140', '01');
console.log(areas);
// Returns: [{ name: "NYABISIRIRA TOWN COUNCIL", code: "001" }]
```

## Data Structure

The library provides a hierarchical structure following Uganda's administrative divisions:

```
Country (Uganda)
├── District (222 total)
│   ├── Constituency (427 total)
│   │   ├── Sub-county (1,881 total)
│   │   │   └── Electoral Area (3,454 total)
```

### Return Format

All methods return arrays of objects with consistent structure:

```javascript
{
  name: "LOCATION_NAME",  // Human-readable name
  code: "123"             // Official code
}
```

## API Reference

### `getDistricts()`
Returns all 222 districts in Uganda.

**Returns:** `Array<{name: string, code: string}>`

**Example:**
```javascript
const districts = selector.getDistricts();
// [
//   { name: "MBARARA", code: "027" },
//   { name: "MAISUKA", code: "052" }, // Contains Wakiso areas
//   { name: "HOIMA", code: "006" },
//   ...
// ]
```

### `getConstituencies(districtCode)`
Returns constituencies for a specific district.

**Parameters:**
- `districtCode` (string): District code (e.g., "027" for Mbarara)

**Returns:** `Array<{name: string, code: string}>`

**Example:**
```javascript
const constituencies = selector.getConstituencies('027');
// [
//   { name: "KASHARI NORTH COUNTY", code: "140" },
//   { name: "KASHARI SOUTH COUNTY", code: "259" }
// ]
```

### `getSubCounties(districtCode, constituencyCode)`
Returns sub-counties for a specific constituency.

**Parameters:**
- `districtCode` (string): District code
- `constituencyCode` (string): Constituency code

**Returns:** `Array<{name: string, code: string}>`

### `getElectoralAreas(districtCode, constituencyCode, subCountyCode)`
Returns electoral areas for a specific sub-county.

**Parameters:**
- `districtCode` (string): District code
- `constituencyCode` (string): Constituency code  
- `subCountyCode` (string): Sub-county code

**Returns:** `Array<{name: string, code: string}>`

### `getCoordinates(locationName)` (Optional)
Get geographic coordinates for a location using Nominatim API.

**Parameters:**
- `locationName` (string): Location name (e.g., "Mbarara, Uganda")

**Returns:** `Promise<{lat: number, lon: number, display_name: string}>`

## React Integration Example

```javascript
import React, { useState, useEffect } from 'react';
import UgandaLocationSelector from '@qa-green-coder/uganda-location-selector';

function LocationSelector() {
  const [selector, setSelector] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [subCounties, setSubCounties] = useState([]);
  const [electoralAreas, setElectoralAreas] = useState([]);
  
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState('');

  // Initialize
  useEffect(() => {
    async function init() {
      const ugandaSelector = new UgandaLocationSelector();
      await ugandaSelector.init();
      setSelector(ugandaSelector);
      setDistricts(ugandaSelector.getDistricts());
    }
    init();
  }, []);

  // Handle district selection
  const handleDistrictChange = (districtCode) => {
    setSelectedDistrict(districtCode);
    setSelectedConstituency('');
    setSelectedSubCounty('');
    
    if (districtCode && selector) {
      const newConstituencies = selector.getConstituencies(districtCode);
      setConstituencies(newConstituencies || []);
      setSubCounties([]);
      setElectoralAreas([]);
    }
  };

  // Handle constituency selection
  const handleConstituencyChange = (constituencyCode) => {
    setSelectedConstituency(constituencyCode);
    setSelectedSubCounty('');
    
    if (constituencyCode && selector) {
      const newSubCounties = selector.getSubCounties(selectedDistrict, constituencyCode);
      setSubCounties(newSubCounties || []);
      setElectoralAreas([]);
    }
  };

  // Handle sub-county selection
  const handleSubCountyChange = (subCountyCode) => {
    setSelectedSubCounty(subCountyCode);
    
    if (subCountyCode && selector) {
      const newAreas = selector.getElectoralAreas(selectedDistrict, selectedConstituency, subCountyCode);
      setElectoralAreas(newAreas || []);
    }
  };

  return (
    <div>
      {/* District Dropdown */}
      <select value={selectedDistrict} onChange={(e) => handleDistrictChange(e.target.value)}>
        <option value="">Select District</option>
        {districts.map(district => (
          <option key={district.code} value={district.code}>
            {district.name}
          </option>
        ))}
      </select>

      {/* Constituency Dropdown */}
      {constituencies.length > 0 && (
        <select value={selectedConstituency} onChange={(e) => handleConstituencyChange(e.target.value)}>
          <option value="">Select Constituency</option>
          {constituencies.map(constituency => (
            <option key={constituency.code} value={constituency.code}>
              {constituency.name}
            </option>
          ))}
        </select>
      )}

      {/* Sub-county Dropdown */}
      {subCounties.length > 0 && (
        <select value={selectedSubCounty} onChange={(e) => handleSubCountyChange(e.target.value)}>
          <option value="">Select Sub-county</option>
          {subCounties.map(subCounty => (
            <option key={subCounty.code} value={subCounty.code}>
              {subCounty.name}
            </option>
          ))}
        </select>
      )}

      {/* Electoral Areas Dropdown */}
      {electoralAreas.length > 0 && (
        <select>
          <option value="">Select Electoral Area</option>
          {electoralAreas.map(area => (
            <option key={area.code} value={area.code}>
              {area.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
```

## Key Districts & Examples

### Major Districts:
- **Mbarara (027)**: 2 constituencies, includes Kashari North/South counties
- **Wakiso (052)**: 16 constituencies, includes Entebbe, Kira, Nansana municipalities  
- **Kampala (012)**: 12 constituencies, various divisions
- **Hoima (006)**: 2 constituencies, Bugahya and Kigorobya counties

### Example Selection Paths:

**Mbarara District:**
```
MBARARA (027)
├── KASHARI NORTH COUNTY (140)
│   ├── NYABISIRIRA TOWN COUNCIL (01)
│   │   └── NYABISIRIRA TOWN COUNCIL (001)
│   ├── KAGONGI (03)
│   └── KASHARE (05)
└── KASHARI SOUTH COUNTY (259)
    ├── BUBAARE (01)
    │   ├── KAMUSHOKO (001)
    │   ├── KASHAKA (002)
    │   └── RWENSHANKU (005)
    └── BUKIIRO (02)
```

**Wakiso District (coded as MAISUKA 052):**
```
MAISUKA (052) [Wakiso areas]
├── NANSANA MUNICIPALITY (160)
├── KIRA MUNICIPALITY (284)
├── ENTEBBE MUNICIPALITY (164)
└── BUSIRO COUNTY EAST (154)
```

## Version History

### v1.0.4 (Current)
- Complete dataset with 222 districts
- Proper attribution to Allan Tumuhimbise
- Fixed Mbarara district data
- Updated API format returning {name, code} objects
- Comprehensive documentation
- Removed emojis for professional appearance

### v1.0.3
- Updated documentation with correct statistics
- Fixed version references

### v1.0.2
- Fixed Mbarara district data
- Updated author attribution

### v1.0.1
- Initial release with basic functionality

### v1.0.0
- Beta release

## License

MIT License - feel free to use in commercial and personal projects.

## Contributing

This library is maintained by Allan Tumuhimbise. For issues or contributions, please contact the author.

## Support

For technical support or questions about integrating this library into your application, please refer to the usage examples above or contact the author.

---

**Built for Uganda's developer community**
