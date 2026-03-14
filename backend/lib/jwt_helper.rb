module JwtHelper
  # トークンの有効期限（24時間）
  TOKEN_EXPIRY = 24.hours

  # ユーザーIDからJWTトークンを生成する
  def encode_token(user_id)
    payload = {
      user_id: user_id,
      exp: TOKEN_EXPIRY.from_now.to_i
    }
    JWT.encode(payload, jwt_secret, "HS256")
  end

  # JWTトークンからペイロードを取り出す（期限切れ・改ざん検知あり）
  def decode_token(token)
    JWT.decode(token, jwt_secret, true, algorithm: "HS256").first
  rescue JWT::ExpiredSignature
    raise AuthenticationError, "トークンの有効期限が切れています"
  rescue JWT::DecodeError
    raise AuthenticationError, "無効なトークンです"
  end

  private

  def jwt_secret
    Rails.application.secret_key_base
  end
end

# 認証エラー用のカスタム例外クラス
class AuthenticationError < StandardError; end
