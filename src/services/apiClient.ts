/**
 * API Client for communication with FastAPI backend.
 * Uses the VITE_API_URL environment variable injected by Vercel.
 */

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: any;

  constructor(status: number, statusText: string, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

const getApiBaseUrl = (): string => {
  // Vercel injects the binding as VITE_API_URL at runtime
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Development fallback
  return import.meta.env.DEV ? 'http://localhost:8000' : '/api';
};

const resolveUrl = (baseUrl: string, endpoint: string): string => {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If endpoint already starts with /api
  if (cleanEndpoint.startsWith('/api/') || cleanEndpoint === '/api') {
    if (cleanBase.endsWith('/api')) {
      return `${cleanBase.slice(0, -4)}${cleanEndpoint}`;
    }
    return `${cleanBase}${cleanEndpoint}`;
  }

  // If base already ends with /api
  if (cleanBase.endsWith('/api')) {
    return `${cleanBase}${cleanEndpoint}`;
  }

  // Default: ensure /api path segment exists between base and endpoint
  return `${cleanBase}/api${cleanEndpoint}`;
};

export class APIClient {
  public static baseUrl = getApiBaseUrl();

  static async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = resolveUrl(this.baseUrl, endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        // Response is not JSON
      }
      throw new ApiError(
        response.status,
        response.statusText,
        errorData?.detail || errorData?.message || `API error: ${response.statusText}`,
        errorData
      );
    }
    return response.json();
  }

  static async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = resolveUrl(this.baseUrl, endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers,
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        // Response is not JSON
      }
      throw new ApiError(
        response.status,
        response.statusText,
        errorData?.detail || errorData?.message || `API error: ${response.statusText}`,
        errorData
      );
    }
    return response.json();
  }

  // Instance methods delegating to static methods for convenience
  public async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return APIClient.get<T>(endpoint, options);
  }

  public async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return APIClient.post<T>(endpoint, data, options);
  }
}

// Instance export matching import { apiClient }
export const apiClient = new APIClient();
