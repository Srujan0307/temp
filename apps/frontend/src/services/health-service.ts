import type { AxiosError } from 'axios';

import { apiClient } from '@/lib/api-client';

export type HealthResponse = {
  status: string;
};

const FALLBACK_HEALTH: HealthResponse = {
  status: 'offline',
};

const extractHealthFromError = (error: AxiosError<HealthResponse>) => {
  const status = error.response?.data?.status;

  if (status) {
    return { status } satisfies HealthResponse;
  }

  return FALLBACK_HEALTH;
};

const fetchHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      return extractHealthFromError(error as AxiosError<HealthResponse>);
    }

    return FALLBACK_HEALTH;
  }
};

export const healthService = {
  fetchHealth,
};
