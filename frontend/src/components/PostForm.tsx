import { useState, type FormEvent } from "react";
import type { PostFormData } from "../types";

type Props = {
  initialValues?: PostFormData;
  onSubmit: (data: PostFormData) => Promise<void>;
  submitLabel: string;
  onCancel: () => void;
};

export default function PostForm({ initialValues, onSubmit, submitLabel, onCancel }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      await onSubmit({ title, content });
    } catch (err: unknown) {
      // axios エラーからメッセージを取り出す
      const data = (err as { response?: { data?: { errors?: string[]; error?: string } } })
        ?.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else if (data?.error) {
        setErrors([data.error]);
      } else {
        setErrors(["保存に失敗しました"]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((err, i) => <div key={i}>{err}</div>)}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力（100文字以内）"
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">本文</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="本文を入力..."
          required
        />
      </div>

      <div className="post-form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : submitLabel}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  );
}
