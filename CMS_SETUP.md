# MUNIMUNI MART CMS setup

このサイトは Decap CMS で一部コンテンツを管理できる構成です。

## Netlify側で必要な設定

1. GitHubリポジトリとNetlifyを連携してデプロイします。
2. Netlify管理画面で `Identity` を有効化します。
3. `Identity > Services` から `Git Gateway` を有効化します。
4. `Identity > Invite users` から管理ユーザーのメールアドレスを招待します。
5. 公開URLの `/admin/` にアクセスしてログインします。

## CMSで編集できる内容

- お知らせ: `assets/news-data.json`
- 商品シリーズ: `assets/data/products.json`
- 取扱店舗: `assets/data/stores.json`
- CMSアップロード画像: `assets/uploads/`

管理画面で保存するとGitHubへ反映され、Netlifyが自動で再公開します。

## 商品画像について

商品シリーズの「シリーズ画像」は商品一覧カードに表示されます。
「カタログ画像」は、商品一覧カードのボタンを押した時に表示されます。
カタログ画像を空欄にした場合は、サイト上で `Coming soon` と表示されます。

## 注意

zipアップロードだけのデプロイではCMSの保存先が安定しないため、CMS運用時はGitHub連携デプロイを使ってください。
