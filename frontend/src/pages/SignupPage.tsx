import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isAxiosError } from "axios";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      await signup({ name, email, password, password_confirmation: passwordConfirmation });
      navigate("/");
    } catch (err) {
      if (isAxiosError(err)) {
        const data = err.response?.data;
        // Rails は errors: string[] か error: string のどちらかを返す
        if (data?.errors) {
          setErrors(data.errors);
        } else if (data?.error) {
          setErrors([data.error]);
        } else {
          setErrors(["登録に失敗しました"]);
        }
      } else {
        setErrors(["予期せぬエラーが発生しました"]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1 className="form-title">新規登録</h1>

        {errors.length > 0 && (
          <div className="error-box">
            {errors.map((err, i) => (
              <div key={i}>{err}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">名前</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="田中太郎"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password-confirmation">パスワード（確認）</label>
            <input
              id="password-confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="もう一度入力"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中..." : "登録する"}
          </button>
        </form>

        <p className="form-link">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  );
}
