import axios from 'axios';
import {
  requestInterceptor,
  responseInterceptor,
  rejectInterceptor,
} from '@/shared/api/interceptors';

export const API_HOST = 'https://api.domanggaja.site';
const API_VERSION = 'v1';

export const apiClient = axios.create({
  baseURL: `${API_HOST}/api/${API_VERSION}`,
  timeout: 10_000,
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, rejectInterceptor);
