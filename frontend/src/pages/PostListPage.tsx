import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../api/posts";
import { useAuth } from "../contexts/AuthContext";
import type { Post } from "../types";

export default function PostListPage() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setError("投稿の取得に失敗しました"))
      .finally(() => setIsLoading(false));
  }, []);

  // 日付を「2026年3月14日」形式で表示する
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">投稿一覧</h1>
          {currentUser && (
            <Link to="/posts/new">
              <button className="btn-primary">投稿する</button>
            </Link>
          )}
        </div>

        {isLoading && <p className="loading">読み込み中...</p>}
        {error && <div className="error-box">{error}</div>}

        {!isLoading && !error && posts.length === 0 && (
          <p className="empty">投稿がまだありません</p>
        )}

        <div className="post-list">
          {posts.map((post) => (
            <Link to={`/posts/${post.id}`} key={post.id} className="post-card">
              <div className="post-card-title">{post.title}</div>
              <div className="post-card-meta">
                {post.user.name} · {formatDate(post.created_at)}
              </div>
              <p className="post-card-excerpt">{post.content}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
