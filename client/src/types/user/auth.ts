export type JwtPayload = {
  token: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  email: string;
  token: JwtPayload;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthState = {
  // user: User | null;
  token: string | null;
  auth: UserAuth;
  refreshToken?: string | null;
  isLoggingOut?: boolean;
};

export type UserAuth = {
  isAdmin: boolean;
  isUser: boolean;
  isAuth: boolean;
  roles: string[];
};

// export type LogoutRequest = {
//   token: string;
// }
