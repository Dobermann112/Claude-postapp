import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchPost, deletePost } from "../api/posts";
import { useAuth } from "../contexts/AuthContext";
import type { Post } from "../types";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchPost(Number(id))
      .then(setPost)
      .catch(() => setError("投稿が見つかりませんでした"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm("この投稿を削除しますか？")) return;

    try {
      await deletePost(post.id);
      navigate("/");
    } catch {
      alert("削除に失敗しました");
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // 投稿の作成者かどうか判定する
  const isOwner = currentUser && post && currentUser.id === post.user.id;

  if (isLoading) return <div className="page"><div className="container"><p className="loading">読み込み中...</p></div></div>;
  if (error || !post) return <div className="page"><div className="container"><div className="error-box">{error || "投稿が見つかりません"}</div></div></div>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="back-link">← 一覧に戻る</Link>

        <div className="post-detail">
          <h1 className="post-detail-title">{post.title}</h1>
          <p className="post-detail-meta">
            {post.user.name} · {formatDate(post.created_at)}
          </p>
          <p className="post-detail-content">{post.content}</p>

          {/* 投稿者本人にだけ編集・削除ボタンを表示する */}
          {isOwner && (
            <div className="post-detail-actions">
              <Link to={`/posts/${post.id}/edit`}>
                <button className="btn-secondary">編集する</button>
              </Link>
              <button className="btn-danger" onClick={handleDelete}>
                削除する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
