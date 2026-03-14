import client from "./client";
import type { LoginFormData, SignupFormData, User } from "../types";

type AuthResponse = {
  token: string;
  user: User;
};

// ユーザー登録
export const signup = (data: SignupFormData): Promise<AuthResponse> =>
  client.post("/signup", { user: data }).then((res) => res.data);

// ログイン
export const login = (data: LoginFormData): Promise<AuthResponse> =>
  client.post("/login", { session: data }).then((res) => res.data);

// ログアウト
export const logout = (): Promise<void> =>
  client.delete("/logout").then(() => undefined);
