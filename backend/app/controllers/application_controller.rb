class ApplicationController < ActionController::API
  include JwtHelper

  # 認証が必要なアクションに before_action で呼び出す
  def authenticate_user!
    token = extract_token_from_header
    payload = decode_token(token)
    @current_user = User.find(payload["user_id"])
  rescue AuthenticationError => e
    render json: { error: e.message }, status: :unauthorized
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ユーザーが見つかりません" }, status: :unauthorized
  end

  attr_reader :current_user

  private

  # Authorization: Bearer <token> ヘッダーからトークンを取り出す
  def extract_token_from_header
    header = request.headers["Authorization"]
    raise AuthenticationError, "認証トークンがありません" unless header&.start_with?("Bearer ")
    header.split(" ").last
  end
end
