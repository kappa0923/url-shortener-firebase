"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const settings = { timestampsInSnapshots: true };
admin.firestore().settings(settings);

/**
 * @desc ショートリクエストをリダイレクト
 */
exports.redirectUrl = functions.https.onRequest((request, response) => {
  const id = request.path.substr(1);
  const db = admin.firestore();
  console.log('ID : ', id);

  // TODO : 06. リクエストへのレスポンスを設定
  response.status(200).send(`Hello ${id}!`);

  // TODO : 13. キャッシュコントロール

  // TODO : 08. リダイレクト先のURLをデータベースから読み込み
});

/**
 * @desc URLを登録
 */
exports.registerUrl = functions.https.onRequest((request, response) => {
  const validUrl = require("valid-url");
  const baseUrl = "https://nabe.ga/";
  const url = data.url;
  const db = admin.firestore();
  console.log('Register URL : ', url);

  // URLのバリデーション
  if (!validUrl.isUri(url)) {
    throw new functions.https.HttpsError('invalid-argument', `${url} is not a url.`);
  }

  const urlData = {
    url: url,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };

  // TODO : 10. 非同期オペレーションの後にデータを返すにはPromiseを返す
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
});
