/**
 * Static list of Benin cities and locations
 * Based on major cities and zones mentioned in the PRD
 * Format matches LocationIQ API response structure exactly
 */

export interface BeninCity {
  city: string;
  country: string;
  pop2025: number;
  latitude: number;
  longitude: number;
  isValidCity: boolean;
  slug: string | null;
}

export const beninCities: BeninCity[] = [
  {
    "city": "Abomey-Calavi",
    "country": "Benin",
    "pop2025": 1375220,
    "latitude": 6.44852,
    "longitude": 2.35566,
    "isValidCity": true,
    "slug": null
  },
  {
    "city": "Cotonou",
    "country": "Benin",
    "pop2025": 757989,
    "latitude": 6.36536,
    "longitude": 2.41833,
    "isValidCity": true,
    "slug": null
  },
  {
    "city": "Parakou",
    "country": "Benin",
    "pop2025": 442127,
    "latitude": 9.33716,
    "longitude": 2.63031,
    "isValidCity": true,
    "slug": null
  },
  {
    "city": "Djougou",
    "country": "Benin",
    "pop2025": 410272,
    "latitude": 9.70853,
    "longitude": 1.66598,
    "isValidCity": true,
    "slug": null
  },
  {
    "city": "Porto-Novo",
    "country": "Benin",
    "pop2025": 234168,
    "latitude": 6.49646,
    "longitude": 2.60359,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Bohicon",
    "country": "Benin",
    "pop2025": 125092,
    "latitude": 7.17826,
    "longitude": 2.0667,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Kandi",
    "country": "Benin",
    "pop2025": 109701,
    "latitude": 11.1342,
    "longitude": 2.93861,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Lokossa",
    "country": "Benin",
    "pop2025": 86971,
    "latitude": 6.63869,
    "longitude": 1.71674,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Ouidah",
    "country": "Benin",
    "pop2025": 83503,
    "latitude": 6.36307,
    "longitude": 2.08506,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Abomey",
    "country": "Benin",
    "pop2025": 82154,
    "latitude": 7.18286,
    "longitude": 1.99119,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Natitingou",
    "country": "Benin",
    "pop2025": 80892,
    "latitude": 10.3042,
    "longitude": 1.37962,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Savè",
    "country": "Benin",
    "pop2025": 75970,
    "latitude": 8.03424,
    "longitude": 2.4866,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Nikki",
    "country": "Benin",
    "pop2025": 54009,
    "latitude": 9.94009,
    "longitude": 3.21075,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Dogbo",
    "country": "Benin",
    "pop2025": 41312,
    "latitude": 6.79911,
    "longitude": 1.78073,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Cové",
    "country": "Benin",
    "pop2025": 38566,
    "latitude": 7.22097,
    "longitude": 2.34017,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Malanville",
    "country": "Benin",
    "pop2025": 37117,
    "latitude": 11.8682,
    "longitude": 3.38327,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Pobè",
    "country": "Benin",
    "pop2025": 32983,
    "latitude": 6.98008,
    "longitude": 2.6649,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Savalou",
    "country": "Benin",
    "pop2025": 30187,
    "latitude": 7.92807,
    "longitude": 1.97558,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Sakété",
    "country": "Benin",
    "pop2025": 30111,
    "latitude": 6.73618,
    "longitude": 2.65866,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Comé",
    "country": "Benin",
    "pop2025": 29208,
    "latitude": 6.40764,
    "longitude": 1.88198,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Bembèrèkè",
    "country": "Benin",
    "pop2025": 24006,
    "latitude": 10.2283,
    "longitude": 2.66335,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Bassila",
    "country": "Benin",
    "pop2025": 23616,
    "latitude": 9.00814,
    "longitude": 1.6654,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Banikoara",
    "country": "Benin",
    "pop2025": 22487,
    "latitude": 11.2985,
    "longitude": 2.43856,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Kétou",
    "country": "Benin",
    "pop2025": 22341,
    "latitude": 7.36332,
    "longitude": 2.59978,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Dassa-Zoumè",
    "country": "Benin",
    "pop2025": 21672,
    "latitude": 7.75,
    "longitude": 2.18333,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Tchaourou",
    "country": "Benin",
    "pop2025": 20971,
    "latitude": 8.88649,
    "longitude": 2.59753,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Allada",
    "country": "Benin",
    "pop2025": 20094,
    "latitude": 6.66547,
    "longitude": 2.15138,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Aplahoué",
    "country": "Benin",
    "pop2025": 19862,
    "latitude": 6.93333,
    "longitude": 1.68333,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Tanguiéta",
    "country": "Benin",
    "pop2025": 19833,
    "latitude": 10.6212,
    "longitude": 1.26651,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Hêvié",
    "country": "Benin",
    "pop2025": 13450,
    "latitude": 6.41667,
    "longitude": 2.25,
    "isValidCity": false,
    "slug": null
  },
  {
    "city": "Bétérou",
    "country": "Benin",
    "pop2025": 13108,
    "latitude": 9.19916,
    "longitude": 2.25855,
    "isValidCity": false,
    "slug": null
  }
];

