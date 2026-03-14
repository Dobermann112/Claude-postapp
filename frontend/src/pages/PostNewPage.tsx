import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import PostForm from "../components/PostForm";
import type { PostFormData } from "../types";

export default function PostNewPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: PostFormData) => {
    const post = await createPost(data);
    navigate(`/posts/${post.id}`);  // 作成した投稿の詳細ページへ遷移
  };

  return (
    <div className="post-form-page">
      <div className="post-form-card">
        <h1 className="form-title">新しい投稿</h1>
        <PostForm
          submitLabel="投稿する"
          onSubmit={handleSubmit}
          onCancel={() => navigate("/")}
        />
      </div>
    </div>
  );
}
