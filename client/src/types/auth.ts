export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  email: string;
  accessToken: string;
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
  accessToken: string | null;
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
//   accessToken: string;
// }
