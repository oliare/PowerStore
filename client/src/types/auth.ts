export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  email: string;
  accessToken: string;
  expiresIn: number;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

export type UserAuth = {
  isAdmin: boolean;
  isUser: boolean;
  isAuth: boolean;
  roles: string[];
};

export type AuthState = {
  accessToken: string | null;
  expiresAt: number | null;
  auth: UserAuth;
  isLoggingOut: boolean;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role?: string | string[];
  exp: number;
  iss?: string;
};
