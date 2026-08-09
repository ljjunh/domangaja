// DTO (서버 계약: Request/Response)
export interface KakaoLoginRequest {
  kakaoAccessToken: string;
}

export interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  signupCompleted: boolean;
  newMember: boolean;
}
