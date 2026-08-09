// DTO (서버 계약: Request/Response)
export interface KakaoLoginRequest {
  kakaoAccessToken: string;
}

export interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  signupCompleted: boolean;
  newMember: boolean;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AppleLoginRequest {
  idToken: string;
}
