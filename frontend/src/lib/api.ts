import type { ModelStatus, AppConfig, AIReflection } from './types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000';

class ApiError extends Error {
  status: number;
  constructor(
    status: number,
    message: string,
  ) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.detail ?? message;
    } catch {
      // ignore parse error, use default message
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async getModelStatus(): Promise<ModelStatus> {
    const res = await fetch(`${BACKEND_URL}/api/model/status`, {
      signal: AbortSignal.timeout(8000),
    });
    return handleResponse<ModelStatus>(res);
  },

  async getConfig(): Promise<AppConfig> {
    const res = await fetch(`${BACKEND_URL}/api/config`, {
      signal: AbortSignal.timeout(5000),
    });
    return handleResponse<AppConfig>(res);
  },

  async reflect(params: {
    observation_text: string;
    quest_title: string;
    quest_theme: string;
    place_label?: string | null;
  }): Promise<AIReflection> {
    const res = await fetch(`${BACKEND_URL}/api/reflect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(130_000), // slightly over backend timeout
    });
    return handleResponse<AIReflection>(res);
  },

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

export { ApiError };
export { BACKEND_URL };
