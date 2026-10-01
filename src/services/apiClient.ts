/**
 * API Client for communication with FastAPI backend.
 * Uses the VITE_API_URL environment variable injected by Vercel.
 */

const getApiBaseUrl = (): string => {
  // Vercel injects the binding as VITE_API_URL at runtime
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Development fallback
  return import.meta.env.DEV ? 'http://localhost:8000' : '/api';
};

export class APIClient {
  private static baseUrl = getApiBaseUrl();

  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }
}
