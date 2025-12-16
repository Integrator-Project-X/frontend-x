export type EmergencyPayload = {
  type: string;
  location: string;
  description?: string;
  reporterName?: string;
  reporterPhone?: string;
};

import { apiClient } from "./api.client";
import { API_ENDPOINTS } from "./api.endpoints";

export const emergenciesClient = {
  report: async (payload: EmergencyPayload) => {
    return apiClient.post(`/emergencies`, payload) as Promise<Record<string, unknown>>;
  },
};
