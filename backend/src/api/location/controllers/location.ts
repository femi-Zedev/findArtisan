import type { Context } from 'koa';

interface SearchLocationQuery {
  q?: string | string[];
  countrycodes?: string | string[];
  limit?: string | string[];
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: Record<string, unknown>;
}

interface LocationResult {
  placeId: number;
  displayName: string;
  latitude: number;
  longitude: number;
  type: string;
  address?: Record<string, unknown>;
}

const resolveEnv = (key: string, fallback: string): string => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : fallback;
};

const NOMINATIM_ENDPOINT = resolveEnv(
  'NOMINATIM_ENDPOINT',
  'https://nominatim.openstreetmap.org/search',
);
const DEFAULT_COUNTRY_CODE = resolveEnv('NOMINATIM_DEFAULT_COUNTRY_CODE', 'bj');
const DEFAULT_USER_AGENT = resolveEnv(
  'NOMINATIM_USER_AGENT',
  'findArtisan/1.0 (contact: femidev@example.com)',
);

const parseSingleParam = (value: string | string[] | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value.at(0) : value;
};

const parseLimit = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed.toString();
};

const mapResult = (result: NominatimResult): LocationResult => ({
  placeId: result.place_id,
  displayName: result.display_name,
  latitude: Number.parseFloat(result.lat),
  longitude: Number.parseFloat(result.lon),
  type: result.type,
  address: result.address,
});

export default {
  async search(ctx: Context) {
    const { q, countrycodes, limit } = ctx.query as SearchLocationQuery;
    const query = parseSingleParam(q);

    if (!query || !query.trim()) {
      ctx.throw(400, 'Missing required query parameter "q"');
      return;
    }

    const countryCodesParam = parseSingleParam(countrycodes) ?? DEFAULT_COUNTRY_CODE;
    const limitParam = parseLimit(parseSingleParam(limit));

    const url = new URL(NOMINATIM_ENDPOINT);
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('countrycodes', countryCodesParam);

    if (limitParam) {
      url.searchParams.set('limit', limitParam);
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': DEFAULT_USER_AGENT,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        strapi.log.error('OpenStreetMap search failed', {
          status: response.status,
          statusText: response.statusText,
          url: url.toString(),
          error: errorText,
        });

        ctx.throw(response.status, `Failed to fetch locations from OpenStreetMap: ${response.statusText}`);
        return;
      }

      const payload = (await response.json()) as NominatimResult[];
      const data = payload.map(mapResult);

      ctx.body = {
        data,
        meta: {
          count: data.length,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      strapi.log.error('OpenStreetMap search error', {
        message: errorMessage,
        stack: errorStack,
        url: url.toString(),
        error,
      });
      
      ctx.throw(500, `Unexpected error fetching locations: ${errorMessage}`);
    }
  },
};

