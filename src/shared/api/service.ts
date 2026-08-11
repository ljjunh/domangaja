import { API_HOST, apiClient } from '@/shared/api/client';

export interface UploadFile {
  uri: string;
  mime: string;
  fileName: string;
}

interface UploadResponse {
  imageUrl: string;
}

/**
 * 파일을 업로드하고 서버가 저장한 경로를 돌려줌
 */
export const uploadImage = async (file: UploadFile): Promise<string> => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.mime,
    name: file.fileName,
  } as unknown as Blob);

  const { data } = await apiClient.post<UploadResponse>('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log('uploadImage', data);
  return data.imageUrl;
};

/**
 * 서버가 주는 이미지 경로는 루트 상대 경로(/uploads/xxx.jpg)라 RN Image가 못 읽음
 * 호스트를 붙여 절대 URL로 생성
 */
export function toImageUrl(path: string | null): string | null {
  if (path == null || path === '') {
    return null;
  }
  // 서버가 절대 URL로 바꿔주는 날 이중 접두를 막는다
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_HOST}${path}`;
}
