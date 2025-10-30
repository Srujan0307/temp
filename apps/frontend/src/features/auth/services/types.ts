
export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface RegisterCredentials {
  email: string;
  password?: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string | null;
  password?: string;
}
