// Deterministic local fixture for the chart stories that normally fetch cars.json.
const cars = Array.from({length: 64}, (_, index) => ({
  Horsepower: 65 + (index * 29) % 155,
  Miles_per_Gallon: 19 + (index * 11) % 23 - (index * 29 % 155) / 12,
}));

export function useDataset() {
  return [cars, false];
}
