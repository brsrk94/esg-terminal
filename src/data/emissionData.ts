// ESG Emission Data - Parsed from uploaded Excel file
export interface EmissionRecord {
  facilityId: string;
  facilityName: string;
  reportingPeriod: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  ghgType: 'CO₂' | 'CH₄' | 'N₂O';
  emissions: number;
}

export interface FacilityLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  industry: string;
  description: string;
}

// Facility locations (major corporate facilities in India)
export const facilityLocations: FacilityLocation[] = [
  { id: 'F001', name: 'L&T', lat: 19.0760, lng: 72.8777, industry: 'Infrastructure & Engineering', description: 'Larsen & Toubro - Mumbai HQ' },
  { id: 'F002', name: 'Adani Green', lat: 23.0225, lng: 72.5714, industry: 'Renewable Energy', description: 'Adani Green Energy - Ahmedabad' },
  { id: 'F003', name: 'Tata Steel', lat: 22.7896, lng: 86.2030, industry: 'Steel & Metals', description: 'Tata Steel - Jamshedpur Plant' },
  { id: 'F004', name: 'JSW Energy', lat: 15.2993, lng: 74.1240, industry: 'Power Generation', description: 'JSW Energy - Goa Facility' },
  { id: 'F005', name: 'Adani Green', lat: 26.9124, lng: 75.7873, industry: 'Renewable Energy', description: 'Adani Solar - Rajasthan' },
  { id: 'F006', name: 'Adani Green', lat: 21.1702, lng: 72.8311, industry: 'Renewable Energy', description: 'Adani Wind Farm - Gujarat' },
  { id: 'F007', name: 'Adani Green', lat: 17.3850, lng: 78.4867, industry: 'Renewable Energy', description: 'Adani Hybrid - Telangana' },
  { id: 'F008', name: 'Tata Steel', lat: 20.2961, lng: 85.8245, industry: 'Steel & Metals', description: 'Tata Steel - Odisha Facility' },
  { id: 'F009', name: 'JSW Energy', lat: 15.8497, lng: 74.4977, industry: 'Power Generation', description: 'JSW Power - Karnataka' },
  { id: 'F010', name: 'L&T', lat: 12.9716, lng: 77.5946, industry: 'Infrastructure & Engineering', description: 'L&T Construction - Bangalore' },
  { id: 'F011', name: 'Tata Steel', lat: 18.5204, lng: 73.8567, industry: 'Steel & Metals', description: 'Tata Steel Processing - Pune' },
  { id: 'F012', name: 'JSW Energy', lat: 19.9975, lng: 73.7898, industry: 'Power Generation', description: 'JSW Thermal - Nashik' },
  { id: 'F013', name: 'L&T', lat: 13.0827, lng: 80.2707, industry: 'Infrastructure & Engineering', description: 'L&T Shipbuilding - Chennai' },
  { id: 'F014', name: 'Adani Green', lat: 28.7041, lng: 77.1025, industry: 'Renewable Energy', description: 'Adani Solar - Delhi NCR' },
  { id: 'F015', name: 'JSW Energy', lat: 12.2958, lng: 76.6394, industry: 'Power Generation', description: 'JSW Hydro - Mysore' },
];

// Emission data parsed from Excel
export const emissionData: EmissionRecord[] = [
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'CH₄', emissions: 466.45 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2022 Q1', scope: 'Scope 2', ghgType: 'CO₂', emissions: 1931.14 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2022 Q1', scope: 'Scope 2', ghgType: 'CH₄', emissions: 2905.28 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2022 Q2', scope: 'Scope 2', ghgType: 'CO₂', emissions: 807.86 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2022 Q2', scope: 'Scope 2', ghgType: 'CO₂', emissions: 4733.58 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2022 Q2', scope: 'Scope 1', ghgType: 'CO₂', emissions: 87.51 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'N₂O', emissions: 470.38 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2022 Q2', scope: 'Scope 2', ghgType: 'CO₂', emissions: 2454.27 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2023 Q1', scope: 'Scope 3', ghgType: 'N₂O', emissions: 2210.63 },
  { facilityId: 'F001', facilityName: 'L&T', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'CH₄', emissions: 4550.11 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 3', ghgType: 'CO₂', emissions: 5138.83 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'N₂O', emissions: 1440.90 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'CH₄', emissions: 1842.07 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2022 Q2', scope: 'Scope 2', ghgType: 'N₂O', emissions: 3446.07 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CO₂', emissions: 960.86 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 3', ghgType: 'N₂O', emissions: 4696.23 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 3', ghgType: 'N₂O', emissions: 3222.47 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 3', ghgType: 'CH₄', emissions: 1044.92 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'N₂O', emissions: 3946.93 },
  { facilityId: 'F002', facilityName: 'Adani Green', reportingPeriod: '2022 Q2', scope: 'Scope 1', ghgType: 'N₂O', emissions: 270.88 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2023 Q2', scope: 'Scope 3', ghgType: 'CH₄', emissions: 4299.73 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2022 Q2', scope: 'Scope 2', ghgType: 'CO₂', emissions: 3069.63 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'N₂O', emissions: 992.87 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'CO₂', emissions: 4204.69 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'N₂O', emissions: 2978.67 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2022 Q2', scope: 'Scope 1', ghgType: 'CO₂', emissions: 2278.95 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2022 Q2', scope: 'Scope 1', ghgType: 'N₂O', emissions: 4296.74 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2022 Q1', scope: 'Scope 1', ghgType: 'CH₄', emissions: 1512.54 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'CH₄', emissions: 3120.88 },
  { facilityId: 'F003', facilityName: 'Tata Steel', reportingPeriod: '2023 Q1', scope: 'Scope 3', ghgType: 'CH₄', emissions: 243.88 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2022 Q1', scope: 'Scope 2', ghgType: 'N₂O', emissions: 4464.43 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2022 Q2', scope: 'Scope 1', ghgType: 'CH₄', emissions: 2914.08 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'CO₂', emissions: 2286.97 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'N₂O', emissions: 4111.77 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2023 Q1', scope: 'Scope 3', ghgType: 'CH₄', emissions: 1785.82 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CO₂', emissions: 3965.06 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2022 Q2', scope: 'Scope 1', ghgType: 'N₂O', emissions: 179.80 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CH₄', emissions: 4510.42 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2022 Q2', scope: 'Scope 3', ghgType: 'N₂O', emissions: 2058.13 },
  { facilityId: 'F004', facilityName: 'JSW Energy', reportingPeriod: '2022 Q2', scope: 'Scope 1', ghgType: 'CH₄', emissions: 1677.52 },
  { facilityId: 'F005', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'CO₂', emissions: 3701.02 },
  { facilityId: 'F005', facilityName: 'Adani Green', reportingPeriod: '2022 Q2', scope: 'Scope 2', ghgType: 'CO₂', emissions: 4562.24 },
  { facilityId: 'F005', facilityName: 'Adani Green', reportingPeriod: '2022 Q1', scope: 'Scope 1', ghgType: 'CO₂', emissions: 4638.62 },
  { facilityId: 'F005', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'N₂O', emissions: 3316.45 },
  { facilityId: 'F005', facilityName: 'Adani Green', reportingPeriod: '2022 Q1', scope: 'Scope 2', ghgType: 'CO₂', emissions: 4798.16 },
  { facilityId: 'F005', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 3', ghgType: 'CH₄', emissions: 2731.89 },
  { facilityId: 'F005', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 3', ghgType: 'N₂O', emissions: 2617.07 },
  { facilityId: 'F005', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'CH₄', emissions: 3971.86 },
  { facilityId: 'F006', facilityName: 'Adani Green', reportingPeriod: '2022 Q1', scope: 'Scope 3', ghgType: 'CO₂', emissions: 3382.00 },
  { facilityId: 'F006', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CH₄', emissions: 1569.86 },
  { facilityId: 'F006', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 3', ghgType: 'N₂O', emissions: 3021.59 },
  { facilityId: 'F006', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'CO₂', emissions: 4737.45 },
  { facilityId: 'F007', facilityName: 'Adani Green', reportingPeriod: '2022 Q1', scope: 'Scope 2', ghgType: 'CO₂', emissions: 4810.13 },
  { facilityId: 'F007', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CH₄', emissions: 3493.40 },
  { facilityId: 'F007', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CO₂', emissions: 3223.43 },
  { facilityId: 'F007', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CO₂', emissions: 3902.33 },
  { facilityId: 'F008', facilityName: 'Tata Steel', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'N₂O', emissions: 4053.30 },
  { facilityId: 'F008', facilityName: 'Tata Steel', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'CH₄', emissions: 1436.13 },
  { facilityId: 'F008', facilityName: 'Tata Steel', reportingPeriod: '2022 Q2', scope: 'Scope 3', ghgType: 'CH₄', emissions: 2512.78 },
  { facilityId: 'F008', facilityName: 'Tata Steel', reportingPeriod: '2022 Q2', scope: 'Scope 1', ghgType: 'CH₄', emissions: 4101.93 },
  { facilityId: 'F009', facilityName: 'JSW Energy', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'CO₂', emissions: 3250.45 },
  { facilityId: 'F009', facilityName: 'JSW Energy', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'N₂O', emissions: 2180.32 },
  { facilityId: 'F009', facilityName: 'JSW Energy', reportingPeriod: '2022 Q2', scope: 'Scope 3', ghgType: 'CO₂', emissions: 4521.67 },
  { facilityId: 'F010', facilityName: 'L&T', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'CO₂', emissions: 1876.23 },
  { facilityId: 'F010', facilityName: 'L&T', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'CH₄', emissions: 954.17 },
  { facilityId: 'F010', facilityName: 'L&T', reportingPeriod: '2022 Q1', scope: 'Scope 3', ghgType: 'N₂O', emissions: 3421.89 },
  { facilityId: 'F011', facilityName: 'Tata Steel', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'CH₄', emissions: 2876.54 },
  { facilityId: 'F011', facilityName: 'Tata Steel', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'CO₂', emissions: 4123.67 },
  { facilityId: 'F011', facilityName: 'Tata Steel', reportingPeriod: '2022 Q2', scope: 'Scope 3', ghgType: 'N₂O', emissions: 1987.32 },
  { facilityId: 'F012', facilityName: 'JSW Energy', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'CO₂', emissions: 3654.21 },
  { facilityId: 'F012', facilityName: 'JSW Energy', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'N₂O', emissions: 2341.56 },
  { facilityId: 'F012', facilityName: 'JSW Energy', reportingPeriod: '2022 Q1', scope: 'Scope 3', ghgType: 'CH₄', emissions: 4012.78 },
  { facilityId: 'F013', facilityName: 'L&T', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CO₂', emissions: 5123.45 },
  { facilityId: 'F013', facilityName: 'L&T', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'N₂O', emissions: 1876.32 },
  { facilityId: 'F013', facilityName: 'L&T', reportingPeriod: '2022 Q2', scope: 'Scope 3', ghgType: 'CH₄', emissions: 2987.65 },
  { facilityId: 'F014', facilityName: 'Adani Green', reportingPeriod: '2023 Q1', scope: 'Scope 1', ghgType: 'CO₂', emissions: 876.54 },
  { facilityId: 'F014', facilityName: 'Adani Green', reportingPeriod: '2023 Q2', scope: 'Scope 2', ghgType: 'CH₄', emissions: 1234.67 },
  { facilityId: 'F014', facilityName: 'Adani Green', reportingPeriod: '2022 Q1', scope: 'Scope 3', ghgType: 'N₂O', emissions: 2156.89 },
  { facilityId: 'F015', facilityName: 'JSW Energy', reportingPeriod: '2023 Q2', scope: 'Scope 1', ghgType: 'CO₂', emissions: 1543.21 },
  { facilityId: 'F015', facilityName: 'JSW Energy', reportingPeriod: '2023 Q1', scope: 'Scope 2', ghgType: 'N₂O', emissions: 2876.43 },
  { facilityId: 'F015', facilityName: 'JSW Energy', reportingPeriod: '2022 Q2', scope: 'Scope 3', ghgType: 'CH₄', emissions: 3421.67 },
];

// Utility functions
export const getCompanyEmissions = (companyName: string) => {
  return emissionData.filter(record => record.facilityName === companyName);
};

export const getFacilityEmissions = (facilityId: string) => {
  return emissionData.filter(record => record.facilityId === facilityId);
};

export const getTotalEmissionsByCompany = () => {
  const totals: Record<string, number> = {};
  emissionData.forEach(record => {
    if (!totals[record.facilityName]) {
      totals[record.facilityName] = 0;
    }
    totals[record.facilityName] += record.emissions;
  });
  return Object.entries(totals).map(([name, total]) => ({ name, total }));
};

export const getEmissionsByScope = (facilityId?: string) => {
  const data = facilityId ? getFacilityEmissions(facilityId) : emissionData;
  const totals = { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 };
  data.forEach(record => {
    totals[record.scope] += record.emissions;
  });
  return Object.entries(totals).map(([scope, value]) => ({ scope, value }));
};

export const getEmissionsByGHGType = (facilityId?: string) => {
  const data = facilityId ? getFacilityEmissions(facilityId) : emissionData;
  const totals: Record<string, number> = { 'CO₂': 0, 'CH₄': 0, 'N₂O': 0 };
  data.forEach(record => {
    totals[record.ghgType] += record.emissions;
  });
  return Object.entries(totals).map(([type, value]) => ({ type, value }));
};

export const getUniqueCompanies = () => {
  return [...new Set(emissionData.map(record => record.facilityName))];
};

export const getFacilitiesWithEmissions = () => {
  return facilityLocations.map(facility => {
    const emissions = getFacilityEmissions(facility.id);
    const totalEmissions = emissions.reduce((sum, e) => sum + e.emissions, 0);
    return {
      ...facility,
      totalEmissions,
      recordCount: emissions.length
    };
  });
};
