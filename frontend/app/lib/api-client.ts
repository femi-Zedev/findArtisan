/**
 * API Client
 * Centralized fetch wrapper for API requests
 */

const DEFAULT_API_BASE_URL = 'http://localhost:1337/api';

const resolveApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

interface ApiClientOptions extends RequestInit {
  params?: Record<string, string | number | undefined | null | (string | number)[]>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = resolveApiBaseUrl();
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | undefined | null | (string | number)[]>): string {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    if (!params) {
      return url;
    }

    const searchParams = new URLSearchParams();
    for (const key in params) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (v !== null && v !== undefined) {
            searchParams.append(key + '[]', String(v));
          }
        });
      } else if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  async get<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async post<T>(endpoint: string, body?: unknown, options?: ApiClientOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If error response is not JSON, use status text
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  }

  async put<T>(endpoint: string, body?: unknown, options?: ApiClientOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async delete<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async uploadFile<T>(endpoint: string, file: File, options?: Omit<ApiClientOptions, 'body'>): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
        ...options?.headers,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`File upload failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  }
}

export const api = new ApiClient();

