import client from "./client";
import type { Post, PostFormData } from "../types";

// 投稿一覧を取得する
export const fetchPosts = (): Promise<Post[]> =>
  client.get("/posts").then((res) => res.data.posts);

// 投稿詳細を取得する
export const fetchPost = (id: number): Promise<Post> =>
  client.get(`/posts/${id}`).then((res) => res.data.post);

// 投稿を新規作成する
export const createPost = (data: PostFormData): Promise<Post> =>
  client.post("/posts", { post: data }).then((res) => res.data.post);

// 投稿を更新する
export const updatePost = (id: number, data: PostFormData): Promise<Post> =>
  client.patch(`/posts/${id}`, { post: data }).then((res) => res.data.post);

// 投稿を削除する
export const deletePost = (id: number): Promise<void> =>
  client.delete(`/posts/${id}`).then(() => undefined);
