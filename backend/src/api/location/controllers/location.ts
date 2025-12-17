import type { Context } from 'koa';
import { beninCities, type BeninCity } from '../data/benin-cities';

interface LocationQuery {
  q?: string | string[];
  countrycodes?: string | string[];
  pageSize?: string | string[];
}

const parseSingleParam = (value: string | string[] | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value.at(0) : value;
};

const parsePageSize = (value: string | undefined): number => {
  if (!value) {
    return 100; // Default pageSize
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return 100;
  }

  return parsed;
};

/**
 * Search through static Benin cities list
 * Matches cities by name (case-insensitive, partial match)
 * Returns results in the exact JSON format provided
 */
const searchCities = (query: string, limit: number): BeninCity[] => {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  // Filter cities that match the query
  const matches = beninCities
    .filter((city) => {
      const cityName = city.city.toLowerCase();
      // Check if query matches the beginning of the city name or any word in it
      const words = cityName.split(/[\s-]+/);
      return words.some((word) => word.startsWith(normalizedQuery)) || cityName.startsWith(normalizedQuery);
    })
    // Sort by population (higher first), then by city name
    .sort((a, b) => {
      const popDiff = b.pop2025 - a.pop2025;
      if (popDiff !== 0) return popDiff;
      return a.city.localeCompare(b.city);
    })
    // Limit results
    .slice(0, limit);

  return matches;
};

/**
 * Get all cities (sorted by population)
 */
const getAllCities = (limit?: number): BeninCity[] => {
  const sorted = [...beninCities].sort((a, b) => {
    const popDiff = b.pop2025 - a.pop2025;
    if (popDiff !== 0) return popDiff;
    return a.city.localeCompare(b.city);
  });

  return limit ? sorted.slice(0, limit) : sorted;
};

export default {
  async find(ctx: Context) {
    const { q, pageSize } = ctx.query as LocationQuery;
    const query = parseSingleParam(q);
    const pageSizeParam = parsePageSize(parseSingleParam(pageSize));

    try {
      let data: BeninCity[];

      // If no query provided, return all cities
      if (!query || !query.trim()) {
        data = getAllCities(pageSizeParam);
      } else {
        // Search through static Benin cities list
        data = searchCities(query, pageSizeParam);
      }

      ctx.body = {
        data,
        meta: {
          count: data.length,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;

      strapi.log.error('Location find error', {
        message: errorMessage,
        stack: errorStack,
        error,
      });

      ctx.throw(500, `Failed to fetch locations: ${errorMessage}`);
    }
  },
};

