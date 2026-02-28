import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

const baseURL = "/api";

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApiRequestConfig extends AxiosRequestConfig {
  signal?: AbortSignal;
}

export function createAbortController(): {
  controller: AbortController;
  signal: AbortSignal;
} {
  const controller = new AbortController();
  return { controller, signal: controller.signal };
}

export async function get<T>(
  url: string,
  config?: ApiRequestConfig
): Promise<T> {
  const { data } = await apiClient.get<T>(url, config as AxiosRequestConfig);
  return data;
}

export { apiClient };

export default apiClient;
