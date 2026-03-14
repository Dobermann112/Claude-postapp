// ユーザー情報の型
export type User = {
  id: number;
  name: string;
  email: string;
};

// 投稿情報の型
export type Post = {
  id: number;
  title: string;
  content: string;
  user: Pick<User, "id" | "name">;
  created_at: string;
  updated_at: string;
};

// 投稿作成・更新フォームの型
export type PostFormData = {
  title: string;
  content: string;
};

// ログインフォームの型
export type LoginFormData = {
  email: string;
  password: string;
};

// ユーザー登録フォームの型
export type SignupFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// APIエラーレスポンスの型
export type ApiError = {
  error?: string;
  errors?: string[];
};
