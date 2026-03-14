import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost, updatePost } from "../api/posts";
import PostForm from "../components/PostForm";
import type { Post, PostFormData } from "../types";

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 編集対象の投稿を取得して初期値にセットする
  useEffect(() => {
    if (!id) return;
    fetchPost(Number(id))
      .then(setPost)
      .catch(() => setError("投稿が見つかりませんでした"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (data: PostFormData) => {
    if (!post) return;
    await updatePost(post.id, data);
    navigate(`/posts/${post.id}`);  // 更新後は詳細ページへ遷移
  };

  if (isLoading) return <div className="page"><div className="container"><p className="loading">読み込み中...</p></div></div>;
  if (error || !post) return <div className="page"><div className="container"><div className="error-box">{error || "投稿が見つかりません"}</div></div></div>;

  return (
    <div className="post-form-page">
      <div className="post-form-card">
        <h1 className="form-title">投稿を編集</h1>
        <PostForm
          initialValues={{ title: post.title, content: post.content }}
          submitLabel="更新する"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/posts/${post.id}`)}
        />
      </div>
    </div>
  );
}
