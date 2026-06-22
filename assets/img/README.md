# assets/img/ — 実画像の入れ方（命名規約）

## 基本ルール
- フォーマット: WebP 推奨（JPEG/PNG も可）
- ファイル名はすべて小文字・ハイフン区切り
- alt属性は `施工種別 + 状態 + 地域` 形式（例: `外壁改修工事 施工前 福岡市`）

---

## ギャラリー写真

`gallery/` フォルダに置く。ファイル名の先頭にカテゴリを付ける。

```
gallery/
  bosui-01.webp     ... 防水工事
  bosui-02.webp
  tosou-01.webp     ... 塗装工事
  tosou-02.webp
  gaiheki-01.webp   ... 外壁改修
  gaiheki-02.webp
  tile-01.webp      ... タイル工事
  tile-02.webp
  other-01.webp     ... その他
```

`index.html` の `<div class="gallery__item" data-category="bosui">` 内の
`<img class="gallery__real-img">` の `src` を書き換えると自動で反映される。
プレースホルダー要素（`.gallery__placeholder`）を削除し、`<img>` タグに差し替える。

**カテゴリ対応表**:
| data-category 値 | 意味 |
|------------------|------|
| bosui            | 防水 |
| tosou            | 塗装 |
| gaiheki          | 外壁改修 |
| tile             | タイル |
| other            | その他 |

---

## サービスバナー（SERVICE 8事業）

`service/` フォルダに置く。各SERVICEカード上部のバナー画像。アスペクト比 16:9 推奨。
`index.html` の `<img class="service__card-banner" src="...">` を差し替えると反映される。

```
service/
  svc-01-shindan.webp   ... 建築物診断調査
  svc-02-gaiheki.webp   ... 外壁改修工事
  svc-03-bousui.webp    ... 防水工事
  svc-04-tosou.webp     ... 塗装工事
  svc-05-shitaji.webp   ... 下地補修工事
  svc-06-sealing.webp   ... シーリング工事
  svc-07-tile.webp      ... タイル工事
  svc-08-sakan.webp     ... 左官工事
```

---

## ヒーロー 動画 / 写真（後日差し込み）

```html
<!-- index.html の <div class="hero__media" data-hero-media> に追加 -->
<img src="assets/img/hero-bg.webp" alt="外壁改修工事の現場 福岡">
<!-- または -->
<video autoplay muted loop playsinline>
  <source src="assets/img/hero-bg.webp" type="video/webp">
</video>
```

推奨サイズ: 1920 × 1080px。opacity は CSS（`.hero__media img { opacity: 0.32; }`）で調整可。

---

## OGP 画像

`ogp.jpg` または `ogp.webp` を本フォルダに置き、
`index.html` の `<meta property="og:image" content="...">` を更新する。
推奨サイズ: 1200 × 630px。

---

## ロゴ / ファビコン

| ファイル名      | 用途           | 推奨サイズ |
|----------------|----------------|-----------|
| favicon.ico    | ブラウザタブ   | 32×32     |
| favicon.svg    | SVGファビコン  | scalable  |
| apple-touch-icon.png | iOS ホーム画面 | 180×180 |
