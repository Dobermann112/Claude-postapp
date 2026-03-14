import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import * as authApi from "../api/auth";
import type { User, LoginFormData, SignupFormData } from "../types";

type AuthContextType = {
  currentUser: User | null;   // ログイン中のユーザー（未ログインなら null）
  isLoading: boolean;         // 初期化中かどうか
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // アプリ起動時に localStorage からユーザー情報を復元する
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginFormData) => {
    const { token, user } = await authApi.login(data);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const signup = async (data: SignupFormData) => {
    const { token, user } = await authApi.signup(data);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = async () => {
    await authApi.logout().catch(() => {});  // サーバーエラーでも続行
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// カスタムフック: AuthContext を使いやすくする
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth は AuthProvider の中で使用してください");
  }
  return context;
}
