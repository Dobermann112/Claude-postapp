Rails.application.routes.draw do
  # ヘルスチェック（サーバーが正常に動いているか確認するURL）
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # 認証系
      post "signup", to: "auth#signup"
      post "login",  to: "auth#login"
      delete "logout", to: "auth#logout"

      # 投稿系
      resources :posts, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
