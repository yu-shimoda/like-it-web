# TODAY (2026-02-19)

## 今日できたこと

- Supabase Auth 連携成功
- Cookieセッション正常化
- RLS有効化
- likes テーブルの user_id NULL削除
- insert 成功（POST 200確認）
- 一覧表示成功

## 今の仕様

- 1ユーザー1商品1Like（現状）
- 次は「1日1Like」へ変更予定

## 明日やること

1. like_date カラム追加（generated column）
2. unique制約を (user_id, product_id, like_date) に変更
3. 重複エラー(23505)を成功扱いにする
4. 動作確認
