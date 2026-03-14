module Api
  module V1
    class PostsController < ApplicationController
      before_action :authenticate_user!, only: [:create, :update, :destroy]
      before_action :set_post, only: [:show, :update, :destroy]
      before_action :authorize_post!, only: [:update, :destroy]

      # GET /api/v1/posts
      # 投稿一覧を新しい順で返す
      def index
        posts = Post.recent.includes(:user)
        render json: { posts: posts.map { |post| post_json(post) } }
      end

      # GET /api/v1/posts/:id
      # 投稿の詳細を返す
      def show
        render json: { post: post_json(@post) }
      end

      # POST /api/v1/posts
      # 新しい投稿を作成する（ログイン必須）
      def create
        post = current_user.posts.build(post_params)
        if post.save
          render json: { post: post_json(post) }, status: :created
        else
          render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/posts/:id
      # 投稿を更新する（投稿した本人のみ）
      def update
        if @post.update(post_params)
          render json: { post: post_json(@post) }
        else
          render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/posts/:id
      # 投稿を削除する（投稿した本人のみ）
      def destroy
        @post.destroy
        render json: { message: "投稿を削除しました" }
      end

      private

      def set_post
        @post = Post.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "投稿が見つかりません" }, status: :not_found
      end

      # 投稿の作成者と現在のログインユーザーが一致するか確認する
      def authorize_post!
        unless @post.user_id == current_user.id
          render json: { error: "この操作は許可されていません" }, status: :forbidden
        end
      end

      def post_params
        params.require(:post).permit(:title, :content)
      end

      # レスポンス用の投稿データ（投稿者情報を含む）
      def post_json(post)
        {
          id: post.id,
          title: post.title,
          content: post.content,
          user: { id: post.user.id, name: post.user.name },
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      end
    end
  end
end
