import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth";

export const jwtParse = (value: string | null): JwtPayload | null => {
  if (!value) {
    return null;
  }
  return jwtDecode<JwtPayload>(value);
};
