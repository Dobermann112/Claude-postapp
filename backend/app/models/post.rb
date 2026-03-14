class Post < ApplicationRecord
  belongs_to :user

  validates :title, presence: true, length: { maximum: 100 }
  validates :content, presence: true, length: { maximum: 10_000 }

  # 新しい順に並べる（一覧表示用）
  scope :recent, -> { order(created_at: :desc) }
end
