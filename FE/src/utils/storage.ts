// 민감 정보 저장 유틸리티 (XSS 방어)

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CSRF_TOKEN: 'csrf_token',
  USER_INFO: 'user_info',
} as const;

class SecureStorage {
  // 토큰 저장 (HttpOnly 쿠키가 이상적이지만, SPA에서는 sessionStorage 사용)
  // 프로덕션에서는 백엔드에서 HttpOnly 쿠키로 전환 권장

  setAccessToken(token: string) {
    sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  setRefreshToken(token: string) {
    // Refresh 토큰은 localStorage에 저장 (자동 로그인 지원)
    // 보안을 위해 암호화 권장
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setCsrfToken(token: string) {
    sessionStorage.setItem(STORAGE_KEYS.CSRF_TOKEN, token);
  }

  getCsrfToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.CSRF_TOKEN);
  }

  setUserInfo(user: any) {
    // 민감 정보 제외
    const safeUserInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      // 비밀번호, 토큰 등 제외
    };
    sessionStorage.setItem(
      STORAGE_KEYS.USER_INFO,
      JSON.stringify(safeUserInfo)
    );
  }

  getUserInfo(): any | null {
    const data = sessionStorage.getItem(STORAGE_KEYS.USER_INFO);
    return data ? JSON.parse(data) : null;
  }

  clear() {
    // 모든 인증 정보 삭제
    Object.values(STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    });
  }
}

export const storage = new SecureStorage();
