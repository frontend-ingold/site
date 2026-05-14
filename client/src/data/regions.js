export const countryStateOptions = {
  "United States": [
    "California",
    "Florida",
    "Illinois",
    "New Jersey",
    "New York",
    "Texas",
    "Washington"
  ],
  India: [
    "Delhi",
    "Gujarat",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    "Telangana",
    "West Bengal"
  ],
  "United Kingdom": [
    "England",
    "Northern Ireland",
    "Scotland",
    "Wales"
  ]
};

export const supportedCountries = Object.keys(countryStateOptions);

export function getStatesForCountry(country) {
  return countryStateOptions[country] ?? [];
}
