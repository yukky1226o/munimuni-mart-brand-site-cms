# MUNIMUNI MART CMS setup

このサイトのお知らせ欄は Decap CMS で管理できる構成です。

## Netlify側で必要な設定

1. GitHubリポジトリとNetlifyを連携してデプロイします。
2. Netlify管理画面で `Identity` を有効化します。
3. `Identity > Services` から `Git Gateway` を有効化します。
4. `Identity > Invite users` から管理ユーザーのメールアドレスを招待します。
5. 公開URLの `/admin/` にアクセスしてログインします。

## お知らせデータ

管理画面で編集した内容は `assets/news-data.json` に保存され、TOPページのお知らせ欄へ反映されます。

## 注意

zipアップロードだけのデプロイではCMSの保存先が安定しないため、CMS運用時はGitHub連携デプロイを使ってください。
