module Api
  module V1
    class AuthController < ApplicationController
      # POST /api/v1/signup
      # 新規ユーザー登録。成功したらJWTトークンを返す
      def signup
        user = User.new(signup_params)
        if user.save
          token = encode_token(user.id)
          render json: { token: token, user: user_json(user) }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/login
      # メール・パスワードで認証。成功したらJWTトークンを返す
      def login
        user = User.find_by(email: login_params[:email].downcase)
        if user&.authenticate(login_params[:password])
          token = encode_token(user.id)
          render json: { token: token, user: user_json(user) }
        else
          render json: { error: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
        end
      end

      # DELETE /api/v1/logout
      # JWTはサーバー側でステートレスなため、フロント側でトークンを削除するだけでOK
      # このエンドポイントは成功レスポンスを返す役割のみ
      def logout
        render json: { message: "ログアウトしました" }
      end

      private

      def signup_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end

      def login_params
        params.require(:session).permit(:email, :password)
      end

      # レスポンスに含めるユーザー情報（password_digest は除外する）
      def user_json(user)
        { id: user.id, name: user.name, email: user.email }
      end
    end
  end
end
