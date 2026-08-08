import axios from 'axios';
import {
  requestInterceptor,
  responseInterceptor,
  rejectInterceptor,
} from '@/shared/api/interceptors';

const BASE_URL = 'https://43-201-178-25.nip.io';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, rejectInterceptor);
