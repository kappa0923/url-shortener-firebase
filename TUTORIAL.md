# Introduction to creating url shortener with Firebase
## 0. About
これはFirebaseでURL短縮アプリを作るためのサンプル兼Codelabです。

手順に沿ってコードを実装していくことで、Firebaseを利用したURL短縮アプリを動かすことができます。

また、このCodelabではGCP, Firebaseを利用するため、Googleアカウントが必要です。
用意していない人は必ず取得しておいてください。

<walkthrough-directive-name name="kappa0923">
</walkthrough-directive-name>

## 1. Introduction
Firebaseはアプリ開発のためのクラウドサービスでいわゆるmBaaS(mobile backend as a service)です。

### 何ができるの？
柔軟でスケーラブルなNoSQLクラウドデータベースであるCloud Firestoreや、Push通知を行うためのCloud Messaging、ウェブサイトの静的ホスティングを行うためのFirebase Hostingなど、モバイルアプリを開発するために必要なサービスが提供されています。

さらに、かなり無料枠が大きく、簡単なアプリなら無料で作ることができちゃいます！

これらの機能はモバイルアプリだけでなく、ウェブアプリなどからも使うことができます。

### 何を作るの？
Firebaseを利用してURL短縮アプリを作ります！

[https://nabe.ga/](https://nabe.ga/)

### 今日のゴール
ただURL短縮アプリを作るだけでなく、Firebaseってどう使うの？何ができるの？という部分を学んでいきましょう。

自分でFirebaseを使おうと思ったときに、少しでもハードルを下げるきっかけになれば。

### 準備するもの
- Googleアカウント
  - Firebaseを使うために必要です
- (Codeエディタ)
  - ローカルでコードを編集したい方は
- (Node.js)
  - v6以上
  - ローカルで開発したい方は入れておいてください

## 2. Setup
### コードダウンロード
[https://github.com/kappa0923/url-shortener-firebase](https://github.com/kappa0923/url-shortener-firebase) にアクセスし、 `Open in Cloud Shell` をクリック。

Cloud Shellが開かれ、サンプルコードがダウンロードされます。

同時に、このチュートリアルが開始されます。
もし、セッションが切れたりしてチュートリアルが途切れてしまったら、以下のコマンドでチュートリアルを再開できます。

```bash
cloudshell launch-tutorial -d TUTORIAL.md
```

### プロジェクト作成
1. [Firebaseコンソール](https://console.firebase.google.com/
) にアクセスし、プロジェクトを追加をクリック
2. プロジェクト名に好きな文字列を入力し、プロジェクトを作成

### Firebaseへのログイン
以下のコマンドを実行してFirebaseにログインします
URLが表示されるのでそこにアクセスし、トークンを入力して `Success! Logged in as XXXX@XXX` と表示されればOK

```bash
firebase login --no-localhost
```

作業ディレクトリとFirebaseプロジェクトを紐づけする

```bash
firebase init
```

Firebaseのどの機能を使うのか聞かれるので、 **FunctionsとHosting、Firestore** を選択

上下キーで選択し、スペースキーでON/OFFを切り替え、選択できたらEnterキー

![images/image001.png](https://github.com/kappa0923/url-shortener-firebase/blob/master/images/image001.png?raw=true)

Firebaseのどのプロジェクトと紐付けるか聞かれるので、先程作成したプロジェクトを上下キーで選択し、Enterキー

いくつかSetupに関する設定を聞かれるので以下のように入力

1. `What file should be used for Firestore Rules?`
    - Firestoreのルールに使用するファイルを聞かれているので、何も入力せずEnter(firestore.rules)
2. ``
3. `File firestore.rules already exists. Do you want to overwrite it with the Firestore Rules from the Firebase Console?`
    - Firestoreのルールがすでに存在するけど、上書きするか聞かれているので、 `N` を入力
4. `What file should be used for Firestore indexes?`
    - Firestoreのindexに使用するファイルを聞かれているので、何も入力せずEnter(firestore.indexes.json)
5. `File firestore.indexes.json already exists. Do you want to overwrite it with the Firestore Indexes from the Firebase Console?`
    - Firestoreのindexに使用するファイルがすでに存在するけど、上書きするか聞かれているので、 `N` を入力
6. `What language would you like to use to write Cloud Functions?`
    - Cloud Functionsで使う言語を聞かれているので、 `TypeScript` を選択
7. `Do you want to use TSLint to catch probable bugs and enforce style?`
    - TSLintを使うか聞かれているので、 `Y` を入力
8. `File functions/package.json already exists. Overwrite?`
    - package.jsonがすでに存在するけど、上書きするか聞かれているので、 `N` を入力
9. `File functions/tsconfig.json already exists. Overwrite?`
    - tsconfig.jsonがすでに存在するけど、上書きするか聞かれているので、 `N` を入力
10. `File functions/src/index.ts already exists. Overwrite?`
    - index.tsがすでに存在するけど、上書きするか聞かれているので、 `N` を入力
11. `Do you want to install dependencies with npm now?`
    - npmでパッケージをすぐにインストールするか聞かれているので、 `Y` を入力
12. `What do you want to use as your public directory?`
    - Hostingで公開するディレクトリを聞かれているので、何も入力せずEnter(public)
13. `Configure as a single-page app (rewrite all urls to /index.html)?`
    - SPAとして公開するため全てのリクエストをindex.htmlにリライトするか聞かれているので、 `N` を入力
14. `File public/404.html already exists. Overwrite?`
    - 404.htmlを上書きするか聞かれているので、 `N` を入力
15. `File public/index.html already exists. Overwrite?`
    - index.htmlを上書きするか聞かれているので、 `N` を入力

## 3. Firebaseのconfigを追加
### configの確認
「Project Overview」「ウェブアプリにFirebaseを追加」と選択

![images/image002.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image002.png?raw=true)

### configの追加
<walkthrough-editor-open-file filePath="url-shortener-firebase/public/index.html" text="public/index.html"></walkthrough-editor-open-file>を開き、configの内容(`Initialize Firebaseの部分`)をL32~43に追記して保存。

![images/image003.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image003.png?raw=true)

```html
<!-- TODO : 03. ここにスニペットをコピー -->
<script src="https://www.gstatic.com/firebasejs/5.5.3/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "hogehoge.firebaseapp.com",
    databaseURL: "https://hogehoge.firebaseio.com",
    projectId: "hogehoge",
    storageBucket: "hogehoge.appspot.com",
    messagingSenderId: "00000000000"
  };
  firebase.initializeApp(config);
</script>
<!-- 03. end -->
```

## 4. 動作確認
以下のコマンドを実行

```bash
firebase serve --only hosting --port 8080
```

<walkthrough-spotlight-pointer spotlightId="devshell-web-preview-button" text="ウェブでプレビューボタン"></walkthrough-spotlight-pointer>で確認

こんな画面が表示される
Firebaseとの接続が正常に行われていれば、エラーも起きないはず

![images/image002.png](https://github.com/kappa0923/url-shortener-firebase/blob/master/images/image002.png?raw=true)

## 5. Firestoreの有効化
投稿を保存するため、Firestoreをコンソールから有効化

![images/image005.png](https://github.com/kappa0923/easy-timeline/blob/master/images/image005.png?raw=true)

セキュリティルールはロックモードに設定

![images/image003.png](https://github.com/kappa0923/url-shortener-firebase/blob/master/images/image003.png?raw=true)

## 6. HostingとFunctionsを接続
HostingへのアクセスでFunctionsが呼び出されるよう、`firebase.json` にリライトの設定を記載する

<walkthrough-editor-open-file filePath="url-shortener-firebase/firebase.json" text="firebase.json"></walkthrough-editor-open-file>を開き、L19の後ろにrewrites設定を追加する

```json
"rewrites": [
  {
    "source": "/",
    "destination": "/index.html"
  },
  {
    "source": "/**",
    "function": "redirectUrl"
  }
]
```

これにより、Firebase Hostingで公開したページの任意のパスにアクセスすると、指定したCloud Functionsの関数が実行される

```bash
firebase serve --port 8080
```

<walkthrough-spotlight-pointer spotlightId="devshell-web-preview-button" text="ウェブでプレビューボタン"></walkthrough-spotlight-pointer>でプレビューを表示したあと、任意のパスにアクセスするとCloud Functionsが実行された結果が表示される

![images/image004.png](https://github.com/kappa0923/url-shortener-firebase/blob/master/images/image004.png?raw=true)

## 7. URL情報を保存するFirestoreの設定
短縮前のURLと短縮後のURLを紐付けるため、Cloud Firestoreに情報を保存する

Firebaseのコンソールから `Database` を選択し、コレクションを以下のように追加する

![images/image005.png](https://github.com/kappa0923/url-shortener-firebase/blob/master/images/image005.png?raw=true)

![images/image006.png](https://github.com/kappa0923/url-shortener-firebase/blob/master/images/image006.png?raw=true)

## 8. 保存されている情報をもとにCloud Functionsでリダイレクト設定
Firestoreに保存されたコレクションのドキュメントIDを短縮後のURLのIDとする

例えば、 `86RaWrLE43Vw9JieaYws` というIDのドキュメントとして保存された場合、短縮後のURLは `https://xxx.firebase.app/86RaWrLE43Vw9JieaYws` となる

なので、リクエストをCloud Functionsで受け取ったらリクエストからパスを取得し、Firestoreからそのデータを取得すれば良い

```js
const id = request.path.substr(1);
```

Firestoreの `urls` コレクションからIDをキーにして取得するコードは以下

これを <walkthrough-editor-open-file filePath="url-shortener-firebase/functions/src/index.ts" text="index.ts"></walkthrough-editor-open-file> のL22に追加する

```js
db.collection('urls').doc(id).get()
  .then(doc => {
    if (!doc.exists) {
      console.log('Page not found');
      response.status(404).end();
    } else {
      console.log('Redirect to ', doc.data().url);
      response.redirect(301, doc.data().url);
    }
  }).catch(err => {
    console.log('Error getting document', err);
  });
```

これで再度実行し、 `https://xxx.firebase.app/hogehoge` (hogehogeはID) にアクセスするともとのURLにリダイレクトされる

```bash
firebase serve --port 8080
```

## 9. デプロイし、アプリを公開する
リダイレクト部分が完成したため、ここまでをデプロイします

```bash
firebase deploy
```

`Deploy complete!` と表示されればOK

表示されているURLにアクセスすると、自分のアプリが公開されている
インターネットに公開されているので、スマホとかからも同じURLでアクセス可能

## 10. URL登録機能 - Cloud Functions部分
今度はリダイレクト用のURLをウェブアプリから登録できるようにする

先程はURLを指定してリクエストする `onRequest` を利用しましたが、今度はアプリから直接呼ぶことができる `onCall` を利用します

以下のコードを <walkthrough-editor-open-file filePath="url-shortener-firebase/functions/src/index.ts" text="index.ts"></walkthrough-editor-open-file> のL59に追加します

```js
return db.collection('urls').add(urlData)
  .then(ref => {
    const responseData = {
      originUrl: url,
      shortUrl: baseUrl + ref.id,
      isSuccess: true
    };
    return responseData;
  })
  .catch(err => {
    throw new functions.https.HttpsError('invalid-argument', url + 'is not a url.');
  });
```

## 11. URL登録機能 - Hosting部分
先程の関数をアプリから呼び出せるようにするため、Hosting側を修正します

まずはURLを入力するためのフォームを作成します
以下のコードを <walkthrough-editor-open-file filePath="url-shortener-firebase/public/index.html" text="index.html"></walkthrough-editor-open-file> L22に追加します

```html
<div class="center">
  <p>Enter your URL</p>
  <input type="url" id="origin-url">
  <button id="shorten" type="button">SHORTEN</button>
  <div id="shorten-url" class="shortened-url"></div>
</div>
```

さらに、アプリから直接関数を呼び出せるように、アプリに匿名ログインを追加します

まずはFirebaseコンソールから匿名ログインを有効にします
`Authentication > ログイン方法 > 匿名` を選択して有効にします

![images/image007.png](https://github.com/kappa0923/url-shortener-firebase/blob/master/images/image007.png?raw=true)

アプリ側で匿名ログインを利用するため、以下のコードを <walkthrough-editor-open-file filePath="url-shortener-firebase/public/scripts/index.js" text="index.js"></walkthrough-editor-open-file> L52に追加します

```js
firebase.auth().signInAnonymously();
```

アプリ側から関数を呼び出すため、以下のコードを <walkthrough-editor-open-file filePath="url-shortener-firebase/public/scripts/index.js" text="index.js"></walkthrough-editor-open-file> L76に追加します

```js
registerUrl({ url: originUrl })
  .then(result => {
    console.log(result.data.shortUrl);
    this.showShortenUrl(result.data.shortUrl);
  })
  .catch(err => {
    console.log(err.message);
  });
```

## 12. デプロイし、アプリを公開する(再)
Firebase Hostingにウェブアプリを公開しましょう
デプロイすると自動的に公開され、ドメイン・SSL証明書などもすべてやってくれます

```bash
firebase deploy
```

公開されたサイトでURL登録ができるようになっています

## 13. プラス1 : キャッシュコントロール
HostingとCloud Functionsを合わせて利用する際、レスポンスをキャッシュ設定することができます

<walkthrough-editor-open-file filePath="url-shortener-firebase/functions/src/index.ts" text="index.ts"></walkthrough-editor-open-file>のL20に以下を追加することで、指定した期間キャッシュを行うようにすることができます

```js
response.set('Cache-Control', 'public, max-age=604800, s-maxage=604800');
```

## Congratulations
<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

お疲れ様でした！
何か質問などがあれば
