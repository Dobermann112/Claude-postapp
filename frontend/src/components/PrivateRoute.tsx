import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// ログインしていない場合はログイン画面へリダイレクトする
export default function PrivateRoute({ children }: Props) {
  const { currentUser, isLoading } = useAuth();

  // 初期化中はまだ判断しない（ちらつき防止）
  if (isLoading) return null;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
